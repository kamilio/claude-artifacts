import { execFile, spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { readFile, rm } from "node:fs/promises";
import http from "node:http";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { configDirectory, readPrivateJson, readSettings, withStateLock, writePrivateJson } from "./settings.js";

const execFilePromise = promisify(execFile);
const clientId = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const scopes = "user:profile user:inference user:sessions:claude_code user:mcp_servers user:file_upload";

function openBrowser(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "rundll32" : "xdg-open";
  const args = process.platform === "win32" ? ["url.dll,FileProtocolHandler", url] : [url];
  const child = spawn(command, args, { stdio: "ignore", detached: true });
  child.on("error", () => {});
  child.unref();
}

// Dependencies are injectable so callback, refresh, and expiry tests never use real credentials.
export function createAuth({ fetchImpl = fetch, launchBrowser = openBrowser,
  tokenUrl = "https://platform.claude.com/v1/oauth/token", callbackPort = 54545,
  timeoutMs = 300_000, onAuthorize = (url) => process.stderr.write(`Sign in to Claude for claude-artifacts:\n${url}\nWaiting for browser authorization…\n`),
} = {}) {
  async function mode() {
    const value = process.env.CLAUDE_ARTIFACTS_AUTH_MODE ?? (await readSettings()).authMode;
    if (!["separate", "claude-code"].includes(value)) throw new Error("CLAUDE_ARTIFACTS_AUTH_MODE must be separate or claude-code.");
    return value;
  }

  async function exchange(body, previous) {
    let response;
    try {
      response = await fetchImpl(tokenUrl, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ client_id: clientId, ...body }),
        signal: AbortSignal.timeout(30_000), redirect: "error",
      });
    } catch { throw new Error("Claude authorization request failed. Retry claude-artifacts auth login."); }
    if (!response.ok) throw new Error(`Claude authorization failed (HTTP ${response.status}). Run claude-artifacts auth login.`);
    let value;
    try { value = await response.json(); } catch { throw new Error("Invalid Claude authorization response."); }
    const refreshToken = value.refresh_token ?? previous?.refreshToken;
    if (typeof value.access_token !== "string" || !value.access_token || typeof refreshToken !== "string" || !refreshToken ||
      !Number.isFinite(value.expires_in) || value.expires_in <= 0 || value.expires_in > 366 * 86400) {
      throw new Error("Incomplete Claude authorization response.");
    }
    return { accessToken: value.access_token, refreshToken, expiresAt: Date.now() + value.expires_in * 1000 };
  }

  async function token(rejectedToken) {
    if (process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN) return process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN;
    if (await mode() === "claude-code") {
      if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return process.env.CLAUDE_CODE_OAUTH_TOKEN;
      try {
        let raw;
        if (process.platform === "darwin" && !process.env.CLAUDE_CONFIG_DIR) {
          raw = (await execFilePromise("security", ["find-generic-password", "-a", process.env.USER ?? "", "-w", "-s", "Claude Code-credentials"])).stdout;
        } else {
          raw = await readFile(join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), ".credentials.json"), "utf8");
        }
        const value = JSON.parse(raw).claudeAiOauth?.accessToken;
        if (!value) throw new Error("missing");
        return value;
      } catch { throw new Error("Claude Code login is unavailable. Run claude auth login, or use claude-artifacts auth login for a separate session."); }
    }
    return withStateLock(async () => {
      const saved = await readPrivateJson("credentials.json");
      if (!saved?.accessToken || !saved?.refreshToken || !Number.isFinite(saved.expiresAt)) {
        throw new Error("Not signed in. Run claude-artifacts auth login. To reuse Claude Code instead: claude-artifacts config --auth-mode claude-code");
      }
      if (saved.expiresAt > Date.now() + 60_000 && saved.accessToken !== rejectedToken) return saved.accessToken;
      const fresh = await exchange({ grant_type: "refresh_token", refresh_token: saved.refreshToken }, saved);
      await writePrivateJson("credentials.json", fresh);
      return fresh.accessToken;
    });
  }

  async function login({ noBrowser = false } = {}) {
    const state = randomBytes(32).toString("base64url");
    const verifier = randomBytes(32).toString("base64url");
    let receive;
    const callback = new Promise((resolve, reject) => { receive = { resolve, reject }; });
    // Attach a rejection handler before opening the listener.
    callback.catch(() => {});
    const server = http.createServer((request, response) => {
      const url = new URL(request.url, "http://localhost");
      response.setHeader("content-type", "text/plain; charset=utf-8");
      response.setHeader("cache-control", "no-store");
      if (request.method !== "GET" || url.pathname !== "/callback") { response.writeHead(404).end("Not found."); return; }
      if (url.searchParams.get("state") !== state) { response.writeHead(400).end("OAuth state mismatch. Return to the authorization page."); return; }
      if (url.searchParams.has("error")) {
        response.end("Sign-in declined. Return to your terminal.");
        receive.reject(new Error("Claude sign-in was declined."));
      } else if (url.searchParams.get("code")) {
        response.end("Authorization received. Return to your terminal to check that sign-in completed.");
        receive.resolve(url.searchParams.get("code"));
      } else { response.writeHead(400).end("Missing authorization code."); }
    });
    let timer;
    const cancel = () => receive.reject(new Error("Claude sign-in cancelled."));
    try {
      await new Promise((resolve, reject) => { server.once("error", reject); server.listen(callbackPort, "127.0.0.1", resolve); });
      const redirect = `http://localhost:${server.address().port}/callback`;
      const url = new URL("https://claude.ai/oauth/authorize");
      url.search = new URLSearchParams({ code: "true", client_id: clientId, response_type: "code", redirect_uri: redirect,
        scope: scopes, code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256", state }).toString();
      timer = setTimeout(() => receive.reject(new Error("Claude sign-in timed out. Run claude-artifacts auth login again.")), timeoutMs);
      process.once("SIGINT", cancel);
      process.once("SIGTERM", cancel);
      await onAuthorize(url.toString());
      if (!noBrowser) launchBrowser(url.toString());
      const code = await callback;
      const saved = await exchange({ grant_type: "authorization_code", code, redirect_uri: redirect, code_verifier: verifier, state });
      await withStateLock(async () => {
        await writePrivateJson("credentials.json", saved);
        await writePrivateJson("config.json", { ...await readSettings(), authMode: "separate" });
      });
      return { authenticated: true, auth_mode: "separate" };
    } finally {
      clearTimeout(timer);
      process.removeListener("SIGINT", cancel);
      process.removeListener("SIGTERM", cancel);
      server.closeAllConnections?.();
      await new Promise((resolve) => server.close(resolve));
    }
  }

  async function status() {
    const authMode = await mode();
    if (process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN) return { auth_mode: authMode, source: "environment", authenticated: true };
    if (authMode === "claude-code") return { auth_mode: authMode, source: "Claude Code", authenticated: null };
    const saved = await readPrivateJson("credentials.json");
    return { auth_mode: authMode, source: "separate", authenticated: Boolean(saved?.accessToken && saved?.refreshToken),
      ...(Number.isFinite(saved?.expiresAt) ? { expires_at: new Date(saved.expiresAt).toISOString() } : {}) };
  }

  async function logout() {
    await withStateLock(() => rm(join(configDirectory(), "credentials.json"), { force: true }));
    return { removed: true, message: "Separate local credentials removed. Claude Code login is unchanged." };
  }
  return { token, login, status, logout };
}

export const auth = createAuth();
