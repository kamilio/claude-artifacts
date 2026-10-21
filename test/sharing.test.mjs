import test from 'node:test';
import assert from 'node:assert/strict';
import { setArtifactSharing } from '../src/sharing.js';

test('org sharing preserves named readers and uses permission revision', async () => {
  const calls = [];
  const request = async (method, path, body, headers) => {
    calls.push({ method, path, body, headers });
    if (method === 'PATCH') return {};
    return { read: { mode: calls.length === 1 ? 'users' : 'org', users: ['member'] }, version: 'p2' };
  };
  assert.equal(await setArtifactSharing(request, 'id', 'org'), 'org');
  assert.deepEqual(calls[1].body, { read: { mode: 'org', users: ['member'] } });
  assert.deepEqual(calls[1].headers, { 'If-Match': 'p2' });
});
test('sharing respects account restrictions and detects unconfirmed writes', async () => {
  for (const metadata of [
    { read: { mode: 'owner' }, version: 'p', readModeFrozen: true },
    { read: { mode: 'owner' }, version: 'p', assignableReadModes: ['owner'] },
    { read: { mode: 'unknown' }, version: 'p' },
  ]) {
    let calls = 0;
    await assert.rejects(setArtifactSharing(async () => { calls++; return metadata; }, 'id', 'org'));
    assert.equal(calls, 1);
  }
  await assert.rejects(setArtifactSharing(async () => ({ read: { mode: 'owner' }, version: 'p' }), 'id', 'org'), /could not be confirmed/);
});
