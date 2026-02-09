/analyze

Input: ISSUE=<number> (ask if missing)

Prerequisite: none
Produces: .state/analysis.md with verdict=FIX or verdict=SKIP
Gate: verdict must be FIX to proceed

EXECUTION RULE: Run commands. Do not just plan.

## Steps

```sh
cd /tmp/openclaw-fork
git checkout main && git pull origin main
mkdir -p .state
ISSUE=<ISSUE>
```

1) Read the issue:
```sh
gh issue view $ISSUE --repo openclaw/openclaw --json title,body,labels,comments
```

2) Check if already fixed on main:
```sh
git log --oneline -20 --grep="<keyword>"
rg -n "<keyword>" src/ --include="*.ts" | head -20
```

3) Identify root cause - read source, trace code path, find exact file+line.
   If unclear: verdict=SKIP reason=unclear_root_cause

4) Assess complexity:
   - 1-5 lines, 1-2 files → low (proceed)
   - Multiple subsystems → high (verdict=SKIP reason=too_complex)

5) Write .state/analysis.md:
```
issue=<N>
title=<title>
verdict=<FIX|SKIP>
reason=<why>
complexity=<low|medium|high>

## Root Cause
<1-3 sentences>

## Fix Strategy
<1-3 sentences>

## Files
- <file>: <change>
```

Verify: `grep "^verdict=" .state/analysis.md`

Output:
- FIX: "Analyzed. Ready for /checkdupe ISSUE"
- SKIP: "Skipped: <reason>"
