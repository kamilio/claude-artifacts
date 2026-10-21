// Optional network smoke test. Installs real toolchains in temporary directories and removes them afterward.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { prepareWebsite } from '../src/build.js';
import { websiteManifest } from '../src/website.js';

if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('Run these framework smoke fixtures with Node 24 or newer.');

process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.ASTRO_TELEMETRY_DISABLED = '1';
process.env.NUXT_TELEMETRY_DISABLED = '1';
process.env.NG_CLI_ANALYTICS = 'false';

const projects = {
  vite: {
    dependencies: { vite: '8.3.5' }, scripts: {}, // Exercise the native-command fallback.
    files: { 'index.html': '<!doctype html><div id="app"></div><script type="module" src="/main.js"></script>',
      'main.js': 'import "./style.css"; document.querySelector("#app").textContent = "Built with Vite";',
      'style.css': 'body { color: navy; }', 'vite.config.js': 'export default { base: "./" };' },
  },
  astro: {
    dependencies: { astro: '7.4.2' }, scripts: { build: 'astro build' },
    files: { 'src/pages/index.astro': '<!doctype html><h1>Built with Astro</h1><a href="about/">About</a>',
      'src/pages/about.astro': '<!doctype html><h1>About</h1>' },
  },
  next: {
    dependencies: { next: '16.4.2', react: '19.3.1', 'react-dom': '19.3.1' }, scripts: { build: 'next build' },
    files: { 'next.config.mjs': 'export default { output: "export", trailingSlash: true };',
      'pages/index.jsx': 'export default function Home() { return <h1>Built with Next</h1>; }' },
  },
  sveltekit: {
    dependencies: { '@sveltejs/kit': '3.1.0', '@sveltejs/adapter-static': '4.0.0', '@sveltejs/vite-plugin-svelte': '7.3.1', svelte: '5.57.2', vite: '8.3.5', typescript: '^6.0.0' },
    scripts: { build: 'vite build' },
    files: { 'vite.config.js': 'import { defineConfig } from "vite"; import { sveltekit } from "@sveltejs/kit/vite"; import adapter from "@sveltejs/adapter-static"; export default defineConfig({ plugins: [sveltekit({ adapter: adapter() })] });',
      'src/app.html': '<!doctype html><html><head>%sveltekit.head%</head><body><div>%sveltekit.body%</div></body></html>',
      'src/routes/+layout.js': 'export const prerender = true;', 'src/routes/+page.svelte': '<h1>Built with SvelteKit</h1>' },
  },
  nuxt: {
    dependencies: { nuxt: '4.6.2' }, scripts: { generate: 'nuxt generate' },
    files: { 'app/app.vue': '<template><h1>Built with Nuxt</h1></template>', 'nuxt.config.ts': 'export default defineNuxtConfig({ devtools: { enabled: false } });' },
  },
  angular: {
    dependencies: { '@angular/core': '22.2.3', '@angular/common': '22.2.3', '@angular/compiler': '22.2.3', '@angular/platform-browser': '22.2.3', '@angular/compiler-cli': '22.2.3', '@angular/build': '22.2.3', '@angular/cli': '22.2.3', typescript: '~6.0.0', rxjs: '^7.8.0' },
    scripts: { build: 'ng build' },
    files: {
      'angular.json': JSON.stringify({ version: 1, projects: { app: { projectType: 'application', root: '', sourceRoot: 'src', architect: { build: { builder: '@angular/build:application', options: { browser: 'src/main.ts', index: 'src/index.html', tsConfig: 'tsconfig.json', outputPath: 'dist/app' } } } } } }),
      'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'preserve', moduleResolution: 'bundler', experimentalDecorators: true, skipLibCheck: true, lib: ['ES2022', 'DOM'] }, files: ['src/main.ts'] }),
      'src/index.html': '<!doctype html><html><head><base href="./"></head><body><app-root></app-root></body></html>',
      'src/main.ts': 'import { Component } from "@angular/core"; import { bootstrapApplication } from "@angular/platform-browser"; @Component({ selector: "app-root", standalone: true, template: "<h1>Built with Angular</h1>" }) class App {} bootstrapApplication(App);',
    },
  },
};
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(projects);
for (const name of names) {
  const project = projects[name];
  if (!project) throw new Error(`Unknown framework: ${name}`);
  const root = await mkdtemp(join(tmpdir(), `claude-artifacts-${name}-`));
  try {
    await writeFile(join(root, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: project.dependencies, scripts: project.scripts }));
    for (const [path, content] of Object.entries(project.files)) {
      await mkdir(dirname(join(root, path)), { recursive: true });
      await writeFile(join(root, path), content);
    }
    const built = await prepareWebsite(root);
    const manifest = await websiteManifest(built.path);
    assert.ok(manifest['index.html']);
    assert.ok(Object.keys(manifest).length < 256);
    console.log(JSON.stringify({ framework: name, node: process.version, dependencies: project.dependencies, files: Object.keys(manifest).length, ok: true }));
  } finally { await rm(root, { recursive: true, force: true }); }
}
