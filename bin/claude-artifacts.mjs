#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runCLI } from "toolcraft/cli";

import { root } from "../src/root.js";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

await runCLI(root, { version: packageJson.version, rootUsageName: "claude-artifacts", presets: false, approvals: false, controls: { output: true } });
