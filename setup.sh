#!/bin/bash
# openclaw-contributor setup script
# creates symlinks for claude code and codex cli

set -e

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMANDS_DIR="$SKILL_DIR/commands"

echo "Setting up openclaw-contributor skill..."

CMDS=(analyze.md checkdupe.md fix.md submit.md monitor.md respond.md close.md jobstatus.md)

# claude code symlinks
mkdir -p ~/.claude/commands
for cmd in "${CMDS[@]}"; do
  target="$COMMANDS_DIR/$cmd"
  link="$HOME/.claude/commands/$cmd"
  if [ -L "$link" ]; then
    rm "$link"
  elif [ -f "$link" ]; then
    echo "Backing up existing $link to $link.bak"
    mv "$link" "$link.bak"
  fi
  ln -s "$target" "$link"
  echo "  ~/.claude/commands/$cmd -> $target"
done

# codex cli symlinks
mkdir -p ~/.codex/prompts
for cmd in "${CMDS[@]}"; do
  target="$COMMANDS_DIR/$cmd"
  link="$HOME/.codex/prompts/$cmd"
  if [ -L "$link" ]; then
    rm "$link"
  elif [ -f "$link" ]; then
    echo "Backing up existing $link to $link.bak"
    mv "$link" "$link.bak"
  fi
  ln -s "$target" "$link"
  echo "  ~/.codex/prompts/$cmd -> $target"
done

echo ""
echo "Done! Commands available:"
echo "  /analyze    - analyze an issue (verdict: FIX or SKIP)"
echo "  /checkdupe  - check for existing PRs (HARD GATE)"
echo "  /fix        - implement fix, pass gates, push"
echo "  /submit     - create PR on GitHub"
echo "  /monitor    - check CI and review status"
echo "  /respond    - address review feedback"
echo "  /close      - close a PR with reason"
echo "  /jobstatus  - check GitHub Actions workflow run status"
