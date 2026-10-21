import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectFramework, packageManager, prepareWebsite, runBuildCommand } from '../src/build.js';

async function fixture(fn, pkg) {
  const directory = await mkdtemp(join(tmpdir(), 'claude-artifacts-build-'));
  try {
    if (pkg) await writeFile(join(directory, 'package.json'), JSON.stringify(pkg));
    await fn(directory);
  } finally { await rm(directory, { recursive: true, force: true }); }
}
async function page(directory, path, body = '<!doctype html><h1>Built</h1>') {
  await mkdir(join(directory, path), { recursive: true });
  await writeFile(join(directory, path, 'index.html'), body);
}
const quiet = { log: () => {} };

test('plain sites and explicit prebuilt directories do not execute scripts', () => fixture(async directory => {
  await page(directory, '.');
  const forbidden = { ...quiet, run: () => { throw new Error('must not execute'); } };
  assert.equal((await prepareWebsite(directory, {}, forbidden)).built, false);
  await writeFile(join(directory, 'package.json'), JSON.stringify({ scripts: { build: 'exit 1' } }));
  await page(directory, 'dist');
  const result = await prepareWebsite(directory, { skipBuild: true, outputDir: 'dist' }, forbidden);
  assert.equal(result.path, join(directory, 'dist'));
  assert.equal(result.built, false);
  await assert.rejects(prepareWebsite(directory, { skipBuild: true, buildCommand: 'echo bad' }, forbidden), /cannot be combined/);
}));

test('framework precedence identifies wrappers before their Vite dependency', () => {
  assert.equal(detectFramework({ dependencies: { vite: '*', astro: '*' } }).name, 'Astro');
  assert.equal(detectFramework({ devDependencies: { vite: '*', '@sveltejs/kit': '*' } }).name, 'SvelteKit');
  assert.equal(detectFramework({ dependencies: { react: '*', vue: '*' } }), undefined);
});

test('framework presets build the expected static directory, including Angular browser output', async () => {
  for (const [dependency, output, script] of [
    ['vite', 'dist', 'build'], ['astro', 'dist', 'build'], ['next', 'out', 'build'], ['nuxt', '.output/public', 'generate'],
    ['@sveltejs/kit', 'build', 'build'], ['@angular/core', 'dist/my-app/browser', 'build'],
    ['@react-router/dev', 'build/client', 'build'], ['@docusaurus/core', 'build', 'build'],
    ['gatsby', 'public', 'build'], ['react-scripts', 'build', 'build'], ['@vue/cli-service', 'dist', 'build'],
    ['@11ty/eleventy', '_site', 'build'], ['parcel', 'dist', 'build'],
  ]) await fixture(async directory => {
    await mkdir(join(directory, 'node_modules'));
    const calls = [];
    const result = await prepareWebsite(directory, {}, { ...quiet, run: async (command, args) => {
      calls.push([command, args]); await page(directory, output);
    } });
    assert.equal(result.path, join(directory, output), dependency);
    assert.equal(result.built, true);
    assert.deepEqual(calls, [['npm', ['run', script]]], dependency);
  }, { dependencies: { [dependency]: '*' }, scripts: { build: 'build-the-app', generate: 'generate-the-app' } });
});

test('package manager selection respects declarations, lockfiles, and modern Yarn', async () => {
  for (const [lock, declared, name, install] of [
    ['package-lock.json', undefined, 'npm', ['ci', '--include=dev']],
    ['npm-shrinkwrap.json', undefined, 'npm', ['ci', '--include=dev']],
    ['pnpm-lock.yaml', undefined, 'pnpm', ['install', '--prod=false', '--frozen-lockfile']],
    ['yarn.lock', 'yarn@1.22.22', 'yarn', ['install', '--frozen-lockfile']],
    ['yarn.lock', 'yarn@4.0.0', 'yarn', ['install', '--immutable']],
    ['bun.lock', undefined, 'bun', ['install', '--frozen-lockfile']],
    ['bun.lockb', undefined, 'bun', ['install', '--frozen-lockfile']],
  ]) await fixture(async directory => {
    await writeFile(join(directory, lock), 'synthetic');
    const selected = await packageManager(directory, { packageManager: declared });
    assert.equal(selected.name, name);
    assert.deepEqual(selected.install, install);
  });
  await fixture(async directory => {
    await writeFile(join(directory, 'yarn.lock'), 'synthetic');
    await writeFile(join(directory, 'package-lock.json'), '{}');
    await assert.rejects(packageManager(directory), /Conflicting/);
    assert.equal((await packageManager(directory, { packageManager: 'yarn@4.0.0' })).name, 'yarn');
    await assert.rejects(packageManager(directory, { packageManager: 'evil@1' }), /must name/);
  });
});

test('installs missing dependencies once and never accepts output created only by install hooks', () => fixture(async directory => {
  const calls = [];
  await assert.rejects(prepareWebsite(directory, {}, { ...quiet, run: async (command, args, options) => {
    calls.push([command, args]);
    if (options.install) await page(directory, 'dist');
  } }), /No fresh index/);
  assert.deepEqual(calls, [['npm', ['install', '--include=dev']], ['npm', ['run', 'build']]]);
}, { scripts: { build: 'do-build' }, dependencies: { vite: '*' } }));

