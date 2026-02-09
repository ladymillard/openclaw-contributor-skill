/submit

Input: ISSUE=<number>
Prerequisite: .state/fix.md with lint_passed=yes, push_verified=yes
Produces: .state/submitted.md with pr_number=<N>, pr_url=<url>

EXECUTION RULE: Create the PR.

## Steps

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>
grep -q "^lint_passed=yes" .state/fix.md || exit 1
grep -q "^push_verified=yes" .state/fix.md || exit 1
branch=$(sed -n 's/^branch=//p' .state/fix.md)
```

1) Create PR with concise description from .state/analysis.md:
```sh
gh pr create --repo openclaw/openclaw \
  --head arosstale:$branch --base main \
  --title 'fix(<scope>): <brief>' \
  --body '## Summary
<1 sentence>

**Fixes #<ISSUE>**

## Problem
<2-3 sentences>

## Fix
**`<file>`** — <what changed>'
```

2) Record:
```
issue=<N>
pr_number=<N>
pr_url=<url>
branch=<branch>
submitted_at=<timestamp>
```
in .state/submitted.md

Output: "PR #N created: <url>. Use /monitor to track."
