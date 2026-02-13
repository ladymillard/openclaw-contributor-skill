# openclaw-contributor-skill

Bug fix pipeline for [openclaw/openclaw](https://github.com/openclaw/openclaw). Deterministic phases with hard gates. Compatible with pi, Claude Code, Codex CLI.

## New to GitHub?

This tool helps you contribute bug fixes to the OpenClaw project. If you're new to GitHub, here's what you need to know:

1. **GitHub** is a platform where people collaborate on code projects
2. **Fork** means making your own copy of a project to work on
3. **Pull Request (PR)** is how you propose changes to a project
4. **Issues** are where bugs and feature requests are tracked

Don't worry if GitHub seems hard at first - this tool guides you through each step!

## Quick Start

1. **Find a bug**: Look at [OpenClaw issues](https://github.com/openclaw/openclaw/issues)
2. **Analyze it**: Run `/analyze <issue-number>` to understand the bug
3. **Check for duplicates**: Run `/checkdupe <issue-number>` to make sure no one else is fixing it
4. **Fix it**: Run `/fix <issue-number>` to make the fix
5. **Submit**: Run `/submit <issue-number>` to create a pull request
6. **Monitor**: Run `/monitor` to check on your PR

## Phases

```
/analyze <issue>   -> .state/analysis.md   -> verdict=FIX required
/checkdupe <issue> -> .state/dupecheck.md  -> existing_prs=0 required
/fix <issue>       -> .state/fix.md        -> push_verified=yes required
/submit <issue>    -> .state/submitted.md  -> PR created
/monitor           -> check CI + reviews
/respond <pr>      -> address feedback
/close <pr>        -> close with reason
```

## When to Use

You found a bug in openclaw/openclaw, can identify the root cause, and can fix it in 1-5 lines with no existing PR addressing it.

## Prerequisites

Before you start, make sure you have:
- A GitHub account (free to create at [github.com](https://github.com))
- Git installed on your computer
- Node.js and pnpm installed (for testing fixes)
- The GitHub CLI (`gh`) installed

Need help installing these? See the [setup guide](./setup.sh) or ask for help in the OpenClaw community!

## Common Questions

**Q: What if I break something?**  
A: Don't worry! The tool checks your work at each step. You can't break the main project - you're working on your own copy.

**Q: Do I need to know everything about OpenClaw?**  
A: No! You just need to understand the specific bug you're fixing. The tool helps you with the rest.

**Q: What if someone else is already fixing the bug?**  
A: The `/checkdupe` command checks for this automatically. If someone else is working on it, the tool will tell you.

## Companion

[openclaw-maintainer-skill](https://github.com/arosstale/openclaw-maintainer-skill) for review/prep/merge.
