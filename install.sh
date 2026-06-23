#!/usr/bin/env bash
set -euo pipefail

prefix="${CLAUDE_ARTIFACTS_PREFIX:-$HOME/.local}"
bin_dir="${CLAUDE_ARTIFACTS_BIN_DIR:-$prefix/bin}"
dist_url="${CLAUDE_ARTIFACTS_DIST_URL:-https://raw.githubusercontent.com/kamilio/claude-artifacts/main/dist/claude-artifacts.mjs}"
mcp_dist_url="${CLAUDE_ARTIFACTS_MCP_DIST_URL:-https://raw.githubusercontent.com/kamilio/claude-artifacts/main/dist/claude-artifacts-mcp.mjs}"
install_dir="${CLAUDE_ARTIFACTS_DIR:-$prefix/share/claude-artifacts}"
target="$bin_dir/claude-artifacts"
mcp_target="$bin_dir/claude-artifacts-mcp"
runtime="$install_dir/claude-artifacts.mjs"
mcp_runtime="$install_dir/claude-artifacts-mcp.mjs"

command -v node >/dev/null
command -v curl >/dev/null

mkdir -p "$bin_dir" "$install_dir"

curl -fsSL "$dist_url" -o "$runtime"
curl -fsSL "$mcp_dist_url" -o "$mcp_runtime"
chmod +x "$runtime"
chmod +x "$mcp_runtime"
cat > "$target" <<EOF
#!/usr/bin/env sh
exec node "$runtime" "\$@"
EOF
cat > "$mcp_target" <<EOF
#!/usr/bin/env sh
exec node "$mcp_runtime" "\$@"
EOF
chmod +x "$target"
chmod +x "$mcp_target"

echo "Installed claude-artifacts to $target"
echo "Installed claude-artifacts-mcp to $mcp_target"
echo "Run: claude-artifacts list"
