#!/bin/bash
# openclaw-contributor setup script
# Creates symlinks for Claude Code and Codex CLI
# 
# NEW TO GITHUB/BASH? This script sets up the tool on your computer.
# Just run: bash setup.sh
# If you see any errors, don't worry! Ask for help in the community.

set -e

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMANDS_DIR="$SKILL_DIR/commands"

echo "========================================="
echo "OpenClaw Contributor Setup"
echo "========================================="
echo ""
echo "This will set up commands to help you contribute bug fixes."
echo ""

CMDS=(analyze.md checkdupe.md fix.md submit.md monitor.md respond.md close.md)

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
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Commands available (use these in order):"
echo ""
echo "  /analyze <issue>   - Start here! Analyze a bug report"
echo "  /checkdupe <issue> - Check if anyone else is fixing it (DON'T SKIP!)"
echo "  /fix <issue>       - Make the fix and test it"
echo "  /submit <issue>    - Submit your fix for review"
echo "  /monitor           - Check on your submission"
echo "  /respond <pr>      - Respond to feedback"
echo "  /close <pr>        - Close a PR if needed"
echo ""
echo "New to this? Start by finding a bug at:"
echo "https://github.com/openclaw/openclaw/issues"
echo ""
echo "Then run: /analyze <issue-number>"
echo ""
