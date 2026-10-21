# claude-artifacts

Publish Claude Code artifacts from your terminal.

I love Claude Code artifacts. `claude-artifacts` exists because sharing and updating them should be as direct as creating them. Point it at local HTML, Markdown, YAML, CSV, JSON, source code, or another text file, get a Claude artifact URL, and keep updating that same URL without going back through chat.

## What You Can Do

- Publish local HTML, Markdown, data files, source files, and other text files as Claude Code artifacts.
- Build and publish a website project, or upload an existing static directory with pages, JavaScript, CSS, images, and fonts.
- Sign in separately from Claude Code, and choose a default audience for new artifacts.
- Update an existing artifact without changing its URL.
- List your Claude Code artifacts with URLs, owners, view counts, and the gallery link.
- Download the live artifact HTML when you need to inspect or archive it.
- Expose the same workflow to Claude Code, Codex, Cursor, and other MCP-capable coding agents.

## Install

```sh
npm install -g claude-artifacts
```

Sign in with a separate session:

```sh
claude-artifacts auth login
```

## Quickstart

Publish a page:

```sh
claude-artifacts create dashboard.html --title "Launch dashboard"
```

Publish a website project, including its build step:

```sh
claude-artifacts create ./my-app --title "Team website"
claude-artifacts update <id> ./my-app
```

Already built? Point directly at the output directory:

```sh
claude-artifacts create ./my-app/dist
```

Pages and assets keep their paths. Use relative links such as `about/team.html`
and `../assets/style.css`; configure your build tool to emit relative asset URLs.
JavaScript modules, CSS, images, fonts, JSON, WebAssembly, audio, video, and PDFs
are uploaded with their content types. Binary assets are preserved. This hosts
static sites; it builds supported source projects locally but does not host a backend.

A directory update replaces the entire deployed file set, including removing old
assets. Pass `--base-version` to reject concurrent changes. Uploads are limited to
256 files and 16 MiB of encoded JSON (binary files use base64). Hidden files and
`node_modules` are skipped; symlinks, unsupported asset types, and invalid UTF-8
text are rejected before publishing. Single HTML file uploads still upload only
that file; use a directory to include local assets.

Publish data or source files too:

```sh
claude-artifacts create config.yaml --title "Runtime config"
claude-artifacts create metrics.csv --title "Metrics export"
```

List your artifacts:

```sh
claude-artifacts list
```

Update the same artifact later:

```sh
claude-artifacts update <id> dashboard.html --title "Launch dashboard"
```

Download the live HTML:

```sh
claude-artifacts read <id> --content --output json | jq -r '.content_html' > deployed.html
```

Delete an artifact:

```sh
claude-artifacts delete <id>
```

## Automatic builds

Both `create` and `update` inspect the supplied directory. A recognized framework
or a `package.json` build/generate script triggers a build, even when the source
root contains `index.html` (as Vite projects do). Plain HTML directories upload
without a build.

The CLI chooses the package manager from `package.json#packageManager`, then the
lockfile, then npm. The declared manager wins over other lockfiles; conflicting
lockfiles without a declaration are an error. Install the chosen manager and a
Node version supported by your framework first. Version provisioning is left to
your package-manager/runtime tooling.

When `node_modules` is absent, it installs dependencies first. npm uses `ci`
with a lockfile; pnpm and Bun use frozen lockfiles. Yarn uses
`--frozen-lockfile` for Classic or `--immutable` for modern Yarn (also detected
from its lockfile when no version is declared). Existing
Yarn PnP installations are recognized. Existing dependencies are reused; use your
package manager to update them after changing dependencies. `--skip-install`
disables the installation step.

Build scripts and install hooks execute locally. Build logs go to stderr, so
`--output json` and MCP responses remain valid. A failed, cancelled, timed-out,
or successful-but-unchanged build does not publish old output. Builds have a
10-minute timeout. Incremental builds that intentionally leave `index.html`
untouched must be published explicitly as prebuilt output.

### Framework support

The table describes automatic detection and default output paths. The build
uses your framework configuration; when it changes the output path, pass
`--output-dir`. The CLI does not rewrite configuration, enable static rendering,
or turn server features into browser features. Package scripts take precedence
over the listed native fallback commands, except Nuxt uses `generate` rather
than its server-oriented `build` script.

