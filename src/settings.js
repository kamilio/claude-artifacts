import { constants } from "node:fs";
import { mkdir, open, rename, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import lockfile from "proper-lockfile";

export function configDirectory() {
  return process.env.CLAUDE_ARTIFACTS_CONFIG_DIR ?? join(homedir(), ".config", "claude-artifacts");
}

export async function readPrivateJson(name) {
  let file;
  try {
    file = await open(join(configDirectory(), name), constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const info = await file.stat();
    if (!info.isFile() || (process.platform !== "win32" && (info.mode & 0o077) !== 0)) {
      throw new Error(`${name} must be a regular file with private permissions (chmod 600).`);
    }
    return JSON.parse(await file.readFile("utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    // Never include credential contents in JSON parser errors.
    if (error instanceof SyntaxError) throw new Error(`Invalid ${name}; repair or remove it before continuing.`);
    throw error;
  } finally {
    await file?.close();
  }
}

export async function writePrivateJson(name, value) {
  const directory = configDirectory();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporary = join(directory, `.${name}.${randomUUID()}`);
  try {
    await usingFile(temporary, async (file) => {
      await file.writeFile(`${JSON.stringify(value, null, 2)}\n`);
      await file.sync();
    });
    await rename(temporary, join(directory, name));
  } finally {
    await rm(temporary, { force: true });
  }
}

async function usingFile(path, operation) {
  const file = await open(path, "wx", 0o600);
  try { await operation(file); } finally { await file.close(); }
}

export async function withStateLock(operation) {
  const directory = configDirectory();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const release = await lockfile.lock(directory, {
    retries: { retries: 100, minTimeout: 100, maxTimeout: 500 },
    stale: 60_000,
  });
  try { return await operation(); } finally { await release(); }
}

export function validateSettings(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid settings object.");
  if (value.authMode !== undefined && !["separate", "claude-code"].includes(value.authMode)) {
    throw new Error("authMode must be separate or claude-code.");
  }
  if (value.defaultShare !== undefined && !["private", "org"].includes(value.defaultShare)) {
    throw new Error("defaultShare must be private or org.");
  }
  return value;
}

export async function readSettings() {
  return { authMode: "separate", defaultShare: "private", ...validateSettings(await readPrivateJson("config.json") ?? {}) };
}

export async function updateSettings(changes) {
  validateSettings(changes);
  return withStateLock(async () => {
    const settings = { ...await readSettings(), ...changes };
    await writePrivateJson("config.json", settings);
    return settings;
  });
}
