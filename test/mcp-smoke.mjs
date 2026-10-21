import assert from "node:assert/strict";
import http from "node:http";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const bin = resolve(root, process.env["CLAUDE_ARTIFACTS_MCP_TEST_BIN"] ?? "bin/claude-artifacts-mcp.mjs");
const fixture = await mkdtemp(resolve(tmpdir(), "claude-artifacts-mcp-"));
const site = resolve(fixture, "site");
await mkdir(site);
await mkdir(resolve(site, "node_modules"));
await writeFile(resolve(site, "package.json"), JSON.stringify({ scripts: { build: "node build.cjs" } }));
await writeFile(resolve(site, "build.cjs"), 'const fs = require("node:fs"); console.log("build output must stay off MCP stdout"); fs.mkdirSync("dist", {recursive:true}); fs.writeFileSync("dist/index.html", "<!doctype html><h1>MCP build</h1>");');
let deployed;
const artifactId = "11111111-1111-4111-8111-111111111111";
const server = http.createServer(async (request, response) => {
  let body = ""; for await (const chunk of request) body += chunk;
  response.setHeader("content-type", "application/json");
  if (request.url === "/api/frame/deploy/direct") {
    deployed = JSON.parse(body); response.end(JSON.stringify({ slug: artifactId, version: "v1", read: "owner" }));
  } else if (request.url === `/api/frame/perm/${artifactId}`) response.end(JSON.stringify({ read: { mode: "owner" }, version: "p1" }));
  else { response.writeHead(404); response.end("{}"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const env = { ...process.env, CLAUDE_ARTIFACTS_CONFIG_DIR: resolve(fixture, "config"), CLAUDE_ARTIFACTS_OAUTH_TOKEN: "synthetic", CLAUDE_CODE_ARTIFACTS_API_BASE_URL: `http://127.0.0.1:${server.address().port}` };
const child = bin.endsWith(".mjs") ? spawn(process.execPath, [bin], { cwd: root, env }) : spawn(bin, [], { cwd: root, env });
const responses = new Map();
let stdout = "";
let stderr = "";

child.stdout.setEncoding("utf8");
child.stderr.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  stdout += chunk;
  for (;;) {
    const newline = stdout.indexOf("\n");
    if (newline === -1) break;
    const line = stdout.slice(0, newline);
    stdout = stdout.slice(newline + 1);
    const message = JSON.parse(line);
    responses.set(message.id, message);
  }
});
child.stderr.on("data", (chunk) => {
  stderr += chunk;
});

function write(id, method, params) {
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
}

function waitFor(id) {
  return new Promise((resolvePromise, rejectPromise) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (responses.has(id)) {
        clearInterval(interval);
        resolvePromise(responses.get(id));
      } else if (Date.now() - start > 5000) {
        clearInterval(interval);
        rejectPromise(new Error(stderr || `missing response ${id}`));
      }
    }, 10);
  });
}

try {
  write(1, "initialize", { protocolVersion: "2025-06-18", clientInfo: { name: "claude-artifacts-smoke", version: "0.0.0" } });
  const initialized = await waitFor(1);
  if (initialized.result.serverInfo.name !== "claude-artifacts") throw new Error("server name mismatch");

  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
  write(2, "tools/list", {});
  const listed = await waitFor(2);
  const names = listed.result.tools.map((tool) => tool.name).sort();
  const expected = [
    "claude_artifacts__create",
    "claude_artifacts__delete",
    "claude_artifacts__list",
    "claude_artifacts__read",
    "claude_artifacts__share",
    "claude_artifacts__update",
  ];
  if (JSON.stringify(names) !== JSON.stringify(expected)) throw new Error(`tools ${JSON.stringify(names)}`);

  for (const name of ["claude_artifacts__create", "claude_artifacts__update"]) {
    const tool = listed.result.tools.find(tool => tool.name === name);
    for (const parameter of ["build_command", "output_dir", "skip_build", "skip_install"]) assert.ok(tool.inputSchema.properties[parameter], parameter);
  }
  write(3, "tools/call", { name: "claude_artifacts__create", arguments: { file: site } });
  const created = await waitFor(3);
  assert.ok(!created.error && !created.result.isError, JSON.stringify(created));
  assert.ok(deployed.manifest["index.html"].content.includes("MCP build"));
  assert.ok(stderr.includes("build output must stay off MCP stdout"));
  write(4, "tools/call", { name: "claude_artifacts__update", arguments: { artifact: artifactId, file: site, build_command: "node build.cjs", output_dir: "dist", skip_install: true } });
  const updated = await waitFor(4);
  assert.ok(!updated.error && !updated.result.isError, JSON.stringify(updated));
  assert.equal(deployed.slug, artifactId);
  child.stdin.end();
  await new Promise((resolvePromise) => child.on("close", resolvePromise));

  console.log(JSON.stringify({ ok: true, tools: names }, null, 2));

} finally {
  child.kill();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await rm(fixture, { recursive: true, force: true });
}
