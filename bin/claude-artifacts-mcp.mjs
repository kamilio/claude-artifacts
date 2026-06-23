#!/usr/bin/env node
import { runMCP } from "toolcraft/mcp";

import { root } from "../src/root.js";

await runMCP(root, { name: "claude-artifacts", version: "0.1.0", approvals: false, casing: "snake", omitRootToolNamePrefix: true });
