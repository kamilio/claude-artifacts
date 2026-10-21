import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const id = '11111111-1111-4111-8111-111111111111';
test('CLI website create/update, persistent sharing defaults, overrides, and recoverable sharing failure', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'claude-artifacts-publishing-'));
  const requests = [];
  let mode = 'owner', revision = 1, failShare = false;
  let files = {};
  const server = http.createServer(async (req, res) => {
    let text = ''; for await (const chunk of req) text += chunk;
    const body = text ? JSON.parse(text) : undefined;
    requests.push({ method: req.method, url: req.url, body, headers: req.headers });
    res.setHeader('content-type', 'application/json');
    if (req.url === '/api/frame/deploy/direct') {
      if (!body.slug) mode = 'owner';
      if (body.mode === 'replace') files = body.manifest;
      res.end(JSON.stringify({ slug: id, version: 'v1', read: mode, shared: false }));
    } else if (req.url === `/api/frame/perm/${id}` && req.method === 'GET') {
      res.end(JSON.stringify({ read: { mode, users: [] }, assignableReadModes: ['owner', 'org'], version: `perm-${revision}` }));
    } else if (req.url === `/api/frame/perm/${id}` && req.method === 'PATCH') {
      if (failShare) { res.writeHead(403); res.end(JSON.stringify({ error: 'org_disabled' })); return; }
      assert.equal(req.headers['if-match'], `perm-${revision}`);
      mode = body.read.mode; revision++;
      res.end(JSON.stringify({ read: { mode }, version: `perm-${revision}` }));
    } else { res.writeHead(404); res.end('{}'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const run = (args, env = {}) => new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [resolve('bin/claude-artifacts.mjs'), ...args, '--output', 'json'], {
      env: { ...process.env, CLAUDE_ARTIFACTS_CONFIG_DIR: join(dir, 'config'), CLAUDE_ARTIFACTS_OAUTH_TOKEN: 'synthetic',
        CLAUDE_CODE_ARTIFACTS_API_BASE_URL: `http://127.0.0.1:${server.address().port}`, ...env },
    });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => stdout += chunk); child.stderr.on('data', chunk => stderr += chunk);
    child.on('error', reject); child.on('close', code => resolvePromise({ code, stdout, stderr, text: stdout + stderr }));
  });
  const ok = async (args, env) => { const result = await run(args, env); assert.equal(result.code, 0, result.text); return JSON.parse(result.stdout); };
  try {
    const site = join(dir, 'website'); await mkdir(site);
    await writeFile(join(site, 'index.html'), '<!doctype html><a href="about.html">About</a>');
    await writeFile(join(site, 'about.html'), '<!doctype html><h1>About</h1>');
    await writeFile(join(site, 'logo.png'), Buffer.from([137, 80, 78, 71]));
    assert.equal((await ok(['config'])).authMode, 'separate');
    await ok(['config', '--default-share', 'org']);
    const noAuth = { CLAUDE_ARTIFACTS_OAUTH_TOKEN: '', CLAUDE_CODE_OAUTH_TOKEN: '', CLAUDE_ARTIFACTS_AUTH_MODE: 'separate' };
    const preview = await ok(['create', site, '--dry-run'], noAuth);
    assert.equal(preview.dry_run, true);
    assert.equal(preview.requested_share, 'org');
    assert.deepEqual(preview.files, ['about.html', 'index.html', 'logo.png']);
    assert.equal(preview.assets.find(asset => asset.path === 'logo.png').content_type, 'image/png');
    assert.equal(preview.artifact_url, undefined);
    assert.equal(requests.length, 0, 'dry run must not authenticate, deploy, or change sharing');
    const created = await ok(['create', site]);
    assert.equal(created.share_mode, 'org');
    assert.equal(created.files.length, 3);
    const deploy = requests.find(request => request.method === 'POST');
    assert.equal(preview.upload_bytes, Buffer.byteLength(JSON.stringify(deploy.body)));
    assert.equal(deploy.body.mode, 'replace');
    assert.equal(deploy.body.content, undefined);
    assert.equal(deploy.body.manifest['logo.png'].contentType, 'image/png');
    await rm(join(site, 'about.html'));
    const beforeUpdate = requests.length;
    const updatePreview = await ok(['update', id, site, '--dry-run'], noAuth);
    assert.equal(updatePreview.requested_share, 'unchanged');
    assert.equal(updatePreview.artifact_id, id);
    assert.equal(requests.length, beforeUpdate);
    await ok(['update', id, site, '--base-version', 'v1']);
    assert.equal(requests.length, beforeUpdate + 1, 'updates must preserve audience without permission mutations');
    assert.equal(files['about.html'], undefined, 'directory update removes old assets');
    assert.equal(requests.at(-1).body.baseVersion, 'v1');
    await ok(['create', site, '--share', 'private']);
    assert.equal(mode, 'owner');
    await ok(['share', id, '--share', 'org']);
    assert.equal(mode, 'org');
    const beforeInvalid = requests.length;
    const invalid = await run(['create', site, '--share', 'public']);
    assert.notEqual(invalid.code, 0);
    assert.equal(requests.length, beforeInvalid);
    // Real CLI build; only generated files reach the deployment API.
    const source = join(dir, 'source-app'); await mkdir(source);
    await mkdir(join(source, 'node_modules'));
    await writeFile(join(source, 'package.json'), JSON.stringify({ scripts: { build: 'node build.cjs' } }));
    await writeFile(join(source, 'build.cjs'), 'const fs=require("node:fs"); console.log("compiler progress"); fs.mkdirSync("dist",{recursive:true}); fs.writeFileSync("dist/index.html","<!doctype html><h1>Fresh build</h1>");');
    const beforePreviewBuild = requests.length;
    const buildPreview = await ok(['create', source, '--dry-run'], noAuth);
    assert.equal(buildPreview.built, true);
    assert.deepEqual(buildPreview.files, ['index.html']);
    assert.equal(requests.length, beforePreviewBuild);
    const built = await ok(['create', source, '--share', 'private']);
    assert.equal(built.built, true);
    assert.equal(built.source_path, source);
    assert.equal(built.publish_path, join(source, 'dist'));
    assert.deepEqual(built.files, ['index.html']);
    assert.equal(requests.filter(request => request.method === 'POST').at(-1).body.title, 'source-app');
    const countBeforeFailure = requests.length;
    await writeFile(join(source, 'build.cjs'), 'process.exit(1);');
    const badBuild = await run(['update', id, source]);
    assert.notEqual(badBuild.code, 0);
    assert.match(badBuild.text, /existing output was not used/);
    assert.equal(requests.length, countBeforeFailure, 'failed build must not call deploy or sharing API');
    const badPreview = await run(['create', source, '--dry-run'], noAuth);
    assert.notEqual(badPreview.code, 0);
    assert.match(badPreview.text, /existing output was not used/);
    assert.equal(requests.length, countBeforeFailure);
    const prebuilt = await ok(['update', id, source, '--skip-build', '--output-dir', 'dist']);
    assert.equal(prebuilt.built, false);
    failShare = true;
    const failed = await run(['create', site]);
    assert.notEqual(failed.code, 0);
    assert.match(failed.text, /Published https:\/\/claude.ai\/code\/artifact\//);
    assert.match(failed.text, /claude-artifacts share/);
    assert.match(failed.text, /do not create another artifact/);
  } finally {
    server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
    await rm(dir, { recursive: true, force: true });
  }
});
