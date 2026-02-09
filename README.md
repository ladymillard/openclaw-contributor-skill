# openclaw-contributor-skill

Deterministic agentic workflow for contributing production-ready PRs to [OpenClaw](https://github.com/openclaw/openclaw).

## Why This Exists

We learned the hard way. 38 of 40 PRs closed, duplicates, broken code, noise. This skill encodes the discipline that would have prevented all of it.

## Pipeline

```
/analyze <issue>    -> .state/analysis.md   (verdict=FIX|SKIP)
/checkdupe <issue>  -> .state/dupecheck.md  (existing_prs=0)     <- HARD GATE
/fix <issue>        -> .state/fix.md        (lint, format, push)  <- HARD GATE
/submit <issue>     -> .state/submitted.md  (pr_number, pr_url)
/monitor            -> .state/monitor.md    (per-PR status)
/respond <pr>       -> .state/responded.md  (all feedback addressed)
/close <pr>         -> .state/closed.md     (honest reason)
```

Each step produces machine-readable `.state/*.md` artifacts (key=value format). Hard gates block progression on failure.

## Key Rules

1. **Check duplicates before any code** (`existing_prs=0` is a hard gate)
2. **One PR at a time** (finish including review feedback before next)
3. **Verify gates locally** (oxfmt + oxlint must pass)
4. **Address every review comment** (Greptile and maintainer)
5. **Close your own broken PRs** (honest comments, no ghosting)

## Companion

[openclaw-maintainer-skill](https://github.com/arosstale/openclaw-maintainer-skill) for the maintainer side.
