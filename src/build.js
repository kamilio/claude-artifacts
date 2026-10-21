import { spawn } from "node:child_process";
import { lstat, readFile, readdir, realpath, stat } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

// Put frameworks that use Vite before Vite itself. React/Vue/Svelte alone do not identify a build tool.
const frameworks = [
  { name: "Next.js", dependency: "next", outputs: ["out"], binary: "next", args: ["build"], hint: "Set output: 'export' in next.config; ordinary .next output needs a server." },
  { name: "Nuxt", dependency: "nuxt", outputs: [".output/public", "dist"], binary: "nuxt", args: ["generate"], script: "generate", hint: "Use Nuxt static generation, not a server build." },
  { name: "SvelteKit", dependency: "@sveltejs/kit", outputs: ["build"], binary: "vite", args: ["build"], hint: "Configure @sveltejs/adapter-static and prerender the homepage; keep pages and assets in one directory." },
  { name: "Astro", dependency: "astro", outputs: ["dist"], binary: "astro", args: ["build"], hint: "Use Astro's static output; on-demand routes need a server." },
  { name: "React Router", dependency: "@react-router/dev", outputs: ["build/client"], binary: "react-router", args: ["build"], hint: "Set ssr: false in react-router.config; server loaders and actions are not hosted." },
  { name: "Angular", dependency: "@angular/core", outputs: [], binary: "ng", args: ["build"], hint: "Build a browser app or set outputMode: 'static'. Select one app with --output-dir if the workspace builds several." },
  { name: "Docusaurus", dependency: "@docusaurus/core", outputs: ["build"], binary: "docusaurus", args: ["build"] },
  { name: "Gatsby", dependency: "gatsby", outputs: ["public"], binary: "gatsby", args: ["build"], hint: "Only fully static Gatsby sites are supported; SSR, deferred generation, and Functions need a server." },
  { name: "Create React App", dependency: "react-scripts", outputs: ["build"], binary: "react-scripts", args: ["build"] },
  { name: "Vue CLI", dependency: "@vue/cli-service", outputs: ["dist"], binary: "vue-cli-service", args: ["build"] },
  { name: "Eleventy", dependency: "@11ty/eleventy", outputs: ["_site"], binary: "eleventy", args: [] },
  { name: "Parcel", dependency: "parcel", outputs: ["dist"], binary: "parcel", args: ["build"], needsScript: true },
  { name: "Vite", dependency: "vite", outputs: ["dist"], binary: "vite", args: ["build"] },
];

async function exists(path) {
  try { await stat(path); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; }
}

async function jsonFile(path) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch (error) {
    if (error.code === "ENOENT") return undefined;
    if (error instanceof SyntaxError) throw new Error(`Invalid JSON in ${path}.`);
    throw error;
  }
}

export function detectFramework(pkg = {}) {
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  return frameworks.find(framework => Object.hasOwn(dependencies, framework.dependency));
}

export async function packageManager(project, pkg = {}) {
  const locks = [
    ["npm", "npm-shrinkwrap.json"], ["npm", "package-lock.json"], ["pnpm", "pnpm-lock.yaml"],
    ["yarn", "yarn.lock"], ["bun", "bun.lock"], ["bun", "bun.lockb"],
  ];
  const present = [];
  for (const [name, file] of locks) if (await exists(join(project, file))) present.push(name);
  const declared = pkg.packageManager;
  if (declared !== undefined && (typeof declared !== "string" || !/^(npm|pnpm|yarn|bun)@\S+$/.test(declared))) {
    throw new Error("packageManager must name npm, pnpm, yarn, or bun with a version (for example pnpm@10.0.0).");
  }
  const choices = [...new Set(present)];
  if (!declared && choices.length > 1) throw new Error("Conflicting package-manager lockfiles. Set packageManager in package.json or remove the obsolete lockfile.");
  const name = declared?.split("@")[0] ?? choices[0] ?? "npm";
  const locked = present.includes(name);
  const modernYarn = name === "yarn" && ((declared && !/^yarn@1\./.test(declared)) || await exists(join(project, ".yarnrc.yml")));
  const install = name === "npm" ? [locked ? "ci" : "install", "--include=dev"]
    : name === "pnpm" ? ["install", "--prod=false", ...(locked ? ["--frozen-lockfile"] : [])]
      : name === "yarn" ? ["install", ...(locked ? [modernYarn ? "--immutable" : "--frozen-lockfile"] : [])]
        : ["install", ...(locked ? ["--frozen-lockfile"] : [])];
  return { name, install, modernYarn };
}

