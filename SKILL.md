---
name: openclaw-contributor
description: Deterministic workflow for contributing to OpenClaw. 7-step pipeline with machine-readable state artifacts. Each step gates the next. Encodes discipline from closing 38 of 40 PRs.
---

# OpenClaw Contributor

Deterministic 7-step pipeline: analyze -> checkdupe -> fix -> submit -> monitor -> respond -> close.
Each step produces machine-readable artifacts in `.state/` consumed by the next. Hard gates prevent progression on failure.

## SAFETY

- NEVER push to `main` or `origin/main`
- All pushes go to feature branches on `fork` remote only
- Close your own broken PRs immediately with honest comments
- ONE PR AT A TIME, finish completely before starting next

## Pipeline

```
/analyze <issue>
  | produces .state/analysis.md (verdict=FIX or verdict=SKIP)
  | gate: verdict must be FIX
/checkdupe <issue>
  | reads .state/analysis.md (verifies verdict=FIX)
  | produces .state/dupecheck.md (existing_prs=0)
  | gate: existing_prs must be 0
/fix <issue>
  | reads .state/analysis.md + .state/dupecheck.md
  | produces .state/fix.md (lint_passed=yes, format_passed=yes, push_verified=yes)
  | gate: all three must be yes
/submit <issue>
  | reads .state/fix.md (verifies gates)
  | produces .state/submitted.md (pr_number=N, pr_url=URL)
  | gate: PR created successfully
/monitor
  | produces .state/monitor.md (per-PR status)
  | gate: none (informational, flags PRs needing action)
/respond <pr>
  | produces .state/responded.md (all_addressed=yes)
  | gate: all comments resolved
/close <pr>
  | produces .state/closed.md
  | terminal
```

## Artifact Format

Machine-readable fields use `key=value` on their own line, parseable with:
```sh
sed -n 's/^key=//p' .state/file.md
```

## Commands

| Command | Produces | Gate to Next |
|---|---|---|
| `/analyze <issue>` | `.state/analysis.md` | verdict=FIX |
| `/checkdupe <issue>` | `.state/dupecheck.md` | existing_prs=0 |
| `/fix <issue>` | `.state/fix.md` | lint_passed=yes, format_passed=yes, push_verified=yes |
| `/submit <issue>` | `.state/submitted.md` | pr_number present |
| `/monitor` | `.state/monitor.md` | none (informational) |
| `/respond <pr>` | `.state/responded.md` | all_addressed=yes |
| `/close <pr>` | `.state/closed.md` | terminal |

Command files in `commands/` are self-contained with all steps, safety rules, and verification. Subagents read command files directly (not this SKILL.md).

## Environment

- Fork repo: `/tmp/openclaw-fork`
- Remote `fork`: `arosstale/openclaw`
- Remote `origin`: `openclaw/openclaw`
- Formatter: `npx oxfmt --write <file>` (NOT prettier)
- Linter: `pnpm lint` (runs `oxlint --type-aware`)
- Known CI flake: `checks-windows (test)` always fails (#12119)
- Pre-existing lint errors: 4 `no-redundant-type-constituents` (not our changes)

## Why These Rules

We closed 38 of 40 PRs. The /checkdupe gate alone would have prevented most of them.
See discussion #11907 for context on the AI PR flood this skill is designed to prevent.
