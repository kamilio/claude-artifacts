import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root } from '../src/root.js';

const create = root.children.find(command => command.name === 'create');
const id = '11111111-1111-4111-8111-111111111111';

async function publishFile(name, content, check) {
  const directory = await mkdtemp(join(tmpdir(), 'claude-artifacts-content-'));
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN;
  const requests = [];
  process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN = 'synthetic';
  globalThis.fetch = async (url, options) => {
    requests.push({ url, ...options });
    return Response.json(options.method === 'POST'
      ? { slug: id, version: 'v1' }
      : { read: { mode: 'owner' }, version: 'p1' });
  };
  try {
    const file = join(directory, name);
    await writeFile(file, content);
    await check(() => create.handler({ params: { file, share: 'private' } }), requests);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN;
    else process.env.CLAUDE_ARTIFACTS_OAUTH_TOKEN = originalToken;
    await rm(directory, { recursive: true, force: true });
  }
}

test('HTML inside source code stays escaped code rather than executable HTML', () =>
  publishFile('template.js', 'const page = `<!doctype html><html><script>alert("example")</script></html>`;', async (publish, requests) => {
    await publish();
    const { content } = JSON.parse(requests[0].body);
    assert.ok(content.includes('<code class="language-js">'));
    assert.ok(!content.includes('<script>alert('));
    assert.ok(content.includes('&lt;script&gt;'));
  }));

test('single-file uploads reject invalid UTF-8 without contacting the API', () =>
  publishFile('invalid.txt', Buffer.from([0xff]), async (publish, requests) => {
    await assert.rejects(publish(), /UTF-8/);
    assert.equal(requests.length, 0);
  }));

test('large text with many backtick runs does not overflow the argument stack', () =>
  publishFile('many-fences.txt', '` '.repeat(150_000), async (publish, requests) => {
    await publish();
    assert.ok(JSON.parse(requests[0].body).content.includes('<code class="language-text">'));
  }));
