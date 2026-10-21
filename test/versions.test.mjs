import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { readSnapshot, exportArtifact, rollbackArtifact, listVersions } from '../src/versions.js';
import { encodeAsset } from '../src/website.js';

const id = '11111111-1111-4111-8111-111111111111';
const originals = {
  'index.html': { bytes: Buffer.from('\ufeff<!doctype html><h1>Original</h1>'), contentType: 'text/html' },
  'pages/unlinked.html': { bytes: Buffer.from('<!doctype html><p>No incoming links</p>'), contentType: 'text/html' },
  'assets/pixel.png': { bytes: Buffer.from([137, 80, 78, 71, 0, 255]), contentType: 'image/png' },
};
function protocol() {
  const calls = [], downloads = [];
  const metadata = { ver: 'v1', live: 'v2', title: 'Original title', favicon: '*', assetToken: 'synthetic-secret',
    files: Object.entries(originals).map(([path, asset]) => ({ path, contentType: asset.contentType, size: asset.bytes.length,
      sha256: createHash('sha256').update(asset.bytes).digest('hex') })) };
  const request = async (method, path, body) => {
    calls.push({ method, path, body });
    if (path === `/api/frame/versions/${id}`) return { live: 'v2', history: ['v2', 'v1'], versions: { v1: { title: 'Original title', thumb_img_url: 'secret-url' } } };
    if (method === 'GET') return metadata;
    return { slug: id, version: 'v3' };
  };
  const fetchImpl = async (url, options) => {
    downloads.push(String(url));
    assert.equal(options.redirect, 'error');
    assert.equal(url.searchParams.get('__frame_t'), 'synthetic-secret');
    assert.equal(url.hostname, `${id}.frame.claudeusercontent.com`);
    const path = decodeURIComponent(url.pathname.replace('/_f/v1/_src/', ''));
    assert.ok(originals[path], 'must use original source paths');
    return new Response(originals[path].bytes);
  };
  return { calls, downloads, metadata, request, fetchImpl };
}

test('version listing excludes asset credentials and marks the live version', async () => {
  const result = await listVersions(id, protocol().request);
  assert.equal(result.versions[0].current, true);
  assert.equal(result.versions[1].title, 'Original title');
  assert.ok(!JSON.stringify(result).includes('secret-url'));
});

test('rollback encoding preserves JavaScript MIME variants as text', () => {
  const source = 'export const answer = 42;';
  assert.equal(encodeAsset(Buffer.from(source), 'application/javascript; charset=utf-8', 'app.js').content, source);
});

test('export writes every original file byte-for-byte and refuses existing destinations', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'claude-artifacts-export-'));
  const p = protocol();
  const destination = join(dir, 'site');
  try {
    const result = await exportArtifact(id, destination, 'v1', p);
    assert.equal(result.files.length, 3);
    for (const [path, asset] of Object.entries(originals)) assert.deepEqual(await readFile(join(destination, path)), asset.bytes);
    await writeFile(join(destination, 'keep.txt'), 'do not overwrite');
    const before = p.calls.length;
    await assert.rejects(exportArtifact(id, destination, 'v1', p), /already exists/);
    assert.equal(p.calls.length, before);
    assert.equal(await readFile(join(destination, 'keep.txt'), 'utf8'), 'do not overwrite');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('rollback restores all original bytes as a new version and guards against concurrent changes', async () => {
  const p = protocol();
  const result = await rollbackArtifact(id, 'v1', {}, p);
  assert.equal(result.restored_from, 'v1');
  assert.equal(result.version, 'v3');
  assert.equal(result.previous_version, 'v2');
  const writes = p.calls.filter(call => call.method !== 'GET');
  assert.equal(writes.length, 1, 'rollback must not change permissions');
  const body = writes[0].body;
  assert.equal(body.slug, id);
  assert.equal(body.baseVersion, 'v2');
  assert.equal(body.mode, 'replace');
  assert.equal(body.title, 'Original title');
  for (const [path, asset] of Object.entries(originals)) {
    const restored = Buffer.from(body.manifest[path].content, asset.contentType === 'image/png' ? 'base64' : 'utf8');
    assert.deepEqual(restored, asset.bytes);
  }
  const stale = protocol();
  await assert.rejects(rollbackArtifact(id, 'v1', { baseVersion: 'v0' }, stale), /conflict/);
  assert.equal(stale.downloads.length, 0);
  const racing = protocol();
  const request = racing.request;
  racing.request = async (...args) => {
    if (args[0] === 'POST') { assert.equal(args[2].baseVersion, 'v2'); throw new Error('conflict: live version is v4'); }
    return request(...args);
  };
  await assert.rejects(rollbackArtifact(id, 'v1', {}, racing), /conflict/);
});

test('historical versions obtain their complete file list from the immutable manifest', async () => {
  const p = protocol();
  const files = Object.fromEntries(p.metadata.files.map(({ path, ...entry }) => [path, entry]));
  delete p.metadata.files;
  p.metadata.fileCount = 3;
  const fetchAsset = p.fetchImpl;
  p.fetchImpl = async (url, options) => url.pathname.endsWith('/_files.json')
    ? Response.json({ ver: 'v1', files }) : fetchAsset(url, options);
  const snapshot = await readSnapshot(id, 'v1', p);
  assert.deepEqual(snapshot.assets.map(asset => asset.path), Object.keys(originals));
  for (const manifest of [{ ver: 'v2', files }, { ver: 'v1', files, narrowed: true }]) {
    p.fetchImpl = async () => Response.json(manifest);
    await assert.rejects(readSnapshot(id, 'v1', p), /incomplete|another version/);
  }
});

test('legacy single pages are supported but missing multi-file manifests never become partial exports', async () => {
  const p = protocol();
  delete p.metadata.files;
  const fetchAsset = p.fetchImpl;
  p.fetchImpl = async (url, options) => url.pathname.endsWith('/_files.json')
    ? new Response('not found', { status: 404 }) : fetchAsset(url, options);
  assert.deepEqual((await readSnapshot(id, 'v1', p)).assets.map(asset => asset.path), ['index.html']);
  p.metadata.fileCount = 3;
  await assert.rejects(readSnapshot(id, 'v1', p), /manifest is unavailable/);
});

test('bad manifests, wrong versions, and altered bytes are rejected before writing', async () => {
  for (const mutate of [
    p => { p.metadata.ver = 'v2'; },
    p => { p.metadata.files[0].path = '../outside.html'; },
    p => { p.metadata.files.push(p.metadata.files[0]); },
    p => { p.metadata.fileCount = 4; },
    p => { p.metadata.files[0].sha256 = '0'.repeat(64); },
  ]) {
    const p = protocol(); mutate(p);
    await assert.rejects(rollbackArtifact(id, 'v1', {}, p));
    assert.ok(p.calls.every(call => call.method === 'GET'));
  }
  const p = protocol();
  p.fetchImpl = async () => new Response('missing', { status: 404 });
  const dir = await mkdtemp(join(tmpdir(), 'claude-artifacts-export-failed-'));
  try {
    await assert.rejects(exportArtifact(id, join(dir, 'site'), 'v1', p), /Original file/);
    await assert.rejects(access(join(dir, 'site')));
  } finally { await rm(dir, { recursive: true, force: true }); }
});
