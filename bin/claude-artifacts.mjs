#!/usr/bin/env node
import { runCLI } from "toolcraft/cli";

import { root } from "../src/root.js";

await runCLI(root, { version: "0.1.0", rootUsageName: "claude-artifacts", presets: false, approvals: false, controls: { output: true } });
