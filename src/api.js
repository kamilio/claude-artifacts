import { auth } from "./auth.js";

const artifactIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function artifactId(value) {
  if (artifactIdPattern.test(value)) return value.toLowerCase();
  try {
    const url = new URL(value);
    const match = /^\/code\/artifact\/([^/]+)\/?$/.exec(url.pathname);
    if (url.protocol === "https:" && url.hostname === "claude.ai" && match && artifactIdPattern.test(match[1])) return match[1].toLowerCase();
  } catch {}
  throw new Error("Expected a Claude artifact UUID or https://claude.ai/code/artifact/<id> URL.");
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
  const text = await response.text();
  let responseBody;
  try { responseBody = text === "" ? null : JSON.parse(text); }
  catch { throw new Error(`${method} ${path} HTTP ${response.status}: non-JSON response`); }
  if (response.status === 409 && responseBody?.["conflict"] === true) throw new Error(`conflict: live version is ${responseBody["live"]}`);
  if (response.status < 200 || response.status >= 300) throw new Error(`${method} ${path} ${response.status}: ${JSON.stringify(responseBody)}`);
  return responseBody;
}

