/fix <issue>

ISSUE must be provided. Prerequisites: `verdict=FIX` in analysis.md, `existing_prs=0` in dupecheck.md.

1. Verify:
```sh
cd /tmp/openclaw-fork
grep -q "^verdict=FIX" .state/analysis.md || exit 1
grep -q "^existing_prs=0" .state/dupecheck.md || exit 1
```

2. Branch:
```sh
git checkout main && git pull origin main
git checkout -b fix/<ISSUE>-<slug>
```

3. Implement. Read `.state/analysis.md` for strategy. Rules:
- Minimal change, root cause only
- Follow existing patterns in the file
- `Record<string, unknown>` not `any`
- Always braces for if/else

4. Format:
```sh
npx oxfmt --write <files>
```

5. Verify gates:
```sh
pnpm build
pnpm check
pnpm test
```
Build MUST pass. Check MUST pass (4 pre-existing errors OK). Test: only NEW failures block.
MAX 3 fix cycles.

6. Review diff:
```sh
git diff
```
Every line must be justified.

7. Commit and push:
```sh
git add <specific-files-only>
git commit -m 'fix(<scope>): <desc>

<root cause and fix>

Fixes #<ISSUE>'
git push fork fix/<ISSUE>-<slug>
```

8. Verify push:
```sh
local_sha=$(git rev-parse HEAD)
remote_sha=$(git ls-remote fork "refs/heads/fix/<ISSUE>-<slug>" | awk '{print $1}')
[ "$local_sha" = "$remote_sha" ] && echo "push_verified=yes" || exit 1
```

9. Write `.state/fix.md`:
```
issue=<N>
branch=fix/<N>-<slug>
head_sha=<sha>
push_verified=yes
build_passed=yes
check_passed=yes
```
