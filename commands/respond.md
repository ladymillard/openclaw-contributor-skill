/respond

Input
- PR: <number>
  - If missing: ALWAYS ask.

DO
Goal: address ALL review feedback on a PR. Read every comment. Fix code issues. Reply to questions.

SAFETY
- Only push to the PR's feature branch on fork, never to main.
- Stage specific files only, never `git add -A`.

EXECUTION RULE (CRITICAL)
- EXECUTE THIS. Read every comment, fix or reply to each one.
- Do not summarize the feedback and stop. Actually address it.

Completion criteria
- Read all inline review comments
- Read all PR-level comments
- Read all review states (approved, changes requested)
- Fixed all code issues
- Replied to all questions
- Pushed fixes (if any code changes)
- Wrote .state/responded.md

## Step 1: Get all feedback

```sh
cd /tmp/openclaw-fork
PR=<PR>

echo "=== Inline Review Comments ==="
gh api "repos/openclaw/openclaw/pulls/$PR/comments" 2>/dev/null | python3 -c "
import json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
comments = json.load(sys.stdin)
for c in comments:
    user = c['user']['login']
    if user in ('arosstale',): continue
    path = c.get('path', '?')
    line = c.get('line', '?')
    body = c['body'][:500]
    print(f'[{user}] {path}:{line}')
    print(f'  {body}')
    print()
if not comments:
    print('  (none)')
"

echo "=== PR Reviews ==="
gh pr view $PR --repo openclaw/openclaw --json reviews --jq '.reviews[] | select(.author.login != "arosstale") | "\(.author.login) [\(.state)]: \(.body[:300])"'

echo ""
echo "=== PR Comments ==="
gh pr view $PR --repo openclaw/openclaw --json comments --jq '.comments[] | select(.author.login != "arosstale" and .author.login != "greptile-apps") | "\(.author.login): \(.body[:300])"'
```

## Step 2: Categorize each piece of feedback

For each comment/review:
- Code fix request -> fix the code
- Question -> reply with answer
- Style/approach concern -> evaluate honestly, fix or explain why not
- "This is a duplicate of #X" -> verify, close if true (use /close)
- "This is not needed" / "wontfix" -> close respectfully (use /close)
- APPROVED -> no action needed

## Step 3: Fix code issues (if any)

```sh
branch=$(gh pr view $PR --repo openclaw/openclaw --json headRefName --jq .headRefName)
git checkout "$branch"
git pull fork "$branch"
```

Make fixes. Then:

```sh
npx oxfmt --write <changed-files>
pnpm lint 2>&1 | tail -10

git add <specific-files-only>
git commit -m 'address review feedback: <what was fixed>'
git push fork "$branch"

# Verify
local_sha=$(git rev-parse HEAD)
remote_sha=$(git ls-remote fork "refs/heads/$branch" | awk '{print $1}')
echo "local=$local_sha remote=$remote_sha"
```

## Step 4: Reply to comments

```sh
gh pr comment $PR --repo openclaw/openclaw --body '<concise reply explaining what was fixed or answering the question>'
```

Keep replies short and direct. Acknowledge the feedback, explain what you changed.

## Step 5: Handle close requests

If a maintainer says "duplicate", "close", "not needed":
1. Verify their claim
2. If correct: use /close <PR>
3. If you disagree (rare): explain briefly and respectfully, then defer to maintainer

## Step 6: Write responded state (MANDATORY)

Write to `.state/responded.md`:

```
pr=<PR>
responded_at=<ISO timestamp>
all_addressed=yes
code_fixes=<N>
replies=<N>

## Actions Taken
- [<reviewer>] <file>:<line> <what they said> -> <what we did>
- [<reviewer>] <comment> -> <our reply>
```

Verify:
```sh
ls -la .state/responded.md
grep "^all_addressed=" .state/responded.md
```

## Output

"All feedback on PR #<PR> addressed. <N> code fixes pushed, <N> replies posted."
