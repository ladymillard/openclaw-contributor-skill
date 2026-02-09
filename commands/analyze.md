/analyze

Input
- ISSUE: <number>
  - If missing: ALWAYS ask. Never auto-detect from conversation.
  - If ambiguous: ask.

DO (analysis only)
Goal: determine if this issue is worth fixing. Produce a structured analysis with a clear verdict (FIX vs SKIP). Do NOT write any fix code.

SAFETY (read before doing anything)
- Do NOT create branches, commit, or push during analysis. This is a read-only operation.
- Do NOT modify any source files.

EXECUTION RULE (CRITICAL)
- EXECUTE THIS COMMAND. DO NOT JUST PLAN.
- After you print the TODO checklist, immediately continue and run the shell commands.
- Do not stop after printing the checklist. That is not completion.

Completion criteria
- You ran the commands and inspected the issue and source code.
- You produced .state/analysis.md with a verdict= line.
- You verified the file exists.

## First: Create a TODO checklist
Print a checklist of all steps. Then keep going and execute.

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

Extract:
- What is broken (symptom)
- What user expects
- What environment/channel (telegram, discord, matrix, etc.)
- Any file paths or stack traces mentioned

If issue is closed or has label "wontfix": verdict=SKIP reason=issue_closed

## Step 2: Check if already fixed on main

```sh
# Search recent commits for keywords from the issue
git log --oneline -30 --grep="<keyword_from_title>"

# Search source for the reported behavior
rg -n "<symptom_keyword>" src/ --type ts | head -20
```

If the fix is already in main: verdict=SKIP reason=already_fixed

## Step 3: Identify root cause

- Read the source files mentioned in or relevant to the issue
- Trace the code path from entry point to where it breaks
- Identify the exact file, function, and line

If you cannot identify a clear root cause after reading the code:
verdict=SKIP reason=unclear_root_cause

## Step 4: Assess complexity and value

Complexity:
- 1-5 line fix in 1-2 files -> complexity=low
- 5-20 lines across 2-3 files in one subsystem -> complexity=medium
- Multiple subsystems, architecture changes, or needs environment to test -> complexity=high

Value (from CONTRIBUTING.md priorities: Stability > UX > Skills > Performance):
- Crash, data loss, corruption -> priority=stability (high value)
- User-facing UX bug -> priority=ux (good value)
- Feature request -> verdict=SKIP reason=feature_not_bug
- Config/env issue, not a code bug -> verdict=SKIP reason=not_code_bug

If complexity=high: verdict=SKIP reason=too_complex

## Step 5: Write analysis (MANDATORY)

Write to `.state/analysis.md`. EXECUTE THIS, DO NOT JUST SAY YOU DID IT:

```
issue=<ISSUE>
title=<issue title>
verdict=<FIX|SKIP>
reason=<why this verdict>
complexity=<low|medium|high>
priority=<stability|ux|skills|performance>

## Root Cause
<1-3 sentences explaining what is broken and why>

## Fix Strategy
<1-3 sentences explaining what to change>

## Files
- <file1>: <what to change>
- <file2>: <what to change>

## Risks
- <edge cases or concerns>
```

Verify it exists and has the verdict:
```sh
ls -la .state/analysis.md
grep "^verdict=" .state/analysis.md
grep "^issue=" .state/analysis.md
```

## Output

- If verdict=FIX: "Issue #<ISSUE> analyzed. Root cause identified in <file>. Ready for /checkdupe <ISSUE>"
- If verdict=SKIP: "Issue #<ISSUE> skipped: <reason>. <1 sentence detail>"
