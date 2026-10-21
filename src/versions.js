import { createHash } from "node:crypto";
import { mkdir, writeFile, rm, lstat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { artifactId, frameRequest } from "./api.js";
import { encodeAsset, maxDeployBytes, pathPattern } from "./website.js";

function versionId(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value)) throw new Error("Invalid artifact version ID. Use claude-artifacts versions to find a version.");
  return value;
}

export async function listVersions(id, request = frameRequest) {
  id = artifactId(id);
  const value = await request("GET", `/api/frame/versions/${id}`);
  if (!Array.isArray(value?.history) || typeof value.live !== "string") throw new Error("Invalid version history response.");
  return {
    artifact_id: id, artifact_url: `https://claude.ai/code/artifact/${id}`, live: versionId(value.live),
    versions: value.history.map(version => {
      versionId(version);
      const metadata = value.versions?.[version] ?? {};
      return { version, current: version === value.live,
        ...(typeof metadata.title === "string" ? { title: metadata.title } : {}),
        ...(typeof metadata.label === "string" ? { label: metadata.label } : {}),
        ...(typeof metadata.created_at === "string" ? { created_at: metadata.created_at } : {}),
      };
    }),
  };
}

async function readBytes(response, remaining) {
  if (Number(response.headers.get("content-length")) > remaining) {
    await response.body?.cancel();
    throw new Error("Artifact files exceed the 16 MiB download limit.");
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of response.body ?? []) {
    length += chunk.length;
    if (length > remaining) throw new Error("Artifact files exceed the 16 MiB download limit.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, length);
}

// Read the complete manifest for one immutable version, never crawl rendered HTML.
export async function readSnapshot(id, version, { request = frameRequest, fetchImpl = fetch } = {}) {
  id = artifactId(id);
  if (version !== undefined) versionId(version);
  const metadata = await request("GET", `/api/frame/${id}${version === undefined ? "" : `?ver=${encodeURIComponent(version)}`}`);
  const actual = versionId(metadata?.ver);
  if (version !== undefined && actual !== version) throw new Error("The server did not return the requested version. Nothing was exported or restored.");
  if (typeof metadata.assetToken !== "string" || !metadata.assetToken) throw new Error("Original files require authenticated access to this artifact.");
  const download = async path => {
    const url = new URL(`https://${id}.frame.claudeusercontent.com/_f/${actual}/${path}`);
    url.searchParams.set("__frame_t", metadata.assetToken);
    try { return await fetchImpl(url, { redirect: "error", signal: AbortSignal.timeout(60_000) }); }
    catch { throw new Error("Could not download artifact files. Retry the command."); }
  };
  let files = metadata.files;
  if (files === undefined) {
    // Historical boot responses omit files. Their immutable manifest remains on the asset host.
    const response = await download("_files.json");
    if (response.status === 404 && (metadata.fileCount === undefined || metadata.fileCount === 1)) {
      await response.body?.cancel();
      files = [{ path: "index.html", contentType: "text/html" }];
    } else {
      if (!response.ok) {
        await response.body?.cancel();
        throw new Error(`Version file manifest is unavailable (HTTP ${response.status}).`);
      }
      const bytes = await readBytes(response, maxDeployBytes);
      let manifest;
      try { manifest = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("Invalid version file manifest."); }
      if (manifest?.ver !== actual || manifest.narrowed === true || !manifest.files || typeof manifest.files !== "object" || Array.isArray(manifest.files)) {
        throw new Error("Version file manifest is incomplete or belongs to another version.");
      }
      files = Object.entries(manifest.files).map(([path, entry]) => ({ ...entry, path }));
    }
  }
  if (!Array.isArray(files) || files.length === 0 || files.length > 256) throw new Error("The server must provide a complete file manifest with 1–256 files.");
  if (metadata.fileCount !== undefined && metadata.fileCount !== files.length) throw new Error("The server returned an incomplete file manifest.");
  const paths = new Set();
  for (const file of files) {
    if (!file || typeof file.path !== "string" || !pathPattern.test(file.path) || paths.has(file.path) ||
      typeof file.contentType !== "string" || !/^[\w.+-]+\/[\w.+-]+(?:;[^\r\n]*)?$/.test(file.contentType)) throw new Error("Invalid or duplicate file in the artifact manifest.");
    paths.add(file.path);
  }
  if (!paths.has("index.html")) throw new Error("Artifact manifest has no index.html.");
  for (const path of paths) {
    const parts = path.split("/");
    for (let i = 1; i < parts.length; i++) if (paths.has(parts.slice(0, i).join("/"))) throw new Error("Artifact manifest has conflicting file and directory paths.");
  }
  let total = 0;
  const assets = [];
  for (const file of files) {
    const path = file.path.split("/").map(encodeURIComponent).join("/");
    const response = await download(`_src/${path}`);
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`Original file ${file.path} is unavailable (HTTP ${response.status}). Nothing was exported or restored.`);
    }
    const bytes = await readBytes(response, maxDeployBytes - total);
    if (file.size !== undefined && file.size !== bytes.length) throw new Error(`Downloaded size does not match the manifest: ${file.path}`);
    if (file.sha256 !== undefined && file.sha256 !== createHash("sha256").update(bytes).digest("hex")) throw new Error(`Downloaded checksum does not match the manifest: ${file.path}`);
    total += bytes.length;
    assets.push({ path: file.path, contentType: file.contentType, bytes });
  }
  return { id, version: actual, metadata, assets, bytes: total };
}

