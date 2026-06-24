import { execFile } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { promisify } from "node:util";

import { defineCommand, defineGroup, S } from "toolcraft";

const artifactIdPattern = /^[0-9a-fA-F-]{36}$/;
const execFilePromise = promisify(execFile);
const artifactShellStyle = "<style>:root{color-scheme:light}body{margin:0;padding:20px;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#faf9f5;color:#141413}img{max-width:100%}</style>";
const artifactsGalleryUrl = "https://claude.ai/code/artifacts";

function artifactId(value) {
  if (artifactIdPattern.test(value)) return value;
  const url = new URL(value);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1];
}

function lineText(value) {
  return value.replace(/[\t\r\n]+/g, " ").trim();
}

function sourceKind(path) {
  const extension = extname(path).toLowerCase();
  if (extension === ".html" || extension === ".htm") return "html";
  if (extension === ".md") return "markdown";
  throw new Error(`Claude Code artifacts can publish .html, .htm, or .md files: ${path}`);
}

async function validateArtifactSource(file) {
  const path = resolve(file);
  const fileStat = await stat(path);
  const contents = await readFile(path, "utf8");
  const kind = sourceKind(path);
  const externalRequests = kind === "html" ? [...contents.matchAll(/\b(?:src|href)\s*=\s*["']https?:\/\//gi)].map((match) => match[0]) : [];
  const dynamicRequests = kind === "html" ? [...contents.matchAll(/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b/g)].map((match) => match[0]) : [];
  return {
    path,
    kind,
    bytes: fileStat.size,
    under_size_limit: fileStat.size <= 16 * 1024 * 1024,
    external_reference_count: externalRequests.length,
    dynamic_request_count: dynamicRequests.length,
    publishable: fileStat.size <= 16 * 1024 * 1024,
  };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCode = false;
  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  for (const line of lines) {
    if (line.startsWith("```")) {
      closeList();
      html.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
    } else if (inCode) {
      html.push(escapeHtml(line));
    } else if (/^#{1,6}\s+/.test(line)) {
      closeList();
      const level = line.match(/^#+/)[0].length;
      html.push(`<h${level}>${escapeHtml(line.slice(level).trim())}</h${level}>`);
    } else if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html.push(`<p>${escapeHtml(line.trim())}</p>`);
    }
  }
  closeList();
  if (inCode) html.push("</code></pre>");
  return html.join("\n");
}

function htmlTitle(contents) {
  const match = contents.slice(0, 32768).replace(/<!--[\s\S]*?(?:-->|$)/g, "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (match === null) return null;
  return lineText(match[1].replace(/<[^>]*>/g, ""));
}

async function artifactContent(path, kind) {
  const source = await readFile(path, "utf8");
  if (kind === "markdown") {
    return `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">${artifactShellStyle}</head><body>\n${markdownToHtml(source)}\n</body></html>`;
  }
  if (/<!doctype\s+html/i.test(source) || /<html[\s>]/i.test(source)) return source;
  return `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">${artifactShellStyle}</head><body>\n${source}\n</body></html>`;
}

async function artifactTitle(path, title) {
  if (title !== undefined) return title;
  const source = await readFile(path, "utf8");
  return htmlTitle(source) ?? basename(path, extname(path));
}

async function oauthToken() {
  if (process.env["CLAUDE_CODE_OAUTH_TOKEN"]) return process.env["CLAUDE_CODE_OAUTH_TOKEN"];
  if (process.platform === "darwin") {
    const result = await execFilePromise("security", ["find-generic-password", "-a", process.env["USER"], "-w", "-s", "Claude Code-credentials"], { encoding: "utf8" });
    return JSON.parse(result.stdout)["claudeAiOauth"]["accessToken"];
  }
  const configDir = process.env["CLAUDE_CONFIG_DIR"] ?? join(homedir(), ".claude");
  return JSON.parse(await readFile(join(configDir, ".credentials.json"), "utf8"))["claudeAiOauth"]["accessToken"];
}

function artifactsApiBaseUrl() {
  if (process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"] !== undefined) return process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"].replace(/\/+$/, "");
  return "https://api.anthropic.com";
}

async function frameRequest(method, path, body) {
  const response = await fetch(`${artifactsApiBaseUrl()}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${await oauthToken()}`,
      "content-type": "application/json",
      "X-Frame-CP": "go",
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  const responseBody = text === "" ? null : JSON.parse(text);
  if (response.status === 409 && responseBody?.["conflict"] === true) throw new Error(`conflict: live version is ${responseBody["live"]}`);
  if (response.status < 200 || response.status >= 300) throw new Error(`${method} ${path} ${response.status}: ${JSON.stringify(responseBody)}`);
  return responseBody;
}

async function artifactAssetContent(slug, version, assetToken) {
  const response = await fetch(`https://${slug}.frame.claudeusercontent.com/_f/${version}/?__frame_t=${encodeURIComponent(assetToken)}`, {
    redirect: "manual",
  });
  const text = await response.text();
  if (response.status < 200 || response.status >= 300) throw new Error(`asset ${response.status}: ${text.slice(0, 200)}`);
  return text.replace(`<base href="/_f/${version}/">`, "");
}

function artifactMetadata(slug, body) {
  return {
    artifact_url: `https://claude.ai/code/artifact/${slug}`,
    artifact_id: slug,
    title: body["title"],
    favicon: body["favicon"],
    version: body["ver"],
    live: body["live"],
    role: body["perm"]?.["role"],
    share_mode: body["perm"]?.["mode"],
    author_email: body["author"]?.["email"],
    created_at: body["created_at"],
    updated_at: body["updated_at"],
    history: body["history"],
    versions: body["versions"],
  };
}

async function publishDirect(path, kind, slug, title, favicon = "*", label, baseVersion) {
  const content = await artifactContent(path, kind);
  const body = {
    title: await artifactTitle(path, title),
    favicon,
    content,
    ...(slug !== undefined ? { slug } : {}),
    ...(label !== undefined ? { label } : {}),
    ...(baseVersion !== undefined ? { baseVersion } : {}),
  };
  const responseBody = await frameRequest("POST", "/api/frame/deploy/direct", body);
  const responseSlug = responseBody["slug"];
  const version = responseBody["version"];
  if (responseSlug === undefined || version === undefined) throw new Error(`deploy returned incomplete response: ${JSON.stringify(responseBody)}`);
  return {
    artifact_url: `https://claude.ai/code/artifact/${responseSlug}`,
    artifact_id: responseSlug,
    version,
    read: responseBody["read"],
    shared: responseBody["shared"],
  };
}

function renderJson(value) {
  return value;
}

function renderLines(lines) {
  return lines.filter((line) => line !== "").join("\n");
}

function formatTimestamp(value) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

function renderPublish(value) {
  return renderLines([
    `artifact: ${value.artifact_url}`,
    `source:   ${value.source_path}`,
    `version:  ${value.version}`,
  ]);
}

function renderRead(value) {
  return renderLines([
    `artifact: ${value.artifact_url}`,
    `title:    ${value.title}`,
    `version:  ${value.version}`,
    `role:     ${value.role}`,
    `updated:  ${value.updated_at}`,
    value.content_html !== undefined ? "" : "",
    value.content_html !== undefined ? "```html" : "",
    value.content_html !== undefined ? value.content_html : "",
    value.content_html !== undefined ? "```" : "",
  ]);
}

function renderList(value) {
  const galleryLine = `gallery: ${value.gallery_url}`;
  if (value.artifacts.length === 0) return renderLines([galleryLine, "no code artifacts"]);
  return renderLines([
    galleryLine,
    "",
    value.artifacts.map((artifact, index) => renderLines([
      `${index + 1}. ${artifact.title ?? "(untitled)"}`,
      `   id:      ${artifact.artifact_id}`,
      `   url:     ${artifact.artifact_url}`,
      `   updated: ${artifact.updated_at_display}`,
      artifact.label !== undefined ? `   label:   ${artifact.label}` : "",
      `   owner:   ${artifact.owner_email}`,
      `   access:  ${artifact.relation}`,
      `   views:   ${artifact.view_count} total, ${artifact.unique_view_count} unique`,
    ])).join("\n\n"),
  ]);
}

function renderDelete(value) {
  return `deleted: ${value.artifact_url}`;
}

const publishParams = {
  file: S.String({ description: "Local .html, .htm, or .md file to publish." }),
  favicon: S.Optional(S.String({ description: "One or two emoji for the artifact browser-tab icon. Defaults to *." })),
  title: S.Optional(S.String({ description: "Artifact title. Defaults to the HTML title or file basename." })),
  label: S.Optional(S.String({ description: "Version label shown in the artifact version picker." })),
};

const createCommand = defineCommand({
  name: "create",
  aliases: ["publish"],
  description: "Publish a new Claude Code artifact from a local file using the current Claude Code login without an LLM turn.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["file"],
  params: S.Object(publishParams),
  handler: async ({ params }) => {
    const validation = await validateArtifactSource(params.file);
    if (!validation.publishable) throw new Error(`Artifact source is not publishable: ${validation.path}`);
    const published = await publishDirect(validation.path, validation.kind, undefined, params.title, params.favicon, params.label, undefined);
    return { ...published, source_path: validation.path };
  },
  render: { json: renderJson, markdown: renderPublish, rich: (value, primitives) => primitives.logger.message(renderPublish(value), "") },
});

const updateCommand = defineCommand({
  name: "update",
  description: "Publish a new version of an existing Claude Code artifact from a local file.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["artifact", "file"],
  params: S.Object({
    artifact: S.String({ description: "Claude Code artifact URL or artifact ID." }),
    baseVersion: S.Optional(S.String({ description: "Version to overwrite from. Pass the current version when enforcing conflict checks." })),
    ...publishParams,
  }),
  handler: async ({ params }) => {
    const validation = await validateArtifactSource(params.file);
    if (!validation.publishable) throw new Error(`Artifact source is not publishable: ${validation.path}`);
    const published = await publishDirect(validation.path, validation.kind, artifactId(params.artifact), params.title, params.favicon, params.label, params.baseVersion);
    return { ...published, artifact_id: artifactId(params.artifact), source_path: validation.path };
  },
  render: { json: renderJson, markdown: renderPublish, rich: (value, primitives) => primitives.logger.message(renderPublish(value), "") },
});

const readCommand = defineCommand({
  name: "read",
  description: "Read a Claude Code artifact from the Claude frame API.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["artifact"],
  params: S.Object({
    artifact: S.String({ description: "Claude Code artifact URL or artifact ID." }),
    content: S.Optional(S.Boolean({ description: "Include current HTML content." })),
    contentVersion: S.Optional(S.String({ description: "Artifact version to fetch when content is included." })),
  }),
  handler: async ({ params }) => {
    const id = artifactId(params.artifact);
    const response = await frameRequest("GET", `/api/frame/${id}`, undefined);
    const metadata = artifactMetadata(id, response);
    if (params.content !== true) return metadata;
    const version = params.contentVersion ?? response["ver"];
    const content = await artifactAssetContent(id, version, response["assetToken"]);
    return { ...metadata, version, content_html: content, content_bytes: Buffer.byteLength(content, "utf8") };
  },
  render: { json: renderJson, markdown: renderRead, rich: (value, primitives) => primitives.logger.message(renderRead(value), "") },
});

const listCommand = defineCommand({
  name: "list",
  description: "List Claude Code artifacts from the Claude frame API.",
  scope: ["cli", "mcp", "sdk"],
  params: S.Object({
    limit: S.Optional(S.Number({ description: "Maximum number of artifacts to request." })),
  }),
  handler: async ({ params }) => {
    const response = await frameRequest("GET", `/api/frame/frames?limit=${params.limit ?? 60}`, undefined);
    const artifacts = response["frames"]
      .filter((frame) => frame["source_surface"] === "code")
      .map((frame) => ({
        artifact_url: `https://claude.ai/code/artifact/${frame["slug"]}`,
        artifact_id: frame["slug"],
        title: frame["title"],
        label: frame["label"],
        owner_email: frame["owner_email"],
        owner_account: frame["owner_account"],
        relation: frame["rel"],
        source_surface: frame["source_surface"],
        view_count: frame["view_count"],
        unique_view_count: frame["unique_view_count"],
        updated_at: frame["updatedAt"],
        updated_at_display: formatTimestamp(frame["updatedAt"]),
      }));
    return { gallery_url: artifactsGalleryUrl, artifacts };
  },
  render: { json: renderJson, markdown: renderList, rich: (value) => process.stdout.write(`${renderList(value)}\n`) },
});

const deleteCommand = defineCommand({
  name: "delete",
  description: "Delete a Claude Code artifact.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["artifact"],
  params: S.Object({
    artifact: S.String({ description: "Claude Code artifact URL or artifact ID." }),
  }),
  handler: async ({ params }) => {
    const id = artifactId(params.artifact);
    await frameRequest("DELETE", `/api/frame/${id}`, undefined);
    return { deleted: true, artifact_id: id, artifact_url: `https://claude.ai/code/artifact/${id}` };
  },
  render: { json: renderJson, markdown: renderDelete, rich: (value, primitives) => primitives.logger.message(renderDelete(value), "") },
});

export const root = defineGroup({
  name: "claude-artifacts",
  description: "Create Claude Code artifacts with the current Claude Code login.",
  scope: ["cli", "mcp", "sdk"],
  children: [
    createCommand,
    readCommand,
    updateCommand,
    listCommand,
    deleteCommand,
  ],
});
