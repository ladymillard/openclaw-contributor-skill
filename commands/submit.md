/submit

Input
- ISSUE: <number>
  - If missing: ALWAYS ask.

Prerequisite: .state/fix.md with build_passed=yes, check_passed=yes, push_verified=yes

DO (create PR and engage)
Goal: create PR with honest description following Mario's guidelines, then link it from the issue.

SAFETY
- Do NOT push code. The fix is already pushed.
- Do NOT modify source files.

EXECUTION RULE
- Create the PR. Comment on the issue. Do not just plan.

Completion criteria
- PR created via `gh pr create`
- PR linked from issue comment
- CI triggered
- .state/submitted.md written

## Step 0: Verify prerequisites

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>
[ -f .state/fix.md ] || { echo "ERROR: Run /fix first"; exit 1; }
grep -q "^build_passed=yes" .state/fix.md || { echo "ERROR: build not passed"; exit 1; }
grep -q "^push_verified=yes" .state/fix.md || { echo "ERROR: push not verified"; exit 1; }
branch=$(sed -n 's/^branch=//p' .state/fix.md)
[ -n "$branch" ] || { echo "ERROR: no branch"; exit 1; }
```

## Step 1: Build PR description

Per CONTRIBUTING.md: "Describe what & why" and "AI PRs: mark it, note testing level"

Title: `fix(<scope>): <brief description>`

Body template:
```
## Summary

<1 sentence: what this fixes>

**Fixes #<ISSUE>**

## Problem

<2-3 sentences: what was broken and why. Explain the root cause, not just the symptom.>

## Fix

**`<file>`** — <what changed and why this is the right fix>

## Testing

- [x] `pnpm build` passes
- [x] `pnpm check` passes
- [x] `pnpm test` — <note any pre-existing failures>
- <how to manually verify if applicable>

## AI Disclosure

AI-assisted (Claude). I understand what the code does and have verified the fix addresses the root cause described above.
```

No padding. No marketing. Just facts.

## Step 2: Create PR

```sh
gh pr create --repo openclaw/openclaw \
  --head "arosstale:$branch" \
  --base main \
  --title 'fix(<scope>): <brief description>' \
  --body '<body from step 1>'
```

Capture URL.

## Step 3: Link from the issue

This is what engaged contributors do. Makes it visible to maintainers watching the issue.

```sh
gh issue comment $ISSUE --repo openclaw/openclaw --body "PR #<pr_number> addresses this — <1 sentence summary of the fix approach>."
```

## Step 4: Verify CI triggered

```sh
sleep 15
pr_number=<from step 2>
gh pr view $pr_number --repo openclaw/openclaw --json statusCheckRollup --jq '.statusCheckRollup | length'
```

## Step 5: Write .state/submitted.md (MANDATORY)

```
issue=<ISSUE>
pr_number=<N>
pr_url=<url>
branch=<branch>
submitted_at=<ISO timestamp>
issue_commented=yes
ci_triggered=<count>
```

Verify:
```sh
ls -la .state/submitted.md
grep "^pr_number=" .state/submitted.md
```

## Output
"PR #N created for #ISSUE: <url>. Issue commented. CI running. Use /monitor to track."
