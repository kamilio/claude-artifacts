# claude-artifacts

Publish, list, update, read, and delete Claude Code artifacts from your terminal.

Claude Code artifacts are great once they exist. Managing them through a chat window is the slow part.

`claude-artifacts` is a small CLI that talks directly to the same artifact API behind `https://claude.ai/code/artifacts`. It reuses your existing Claude Code login, so there is no pasted token, no separate API key, and no LLM turn just to upload a file.

- Ship local HTML or Markdown as a Claude artifact.
- List only artifacts created from Claude Code.
- Download the current artifact HTML.
- Replace an artifact without changing its URL.
- Delete throwaway test artifacts from the shell.

## Install

One command. No npm package install. No repo clone.

```sh
curl -fsSL https://raw.githubusercontent.com/kamilio/claude-artifacts/main/install.sh | bash
```

The installer downloads the bundled CLI from GitHub and writes it to `~/.local/bin/claude-artifacts`.

Requirements:

- Node.js
- Claude Code logged in on this machine
- `~/.local/bin` on your `PATH`

Local checkout install:

```sh
git clone git@github.com:kamilio/claude-artifacts.git
cd claude-artifacts
npm run install:global
```

Tested on Node 18 and Node 22. Toolcraft may print npm engine warnings on Node 18 during development installs, but the bundled CLI runs there.

## Quickstart

See what you have:

```sh
claude-artifacts list
```

Ship a local page:

```sh
claude-artifacts create dashboard.html --favicon '*' --title "Launch dashboard"
```

Update that artifact later:

```sh
claude-artifacts update <id> dashboard.html --favicon '*' --title "Launch dashboard"
```

Download the deployed HTML:

```sh
claude-artifacts read <id> --content > deployed.html
```

Delete the experiment:

```sh
claude-artifacts delete <id>
```

Open the browser gallery:

```sh
claude-artifacts gallery
```

## The Artifact Key

Every artifact has a UUID in its Claude URL:

```text
https://claude.ai/code/artifact/e2438a48-35b9-46bb-902e-fc59665782e2
                              ^ this part
```

Commands accept either the full URL or just the UUID:

```sh
claude-artifacts read https://claude.ai/code/artifact/<id>
claude-artifacts read <id>
```

## Output

`list` is formatted for scanning in a terminal:

```text
1. Launch dashboard
   id:      e2438a48-35b9-46bb-902e-fc59665782e2
   url:     https://claude.ai/code/artifact/e2438a48-35b9-46bb-902e-fc59665782e2
   updated: Jun 23, 2026, 2:28 PM CDT
   label:   launch-v1
   owner:   you@example.com
   access:  mine
   views:   8 total, 1 unique
```

## Commands

```sh
claude-artifacts create <file> --favicon <text> [--title <title>] [--label <label>]
claude-artifacts list [--limit <n>]
claude-artifacts read <artifact> [--content] [--content-version <version>]
claude-artifacts update <artifact> <file> --favicon <text> [--title <title>] [--label <label>] [--base-version <version>]
claude-artifacts delete <artifact>
claude-artifacts gallery
```

`<file>` must be `.html`, `.htm`, or `.md`.

## Auth

The CLI reads the same OAuth session Claude Code already uses:

- macOS: `Claude Code-credentials` in the keychain
- Linux and other non-macOS systems: `~/.claude/.credentials.json`

Log in with Claude Code first:

```sh
claude /login
```

For proxies and tests:

```sh
CLAUDE_CODE_OAUTH_TOKEN=... claude-artifacts list
CLAUDE_CODE_ARTIFACTS_API_BASE_URL=http://127.0.0.1:53039 claude-artifacts list
```

## Development

```sh
npm install
npm test
```

`npm test` builds the bundled CLI and runs smoke tests against both source and dist.

## Why

Artifacts are web pages with private Claude URLs. If you already have the file and the artifact id, asking Claude to republish it is unnecessary. This CLI skips the conversation and performs the operation directly.
