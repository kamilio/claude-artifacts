import { chmod } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";

await build({
  entryPoints: ["bin/claude-artifacts.mjs"],
  outfile: "dist/claude-artifacts.mjs",
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  external: [
    "@modelcontextprotocol/sdk/inMemory.js",
    "@modelcontextprotocol/sdk/server/index.js",
    "@modelcontextprotocol/sdk/types.js",
  ],
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module';\nconst require = __createRequire(import.meta.url);",
  },
  plugins: [
    {
      name: "bundle-process-runner-ignore",
      setup(buildContext) {
        buildContext.onLoad({ filter: /@poe-code\/process-runner\/dist\/docker\/build-context\.js$/ }, async (args) => {
          const contents = String(await readFile(args.path)).replace(
            'import { createRequire } from "node:module";\nimport path from "node:path";\nconst require = createRequire(import.meta.url);\nconst createIgnore = require("ignore");',
            'import createIgnore from "ignore";\nimport path from "node:path";',
          );
          return { contents, loader: "js" };
        });
      },
    },
  ],
});

await chmod("dist/claude-artifacts.mjs", 0o755);
