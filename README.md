# claude-artifacts

Publish Claude Code artifacts from your terminal.

I love Claude Code artifacts. `claude-artifacts` exists because sharing and updating them should be as direct as creating them. Point it at local HTML or Markdown, get a Claude artifact URL, and keep updating that same URL without going back through chat.

## What You Can Do

- Publish local `.html`, `.htm`, or `.md` files as Claude Code artifacts.
- Update an existing artifact without changing its URL.
- List your Claude Code artifacts with URLs, owners, view counts, and the gallery link.
- Download the live artifact HTML when you need to inspect or archive it.
- Expose the same workflow to Claude Code, Codex, Cursor, and other MCP-capable coding agents.

## Install

```sh
npm install -g claude-artifacts
```

If Claude Code is not logged in yet:

```sh
claude /login
```

## Quickstart

Publish a page:

```sh
claude-artifacts create dashboard.html --title "Launch dashboard"
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
| `claude-artifacts create <file> [--title <title>] [--favicon <emoji>] [--label <label>]` | Publish a local file as a new artifact. |
| `claude-artifacts list [--limit <n>]` | Show your Claude Code artifacts and gallery URL. |
| `claude-artifacts read <artifact> [--content] [--content-version <version>]` | Read artifact metadata, or include HTML with `--content`. |
| `claude-artifacts update <artifact> <file> [--title <title>] [--favicon <emoji>] [--label <label>] [--base-version <version>]` | Publish a new version to an existing artifact URL. |
| `claude-artifacts delete <artifact>` | Remove an artifact. |

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
```

## How Login Works

`claude-artifacts` uses the same Claude Code login already on your machine. There is no separate API key to create or paste.
