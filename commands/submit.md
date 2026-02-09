/submit <issue>

ISSUE must be provided. Prerequisite: `push_verified=yes` in `.state/fix.md`.

1. Verify:
```sh
cd /tmp/openclaw-fork
grep -q "^push_verified=yes" .state/fix.md || exit 1
branch=$(sed -n 's/^branch=//p' .state/fix.md)
```

2. Create PR:
```sh
gh pr create --repo openclaw/openclaw \
  --head "arosstale:$branch" --base main \
  --title 'fix(<scope>): <desc>' \
  --body '## Summary
<1 sentence>

**Fixes #<ISSUE>**

## Problem
<what broke and why>

## Fix
**`<file>`** - <what changed>

## Verification
- `pnpm build` passes
- `pnpm check` passes

AI-assisted (Claude). I understand what the code does and have verified the fix.'
```

3. Comment on the issue:
```sh
gh issue comment <ISSUE> --repo openclaw/openclaw --body "PR #<N> addresses this."
```

4. Write `.state/submitted.md`:
```
issue=<N>
pr_number=<N>
pr_url=<url>
branch=<branch>
```
