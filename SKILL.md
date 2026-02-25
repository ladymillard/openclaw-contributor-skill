---
name: openclaw-contributor
description: Contribute bug fixes to openclaw/openclaw via fork. Deterministic pipeline with hard gates between phases. Compatible with pi, Claude Code, and Codex CLI.
---

# OpenClaw Contributor

Bug fix pipeline for openclaw/openclaw. Each phase produces a state file consumed by the next. Hard gates prevent progression on failure.

## Setup

Fork at `arosstale/openclaw`, cloned to `/tmp/openclaw-fork`. Remotes: `origin` = upstream, `fork` = our fork.

## Workflow

**Phases in order: ANALYZE -> CHECKDUPE -> FIX -> SUBMIT -> MONITOR**

You MUST follow phases in order. You MUST NOT skip CHECKDUPE (we closed 38 of 40 PRs because we skipped it).

### ANALYZE
1. Read the issue: `gh issue view <N> --repo openclaw/openclaw --json title,body,labels,comments,state`
2. Trace root cause in source code
3. Assess: crash/data-loss (stability), UX bug, or feature request (skip)
4. Write `.state/analysis.md` with `verdict=FIX` or `verdict=SKIP`
5. STOP if SKIP

### CHECKDUPE
1. Search: `gh search prs --repo openclaw/openclaw --state open "<issue-number>"`
2. Search by keywords from title
3. Check issue comments for linked PRs
4. Write `.state/dupecheck.md` with `existing_prs=<N>`
5. STOP if existing_prs > 0

### FIX
1. Branch from main: `fix/<issue>-<slug>`
2. Implement minimal fix. Follow existing patterns.
3. Format: `npx oxfmt --write <files>`
4. Verify: `pnpm build && pnpm check && pnpm test`
5. Commit specific files only (never `git add -A`)
6. Push to fork, verify sha match
7. Write `.state/fix.md` with `push_verified=yes`

### SUBMIT
1. Create PR with `gh pr create` — title: `fix(<scope>): <desc>`, body: what broke, why, fix
2. Include `Fixes #<issue>` in body
3. Include AI disclosure: "AI-assisted. I understand what the code does."
4. Comment on the issue linking the PR
5. Write `.state/submitted.md` with `pr_number=<N>`

### MONITOR
1. Check CI, reviews, comments on open PRs
2. Respond to all feedback immediately
3. Close your own broken PRs honestly

## State Files

All in `.state/` (gitignored). Machine-readable `key=value` fields:
```sh
sed -n 's/^verdict=//p' .state/analysis.md
```

## Commands

Detailed instructions for each phase live in `commands/`:
- `commands/analyze.md`
- `commands/checkdupe.md`
- `commands/fix.md`
- `commands/submit.md`
- `commands/monitor.md`
- `commands/respond.md`
- `commands/close.md`
- `commands/jobstatus.md`

## Code Rules

- `Record<string, unknown>` not `any`
- Always braces for if/else
- Formatter: oxfmt (not prettier)
- Linter: oxlint via `pnpm lint`
- Never `git add -A`, never `git reset --hard`
- If rebase conflicts in files you didn't modify: abort, report

## When to Use

- You found a bug report in openclaw/openclaw issues
- You can identify the root cause and fix it in 1-5 lines
- No existing PR addresses the same issue
