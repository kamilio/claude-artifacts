import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findProject, initializeProject, publishingOptions, rememberArtifact, projectArtifact, projectFilename } from '../src/project.js';

const id = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
async function fixture(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'claude-artifacts-project-'));
  try { await fn(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}

test('project initialization validates settings and never overwrites existing config', () => fixture(async dir => {
  await assert.rejects(initializeProject(dir, { token: 'not-allowed' }), /unknown setting/);
  await assert.rejects(initializeProject(dir, { share: 'public' }), /private or org/);
  await initializeProject(dir, { artifact: `https://claude.ai/code/artifact/${id}`, title: 'Team site' });
  const before = await readFile(join(dir, projectFilename), 'utf8');
  assert.equal(JSON.parse(before).artifact, id);
  await assert.rejects(initializeProject(dir, {}), /already exists/);
  assert.equal(await readFile(join(dir, projectFilename), 'utf8'), before);
}));

test('project discovery works from nested folders and stops at repository boundaries', () => fixture(async dir => {
  await initializeProject(dir);
  const nested = join(dir, 'nested', 'pages'); await mkdir(nested, { recursive: true });
  assert.equal((await findProject({ file: nested })).directory, dir);
  await mkdir(join(dir, 'nested', '.git'));
  assert.equal(await findProject({ file: nested }), undefined);
  assert.equal((await findProject({ file: nested, project: dir })).directory, dir);
  await assert.rejects(findProject({ project: nested }), /No .claude-artifacts.json/);
}));

test('dotfile paths are project-relative and explicit options win', () => fixture(async dir => {
  await mkdir(join(dir, 'site'));
  await initializeProject(dir, { artifact: id, file: 'site', title: 'Saved', share: 'org', buildCommand: 'npm run special', outputDir: 'docs', skipInstall: true });
  const { options } = await publishingOptions({ project: dir, title: 'Override', skipInstall: false, skipBuild: true }, true);
  assert.equal(options.file, join(dir, 'site'));
  assert.equal(options.artifact, id);
  assert.equal(options.title, 'Override');
  assert.equal(options.skipInstall, false);
  assert.equal(options.buildCommand, undefined);
  assert.equal(options.share, undefined, 'updates preserve the existing audience');
  assert.equal((await publishingOptions({ project: dir })).options.share, 'org');
  assert.equal((await publishingOptions({ project: dir, artifact: other, share: 'private' }, true)).options.artifact, other);
  const fromSource = await publishingOptions({ artifact: join(dir, 'site') }, true);
  assert.equal(fromSource.options.artifact, id);
  assert.equal(fromSource.options.file, join(dir, 'site'));
  assert.equal(await projectArtifact({ project: dir }), id);
  await mkdir(join(dir, 'site', 'dist'));
  const prebuilt = (await publishingOptions({ file: join(dir, 'site', 'dist') })).options;
  assert.equal(prebuilt.buildCommand, undefined);
  assert.equal(prebuilt.outputDir, undefined);
  assert.equal(prebuilt.title, 'Saved');
  assert.equal((await publishingOptions({ file: join(dir, 'site', 'dist'), outputDir: 'custom' })).options.outputDir, 'custom');
}));

test('publishing records the first target and preserves later edits or existing targets', () => fixture(async dir => {
  await initializeProject(dir, { title: 'First' });
  const project = await findProject({ project: dir });
  await writeFile(project.path, JSON.stringify({ title: 'Edited while building' }));
  await rememberArtifact(project, id);
  await rememberArtifact(project, other);
  const saved = JSON.parse(await readFile(project.path, 'utf8'));
  assert.equal(saved.title, 'Edited while building');
  assert.equal(saved.artifact, id);
}));

test('malformed or unknown project settings fail before executing a build', () => fixture(async dir => {
  await writeFile(join(dir, projectFilename), '{broken');
  await assert.rejects(publishingOptions({ file: dir }), /Invalid JSON/);
  await writeFile(join(dir, projectFilename), JSON.stringify({ outputDir: '/absolute' }));
  await assert.rejects(publishingOptions({ file: dir }), /must be relative/);
}));
