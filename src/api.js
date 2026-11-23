import { createTranslator } from "short-uuid";
import { auth } from "./auth.js";

const artifactIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const shortIds = createTranslator("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");

function decodeShortId(value) {
  if (!shortIds.validate(value)) return;
  const id = shortIds.toUUID(value);
  // Reject encodings outside the UUID range instead of silently truncating them.
  if (shortIds.fromUUID(id) === value) return id;
}

function artifactUrl(value) {
  try {
    const url = new URL(value);
    if (url.origin === "https://claude.ai" && !url.username && !url.password) return url;
  } catch {}
}

function artifactReference(value) {
  const url = artifactUrl(value);
  const match = url && /^\/(?:code\/)?artifact\/([^/]+)\/?$/.exec(url.pathname);
  const candidate = match?.[1] ?? value;
  const id = artifactIdPattern.test(candidate) ? candidate.toLowerCase() : decodeShortId(candidate);
  if (!id) throw new Error("Expected a Claude artifact UUID or https://claude.ai/[code/]artifact/<id> URL.");

  const query = new URLSearchParams();
  const key = url?.searchParams.get("sk");
  if (key !== null && key !== undefined) {
    if (!/^[A-Za-z0-9_-]{16,64}$/.test(key)) throw new Error("Invalid artifact share key.");
    query.set("sk", key);
  }
  return { id, query };
}

export function artifactId(value) {
  return artifactReference(value).id;
}

export async function readArtifactFrame(value, version) {
  const { id, query } = artifactReference(value);
  if (version !== undefined) query.set("ver", version);
  const path = `/api/frame/${id}${query.size ? `?${query}` : ""}`;
  const response = await frameRequest("GET", path);
  if (version !== undefined && response.ver !== version) throw new Error("The server did not return the requested version.");
  return { id, response };
}

function artifactsApiBaseUrl() {
  if (process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"] !== undefined) return process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"].replace(/\/+$/, "");
  return "https://api.anthropic.com";
}

export async function frameRequest(method, path, body, headers = {}) {
  let token = await auth.token();
  const send = () => fetch(`${artifactsApiBaseUrl()}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "X-Frame-CP": "go", ...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(60_000), redirect: "error",
  });
  let response = await send();
  if (response.status === 401) {
    await response.body?.cancel();
    const fresh = await auth.token(token);
    if (fresh === token) throw new Error("Claude login was rejected. Run claude-artifacts auth login, or renew the selected environment/Claude Code login.");
    token = fresh;
    response = await send();
  }
  const safePath = path.replace(/([?&]sk=)[^&]*/g, "$1[redacted]");
  const text = await response.text();
  let responseBody;
  try { responseBody = text === "" ? null : JSON.parse(text); }
  catch { throw new Error(`${method} ${safePath} HTTP ${response.status}: non-JSON response`); }
  if (response.status === 409 && responseBody?.["conflict"] === true) throw new Error(`conflict: live version is ${responseBody["live"]}`);
  if (response.status < 200 || response.status >= 300) throw new Error(`${method} ${safePath} ${response.status}: request rejected`);
  return responseBody;
}

