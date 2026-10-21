import { constants } from "node:fs";
import { lstat, open, stat, writeFile, rename, rm } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import lockfile from "proper-lockfile";
import { artifactId } from "./api.js";

export const projectFilename = ".claude-artifacts.json";
const stringKeys = ["file", "artifact", "title", "favicon", "share", "buildCommand", "outputDir"];
const booleanKeys = ["skipBuild", "skipInstall"];

export function validateProject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${projectFilename} must contain a JSON object.`);
  for (const [key, entry] of Object.entries(value)) {
    if (stringKeys.includes(key)) {
      if (typeof entry !== "string" || !entry.trim()) throw new Error(`${projectFilename}: ${key} must be a nonempty string.`);
    } else if (booleanKeys.includes(key)) {
      if (typeof entry !== "boolean") throw new Error(`${projectFilename}: ${key} must be a boolean.`);
    } else throw new Error(`${projectFilename}: unknown setting ${key}. Credentials belong in the user configuration, not this file.`);
  }
  if (value.artifact !== undefined) artifactId(value.artifact);
  if (value.share !== undefined && !["private", "org"].includes(value.share)) throw new Error(`${projectFilename}: share must be private or org.`);
  for (const key of ["file", "outputDir"]) if (value[key] !== undefined && isAbsolute(value[key])) throw new Error(`${projectFilename}: ${key} must be relative.`);
  return value;
}

async function readProject(path) {
  let file;
  try {
    file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    if (!(await file.stat()).isFile()) throw new Error(`${path} must be a regular file.`);
    const raw = await file.readFile("utf8");
    let settings;
    try { settings = JSON.parse(raw); } catch { throw new Error(`Invalid JSON in ${path}.`); }
    return { path, directory: dirname(path), settings: validateProject(settings) };
  } catch (error) { if (error.code === "ENOENT") return undefined; throw error; }
  finally { await file?.close(); }
}

export async function findProject({ file, project } = {}) {
  if (project !== undefined) {
    const found = await readProject(join(resolve(project), projectFilename));
    if (!found) throw new Error(`No ${projectFilename} in ${resolve(project)}. Run claude-artifacts init there first.`);
    return found;
  }
  let directory = resolve(file ?? ".");
  if (file !== undefined && !(await stat(directory)).isDirectory()) directory = dirname(directory);
  for (;;) {
    const found = await readProject(join(directory, projectFilename));
    if (found) return found;
    // Do not inherit another repository's publishing target.
    try { await lstat(join(directory, ".git")); return undefined; }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    const parent = dirname(directory);
    if (parent === directory) return undefined;
    directory = parent;
  }
}

export async function publishingOptions(params, update = false) {
  let { artifact, file } = params;
  if (update && artifact !== undefined && file === undefined) {
    try { artifactId(artifact); }
    catch {
      // Preserve update <id> <file>, and also allow update ./app with a saved target.
      try { await stat(resolve(artifact)); } catch { artifactId(artifact); }
      file = artifact;
      artifact = undefined;
    }
  }
  const project = await findProject({ file, project: params.project });
  const settings = project?.settings ?? {};
  const configuredSource = resolve(project?.directory ?? ".", settings.file ?? ".");
  const source = file !== undefined ? resolve(file) : configuredSource;
  const defaults = { ...settings };
  // Build paths describe the saved source. Pointing directly at dist/ or a single file
  // must not accidentally rebuild it or append the saved output directory again.
  if (source !== configuredSource) {
    for (const key of ["buildCommand", "outputDir", "skipBuild", "skipInstall"]) delete defaults[key];
  }
  const explicit = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  const options = { ...defaults, ...explicit, file: source };
  // A one-off build command supersedes a saved skipBuild setting.
  if (params.buildCommand !== undefined && params.skipBuild === undefined) options.skipBuild = false;
  if (params.skipBuild === true && params.buildCommand === undefined) delete options.buildCommand;
  if (update) {
    // Project audience is a creation default; updating content preserves existing permissions.
    if (params.share === undefined) delete options.share;
    const target = artifact ?? settings.artifact;
    if (target === undefined) throw new Error(`No artifact target. Pass an artifact ID or save artifact in ${projectFilename}.`);
    options.artifact = artifactId(target);
  }
  return { options, project };
}

export async function projectArtifact(params) {
  if (params.artifact !== undefined) return artifactId(params.artifact);
  const project = await findProject({ project: params.project });
  if (!project?.settings.artifact) throw new Error(`Pass an artifact ID or save artifact in ${projectFilename}.`);
  return artifactId(project.settings.artifact);
}

export async function initializeProject(directory = ".", settings = {}) {
  directory = resolve(directory);
  if (!(await stat(directory)).isDirectory()) throw new Error("Project must be a directory.");
  const value = validateProject({ file: ".", ...settings });
  if (value.artifact) value.artifact = artifactId(value.artifact);
  const path = join(directory, projectFilename);
  try { await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" }); }
  catch (error) { if (error.code === "EEXIST") throw new Error(`${path} already exists. Edit it to change the settings.`); throw error; }
  return { project_file: path, settings: value };
}

export async function rememberArtifact(project, id) {
  if (!project || project.settings.artifact !== undefined) return;
  id = artifactId(id);
  const release = await lockfile.lock(project.path, { retries: 5 });
  const temporary = join(project.directory, `.${randomUUID()}.tmp`);
  try {
    const current = await readProject(project.path);
    if (!current) throw new Error("Project configuration was removed while publishing.");
    if (current.settings.artifact !== undefined) return;
    await writeFile(temporary, `${JSON.stringify({ ...current.settings, artifact: id }, null, 2)}\n`, { flag: "wx" });
    await rename(temporary, project.path);
  } finally {
    await rm(temporary, { force: true });
    await release();
  }
}
