# claude-artifacts

Publish Claude Code artifacts from your terminal.

I love Claude Code artifacts. `claude-artifacts` exists because sharing and updating them should be as direct as creating them. Point it at local HTML, Markdown, YAML, CSV, JSON, source code, or another text file, get a Claude artifact URL, and keep updating that same URL without going back through chat.

## What You Can Do

- Publish local HTML, Markdown, data files, source files, and other text files as Claude Code artifacts.
- Publish a static website directory with multiple pages, JavaScript, CSS, images, and fonts.
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

Publish a built static website (the directory must contain `index.html`):

```sh
claude-artifacts create ./dist --title "Team website"
claude-artifacts update <id> ./dist
```

Pages and assets keep their paths. Use relative links such as `about/team.html`
and `../assets/style.css`; configure your build tool to emit relative asset URLs.
JavaScript modules, CSS, images, fonts, JSON, WebAssembly, audio, video, and PDFs
are uploaded with their content types. Binary assets are preserved. This hosts
built static sites; it does not run a backend or compile source files.

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
claude-artifacts read <id> --content > deployed.html
```

Delete an artifact:

```sh
claude-artifacts delete <id>
```

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