test('modern Yarn is recognized from its lockfile and reuses PnP without installing', () => fixture(async directory => {
  await writeFile(join(directory, 'yarn.lock'), '# Generated by Yarn\n__metadata:\n  version: 8\n');
  await writeFile(join(directory, '.pnp.cjs'), '// Existing PnP install');
  assert.deepEqual((await packageManager(directory)).install, ['install', '--immutable']);
  // An explicit Classic declaration still takes precedence over filesystem hints.
  assert.deepEqual((await packageManager(directory, { packageManager: 'yarn@1.22.22' })).install, ['install', '--frozen-lockfile']);
  const calls = [];
  await prepareWebsite(directory, {}, { ...quiet, run: async (command, args) => {
    calls.push([command, args]);
    await page(directory, 'dist');
  } });
  assert.deepEqual(calls, [['yarn', ['run', 'build']]]);
}, { scripts: { build: 'build' } }));

test('failed and no-op builds cannot publish stale output, even with an explicit output directory', () => fixture(async directory => {
  await page(directory, 'dist', 'stale');
  await assert.rejects(prepareWebsite(directory, { skipInstall: true }, { ...quiet, run: async () => { throw new Error('compiler failed'); } }), /compiler failed/);
  await assert.rejects(prepareWebsite(directory, { skipInstall: true, outputDir: 'dist' }, { ...quiet, run: async () => {} }), /No fresh index/);
  assert.equal(await readFile(join(directory, 'dist/index.html'), 'utf8'), 'stale');
}, { dependencies: { vite: '*' }, scripts: { build: 'build' } }));

test('custom build commands and paths support non-Node generators without dependency installation', () => fixture(async directory => {
  const result = await prepareWebsite(directory, { buildCommand: 'hugo --destination web', outputDir: 'web' }, { ...quiet,
    run: async (command, args, options) => {
      assert.equal(command, 'hugo --destination web'); assert.deepEqual(args, []); assert.equal(options.shell, true);
      await page(directory, 'web');
    },
  });
  assert.equal(result.path, join(directory, 'web'));
}));

test('unknown scripts require an unambiguous fresh static output', () => fixture(async directory => {
  await assert.rejects(prepareWebsite(directory, { skipInstall: true }, { ...quiet, run: async () => {
    await page(directory, 'dist'); await page(directory, 'build');
  } }), /Several website outputs/);
}, { scripts: { build: 'custom-tool' } }));

test('server outputs are rejected even when they contain a prerendered homepage', async () => {
  for (const [dependency, output, server] of [
    ['next', '.next/server/app', '.next/server/app/index.js'],
    ['astro', 'dist', 'dist/server/entry.mjs'],
    ['@react-router/dev', 'build/client', 'build/server/index.js'],
    ['nuxt', '.output/public', '.output/server/index.mjs'],
    ['@angular/core', 'dist/app/browser', 'dist/app/server/server.mjs'],
  ]) await fixture(async directory => {
    await assert.rejects(prepareWebsite(directory, { skipInstall: true, outputDir: output }, { ...quiet, run: async () => {
      await page(directory, output);
      await mkdir(join(directory, server, '..'), { recursive: true });
      await writeFile(join(directory, server), 'server code');
    } }), /server|runtime/);
  }, { dependencies: { [dependency]: '*' }, scripts: { build: 'build', generate: 'generate' } });
});

test('build output cannot escape the project through a symlink', () => fixture(async directory => {
  const external = await mkdtemp(join(tmpdir(), 'claude-artifacts-external-'));
  try {
    await symlink(external, join(directory, 'dist'));
    await assert.rejects(prepareWebsite(directory, { skipInstall: true }, { ...quiet, run: async () => { await page(external, '.'); } }), /subdirectory/);
  } finally { await rm(external, { recursive: true, force: true }); }
}, { scripts: { build: 'build' }, dependencies: { vite: '*' } }));

test('real command execution reports failures and terminates timed-out processes', () => fixture(async directory => {
  await assert.rejects(runBuildCommand(process.execPath, ['-e', 'process.exit(7)'], { cwd: directory }), /failed \(7\)/);
  await assert.rejects(runBuildCommand(process.execPath, ['-e', 'setTimeout(() => {}, 10000)'], { cwd: directory, timeoutMs: 30 }), /exceeded/);
  await assert.rejects(runBuildCommand('claude-artifacts-missing-executable', [], { cwd: directory }), /executable not found/);
}));

test('Nuxt output aliases count as one directory and server build scripts are not chosen', () => fixture(async directory => {
  const result = await prepareWebsite(directory, { skipInstall: true }, { ...quiet, run: async (command, args) => {
    assert.equal(command, 'npm');
    assert.deepEqual(args, ['exec', '--offline', '--no', '--', 'nuxt', 'generate']);
    await page(directory, '.output/public');
    await symlink(join(directory, '.output/public'), join(directory, 'dist'));
  } });
  assert.equal(result.path, join(directory, '.output/public'));
}, { dependencies: { nuxt: '*' }, scripts: { build: 'nuxt build' } }));

test('a new Nuxt output alias does not make an old website fresh', () => fixture(async directory => {
  await page(directory, '.output/public', 'old website');
  await assert.rejects(prepareWebsite(directory, { skipInstall: true }, { ...quiet, run: async () => {
    await symlink(join(directory, '.output/public'), join(directory, 'dist'));
  } }), /No fresh index/);
}, { dependencies: { nuxt: '*' }, scripts: { generate: 'generate' } }));
