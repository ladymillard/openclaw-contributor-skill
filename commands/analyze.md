/analyze

Input
- ISSUE: <number>
  - If missing: ALWAYS ask. Never auto-detect from conversation.

DO (analysis only)
Goal: determine if this issue is worth fixing. Produce a structured analysis with verdict FIX or SKIP. Do NOT write fix code, do NOT create branches.

SAFETY
- This is a read-only operation. No commits, no pushes.

EXECUTION RULE (CRITICAL)
- EXECUTE THIS. Run the commands. Do not just plan.
- Do not stop after printing a checklist.

Completion criteria
- You ran commands and inspected the issue and source code.
- You produced .state/analysis.md with verdict= line.

## Step 0: Setup

```sh
cd /tmp/openclaw-fork
git checkout main && git pull origin main
mkdir -p .state
ISSUE=<ISSUE>
```

## Step 1: Read the issue

```sh
gh issue view $ISSUE --repo openclaw/openclaw --json number,title,body,labels,comments,state
```

Extract: symptom, expected behavior, environment/channel, file paths, stack traces.
If issue is closed or wontfix: verdict=SKIP reason=issue_closed

## Step 2: Prioritize per Mario's hierarchy

From CONTRIBUTING.md: **Stability > UX > Skills > Performance**

- Crash, data loss, corruption -> priority=stability (highest value, fix it)
- User-facing UX bug -> priority=ux (good value)
- Skill or plugin issue -> priority=skills (moderate)
- Perf issue -> priority=performance (lower)
- Feature request -> verdict=SKIP reason=feature_not_bug
- Config/env issue -> verdict=SKIP reason=not_code_bug

## Step 3: Check if already fixed on main

```sh
git log --oneline -30 --grep="<keyword_from_title>"
rg -n "<symptom_keyword>" src/ --type ts | head -20
```

If already fixed: verdict=SKIP reason=already_fixed

## Step 4: Identify root cause

Read source files. Trace code path from entry point to failure.
Identify exact file, function, line.

If unclear after honest effort: verdict=SKIP reason=unclear_root_cause

## Step 5: Assess complexity

- 1-5 lines, 1-2 files -> complexity=low
- 5-20 lines, 2-3 files, one subsystem -> complexity=medium
- Multiple subsystems or architecture -> complexity=high (verdict=SKIP reason=too_complex)
- Needs specific environment to test (Mattermost, Signal, etc.) -> verdict=SKIP reason=cannot_test

## Step 6: Check if there's a consolidation opportunity

Mario's project merges net-negative-LOC refactors fastest. If the fix can also:
- Remove dead code nearby
- Consolidate a duplicated helper
- Simplify an over-complicated path

Note it in the strategy. But keep scope tight.

## Step 7: Write .state/analysis.md (MANDATORY)

```
issue=<ISSUE>
title=<issue title>
verdict=<FIX|SKIP>
reason=<why>
complexity=<low|medium|high>
priority=<stability|ux|skills|performance>

## Root Cause
<1-3 sentences: what is broken and why>

## Fix Strategy
<1-3 sentences: what to change and how>

## Files
- <file>: <what to change>

## Testing
<how to verify the fix, what test to add if possible>

## Risks
- <edge cases or concerns>
```

Verify:
```sh
ls -la .state/analysis.md
grep "^verdict=" .state/analysis.md
```

## Output
- FIX: "Issue #ISSUE analyzed. Root cause: <1 sentence>. Ready for /checkdupe ISSUE"
- SKIP: "Issue #ISSUE skipped: <reason>"
