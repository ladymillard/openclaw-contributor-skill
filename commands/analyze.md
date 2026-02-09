/analyze <issue>

ISSUE must be provided. Ask if missing.

1. Setup:
```sh
cd /tmp/openclaw-fork && git checkout main && git pull origin main && mkdir -p .state
```

2. Read issue:
```sh
gh issue view <ISSUE> --repo openclaw/openclaw --json number,title,body,labels,comments,state
```

3. Check if already fixed:
```sh
git log --oneline -30 --grep="<keyword>"
rg -n "<keyword>" src/ --type ts | head -20
```

4. Identify root cause. Read source, trace code path, find exact file and line.

5. Decide:
- Crash or data loss -> verdict=FIX priority=stability
- UX bug -> verdict=FIX priority=ux
- Feature request -> verdict=SKIP
- Unclear root cause -> verdict=SKIP
- Multiple subsystems -> verdict=SKIP
- Needs specific env to test -> verdict=SKIP

6. Write `.state/analysis.md`:
```
issue=<N>
title=<title>
verdict=<FIX|SKIP>
reason=<why>
complexity=<low|medium|high>

## Root Cause
<what is broken and why>

## Fix Strategy
<what to change>

## Files
- <file>: <change>
```

7. Verify: `grep "^verdict=" .state/analysis.md`
