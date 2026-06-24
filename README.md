# claude-artifacts

Turn local HTML or Markdown into Claude Code artifacts from your terminal.

I love Claude Code artifacts. `claude-artifacts` exists because managing them should be as direct as creating them.

`claude-artifacts` lets you publish, inspect, refresh, download, and clean up Claude Code artifacts without going back through chat. It uses the Claude Code login already on your machine, so there are no extra tokens to manage and no repeated upload dance when all you want is to ship the latest version of a file.

Use it when you want to:

- Share a local prototype, report, dashboard, or write-up as a Claude artifact.
- Update an artifact while keeping the same Claude URL.
- Download the live artifact HTML for review or archiving.
- See your artifact gallery URL when listing artifacts.
- Give MCP clients a simple way to manage artifacts.

## Install

Install from npm:

```sh
npm install -g claude-artifacts
```

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
claude-artifacts create dashboard.html --title "Launch dashboard"
```

Update the same artifact later without changing its URL:

```sh
claude-artifacts update <id> dashboard.html --title "Launch dashboard"
```

Download the current artifact HTML:

```sh
claude-artifacts read <id> --content > deployed.html
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

## Commands

```sh
claude-artifacts create <file> [--title <title>] [--favicon <emoji>] [--label <label>]
claude-artifacts list [--limit <n>]
claude-artifacts read <artifact> [--content] [--content-version <version>]
claude-artifacts update <artifact> <file> [--title <title>] [--favicon <emoji>] [--label <label>] [--base-version <version>]
claude-artifacts delete <artifact>
```

`<file>` must be `.html`, `.htm`, or `.md`.

`--favicon` is optional. It is a short text icon, usually an emoji, shown by Claude for the artifact.

## MCP

The package also includes an MCP stdio server. You can use it with Claude Code or any other coding agent that supports MCP stdio servers.

```sh
npx --package claude-artifacts claude-artifacts-mcp
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

Available MCP tools are unprefixed:

```text
create
list
read
update
delete
```

## Auth

The CLI reads the same OAuth session Claude Code already uses:

- macOS: `Claude Code-credentials` in the keychain
- Linux and other non-macOS systems: `~/.claude/.credentials.json`
