# openclaw-contributor-skill

Bug fix pipeline for [openclaw/openclaw](https://github.com/openclaw/openclaw). Deterministic phases with hard gates. Compatible with pi, Claude Code, Codex CLI.

## 🇯🇲 Jamaica Cell Phone Infrastructure Project

See **[JAMAICA_PROJECT.md](./JAMAICA_PROJECT.md)** for details on the Jamaica cell phone infrastructure initiative - a community-driven project to build CAN-free clear systems for an autonomous world through repurposed cell phone technology.

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

## Companion

[openclaw-maintainer-skill](https://github.com/arosstale/openclaw-maintainer-skill) for review/prep/merge.