export async function exportArtifact(id, directory, version, dependencies) {
  directory = resolve(directory);
  // Check before downloading, then reserve with mkdir to avoid overwriting a racing writer.
  try { await lstat(directory); throw new Error(`Export destination already exists: ${directory}. Choose a new directory.`); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const snapshot = await readSnapshot(id, version, dependencies);
  await mkdir(directory);
  try {
    for (const asset of snapshot.assets) {
      const path = join(directory, asset.path);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, asset.bytes, { flag: "wx" });
    }
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
  return { artifact_id: snapshot.id, artifact_url: `https://claude.ai/code/artifact/${snapshot.id}`,
    version: snapshot.version, directory, files: snapshot.assets.map(asset => asset.path), bytes: snapshot.bytes };
}

export async function rollbackArtifact(id, version, { baseVersion, label } = {}, dependencies = {}) {
  id = artifactId(id);
  versionId(version);
  const request = dependencies.request ?? frameRequest;
  const history = await listVersions(id, request);
  if (!history.versions.some(entry => entry.version === version)) throw new Error("Version is not in this artifact's history.");
  if (baseVersion !== undefined && baseVersion !== history.live) throw new Error(`conflict: live version is ${history.live}`);
  const snapshot = await readSnapshot(id, version, dependencies);
  const manifest = Object.create(null);
  for (const asset of snapshot.assets) manifest[asset.path] = encodeAsset(asset.bytes, asset.contentType, asset.path);
  const body = {
    slug: id, manifest, mode: "replace", baseVersion: history.live,
    title: snapshot.metadata.title ?? `Restored ${version}`, favicon: snapshot.metadata.favicon ?? "*",
    label: label ?? `Restored ${version}`,
  };
  if (Buffer.byteLength(JSON.stringify(body)) > maxDeployBytes) throw new Error("Restored artifact exceeds the 16 MiB encoded upload limit.");
  const result = await request("POST", "/api/frame/deploy/direct", body);
  if (result?.slug !== id || typeof result.version !== "string") throw new Error("Rollback returned an incomplete response. Check version history before retrying.");
  return { artifact_id: id, artifact_url: `https://claude.ai/code/artifact/${id}`, version: result.version,
    restored_from: version, previous_version: history.live, files: snapshot.assets.map(asset => asset.path) };
}
