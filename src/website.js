import { constants } from "node:fs";
import { lstat, open, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const textTypes = {
  ".html": "text/html", ".htm": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".map": "application/json", ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".md": "text/markdown", ".csv": "text/csv",
};
const binaryTypes = {
  ".wasm": "application/wasm", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
  ".ttf": "font/ttf", ".otf": "font/otf", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
  ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf",
};
const pathPattern = /^(?!\/)(?!.*\/\/)(?!.*\/$)(?!(?:^|.*\/)\.\.?(?:\/|$))[^\p{Cc}\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069\u2028\u2029\\?#%:;]{1,512}$/u;
export const maxDeployBytes = 16 * 1024 * 1024;

// Send one atomic manifest. No asset URL rewriting or client-side router is needed.
export async function websiteManifest(directory) {
  const manifest = Object.create(null);
  let count = 0;
  let wireBytes = 0;
  async function walk(relative = "") {
    const entries = await readdir(join(directory, relative), { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const path = relative ? `${relative}/${entry.name}` : entry.name;
      if (!pathPattern.test(path)) throw new Error(`Unsupported website path: ${path}`);
      const absolute = join(directory, path);
      const info = await lstat(absolute);
      if (info.isSymbolicLink()) throw new Error(`Website symlinks are not supported: ${path}. Copy the asset into the website directory.`);
      if (info.isDirectory()) { await walk(path); continue; }
      if (!info.isFile()) throw new Error(`Website entry is not a regular file: ${path}`);
      if (++count > 256) throw new Error("Website exceeds 256 files. Publish a smaller build directory.");
      const extension = extname(path).toLowerCase();
      const contentType = textTypes[extension] ?? binaryTypes[extension];
      if (!contentType) throw new Error(`Unsupported website asset: ${path}. Publish the built static site, not its source directory.`);
      if (info.size > maxDeployBytes) throw new Error(`Website asset exceeds the 16 MiB upload limit: ${path}`);
      const file = await open(absolute, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
      let bytes;
      try { bytes = await file.readFile(); } finally { await file.close(); }
      const text = Object.hasOwn(textTypes, extension);
      let content;
      if (text) {
        try { content = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
        catch { throw new Error(`Website text must be UTF-8: ${path}`); }
      } else { content = bytes.toString("base64"); }
      const asset = { content, contentType };
      wireBytes += Buffer.byteLength(JSON.stringify({ [path]: asset }));
      if (wireBytes > maxDeployBytes) throw new Error("Website exceeds the 16 MiB encoded upload limit. Compress assets or publish a smaller build.");
      manifest[path] = asset;
    }
  }
  await walk();
  if (!Object.hasOwn(manifest, "index.html")) throw new Error("Website directory must contain index.html.");
  return manifest;
}