// Build output goes to stderr, leaving CLI JSON and MCP's stdout protocol intact.
export function runBuildCommand(command, args, { cwd, shell = false, install = false, timeoutMs = 600_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd, shell: shell || process.platform === "win32", detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...(install ? { NODE_ENV: "development" } : {}) },
    });
    let failure;
    const terminate = (reason) => {
      failure ??= reason;
      try {
        if (process.platform !== "win32") process.kill(-child.pid, "SIGKILL");
        else child.kill("SIGKILL");
      } catch (error) { if (error.code !== "ESRCH") child.kill("SIGKILL"); }
    };
    const cancel = () => terminate(new Error("Build cancelled; nothing was published."));
    const timer = setTimeout(() => terminate(new Error("Build exceeded 10 minutes; nothing was published.")), timeoutMs);
    process.once("SIGINT", cancel);
    process.once("SIGTERM", cancel);
    child.stdout.on("data", chunk => process.stderr.write(chunk));
    child.stderr.on("data", chunk => process.stderr.write(chunk));
    child.on("error", error => { failure = new Error(error.code === "ENOENT" ? `Build executable not found: ${command}. Install the project's package manager/toolchain and retry.` : `Cannot run build command: ${error.message}`); });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      process.removeListener("SIGINT", cancel);
      process.removeListener("SIGTERM", cancel);
      if (failure) reject(failure);
      else if (code !== 0) reject(new Error(`Build command failed (${signal ?? code}): ${command} ${args.join(" ")}. Nothing was published; existing output was not used.`));
      else resolvePromise();
    });
  });
}

