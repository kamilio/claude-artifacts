# claude-artifacts

Claude Code artifacts are great once they exist. The annoying part is managing them through a chat window.

`claude-artifacts` is a tiny terminal remote control for the artifacts already living behind `https://claude.ai/code/artifacts`.

It lets you:

- create a new artifact from local HTML or Markdown
- list your Claude Code artifacts from the API
- read metadata or download the current HTML
- update an existing artifact in place
- delete the junk without opening a browser

No LLM turn. No prompt ceremony. No pasted token. It reuses your existing Claude Code login and talks directly to the same frame API the web app uses.

## Install

Requires Node.js. Tested on Node 18 and Node 22. The current Toolcraft dependency may print npm engine warnings on Node 18, but the CLI test suite passes there.

One command from GitHub:

```sh
curl -fsSL https://raw.githubusercontent.com/kamilio/claude-artifacts/main/install.sh | bash
```

That installs the bundled CLI to `~/.local/bin/claude-artifacts`. Make sure `~/.local/bin` is on your `PATH`.

The installer downloads a single built file from GitHub. It does not use npm, does not clone the repo, and does not need an npm package release.

Or install from a local checkout:

```sh
git clone git@github.com:kamilio/claude-artifacts.git
cd claude-artifacts
npm run install:global
```

## Quick Start

See what you have:

```sh
claude-artifacts list
```

Ship a page:

```sh
claude-artifacts create dashboard.html --favicon '*' --title "Launch dashboard"
```

Inspect an artifact:

```sh
claude-artifacts read https://claude.ai/code/artifact/<id>
```

Download the current HTML:

```sh
claude-artifacts read <id> --content
```

Replace it with a new local file:

```sh
claude-artifacts update <id> dashboard.html --favicon '*' --title "Launch dashboard"
```

Delete the test junk:

```sh
claude-artifacts delete <id>
```

Open the browser gallery:

```sh
claude-artifacts gallery
```

## What Is The Key?

The artifact key is the UUID in the Claude URL:

```text
https://claude.ai/code/artifact/e2438a48-35b9-46bb-902e-fc59665782e2
                              ^ this part
```

Every command accepts either the full URL or just the UUID.

## Output

The list output is built for scanning:

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

## Auth

The CLI reads the same OAuth session Claude Code uses from the macOS keychain item:

```text
Claude Code-credentials
```

You need to be logged in with Claude Code first:

```sh
claude /login
```

For tests and proxies:

```sh
CLAUDE_CODE_OAUTH_TOKEN=... claude-artifacts list
CLAUDE_CODE_ARTIFACTS_API_BASE_URL=http://127.0.0.1:53039 claude-artifacts list
```

## Commands

```sh
claude-artifacts create <file> --favicon <text> [--title <title>] [--label <label>]
claude-artifacts read <artifact> [--content] [--content-version <version>]
claude-artifacts update <artifact> <file> --favicon <text> [--title <title>] [--label <label>] [--base-version <version>]
claude-artifacts list [--limit <n>]
claude-artifacts delete <artifact>
claude-artifacts gallery
```

`<file>` must be `.html`, `.htm`, or `.md`.

## Why

Artifacts are web pages with private Claude URLs. When you already have the file and the artifact id, asking an LLM to republish it is unnecessary. This CLI skips the conversation and performs the operation directly.
