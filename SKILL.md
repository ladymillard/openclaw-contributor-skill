---
name: openclaw-contributor
description: PR creation and contribution automation for OpenClaw contributors. Analyze issues, create fixes, write tests, and submit PRs. Use when asked to fix an issue or create a PR.
---

# OpenClaw Contributor

Automated issue analysis → root cause fix → comprehensive testing → PR submission workflow.

## SAFETY: QUALITY GATES FIRST

This skill ensures production-ready PRs only:
- NEVER submit without local build passing
- NEVER submit without all tests passing
- NEVER submit without root cause analysis
- NEVER submit without defensive programming patterns
- All PRs must have 3+ test cases minimum
- All PRs must include professional descriptions

## Command Files

The actual command files live in this skill's `commands/` folder:
- `commands/analyzeissue.md` - deep issue analysis + root cause
- `commands/createfix.md` - implement fix + write tests
- `commands/submitpr.md` - create PR + verify submission

## Workflow Overview (3 step)

1. **User:** "fix issue #10238"
2. **Main agent:** spawns subagent via `sessions_spawn`. Subagent reads `commands/analyzeissue.md` and executes.
3. **Analysis subagent:** digs into issue, identifies root cause, proposes solution
4. **Main agent:** summarizes findings for user (ready to fix, needs more info, too complex)
5. **User:** "ok fix it" / "research more" / "skip this one"
6. **Main agent:** if approved, spawns subagent (high thinking) via `sessions_spawn`. Subagent reads `commands/createfix.md`.
7. **Fix subagent:** implements fix, writes tests (3+ cases), runs local build, runs tests, commits with professional message, pushes to new branch, verifies push landed
8. **User:** "submit it" / "needs changes" / "abandon"
9. **Main agent:** if ready, spawns subagent (high thinking) via `sessions_spawn`. Subagent reads `commands/submitpr.md`.
10. **Submit subagent:** creates PR via gh cli, adds professional description, verifies submission on GitHub
11. **Main agent:** confirms to user with PR URL

## ⚠️ ALWAYS USE SUBAGENT

Analysis, fixing, and submission are complex tasks. NEVER run in the main thread. Always use `sessions_spawn` to create a subagent.

## Model Preferences

Preferred models (fall back to session default if not available):
- Analysis: `model:opus` (best for deep code understanding)
- Fix: `model:gpt` with `thinking:high` (methodical implementations + tests)
- Submit: `model:gpt` with `thinking:high` (professional PR creation)

## Config (optional)

Create `config.yaml` in this skill folder to override defaults:

```yaml
# ~/openclaw/skills/openclaw-contributor/config.yaml
models:
  analyze: opus         # or anthropic/claude-opus-4-5
  fix: gpt              # or openai-codex/gpt-5.2
  submit: gpt           # or openai-codex/gpt-5.2
  fix_thinking: high
  submit_thinking: high

quality_gates:
  min_test_cases: 3
  require_build_pass: true
  require_tests_pass: true
  defensive_patterns: true
```

If config not present or model not available, uses session default model.

## Analysis Workflow (/analyzeissue)

Spawn a subagent with a task referencing the command file:

```
sessions_spawn task:"Analyze issue #<number> in openclaw repo. Read commands/analyzeissue.md and follow its instructions exactly." model:opus runTimeoutSeconds:0 (infinite)
```

## Fix Workflow (/createfix)

Spawn a subagent for fix implementation (only after user approves analysis):

```
sessions_spawn task:"Create fix for issue #<number> in openclaw repo. Read commands/createfix.md and follow its instructions exactly." model:gpt thinking:high runTimeoutSeconds:0 (infinite)
```

## Submit Workflow (/submitpr)

Spawn a subagent for PR submission (only after fix is complete and user says submit):

```
sessions_spawn task:"Submit PR for issue #<number> in openclaw repo. Read commands/submitpr.md and follow its instructions exactly." model:gpt thinking:high runTimeoutSeconds:0 (infinite)
```

## Key Principles

- **Deep Understanding First**: Always analyze root cause before coding
- **Defensive Programming**: Assume the worst, code for safety
- **Comprehensive Testing**: 3+ test cases minimum per fix
- **Professional Communication**: Clear PRs, thorough descriptions
- **Quality Gates**: Build must pass, tests must pass
- **Single Responsibility**: Each fix addresses one root cause
- **Sustainable Pace**: 25 min per fix is the target

## Important Notes

- Subagents read the command file directly, they do NOT read this SKILL.md
- Each command file is self-contained with all setup, steps, and quality gates
- If build fails, report failure and suggest debugging steps
- If tests fail, report and do NOT submit
- PR submission is the final step only
- Quality > Volume: One good PR beats 10 rushed ones
