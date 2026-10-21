import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createAuth } from '../src/auth.js';
import { readSettings, updateSettings, writePrivateJson } from '../src/settings.js';

async function isolated(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'claude-artifacts-auth-'));
  const old = { ...process.env };
  process.env.CLAUDE_ARTIFACTS_CONFIG_DIR = dir;
  delete process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN;
  delete process.env.CLAUDE_ARTIFACTS_AUTH_MODE;
  process.env.CLAUDE_CODE_OAUTH_TOKEN = 'unrelated-code-token';
  try { await fn(dir); } finally { process.env = old; await rm(dir, { recursive: true, force: true }); }
}
const tokenResponse = (access = 'owned-access', refresh = 'owned-refresh') => Response.json({ access_token: access, refresh_token: refresh, expires_in: 3600 });

test('separate default never falls back to Claude Code, explicit opt-out does', () => isolated(async () => {
  const auth = createAuth();
  await assert.rejects(auth.token(), /Not signed in/);
  assert.equal((await readSettings()).authMode, 'separate');
  await updateSettings({ authMode: 'claude-code' });
  assert.equal(await auth.token(), 'unrelated-code-token');
  process.env.CLAUDE_ARTIFACTS_AUTH_MODE = 'separate';
  await assert.rejects(auth.token(), /Not signed in/);
  process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN = 'explicit-own-token';
  assert.equal(await auth.token(), 'explicit-own-token');
}));

test('OAuth callback checks state, exchanges PKCE, and saves private independent tokens', () => isolated(async (dir) => {
  let authorize;
  let launched = false;
  const auth = createAuth({ callbackPort: 0, launchBrowser: () => { launched = true; }, onAuthorize: async (value) => {
    authorize = new URL(value);
    const callback = new URL(authorize.searchParams.get('redirect_uri'));
    callback.hostname = '127.0.0.1';
    callback.search = new URLSearchParams({ code: 'synthetic-code', state: 'wrong' });
    assert.equal((await fetch(callback)).status, 400);
    callback.searchParams.set('state', authorize.searchParams.get('state'));
    assert.equal((await fetch(callback)).status, 200);
  }, fetchImpl: async (url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.grant_type, 'authorization_code');
    assert.equal(body.code, 'synthetic-code');
    assert.equal(body.state, authorize.searchParams.get('state'));
    assert.equal(createHash('sha256').update(body.code_verifier).digest('base64url'), authorize.searchParams.get('code_challenge'));
    return tokenResponse();
  } });
  assert.equal((await auth.login({ noBrowser: true })).authenticated, true);
  assert.equal(launched, false);
  assert.equal(await auth.token(), 'owned-access');
  assert.equal((await stat(join(dir, 'credentials.json'))).mode & 0o777, 0o600);
  assert.equal((await readSettings()).authMode, 'separate');
  assert.equal(JSON.stringify(await auth.status()).includes('owned-access'), false);
  await auth.logout();
  await assert.rejects(auth.token(), /Not signed in/);
  assert.equal(process.env.CLAUDE_CODE_OAUTH_TOKEN, 'unrelated-code-token');
}));

test('expired and rejected tokens refresh once across concurrent clients', () => isolated(async () => {
  await writePrivateJson('credentials.json', { accessToken: 'expired', refreshToken: 'refresh', expiresAt: 0 });
  let calls = 0;
  const fetchImpl = async () => { calls++; await new Promise(resolve => setTimeout(resolve, 25)); return tokenResponse('fresh', 'rotated'); };
  const clients = Array.from({ length: 4 }, () => createAuth({ fetchImpl }));
  assert.deepEqual(await Promise.all(clients.map(client => client.token())), Array(4).fill('fresh'));
  assert.equal(calls, 1);
  await clients[0].token('fresh');
  assert.equal(calls, 2);
}));

test('refresh failures preserve credentials and never echo secrets', () => isolated(async (dir) => {
  await writePrivateJson('credentials.json', { accessToken: 'expired-secret', refreshToken: 'refresh-secret', expiresAt: 0 });
  const before = await readFile(join(dir, 'credentials.json'), 'utf8');
  const auth = createAuth({ fetchImpl: async () => new Response('refresh-secret', { status: 400 }) });
  await assert.rejects(auth.token(), error => !error.message.includes('secret') && /auth login/.test(error.message));
  assert.equal(await readFile(join(dir, 'credentials.json'), 'utf8'), before);
  await writeFile(join(dir, 'credentials.json'), 'secret-invalid-json');
  await assert.rejects(auth.token(), error => !error.message.includes('secret-invalid-json'));
}));

test('cancelled, declined and timed-out login leave saved credentials untouched', () => isolated(async (dir) => {
  await writePrivateJson('credentials.json', { accessToken: 'old', refreshToken: 'refresh', expiresAt: 99 });
  const before = await readFile(join(dir, 'credentials.json'), 'utf8');
  const declined = createAuth({ callbackPort: 0, onAuthorize: async value => {
    const url = new URL(value), callback = new URL(url.searchParams.get('redirect_uri'));
    callback.hostname = '127.0.0.1';
    callback.search = new URLSearchParams({ state: url.searchParams.get('state'), error: 'access_denied' });
    await fetch(callback);
  } });
  await assert.rejects(declined.login({ noBrowser: true }), /declined/);
  const cancelled = createAuth({ callbackPort: 0, onAuthorize: () => process.emit('SIGINT') });
  await assert.rejects(cancelled.login({ noBrowser: true }), /cancelled/);
  const timed = createAuth({ callbackPort: 0, timeoutMs: 10, onAuthorize: () => {} });
  await assert.rejects(timed.login({ noBrowser: true }), /timed out/);
  assert.equal(await readFile(join(dir, 'credentials.json'), 'utf8'), before);
}));
