import { spawn } from "node:child_process";
import http from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const bin = resolve(root, process.env["CLAUDE_ARTIFACTS_TEST_BIN"] ?? "bin/claude-artifacts.mjs");
const requests = [];
const artifactId = "11111111-1111-4111-8111-111111111111";
let versionIndex = 0;
let deleted = false;

const server = http.createServer((request, response) => {
  let body = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    body += chunk;
  });
  request.on("end", () => {
    const parsedBody = body === "" ? null : JSON.parse(body);
    requests.push({ method: request.method, url: request.url, headers: request.headers, body: parsedBody });
    response.setHeader("content-type", "application/json");
    response.setHeader("connection", "close");
    if (request.method === "POST" && request.url === "/api/frame/deploy/direct") {
      versionIndex += 1;
      response.end(JSON.stringify({ slug: parsedBody.slug ?? artifactId, version: `version-${versionIndex}`, read: "owner", shared: false }));
    } else if (request.method === "GET" && request.url === "/api/frame/frames?limit=60") {
      response.end(JSON.stringify({ frames: deleted ? [] : [{ slug: artifactId, title: "Smoke Artifact", label: "smoke", owner_account: "acct", owner_email: "owner@example.com", source_surface: "code", rel: "mine", view_count: 2, unique_view_count: 1, updatedAt: "2026-06-23T19:28:14Z" }], thumbsEnabled: false }));
    } else if (request.method === "GET" && request.url === `/api/frame/${artifactId}`) {
      response.end(JSON.stringify({ ver: `version-${versionIndex}`, assetToken: "asset-token", title: "Smoke Artifact", favicon: "*", perm: { role: "owner", mode: "owner" }, author: { email: "owner@example.com" }, created_at: "2026-06-23T19:28:14Z", updated_at: "2026-06-23T19:28:14Z", live: `version-${versionIndex}`, history: ["version-1"], versions: { "version-1": { title: "Smoke Artifact" } } }));
    } else if (request.method === "DELETE" && request.url === `/api/frame/${artifactId}`) {
      deleted = true;
      response.statusCode = 204;
      response.end("");
    } else {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: `${request.method} ${request.url}` }));
    }
  });
});

await new Promise((resolvePromise) => server.listen(0, "127.0.0.1", resolvePromise));

function run(args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, [bin, ...args, "--output", "json"], {
      cwd: root,
      env: {
        ...process.env,
        CLAUDE_CODE_OAUTH_TOKEN: "fake-token",
        CLAUDE_CODE_ARTIFACTS_API_BASE_URL: `http://127.0.0.1:${server.address().port}`,
      },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", rejectPromise);
    child.on("close", (code) => {
      if (code !== 0) rejectPromise(new Error(`${args.join(" ")} failed\n${stdout}\n${stderr}`));
      else resolvePromise(JSON.parse(stdout));
    });
  });
}

const created = await run(["create", "test/smoke.html", "--title", "Smoke Artifact"]);
if (created.artifact_id !== artifactId) throw new Error(`create id ${created.artifact_id}`);
const read = await run(["read", artifactId]);
if (read.title !== "Smoke Artifact") throw new Error(`read title ${read.title}`);
const updated = await run(["update", artifactId, "test/smoke.html", "--title", "Smoke Artifact Updated", "--base-version", created.version]);
if (updated.version !== "version-2") throw new Error(`update version ${updated.version}`);
const listed = await run(["list"]);
if (listed.artifacts.length !== 1 || listed.artifacts[0].artifact_id !== artifactId) throw new Error("list missing artifact");
if (listed.gallery_url !== "https://claude.ai/code/artifacts") throw new Error(`gallery ${listed.gallery_url}`);
const removed = await run(["delete", artifactId]);
if (removed.deleted !== true) throw new Error("delete failed");
const afterDelete = await run(["list"]);
if (afterDelete.artifacts.length !== 0) throw new Error("deleted artifact still listed");
if (!requests.every((request) => request.headers.authorization === "Bearer fake-token")) throw new Error("auth header missing");

server.closeAllConnections?.();
await new Promise((resolvePromise) => server.close(resolvePromise));

console.log(JSON.stringify({ ok: true, requests: requests.length }, null, 2));
process.exit(0);
