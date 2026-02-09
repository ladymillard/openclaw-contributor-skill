/submit

Input
- ISSUE: <number>
  - If missing: ALWAYS ask.

DO (create PR only)
Goal: create the pull request on GitHub with a concise, honest description. Verify CI triggers.

SAFETY
- Do NOT push additional commits during this step.
- Do NOT modify source code. The fix is already done.

EXECUTION RULE (CRITICAL)
- EXECUTE THIS. Create the PR. Verify it exists.
- Do not stop after building the description. Actually run `gh pr create`.

Completion criteria
- PR created successfully via `gh pr create`
- PR number and URL captured
- CI checks triggered (at least 1 check within 30s)
- .state/submitted.md written

## Step 0: Load prerequisites

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>

if [ ! -f .state/fix.md ]; then
  echo "ERROR: Run /fix $ISSUE first"
  exit 1
fi

lint=$(sed -n 's/^lint_passed=//p' .state/fix.md)
fmt=$(sed -n 's/^format_passed=//p' .state/fix.md)
push=$(sed -n 's/^push_verified=//p' .state/fix.md)
branch=$(sed -n 's/^branch=//p' .state/fix.md)

if [ "$lint" != "yes" ]; then echo "ERROR: lint_passed=$lint"; exit 1; fi
if [ "$fmt" != "yes" ]; then echo "ERROR: format_passed=$fmt"; exit 1; fi
if [ "$push" != "yes" ]; then echo "ERROR: push_verified=$push"; exit 1; fi
if [ -z "$branch" ]; then echo "ERROR: no branch in fix.md"; exit 1; fi

echo "Prerequisites verified. Creating PR from branch: $branch"
```

## Step 1: Build PR title and description

Read .state/analysis.md for root cause and fix strategy.
Read .state/fix.md for files modified.

Title format: `fix(<scope>): <brief description>`

Body format (keep it short, no padding):
```
## Summary

<1 sentence: what this PR fixes>

**Fixes #<ISSUE>**

## Problem

<2-3 sentences: what was broken and why>

## Fix

**`<file1>`** - <what changed and why>
**`<file2>`** - <what changed and why>
```

No marketing. No emoji. Just facts.

## Step 2: Create PR

```sh
gh pr create --repo openclaw/openclaw \
  --head "arosstale:$branch" \
  --base main \
  --title 'fix(<scope>): <brief description>' \
  --body '<body from step 1>'
```

Capture the URL from the output.

## Step 3: Extract PR number and verify

```sh
pr_number=<extracted from URL>

gh pr view $pr_number --repo openclaw/openclaw --json number,state,title --jq '{number,state,title}'
```

## Step 4: Wait for CI to trigger

```sh
sleep 15
check_count=$(gh pr view $pr_number --repo openclaw/openclaw --json statusCheckRollup --jq '.statusCheckRollup | length')
echo "CI checks triggered: $check_count"
```

If 0 checks after 30s, note it but do not block.

## Step 5: Write submitted state (MANDATORY)

Write to `.state/submitted.md`:

```
issue=<ISSUE>
pr_number=<number>
pr_url=<full URL>
branch=<branch name>
submitted_at=<ISO timestamp>
ci_checks_triggered=<count>

## PR
- Title: <title>
- URL: <url>
- Branch: <branch>
```

Verify:
```sh
ls -la .state/submitted.md
grep "^pr_number=" .state/submitted.md
grep "^pr_url=" .state/submitted.md
```

## Output

"PR #<number> created for #<ISSUE>: <url>. CI running (<N> checks). Use /monitor to track."
