/fix

Input
- ISSUE: <number>
  - If missing: ALWAYS ask.

DO (implement fix only)
Goal: implement the fix, pass all local gates (format, lint), commit to a feature branch, push to fork. Do NOT create the PR yet.

SAFETY
- NEVER push to `main` or `origin/main`. All pushes go to feature branches on `fork` remote.
- Do NOT run `git add -A` or `git add .`. Always stage specific files you changed.
- Do NOT run `git push` without specifying remote and branch.

EXECUTION RULE (CRITICAL)
- EXECUTE THIS. Write the code. Run the gates.
- If gates fail, fix the issue and rerun. MAX 3 ATTEMPTS.
- Do not stop after implementing. You must also format, lint, commit, push, and verify.

Known footguns
- Formatter is `oxfmt`, NOT prettier. `npx oxfmt --write <file>` / `npx oxfmt --check <file>`
- Linter is `pnpm lint` (oxlint --type-aware). Watch for `no-explicit-any` and `curly` rules.
- There are 4 pre-existing lint errors (no-redundant-type-constituents). These are NOT from us.
- `pnpm install` may be needed if dependencies changed.

Completion criteria
- Code implements the fix from .state/analysis.md
- `npx oxfmt --check <files>` passes
- `pnpm lint` shows no NEW errors
- Committed to feature branch
- Pushed to fork remote
- Push verified (local sha == remote sha)
- .state/fix.md written with all gate fields

## Step 0: Load prerequisites

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>

if [ ! -f .state/analysis.md ]; then
  echo "ERROR: Run /analyze $ISSUE first"
  exit 1
fi
if [ ! -f .state/dupecheck.md ]; then
  echo "ERROR: Run /checkdupe $ISSUE first"
  exit 1
fi

verdict=$(sed -n 's/^verdict=//p' .state/analysis.md)
dupes=$(sed -n 's/^existing_prs=//p' .state/dupecheck.md)

if [ "$verdict" != "FIX" ]; then
  echo "ERROR: verdict=$verdict, not FIX"
  exit 1
fi
if [ "$dupes" != "0" ]; then
  echo "ERROR: existing_prs=$dupes, not 0"
  exit 1
fi

echo "Prerequisites verified. Proceeding with fix for #$ISSUE"
```

## Step 1: Create branch

```sh
git checkout main && git pull origin main
git checkout -b fix/$ISSUE-<brief-description>
```

Use a short descriptive name. Example: `fix/12345-telegram-crash`

## Step 2: Read the fix strategy

```sh
cat .state/analysis.md
```

Read the Root Cause, Fix Strategy, and Files sections. Understand exactly what to change before writing code.

## Step 3: Implement the fix

Rules for writing code:
- Minimal change. Fix the root cause, nothing else. No drive-by refactors.
- Follow existing patterns in the file. Match style, naming, error handling.
- Use `Record<string, unknown>` not `any` (lint rule: no-explicit-any)
- Always use braces for if/else/for/while (lint rule: curly)
- Check content format: is it `string` or `{type, text}[]`? Match surrounding code.
- Check model IDs: is it `"model"` or `"provider/model"`? Match callers.
- If adding a constant, check if one already exists nearby.
- If adding error handling, check how the same file handles similar errors.

## Step 4: Format

```sh
npx oxfmt --write <changed-file-1> <changed-file-2>
npx oxfmt --check <changed-file-1> <changed-file-2>
```

Both must succeed. If `--check` fails after `--write`, something is wrong.

## Step 5: Lint

```sh
pnpm lint 2>&1 | tail -20
```

Count errors. Only 4 pre-existing errors are acceptable:
- `no-redundant-type-constituents` for ZodIssue (2 occurrences)
- `no-redundant-type-constituents` for TemplateResult (2 occurrences)

If there are NEW errors from files we changed, fix them and reformat.
MAX 3 fix-lint cycles. If still failing, stop and report.

## Step 6: Review diff

```sh
git diff --stat
git diff
```

Read every line. For each changed line, ask:
- Does this actually fix the reported issue?
- Could this break anything else?
- Is this the minimal change needed?
- Would I be embarrassed if a maintainer read this?

If anything looks wrong, fix it, reformat, relint.

## Step 7: Commit

Stage only specific files:
```sh
git add <file1> <file2>
```

NEVER `git add -A` or `git add .`.

Commit message format:
```sh
git commit -m 'fix(<scope>): <brief description>

<1-2 sentences: what was broken, why, what this changes>

Fixes #<ISSUE>'
```

Scope should match the subsystem: agents, telegram, discord, matrix, gateway, media, auto-reply, etc.

## Step 8: Push

```sh
git push fork fix/$ISSUE-<brief-description>
```

If push fails, check that the fork remote is configured:
```sh
git remote -v | grep fork
```

## Step 9: Verify push (MANDATORY)

```sh
local_sha=$(git rev-parse HEAD)
remote_sha=$(git ls-remote fork "refs/heads/fix/$ISSUE-<brief-description>" | awk '{print $1}')

echo "local_sha=$local_sha"
echo "remote_sha=$remote_sha"

if [ "$local_sha" != "$remote_sha" ]; then
  echo "ERROR: push verification failed. local=$local_sha remote=$remote_sha"
  exit 1
fi
echo "push_verified=yes"
```

## Step 10: Write fix state (MANDATORY)

Write to `.state/fix.md`:

```
issue=<ISSUE>
branch=fix/<ISSUE>-<description>
head_sha=<sha from git rev-parse HEAD>
push_verified=yes
format_passed=yes
lint_passed=yes
files_changed=<number of files>

## Files Modified
- <file1>: <what changed and why>
- <file2>: <what changed and why>

## Fix Summary
<2-3 sentences describing what the fix does>
```

Verify:
```sh
ls -la .state/fix.md
grep "^push_verified=" .state/fix.md
grep "^lint_passed=" .state/fix.md
grep "^format_passed=" .state/fix.md
```

## Output

- If all gates passed: "Fix for #<ISSUE> ready on branch <branch>. <N> files changed. Ready for /submit <ISSUE>"
- If any gate failed: report which gate failed, what the error was, and stop.
