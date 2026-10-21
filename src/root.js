import { readFile, stat } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";
import { auth } from "./auth.js";
import { prepareWebsite } from "./build.js";
import { readSettings, updateSettings } from "./settings.js";
import { websiteManifest, maxDeployBytes } from "./website.js";
import { setArtifactSharing, validateShare } from "./sharing.js";

import { defineCommand, defineGroup, S } from "toolcraft";
import { parse } from "toolcraft/design/parse";
import { renderHtml } from "toolcraft/design/render-html";
import { renderMarkdownHtml } from "toolcraft/design/render-markdown-html";

const artifactIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const artifactCss = await readFile(new URL("./artifact.css", import.meta.url), "utf8");
const artifactsGalleryUrl = "https://claude.ai/code/artifacts";
const markdownHtmlOptions = { syntaxHighlight: true };
const codeLanguageByExtension = new Map([
  [".cjs", "js"],
  [".css", "css"],
  [".csv", "csv"],
  [".env", "sh"],
  [".js", "js"],
  [".json", "json"],
  [".jsonc", "jsonc"],
  [".jsx", "jsx"],
  [".log", "text"],
  [".mjs", "js"],
  [".py", "python"],
  [".rb", "ruby"],
  [".sh", "sh"],
  [".sql", "sql"],
  [".toml", "toml"],
  [".ts", "ts"],
  [".tsx", "tsx"],
  [".txt", "text"],
  [".xml", "xml"],
  [".yaml", "yaml"],
  [".yml", "yaml"],
]);

function artifactId(value) {
  if (artifactIdPattern.test(value)) return value.toLowerCase();
  try {
    const url = new URL(value);
    const match = /^\/code\/artifact\/([^/]+)\/?$/.exec(url.pathname);
    if (url.protocol === "https:" && url.hostname === "claude.ai" && match && artifactIdPattern.test(match[1])) return match[1].toLowerCase();
  } catch {}
  throw new Error("Expected a Claude artifact UUID or https://claude.ai/code/artifact/<id> URL.");
}

function sourceKind(path) {
  const extension = extname(path).toLowerCase();
  if (extension === ".html" || extension === ".htm") return "html";
  if (extension === ".md" || extension === ".markdown") return "markdown";
  return "code";
}

function sourceLanguage(path) {
  const extension = extname(path).toLowerCase();
  if (extension === "") return "text";
  return codeLanguageByExtension.get(extension) ?? (extension.slice(1).replace(/[^a-z0-9_+-]/gi, "") || "text");
}

async function validateArtifactSource(file) {
  const path = resolve(file);
  const fileStat = await stat(path);
  if (!fileStat.isFile() && !fileStat.isDirectory()) throw new Error("Source must be a regular file or website directory.");
  const kind = fileStat.isDirectory() ? "website" : sourceKind(path);
  const language = kind === "code" ? sourceLanguage(path) : undefined;
  return {
    path,
    kind,
    language,
    bytes: fileStat.size,
    under_size_limit: kind === "website" || fileStat.size <= maxDeployBytes,
    publishable: kind === "website" || fileStat.size <= maxDeployBytes,
  };
}

function pageHtml(bodyHtml) {
  return `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>${artifactCss}</style></head><body>\n${bodyHtml}\n</body></html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderFrontmatterValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    return `<table><tbody><tr>${value.map((item) => `<td>${renderFrontmatterValue(item)}</td>`).join("")}</tr></tbody></table>`;
  }
  if (value !== null && typeof value === "object") return renderNestedFrontmatterTable(value);
  if (value === null || value === undefined) return "";
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function renderNestedFrontmatterTable(frontmatter) {
  const entries = Object.entries(frontmatter);
  if (entries.length === 0) return "";
  const headers = entries.map(([key]) => `<th>${escapeHtml(key)}</th>`).join("");
  const values = entries.map(([, value]) => `<td>${renderFrontmatterValue(value)}</td>`).join("");
  return `<table><thead><tr>${headers}</tr></thead><tbody><tr>${values}</tr></tbody></table>`;
}

function renderFrontmatterTable(frontmatter) {
  if (frontmatter === undefined) return "";
  const rows = Object.entries(frontmatter)
    .map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${renderFrontmatterValue(value)}</td></tr>`)
    .join("");
  return rows === "" ? "" : `<table class="frontmatter"><tbody>${rows}</tbody></table>`;
}

function renderArtifactMarkdownHtml(source) {
  const { ast, frontmatter } = parse(source);
  return [renderFrontmatterTable(frontmatter), renderHtml(ast, markdownHtmlOptions)].filter(Boolean).join("\n");
}

