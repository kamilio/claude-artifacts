# claude-artifacts

Turn local HTML or Markdown into Claude Code artifacts from your terminal.

`claude-artifacts` lets you publish, inspect, refresh, download, and clean up Claude Code artifacts without going back through chat. It uses the Claude Code login already on your machine, so there are no extra tokens to manage and no repeated upload dance when all you want is to ship the latest version of a file.

Use it when you want to:

- Share a local prototype, report, dashboard, or write-up as a Claude artifact.
- Update an artifact while keeping the same Claude URL.
- Download the live artifact HTML for review or archiving.
- Browse your artifact gallery from the shell.
- Give MCP clients a simple way to manage artifacts.

## Install

Install from npm:

```sh
npm install -g claude-artifacts
```

Or use the standalone installer:

```sh
curl -fsSL https://raw.githubusercontent.com/kamilio/claude-artifacts/main/install.sh | bash
```

The installer places `claude-artifacts` and `claude-artifacts-mcp` in `~/.local/bin`.

Requirements:

- Node.js 18 or newer
- Claude Code logged in on this machine
- `~/.local/bin` on your `PATH` when using the standalone installer

If you need to log in first:

```sh
claude /login
```

## Quickstart

List your artifacts:

```sh
claude-artifacts list
```

Publish a local page:

```sh
claude-artifacts create dashboard.html --favicon '*' --title "Launch dashboard"
```

Update the same artifact later without changing its URL:

```sh
claude-artifacts update <id> dashboard.html --favicon '*' --title "Launch dashboard"
```

Download the current artifact HTML:

```sh
claude-artifacts read <id> --content > deployed.html
```

Open your artifact gallery:

```sh
claude-artifacts gallery
```

Remove an artifact you no longer need:

```sh
claude-artifacts delete <id>
```

## Artifact IDs

Every artifact URL includes a UUID:

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

`list` is formatted for quick scanning:

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

## MCP

The package also includes an MCP stdio server:

```sh
claude-artifacts-mcp
```

Example MCP config:

```json
{
  "mcpServers": {
    "claude-artifacts": {
      "command": "claude-artifacts-mcp"
    }
  }
}
```

Available MCP tools:

```text
create
list
read
update
delete
gallery
```

## Auth

The CLI reads the same OAuth session Claude Code already uses:

- macOS: `Claude Code-credentials` in the keychain
- Linux and other non-macOS systems: `~/.claude/.credentials.json`

For proxies and tests:

```sh
CLAUDE_CODE_OAUTH_TOKEN=... claude-artifacts list
CLAUDE_CODE_ARTIFACTS_API_BASE_URL=http://127.0.0.1:53039 claude-artifacts list
```

## Local Development

```sh
git clone git@github.com:kamilio/claude-artifacts.git
cd claude-artifacts
npm install
npm test
```

`npm test` builds the bundled CLI and runs smoke tests against both source and bundled output.
