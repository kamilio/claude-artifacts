#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runMCP } from "toolcraft/mcp";

import { root } from "../src/root.js";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

await runMCP(root, { name: "claude-artifacts", version: packageJson.version, approvals: false, casing: "snake" });
