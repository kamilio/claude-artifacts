import { chmod } from "node:fs/promises";
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
});

await chmod("dist/claude-artifacts.mjs", 0o755);