| Framework / project | Detected dependency | Build selection | Default publish directory | Requirement |
| --- | --- | --- | --- | --- |
| [Vite](https://vite.dev/guide/static-deploy) — React, Vue, Svelte, Solid, vanilla | `vite` | `build` script → `vite build` | `dist/` | Browser build; React/Vue alone do not identify a build tool. |
| [Next.js](https://nextjs.org/docs/app/guides/static-exports) | `next` | `build` → `next build` | `out/` | Configure `output: 'export'`. Ordinary `.next/` output, server actions, and runtime APIs are not supported. |
| [Astro](https://docs.astro.build/en/guides/deploy/) | `astro` | `build` → `astro build` | `dist/` | Static output; on-demand routes need a server. |
| [Angular](https://angular.dev/reference/configs/workspace-config#output-path-configuration) | `@angular/core` | `build` → `ng build` | `dist/<app>/browser/` or legacy `dist/<app>/` | Browser app, or `outputMode: 'static'` for prerendering. Multiple outputs require `--output-dir`. |
| [SvelteKit](https://svelte.dev/docs/kit/adapter-static) | `@sveltejs/kit` | `build` → `vite build` | `build/` | Configure `@sveltejs/adapter-static` and a prerendered `index.html`. Keep pages and assets together. |
| [Nuxt](https://nuxt.com/docs/4.x/getting-started/deployment) | `nuxt` | `generate` → `nuxt generate` | `.output/public/`; legacy `dist/` | Static generation. SSR/Nitro server output is not hosted. |
| [React Router framework](https://reactrouter.com/how-to/spa) | `@react-router/dev` | `build` → `react-router build` | `build/client/` | Configure `ssr: false`. Runtime loaders/actions need a backend. |
| [Create React App](https://create-react-app.dev/docs/deployment/) | `react-scripts` | `build` → `react-scripts build` | `build/` | Existing CRA apps; also respects `BUILD_PATH` when paired with `--output-dir`. |
| [Docusaurus](https://docusaurus.io/docs/deployment) | `@docusaurus/core` | `build` → `docusaurus build` | `build/` | Static documentation site. |
| [Vue CLI](https://cli.vuejs.org/guide/deployment.html) | `@vue/cli-service` | `build` → `vue-cli-service build` | `dist/` | Existing Vue CLI apps; not Nuxt. |
| [Gatsby](https://www.gatsbyjs.com/docs/reference/gatsby-cli/) | `gatsby` | `build` → `gatsby build` | `public/` | Fully static sites only; SSR, deferred generation, and Functions need a server. |
| [Parcel](https://parceljs.org/features/targets/) | `parcel` | `build` script | `dist/` | Script must specify the HTML entry/target. Custom targets need `--output-dir`. |
| [Eleventy](https://www.11ty.dev/docs/config/#output-directory) | `@11ty/eleventy` | `build` → `eleventy` | `_site/` | Static site with `index.html`. |
| Other Node build tools | `scripts.build` or `scripts.generate` | Existing script | One fresh output among `dist/`, `build/`, `out/`, `public/`, `_site/`, `.output/public/` | Ambiguous or custom output needs `--output-dir`. |
| [Hugo](https://gohugo.io/host-and-deploy/) | Explicit command | `--build-command "hugo --minify"` | `--output-dir public` | Install Hugo first. |
| [Jekyll](https://jekyllrb.com/docs/usage/) | Explicit command | `--build-command "bundle exec jekyll build"` | `--output-dir _site` | Install Ruby/Bundler and project gems first. |
| [MkDocs](https://www.mkdocs.org/user-guide/deploying-your-docs/) | Explicit command | `--build-command "mkdocs build"` | `--output-dir site` | Install MkDocs and project plugins first. |
| Plain HTML / prebuilt output | `index.html`, no detected build | None | Supplied directory | `--skip-build` forces this behavior. |

Coverage was prioritized using [npm weekly downloads](https://api.npmjs.org/downloads/point/2026-10-12:2026-10-18/vite)
for October 12–18, 2026 and the linked framework deployment docs. The largest
sampled packages were Vite (119M), Next.js (41M), Astro (4.8M), and Angular core
(3.4M). Downloads include CI and transitive installations; they are not counts
of websites. The remaining presets cover popular app frameworks, existing apps,
and documentation/static-site generators.

### Overrides and limits

`--build-command` replaces the detected command. `--output-dir` selects the
resulting directory relative to the project. These options are also exposed as
`build_command` and `output_dir` in MCP.

```sh
claude-artifacts create ./my-app --build-command "pnpm run build:docs" --output-dir docs-dist
claude-artifacts create ./docs --build-command "hugo --minify" --output-dir public
claude-artifacts create ./my-app --skip-build --output-dir dist
```

The selected build output must be a project subdirectory containing a fresh
`index.html`. Source files are not uploaded. For monorepos, point at the app
package or use the workspace build command and an explicit output directory;
workspace orchestration and custom config-file parsing are not automatic.
Frameworks with nonstandard or split output directories require an override or
an assembled static directory. Server files are rejected for known runtime
layouts, but the CLI cannot prove that arbitrary JavaScript needs no backend.

The original upload limits still apply: 256 files, 16 MiB encoded, supported
asset types, and no symlinks. Large framework exports may exceed these limits.
The CLI does not rewrite generated asset URLs or provide server-side routing,
rewrites, image optimization, or redirects. Configure relative asset URLs for
the artifact host (for example Vite `base: './'`, CRA `homepage: '.'`, or
Angular `--base-href ./`); use hash routing or exported HTML pages when a client
router would otherwise need a server fallback. A build succeeding locally is
not proof that every framework feature will work on the artifact host.

## Sharing

New artifacts are private by default. To share new artifacts with your Claude
organization automatically:

```sh
claude-artifacts config --default-share org
```

Override the default for one publication, or change an existing artifact:

```sh
claude-artifacts create ./dist --share private
claude-artifacts share <id> --share org
claude-artifacts config --default-share private
```

Updates keep the current audience unless you pass `--share private` or
`--share org`. The default is local to claude-artifacts and is also used by its
MCP server; it does not change Claude's website or Claude Code settings. Organization
sharing depends on your account and organization policy. Audience changes preserve
the artifact's existing organization access level and editor permissions.

Publishing and sharing are separate API operations. If sharing fails after a
successful upload, the error includes the artifact URL and a `share` command to
retry, so you can finish sharing without creating a duplicate.

## Output

`list` is built for quick scanning:

```text
gallery: https://claude.ai/code/artifacts

1. Launch dashboard
   id:      e2438a48-35b9-46bb-902e-fc59665782e2
   url:     https://claude.ai/code/artifact/e2438a48-35b9-46bb-902e-fc59665782e2
   updated: Jun 23, 2026, 2:28 PM CDT
   label:   launch-v1
   owner:   you@example.com
   access:  mine
   views:   8 total, 1 unique
```

Commands accept either the full Claude artifact URL or just the UUID:

```sh
claude-artifacts read https://claude.ai/code/artifact/<id>
claude-artifacts read <id>
```

## Commands

| Command | Purpose |
| --- | --- |
| `claude-artifacts create <file-or-directory> [--title <title>] [--favicon <emoji>] [--label <label>] [--share private\|org]` | Publish a local file or static website as a new artifact. |
| `claude-artifacts list [--limit <n>]` | Show your Claude Code artifacts and gallery URL. |
| `claude-artifacts read <artifact> [--content] [--content-version <version>]` | Read artifact metadata, or include HTML with `--content`. |
| `claude-artifacts update <artifact> <file-or-directory> [--title <title>] [--favicon <emoji>] [--label <label>] [--base-version <version>] [--share private\|org]` | Publish a new version to an existing artifact URL. |
| `claude-artifacts delete <artifact>` | Remove an artifact. |
| `claude-artifacts share <artifact> --share private\|org` | Change an artifact audience. |
| `claude-artifacts config [--auth-mode separate\|claude-code] [--default-share private\|org]` | Show or save local defaults. |
| `claude-artifacts auth login [--no-browser]` | Sign in with a separate session. |
| `claude-artifacts auth status` | Show local credential state without revealing tokens. |
| `claude-artifacts auth logout` | Remove the separate local login. |

`--favicon` is optional. It is a short text icon, usually an emoji, shown by Claude for the artifact.

## MCP

Use the MCP server with Claude Code or any other coding agent that supports MCP stdio servers:

```sh
npx -y --package claude-artifacts claude-artifacts-mcp
```

Example MCP config:

```json
{
  "mcpServers": {
    "claude-artifacts": {
      "command": "npx",
      "args": ["-y", "--package", "claude-artifacts", "claude-artifacts-mcp"]
    }
  }
}
```

Website build options are available on both create and update.

Available MCP tools:

```text
claude_artifacts__create
claude_artifacts__list
claude_artifacts__read
claude_artifacts__update
claude_artifacts__delete
claude_artifacts__share
```

## How Login Works

By default, `claude-artifacts auth login` opens Claude's OAuth authorization page
and receives the result on localhost port 54545. It creates its own access and
refresh tokens, and refreshes them automatically. Claude Code credentials are
never read or changed in this mode. The browser may already be signed in to
Claude; the resulting OAuth session is still separate.

To opt out and reuse Claude Code's existing login:

```sh
claude-artifacts config --auth-mode claude-code
```

Return to a separate session with `claude-artifacts auth login` or
`claude-artifacts config --auth-mode separate`. Reused Claude Code credentials
are read only; renew them in Claude Code if they expire.

Settings and separate credentials live in `~/.config/claude-artifacts/` (or
`CLAUDE_ARTIFACTS_CONFIG_DIR`). Credential files are written atomically with
owner-only permissions; concurrent CLI and MCP processes serialize refreshes.
`auth status` reports local state, not a live validation of the login.
`auth logout` deletes only this tool's local credentials, without revoking the
server session or clearing environment tokens.

For automation, `CLAUDE_ARTIFACTS_OAUTH_TOKEN` explicitly overrides stored
credentials. `CLAUDE_ARTIFACTS_AUTH_MODE=claude-code` opts out for one process;
`CLAUDE_CODE_OAUTH_TOKEN` is used only in that mode. Configure login and defaults
through the CLI before using MCP; browser login is not exposed as an MCP tool.

## Development checks

`npm test` covers build detection, package-manager selection, failure handling,
and publishing through the CLI and MCP, including bundled executables.
`npm run smoke:frameworks` additionally installs and builds pinned real Vite,
Astro, Next.js, SvelteKit, Nuxt, and Angular fixtures in temporary directories.
It requires Node 24 and network access, and deletes the fixtures afterward.
