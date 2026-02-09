# openclaw-contributor-skill

Deterministic agentic workflow for contributing to [OpenClaw](https://github.com/openclaw/openclaw), following Mario's project philosophy.

Built from the hard lesson of closing 38 of 40 PRs.

## Pipeline

```
/analyze <issue>    -> .state/analysis.md   verdict=FIX|SKIP
/checkdupe <issue>  -> .state/dupecheck.md  existing_prs=0        <- HARD GATE
/fix <issue>        -> .state/fix.md        build+check+test+push <- HARD GATE
/submit <issue>     -> .state/submitted.md  pr_number + issue comment
/monitor            -> .state/monitor.md    CI + review status
/respond <pr>       -> .state/responded.md  all feedback addressed
/close <pr>         -> .state/closed.md     honest reason
```

## What Gets Merged (learned from watching the repo)

- Tested fixes with clear root-cause explanations
- Net-negative LOC consolidation refactors
- PRs from contributors who engage (comment on issues, respond to feedback)
- AI-assisted PRs that are transparent about it

## What Gets Ignored

- Spray-and-pray bot PRs with no engagement
- PRs that don't run `pnpm build && pnpm check && pnpm test`
- Duplicates of existing PRs

## Companion

[openclaw-maintainer-skill](https://github.com/arosstale/openclaw-maintainer-skill) for the maintainer side.
