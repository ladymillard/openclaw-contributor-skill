---
name: openclaw-contributor
description: Deterministic workflow for contributing to OpenClaw, following Mario's project philosophy. Stability > UX > Skills > Performance. AI-assisted PRs welcome with transparency. Each step gates the next with machine-readable artifacts.
---

# OpenClaw Contributor

Deterministic pipeline: analyze -> checkdupe -> fix -> submit -> monitor -> respond -> close.
Each step produces machine-readable artifacts in `.state/` consumed by the next.

## Mario's Project Philosophy

From CONTRIBUTING.md and what actually gets merged:

1. **Stability > UX > Skills > Performance** — crash fixes and data-loss prevention first
2. **One thing per PR** — focused, minimal, reviewable
3. **Describe what and why** — not just what changed, but why the old code was wrong
4. **AI PRs welcome, be transparent** — mark as AI-assisted, note testing level, confirm you understand the code
5. **Test locally** — `pnpm build && pnpm check && pnpm test` before submitting
6. **Engage after submission** — comment on the issue linking your PR, respond to feedback promptly
7. **Net-negative LOC wins** — consolidation and simplification get merged fastest

What gets merged: tested fixes, consolidation refactors, engaged contributors.
What gets ignored: spray-and-pray bot PRs with zero engagement.

## Hard-Won Rules (from closing 38 of 40 PRs)

1. CHECK FOR EXISTING PRs FIRST — the /checkdupe gate would have prevented 38 closures
2. ONE PR AT A TIME — finish completely including review feedback
3. CLOSE YOUR OWN BROKEN PRs — honest comments, no ghosting

## Pipeline

```
/analyze <issue>
  | .state/analysis.md (verdict=FIX|SKIP)
  | gate: verdict=FIX
/checkdupe <issue>
  | .state/dupecheck.md (existing_prs=0)
  | gate: existing_prs=0
/fix <issue>
  | .state/fix.md (build_passed=yes, check_passed=yes, test_passed=yes, push_verified=yes)
  | gate: all four yes
/submit <issue>
  | .state/submitted.md (pr_number=N, pr_url=URL)
  | gate: PR created + CI triggered
/monitor
  | .state/monitor.md (per-PR status)
/respond <pr>
  | .state/responded.md (all_addressed=yes)
/close <pr>
  | .state/closed.md
```

## Artifact Format

Machine-readable `key=value` on own line, parseable with:
```sh
sed -n 's/^key=//p' .state/file.md
```

## Commands

Command files in `commands/` are self-contained. Subagents read them directly.

| Command | Produces | Gate |
|---|---|---|
| `/analyze <issue>` | `.state/analysis.md` | verdict=FIX |
| `/checkdupe <issue>` | `.state/dupecheck.md` | existing_prs=0 |
| `/fix <issue>` | `.state/fix.md` | build + check + test + push all yes |
| `/submit <issue>` | `.state/submitted.md` | pr_number present |
| `/monitor` | `.state/monitor.md` | informational |
| `/respond <pr>` | `.state/responded.md` | all_addressed=yes |
| `/close <pr>` | `.state/closed.md` | terminal |

## Environment

- Fork repo: `/tmp/openclaw-fork`
- Remote `fork`: `arosstale/openclaw`
- Remote `origin`: `openclaw/openclaw`
- Build: `pnpm build`
- Check: `pnpm check` (format + lint combined)
- Test: `pnpm test`
- Formatter: `npx oxfmt --write <file>` (NOT prettier)
- Linter: `pnpm lint` (oxlint --type-aware)
- Known CI flake: `checks-windows (test)` always fails (#12119)
- Known repo-wide failures: bun test and node test currently failing on ALL PRs
- Pre-existing lint: 4 `no-redundant-type-constituents` errors (not ours)
- Pre-existing macOS: `GatewayModels.swift` file_length lint violation