function fencedMarkdown(source, language) {
  let longestBacktickRun = 2;
  for (const match of source.matchAll(/`+/g)) longestBacktickRun = Math.max(longestBacktickRun, match[0].length);
  const fence = "`".repeat(longestBacktickRun + 1);
  return `${fence}${language}\n${source.replace(/\s*$/, "\n")}${fence}`;
}

async function artifactContent(path, kind, language) {
  const bytes = await readFile(path);
  let source;
  try { source = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch { throw new Error("Single-file uploads must be UTF-8 text. To publish binary assets, include them in a website directory."); }
  if (kind === "markdown") {
    return pageHtml(renderArtifactMarkdownHtml(source));
  }
  if (kind === "html") return /<!doctype\s+html/i.test(source) || /<html[\s>]/i.test(source) ? source : pageHtml(source);
  return pageHtml(renderMarkdownHtml(fencedMarkdown(source, language ?? "text"), markdownHtmlOptions));
}

async function artifactTitle(path, title) {
  if (title !== undefined) return title;
  return basename(path, extname(path));
}

function artifactsApiBaseUrl() {
  if (process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"] !== undefined) return process.env["CLAUDE_CODE_ARTIFACTS_API_BASE_URL"].replace(/\/+$/, "");
  return "https://api.anthropic.com";
}

async function frameRequest(method, path, body, headers = {}) {
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

async function publishDirect(path, kind, language, slug, title, favicon = "*", label, baseVersion, share, buildOptions = {}, dryRun = false) {
  const requestedShare = share === undefined ? (slug === undefined ? (await readSettings()).defaultShare : undefined) : validateShare(share);
  const prepared = kind === "website" ? await prepareWebsite(path, buildOptions) : undefined;
  if (kind !== "website" && Object.values(buildOptions).some(value => value !== undefined && value !== false)) throw new Error("Build options require a directory, not a single file.");
  const payload = kind === "website"
    ? { manifest: await websiteManifest(prepared.path), mode: "replace" }
    : { content: await artifactContent(path, kind, language) };
  const body = {
    title: title ?? (kind === "website" ? basename(path) : await artifactTitle(path)),
    favicon,
    ...payload,
    ...(slug !== undefined ? { slug } : {}),
    ...(label !== undefined ? { label } : {}),
    ...(baseVersion !== undefined ? { baseVersion } : {}),
  };
  const uploadBytes = Buffer.byteLength(JSON.stringify(body));
  if (uploadBytes > maxDeployBytes) throw new Error("Artifact exceeds the 16 MiB encoded upload limit.");
  const website = kind === "website" ? {
    files: Object.keys(payload.manifest), publish_path: prepared.path, built: prepared.built,
    ...(prepared.built ? { framework: prepared.framework, package_manager: prepared.package_manager } : {}),
  } : {};
  if (dryRun) return {
    dry_run: true, title: body.title, kind, upload_bytes: uploadBytes, upload_limit_bytes: maxDeployBytes,
    requested_share: requestedShare ?? "unchanged",
    ...(slug !== undefined ? { artifact_id: slug } : {}),
    ...website,
    ...(kind === "website" ? { assets: Object.entries(payload.manifest).map(([path, asset]) => ({
      path, content_type: asset.contentType, encoded_bytes: Buffer.byteLength(JSON.stringify(asset)),
    })) } : {}),
  };
  const responseBody = await frameRequest("POST", "/api/frame/deploy/direct", body);
  const responseSlug = responseBody["slug"];
  const version = responseBody["version"];
  if (responseSlug === undefined || version === undefined) throw new Error(`deploy returned incomplete response: ${JSON.stringify(responseBody)}`);
  let shareMode;
  if (requestedShare !== undefined) {
    try { shareMode = await setArtifactSharing(frameRequest, responseSlug, requestedShare); }
    catch (error) { throw new Error(`Published https://claude.ai/code/artifact/${responseSlug} (version ${version}), but ${requestedShare} sharing failed: ${error.message}. Retry with claude-artifacts share ${responseSlug} --share ${requestedShare}; do not create another artifact.`); }
  }
  return {
    artifact_url: `https://claude.ai/code/artifact/${responseSlug}`,
    artifact_id: responseSlug,
    version,
    read: responseBody["read"],
    shared: shareMode !== undefined ? shareMode !== "owner" : responseBody["shared"],
    share_mode: shareMode ?? responseBody["read"],
    ...website,
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
  if (value.dry_run) return renderLines([
    "dry run: validated locally; nothing published",
    `source:   ${value.source_path}`,
    value.publish_path ? `output:   ${value.publish_path}` : "",
    `payload:  ${value.upload_bytes} / ${value.upload_limit_bytes} bytes`,
    `sharing:  ${value.requested_share}`,
    ...(value.assets ?? []).map(asset => `  ${asset.path} (${asset.content_type}, ${asset.encoded_bytes} encoded bytes)`),
  ]);
  return renderLines([
    `artifact: ${value.artifact_url}`,
    `source:   ${value.source_path}`,
    value.built ? `build:    ${value.framework} → ${value.publish_path}` : "",
    `version:  ${value.version}`,
    value.share_mode !== undefined ? `sharing:  ${value.share_mode}` : "",
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

const buildParams = {
  buildCommand: S.Optional(S.String({ description: "Custom shell build command, run in the project directory instead of the detected command." })),
  outputDir: S.Optional(S.String({ description: "Static build output directory, relative to the project. Overrides framework defaults." })),
  skipBuild: S.Optional(S.Boolean({ description: "Publish an already-built directory without building or installing dependencies." })),
  skipInstall: S.Optional(S.Boolean({ description: "Skip automatic dependency installation when node_modules is absent." })),
};

function buildOptions(params) {
  return Object.fromEntries(Object.keys(buildParams).map(key => [key, params[key]]));
}

const publishParams = {
  ...buildParams,
  dryRun: S.Optional(S.Boolean({ description: "Build and validate locally, reporting files and upload size without authentication or API calls. Build/install scripts still run unless --skip-build is set." })),
  file: S.String({ description: "Local file, built website directory, or website project to build automatically." }),
  favicon: S.Optional(S.String({ description: "One or two emoji for the artifact browser-tab icon. Defaults to *." })),
  title: S.Optional(S.String({ description: "Artifact title. Defaults to the file basename." })),
  label: S.Optional(S.String({ description: "Version label shown in the artifact version picker." })),
  share: S.Optional(S.String({ description: "private or org. Creates use the saved default; updates preserve sharing unless explicitly set." })),
};

const createCommand = defineCommand({
  name: "create",
  aliases: ["publish"],
  description: "Publish a file or website. Website projects are built automatically.",
  scope: ["cli", "mcp", "sdk"],
  positional: ["file"],
  params: S.Object(publishParams),
  handler: async ({ params }) => {
    const validation = await validateArtifactSource(params.file);
    if (!validation.publishable) throw new Error(`Artifact source is not publishable: ${validation.path}`);
    const published = await publishDirect(validation.path, validation.kind, validation.language, undefined, params.title, params.favicon, params.label, undefined, params.share, buildOptions(params), params.dryRun);
    return { ...published, source_path: validation.path };
  },
  render: { json: renderJson, markdown: renderPublish, rich: (value, primitives) => primitives.logger.message(renderPublish(value), "") },
});

const updateCommand = defineCommand({
  name: "update",
  description: "Publish a new version from a file or website directory. Directory updates replace all deployed files.",
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
    const published = await publishDirect(validation.path, validation.kind, validation.language, artifactId(params.artifact), params.title, params.favicon, params.label, params.baseVersion, params.share, buildOptions(params), params.dryRun);
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

const simpleRender = {
  json: renderJson,
  markdown: (value) => JSON.stringify(value, null, 2),
  rich: (value, primitives) => primitives.logger.message(JSON.stringify(value, null, 2), ""),
};

const configCommand = defineCommand({
  name: "config",
  description: "Show or save authentication and new-artifact sharing defaults.",
  scope: ["cli"],
  params: S.Object({
    authMode: S.Optional(S.String({ description: "separate (default) or claude-code to reuse Claude Code login." })),
    defaultShare: S.Optional(S.String({ description: "private (default) or org. Applies to new artifacts only." })),
  }),
  handler: async ({ params }) => {
    const changes = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
    return Object.keys(changes).length ? updateSettings(changes) : readSettings();
  },
  render: simpleRender,
});

const authGroup = defineGroup({
  name: "auth", description: "Manage the separate claude-artifacts login.", scope: ["cli"],
  children: [
    defineCommand({
      name: "login", description: "Sign in through the browser with a separate OAuth session.", scope: ["cli"],
      params: S.Object({ noBrowser: S.Optional(S.Boolean({ description: "Print the sign-in URL without opening a browser." })) }),
      handler: ({ params }) => auth.login(params), render: simpleRender,
    }),
    defineCommand({
      name: "status", description: "Show the credential source and local sign-in state without revealing tokens.", scope: ["cli"],
      params: S.Object({}), handler: () => auth.status(), render: simpleRender,
    }),
    defineCommand({
      name: "logout", description: "Remove the separate local login. Does not sign out Claude Code or clear environment tokens.", scope: ["cli"],
      params: S.Object({}), handler: () => auth.logout(), render: simpleRender,
    }),
  ],
});

const shareCommand = defineCommand({
  name: "share", description: "Change an existing artifact's audience to private or org.", scope: ["cli", "mcp", "sdk"],
  positional: ["artifact"],
  params: S.Object({
    artifact: S.String({ description: "Claude Code artifact URL or artifact ID." }),
    share: S.String({ description: "private or org." }),
  }),
  handler: async ({ params }) => {
    const id = artifactId(params.artifact);
    return { artifact_url: `https://claude.ai/code/artifact/${id}`, share_mode: await setArtifactSharing(frameRequest, id, params.share) };
  },
  render: simpleRender,
});

export const root = defineGroup({
  name: "claude-artifacts",
  description: "Publish Claude Code artifacts and static websites with a separate Claude session.",
  scope: ["cli", "mcp", "sdk"],
  children: [
    authGroup,
    configCommand,
    createCommand,
    readCommand,
    updateCommand,
    listCommand,
    deleteCommand,
    shareCommand,
  ],
});