async function candidates(project, framework, outputDir) {
  if (outputDir !== undefined) return [resolve(project, outputDir)];
  if (framework?.name === "Angular") {
    let entries;
    try { entries = await readdir(join(project, "dist"), { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
    return [join(project, "dist/browser"), join(project, "dist"), ...entries.filter(entry => entry.isDirectory()).flatMap(entry => [join(project, "dist", entry.name, "browser"), join(project, "dist", entry.name)])];
  }
  return (framework?.outputs ?? ["dist", "build", "out", "public", "_site", ".output/public"]).map(path => join(project, path));
}

async function stamp(path) {
  try {
    const info = await stat(join(path, "index.html"), { bigint: true });
    return info.isFile() ? `${info.ino}:${info.size}:${info.mtimeNs}:${info.ctimeNs}` : undefined;
  } catch (error) { if (["ENOENT", "ENOTDIR"].includes(error.code)) return undefined; throw error; }
}

async function assertOutput(project, output) {
  const root = await realpath(project);
  const destination = await realpath(output);
  const path = relative(root, destination);
  if (!path || path === ".." || path.startsWith(`..${sep}`) || isAbsolute(path)) {
    throw new Error("Build output must be a subdirectory of the project. To publish an existing directory directly, use --skip-build.");
  }
  if (!(await lstat(join(output, "index.html"))).isFile()) throw new Error("Build output index.html must be a regular file, not a symlink.");
}

async function rejectServerOutput(framework, output) {
  const name = framework?.name;
  if (name === "Next.js" && output.split(sep).includes(".next")) throw new Error(".next contains a Next.js server build. Set output: 'export' and publish out/ instead.");
  const markers = name === "Astro" ? [join(output, "server/entry.mjs"), join(output, "../server/entry.mjs")]
    : name === "React Router" ? [join(output, "../server/index.js")]
      : name === "Nuxt" ? [join(output, "../server/index.mjs")]
        : name === "Angular" ? [join(output, "../server/server.mjs")]
          : name === "Gatsby" ? [join(output, "functions")] : [];
  for (const marker of markers) if (await exists(marker)) throw new Error(`${name} output includes a server runtime. ${framework.hint} Produce a clean static build before publishing.`);
}

export async function prepareWebsite(project, { buildCommand, outputDir, skipBuild = false, skipInstall = false } = {}, { run = runBuildCommand, log = message => process.stderr.write(`${message}\n`) } = {}) {
  project = resolve(project);
  if (buildCommand !== undefined && !buildCommand.trim()) throw new Error("--build-command cannot be empty.");
  if (outputDir !== undefined && !outputDir.trim()) throw new Error("--output-dir cannot be empty.");
  if (skipBuild && buildCommand !== undefined) throw new Error("--skip-build and --build-command cannot be combined.");
  if (skipBuild) {
    const path = resolve(project, outputDir ?? ".");
    if (!(await stamp(path))) throw new Error(`No index.html in ${path}. Point at a built website directory.`);
    return { path, built: false };
  }
  const pkg = await jsonFile(join(project, "package.json"));
  if (pkg !== undefined && (pkg === null || typeof pkg !== "object" || Array.isArray(pkg))) throw new Error("package.json must contain an object.");
  const framework = detectFramework(pkg);
  const scripts = pkg?.scripts ?? {};
  const building = buildCommand !== undefined || framework !== undefined || typeof scripts.build === "string" || typeof scripts.generate === "string";
  if (!building) {
    const path = resolve(project, outputDir ?? ".");
    if (await stamp(path)) return { path, built: false };
    throw new Error("No website entry point or recognized build. Add a package.json build script, or pass --build-command and --output-dir.");
  }
  const manager = await packageManager(project, pkg);
  let command, args, shell = false;
  if (buildCommand !== undefined) { command = buildCommand; args = []; shell = true; }
  else {
    const script = framework?.script ?? (scripts.build ? "build" : scripts.generate ? "generate" : "build");
    if (typeof scripts[script] === "string" && scripts[script].trim()) { command = manager.name; args = ["run", script]; }
    else if (framework && !framework.needsScript) {
      // Package-manager exec uses the installed local dependency; never invoke an npx download.
      if (manager.name === "npm") { command = "npm"; args = ["exec", "--offline", "--no", "--", framework.binary, ...framework.args]; }
      else if (manager.name === "yarn") { command = "yarn"; args = ["exec", framework.binary, ...framework.args]; }
      else { command = manager.name; args = manager.name === "bun" ? ["run", framework.binary, ...framework.args] : ["exec", framework.binary, ...framework.args]; }
    } else throw new Error("No build script. Add scripts.build to package.json or pass --build-command.");
  }
  if (!skipInstall && pkg && !(await exists(join(project, "node_modules"))) && !(manager.modernYarn && await exists(join(project, ".pnp.cjs")))) {
    log(`Installing dependencies with ${manager.name}…`);
    await run(manager.name, manager.install, { cwd: project, install: true });
  }
  // Snapshot after install hooks, so only the requested build can produce fresh output.
  const before = new Map();
  for (const path of await candidates(project, framework, outputDir)) {
    const current = await stamp(path);
    if (current !== undefined) before.set(await realpath(path), current);
  }
  log(`Building ${framework?.name ?? "website"}: ${command} ${args.join(" ")}`);
  await run(command, args, { cwd: project, shell });
  const fresh = [];
  const destinations = new Set();
  const possible = [...new Set(await candidates(project, framework, outputDir))];
  for (const path of possible) {
    const current = await stamp(path);
    if (current !== undefined) {
      // Nuxt also creates dist as an alias for .output/public. It is one output, not two.
      const destination = await realpath(path);
      if (current !== before.get(destination) && !destinations.has(destination)) fresh.push(path);
      destinations.add(destination);
    }
  }
  if (fresh.length !== 1) {
    const detail = fresh.length ? `Several website outputs were built: ${fresh.map(path => relative(project, path)).join(", ")}. Select one with --output-dir.`
      : `No fresh index.html in ${possible.map(path => relative(project, path)).join(", ") || "dist/<app>/browser"}. ${framework?.hint ?? "The build must produce a static website."} For a custom output location, pass --output-dir. For intentionally unchanged, prebuilt output, point at that directory with --skip-build.`;
    throw new Error(`${detail} Nothing was published.`);
  }
  const path = fresh[0];
  await assertOutput(project, path);
  await rejectServerOutput(framework, path);
  log(`Publishing build output: ${relative(project, path)}`);
  return { path, built: true, framework: framework?.name ?? "custom", ...(pkg ? { package_manager: manager.name } : {}) };
}
