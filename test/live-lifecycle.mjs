// Opt-in integration test: creates one private artifact and deletes it in finally.
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const bin = resolve(dirname(fileURLToPath(import.meta.url)), '../bin/claude-artifacts.mjs');
const directory = await mkdtemp(join(tmpdir(), 'claude-artifacts-live-'));
const site = join(directory, 'site');
await mkdir(site);
let artifact;
const run = async args => {
  const result = await exec(process.execPath, [bin, ...args, '--output', 'json'], { cwd: site, maxBuffer: 1024 * 1024 });
  return JSON.parse(result.stdout);
};
const originals = {
  'index.html': Buffer.from('<!doctype html><html><head><title>Original</title></head><body>First version</body></html>'),
  'pages/unlinked.html': Buffer.from('<!doctype html><html><body>Unlinked page</body></html>'),
  'pixel.png': Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=', 'base64'),
};
try {
  for (const [path, bytes] of Object.entries(originals)) {
    await mkdir(dirname(join(site, path)), { recursive: true });
    await writeFile(join(site, path), bytes);
  }
  await run(['init', '--title', 'Temporary CLI lifecycle test', '--share', 'private']);
  const first = await run(['create']);
  artifact = first.artifact_id;
  assert.equal(JSON.parse(await readFile(join(site, '.claude-artifacts.json'), 'utf8')).artifact, artifact);
  await writeFile(join(site, 'index.html'), '<!doctype html><h1>Second version</h1>');
  await rm(join(site, 'pages/unlinked.html'));
  await writeFile(join(site, 'second-only.txt'), 'Remove me on rollback');
  const second = await run(['update', '--base-version', first.version, '--title', 'Temporary changed title']);
  assert.notEqual(second.version, first.version);
  const backup = join(directory, 'backup');
  const exported = await run(['export', '--directory', backup, '--content-version', first.version]);
  assert.deepEqual([...exported.files].sort(), Object.keys(originals).sort());
  for (const [path, bytes] of Object.entries(originals)) assert.deepEqual(await readFile(join(backup, path)), bytes);
  const rolled = await run(['rollback', '--to-version', first.version]);
  assert.equal(rolled.artifact_id, artifact);
  assert.equal(rolled.previous_version, second.version);
  assert.notEqual(rolled.version, first.version);
  const restored = join(directory, 'restored');
  const current = await run(['export', '--directory', restored]);
  assert.deepEqual([...current.files].sort(), Object.keys(originals).sort());
  for (const [path, bytes] of Object.entries(originals)) assert.deepEqual(await readFile(join(restored, path)), bytes);
  const read = await run(['read']);
  assert.equal(read.share_mode, 'owner');
  assert.equal(read.title, 'Temporary CLI lifecycle test');
  const versions = await run(['versions']);
  assert.equal(versions.live, rolled.version);
  assert.ok(versions.versions.some(v => v.version === first.version));
  assert.ok(versions.versions.some(v => v.version === second.version));
  console.log(JSON.stringify({ ok: true, files: exported.files.length, versions: versions.versions.length, sharing: 'owner' }));
} finally {
  // create saves the ID before changing sharing, so failures there are also recoverable.
  if (!artifact) {
    try { artifact = JSON.parse(await readFile(join(site, '.claude-artifacts.json'), 'utf8')).artifact; } catch {}
  }
  try {
    if (artifact) { await run(['delete', artifact]); console.log('Temporary artifact deleted.'); }
  } finally { await rm(directory, { recursive: true, force: true }); }
}
