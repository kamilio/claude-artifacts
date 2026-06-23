#!/usr/bin/env bash
set -euo pipefail

prefix="${CLAUDE_ARTIFACTS_PREFIX:-$HOME/.local}"
bin_dir="${CLAUDE_ARTIFACTS_BIN_DIR:-$prefix/bin}"
dist_url="${CLAUDE_ARTIFACTS_DIST_URL:-https://raw.githubusercontent.com/kamilio/claude-artifacts/main/dist/claude-artifacts.mjs}"
install_dir="${CLAUDE_ARTIFACTS_DIR:-$prefix/share/claude-artifacts}"
target="$bin_dir/claude-artifacts"
runtime="$install_dir/claude-artifacts.mjs"

command -v node >/dev/null
command -v curl >/dev/null

mkdir -p "$bin_dir" "$install_dir"

curl -fsSL "$dist_url" -o "$runtime"
chmod +x "$runtime"
cat > "$target" <<EOF
#!/usr/bin/env sh
exec node "$runtime" "\$@"
EOF
chmod +x "$target"

echo "Installed claude-artifacts to $target"
echo "Run: claude-artifacts list"
