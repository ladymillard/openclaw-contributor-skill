#!/bin/bash

# OpenClaw Contributor Skill Setup

echo "Setting up openclaw-contributor-skill..."

# Verify required tools
command -v gh >/dev/null 2>&1 || { echo "❌ gh CLI not found. Install from https://cli.github.com"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git not found"; exit 1; }

# Check GitHub auth
gh auth status > /dev/null 2>&1 || { echo "❌ GitHub auth not configured. Run: gh auth login"; exit 1; }

# Verify fork access
echo "✓ Checking fork access..."
gh repo view arosstale/openclaw > /dev/null 2>&1 || { echo "❌ Fork not accessible"; exit 1; }

# Verify upstream access
echo "✓ Checking upstream access..."
gh repo view openclaw/openclaw > /dev/null 2>&1 || { echo "❌ openclaw/openclaw not accessible"; exit 1; }

echo ""
echo "✅ Setup complete!"
echo ""
echo "Ready to use:"
echo "  /analyzeissue #ISSUE_NUMBER"
echo "  /createfix"
echo "  /submitpr"
echo ""
echo "See SKILL.md for full documentation"
