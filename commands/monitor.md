/monitor

Input: none (monitors all open PRs by arosstale)

DO
Goal: report status of all open PRs. Detect auto-closes, new reviews, CI failures. Flag PRs needing action.

EXECUTION RULE
- EXECUTE THIS. Run the commands.
- Do not stop after describing what to check. Actually check.

Completion criteria
- Listed all open PRs with CI status
- Checked for recently closed PRs
- Flagged PRs needing /respond
- Wrote .state/monitor.md

## Step 1: List all open PRs

```sh
echo "=== Open PRs ==="
gh pr list --repo openclaw/openclaw --author arosstale --state open --json number,title --jq '.[] | "#\(.number) \(.title)"'
```

## Step 2: Check each PR status

For each open PR:

```sh
PR=<number>
gh pr view $PR --repo openclaw/openclaw --json number,title,statusCheckRollup,reviews,comments 2>/dev/null | python3 -c "
import json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
d = json.load(sys.stdin)
n = d['number']; t = d['title'][:60]

# CI status
checks = d.get('statusCheckRollup') or []
passed = sum(1 for c in checks if c.get('conclusion') == 'SUCCESS')
failed = sum(1 for c in checks if c.get('conclusion') == 'FAILURE')
total = sum(1 for c in checks if c.get('conclusion') not in (None, 'SKIPPED'))
ci = f'{passed}/{total}'
if failed > 0:
    ci += f' ({failed} FAILED)'

# Maintainer reviews (not greptile, not us)
reviews = [r for r in (d.get('reviews') or []) if r.get('author',{}).get('login','') not in ('greptile-apps','arosstale')]
review_str = 'clean'
for r in reviews:
    review_str = f'{r[\"author\"][\"login\"]}:{r[\"state\"]}'

# Maintainer comments (not greptile, not us)
comments = [c for c in (d.get('comments') or []) if c.get('author',{}).get('login','') not in ('greptile-apps','arosstale')]

# Action needed?
action = 'none'
if any(r['state'] == 'CHANGES_REQUESTED' for r in reviews):
    action = 'RESPOND (changes requested)'
elif reviews or comments:
    action = 'RESPOND (new feedback)'

print(f'#{n} CI:{ci} Reviews:{review_str} Action:{action}')
print(f'  {t}')
"
```

## Step 3: Check recently closed PRs

```sh
echo ""
echo "=== Recently Closed ==="
gh pr list --repo openclaw/openclaw --author arosstale --state closed --limit 10 --json number,title,closedAt,mergedAt --jq '.[] | "#\(.number) \(if .mergedAt then "MERGED" else "CLOSED" end) \(.closedAt[:10]) \(.title)"'
```

Flag any CLOSED (not merged) since last monitor.

## Step 4: Write monitor state (MANDATORY)

Write to `.state/monitor.md`:

```
checked_at=<ISO timestamp>
open_count=<N>
needs_action=<comma-separated PR numbers, or "none">

## Open PRs
| PR | CI | Reviews | Action |
|---|---|---|---|
| #<N> <title> | <pass/total> | <status> | <none/respond> |

## Recently Closed
| PR | Status | Date | Title |
|---|---|---|---|
| #<N> | MERGED/CLOSED | <date> | <title> |
```

## Output

Print the tables. Then:
- If any PR needs action: "PRs needing attention: #X, #Y. Use /respond <PR>"
- If any auto-closed: "Auto-closed: #X. Consider Discord escalation (6h slowmode, 1 post)"
- If all clean: "All <N> PRs healthy. No action needed."
