/fix

Input
- ISSUE: <number>
  - If missing: ALWAYS ask.

Prerequisites: .state/analysis.md (verdict=FIX), .state/dupecheck.md (existing_prs=0)

DO (implement and verify)
Goal: implement the fix, run ALL local gates (build, check, test), commit, push.
Do NOT create the PR yet.

SAFETY
- NEVER push to `main` or `origin/main`. Feature branches on `fork` only.
- NEVER `git add -A` or `git add .`. Stage specific files.
- NEVER `git push` without explicit remote and branch.

EXECUTION RULE (CRITICAL)
- Write the code. Run the gates. Do not just plan.
- MAX 3 fix-and-rerun cycles on gate failures.

Known footguns
- Formatter: `oxfmt` NOT prettier. Use `npx oxfmt --write <file>`
- Linter: `pnpm lint` (oxlint --type-aware). Rules: `no-explicit-any`, `curly`
- 4 pre-existing lint errors are acceptable (no-redundant-type-constituents)
- `pnpm install` may be needed after rebase

Completion criteria
- Fix implements root cause from .state/analysis.md
- `pnpm build` passes
- `pnpm check` passes (format + lint)
- `pnpm test` passes (or only pre-existing failures)
- Committed and pushed to fork
- Push verified (local sha == remote sha)
- .state/fix.md written

## Step 0: Verify prerequisites

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>

[ -f .state/analysis.md ] || { echo "ERROR: Run /analyze first"; exit 1; }
[ -f .state/dupecheck.md ] || { echo "ERROR: Run /checkdupe first"; exit 1; }
grep -q "^verdict=FIX" .state/analysis.md || { echo "ERROR: verdict not FIX"; exit 1; }
grep -q "^existing_prs=0" .state/dupecheck.md || { echo "ERROR: dupes exist"; exit 1; }
```

## Step 1: Branch

```sh
git checkout main && git pull origin main
git checkout -b fix/$ISSUE-<brief-description>
```

## Step 2: Read strategy

```sh
cat .state/analysis.md
```

## Step 3: Implement

Rules:
- Minimal change. Root cause only. No drive-by refactors.
- Follow existing patterns in the file.
- `Record<string, unknown>` not `any`
- Always braces for if/else/for/while
- Check content format (string vs {type, text}[]) from surrounding code
- Check model IDs (bare vs provider/model) from callers
- If the fix removes code, even better (net-negative LOC)

## Step 4: Format

```sh
npx oxfmt --write <changed-files>
npx oxfmt --check <changed-files>
```

## Step 5: Full gate suite

Run the SAME gates CONTRIBUTING.md specifies:

```sh
pnpm build 2>&1 | tail -20
echo "build_exit=$?"

pnpm check 2>&1 | tail -20
echo "check_exit=$?"

pnpm test 2>&1 | tail -20
echo "test_exit=$?"
```

`pnpm build` MUST pass (exit 0).
`pnpm check` MUST pass except 4 pre-existing errors.
`pnpm test`: note pre-existing failures (bun/node tests currently failing repo-wide).
Only NEW failures from our changes are blockers.

If gates fail, fix and rerun. MAX 3 cycles.

## Step 6: Review diff

```sh
git diff --stat
git diff
```

For each line: Does it fix the issue? Could it break anything? Is it minimal?

## Step 7: Commit

```sh
git add <specific-files-only>
git commit -m 'fix(<scope>): <brief description>

<what was broken, why, what this changes>

Fixes #<ISSUE>'
```

## Step 8: Push and verify

```sh
git push fork fix/$ISSUE-<brief-description>

local_sha=$(git rev-parse HEAD)
remote_sha=$(git ls-remote fork "refs/heads/fix/$ISSUE-<brief-description>" | awk '{print $1}')

echo "local_sha=$local_sha"
echo "remote_sha=$remote_sha"
[ "$local_sha" = "$remote_sha" ] && echo "push_verified=yes" || { echo "ERROR: mismatch"; exit 1; }
```

## Step 9: Write .state/fix.md (MANDATORY)

```
issue=<ISSUE>
branch=fix/<ISSUE>-<description>
head_sha=<sha>
push_verified=yes
build_passed=yes
check_passed=yes
test_passed=<yes|pre-existing-failures-only>
files_changed=<N>
lines_added=<N>
lines_removed=<N>

## Files Modified
- <file>: <what changed and why>

## Fix Summary
<2-3 sentences>

## Test Coverage
<what tests exist, what we could add>
```

Verify:
```sh
ls -la .state/fix.md
grep "^push_verified=" .state/fix.md
grep "^build_passed=" .state/fix.md
```

## Output
"Fix for #ISSUE ready on branch <branch>. <+N/-N lines, M files>. Ready for /submit ISSUE"
