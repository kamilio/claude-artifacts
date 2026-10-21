import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { websiteManifest } from '../src/website.js';

async function fixture(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'claude-artifacts-site-'));
  try { await fn(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}
test('website preserves pages, modules, styles, binary assets, and relative links', () => fixture(async dir => {
  await mkdir(join(dir, 'about'));
  await mkdir(join(dir, 'assets'));
  await writeFile(join(dir, 'index.html'), '<!doctype html><a href="about/team.html">Team</a><script type="module" src="assets/app.js"></script>');
  await writeFile(join(dir, 'about/team.html'), '<!doctype html><link rel="stylesheet" href="../assets/style.css"><img src="../assets/logo.png">');
  await writeFile(join(dir, 'assets/app.js'), 'import "./dep.js";');
  await writeFile(join(dir, 'assets/dep.js'), 'console.log("works");');
  await writeFile(join(dir, 'assets/style.css'), 'body { background: url("./logo.png"); }');
  const binary = Buffer.from([0, 1, 255, 128, 3]);
  await writeFile(join(dir, 'assets/logo.png'), binary);
  await writeFile(join(dir, '.env'), 'secret');
  await mkdir(join(dir, 'node_modules'));
  await writeFile(join(dir, 'node_modules/nope.js'), 'not for publishing');
  const manifest = await websiteManifest(dir);
  assert.equal(Object.keys(manifest).length, 6);
  assert.equal(manifest['index.html'].content.includes('about/team.html'), true);
  assert.equal(manifest['about/team.html'].content.includes('../assets/logo.png'), true);
  assert.equal(manifest['assets/app.js'].contentType, 'text/javascript');
  assert.equal(manifest['assets/style.css'].contentType, 'text/css');
  assert.deepEqual(Buffer.from(manifest['assets/logo.png'].content, 'base64'), binary);
}));
test('website refuses missing index, symlinks, unsupported assets, invalid UTF-8, and unsafe paths', () => fixture(async dir => {
  await assert.rejects(websiteManifest(dir), /index.html/);
  await writeFile(join(dir, 'index.html'), '<!doctype html>');
  await symlink(join(dir, 'index.html'), join(dir, 'linked.html'));
  await assert.rejects(websiteManifest(dir), /symlinks/);
  await rm(join(dir, 'linked.html'));
  await writeFile(join(dir, 'app.ts'), 'const source = 1;');
  await assert.rejects(websiteManifest(dir), /built static site/);
  await rm(join(dir, 'app.ts'));
  await writeFile(join(dir, 'bad.txt'), Buffer.from([255]));
  await assert.rejects(websiteManifest(dir), /UTF-8/);
  await rm(join(dir, 'bad.txt'));
  await writeFile(join(dir, 'bad?.html'), 'x');
  await assert.rejects(websiteManifest(dir), /Unsupported website path/);
}));
test('website enforces file count and encoded payload limits', () => fixture(async dir => {
  await writeFile(join(dir, 'index.html'), '<!doctype html>');
  await writeFile(join(dir, 'large.png'), Buffer.alloc(13 * 1024 * 1024));
  await assert.rejects(websiteManifest(dir), /encoded upload limit/);
  await rm(join(dir, 'large.png'));
  await Promise.all(Array.from({length: 256}, (_, i) => writeFile(join(dir, `${i}.txt`), 'x')));
  await assert.rejects(websiteManifest(dir), /256 files/);
}));
