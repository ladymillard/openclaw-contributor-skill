/fix

Input: ISSUE=<number>
Prerequisites: .state/analysis.md (verdict=FIX), .state/dupecheck.md (existing_prs=0)
Produces: .state/fix.md with lint_passed=yes, format_passed=yes, push_verified=yes
Gate: all three must be yes

EXECUTION RULE: Write code. Run gates. Do not just plan.

## Steps

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>
grep -q "^verdict=FIX" .state/analysis.md || exit 1
grep -q "^existing_prs=0" .state/dupecheck.md || exit 1
```

1) Branch:
```sh
git checkout main && git pull origin main
git checkout -b fix/$ISSUE-<brief>
```

2) Implement from .state/analysis.md strategy. Rules:
   - Minimal change, root cause only
   - Follow existing patterns
   - Record<string, unknown> not any
   - Always braces for if/else
   - Match content format from surrounding code

3) Format and lint:
```sh
npx oxfmt --write <files>
pnpm lint 2>&1 | tail -10
```
Only 4 pre-existing errors acceptable. Fix NEW errors.

4) Review: `git diff` — every line justified, minimal, safe.

5) Commit and push:
```sh
git add <specific-files-only>
git commit -m 'fix(<scope>): <description>

Fixes #<ISSUE>'
git push fork fix/$ISSUE-<brief>
```

6) Verify push:
```sh
local_sha=$(git rev-parse HEAD)
remote_sha=$(git ls-remote fork "refs/heads/fix/$ISSUE-<brief>" | awk '{print $1}')
[ "$local_sha" = "$remote_sha" ] && echo "push_verified=yes" || exit 1
```

7) Write .state/fix.md:
```
issue=<N>
branch=fix/<N>-<brief>
head_sha=<sha>
push_verified=yes
format_passed=yes
lint_passed=yes
files_changed=<N>

## Files
- <file>: <change>

## Summary
<2-3 sentences>
```

Output: "Fix ready. Ready for /submit ISSUE"
