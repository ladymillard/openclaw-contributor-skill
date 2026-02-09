/monitor

Input: none

Goal: check all open PRs for CI status, reviews, auto-closes. Flag engagement opportunities.

EXECUTION RULE
- Run the commands. Do not just describe what to check.

## Step 1: List and check each open PR

```sh
cd /tmp/openclaw-fork
echo "=== Open PRs ==="
for pr in $(gh pr list --repo openclaw/openclaw --author arosstale --state open --json number -q '.[].number' 2>/dev/null | sort -n); do
  gh pr view $pr --repo openclaw/openclaw --json number,title,statusCheckRollup,reviews,comments 2>/dev/null | python3 -c "
import json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
d = json.load(sys.stdin)
n = d['number']; t = d['title'][:55]
checks = d.get('statusCheckRollup') or []
passed = sum(1 for c in checks if c.get('conclusion') == 'SUCCESS')
failed = sum(1 for c in checks if c.get('conclusion') == 'FAILURE')
total = len([c for c in checks if c.get('conclusion') not in (None, 'SKIPPED')])
reviews = [r for r in (d.get('reviews') or []) if r.get('author',{}).get('login','') not in ('greptile-apps','arosstale')]
comments = [c for c in (d.get('comments') or []) if c.get('author',{}).get('login','') not in ('greptile-apps','arosstale')]
action = 'wait'
if any(r['state'] == 'CHANGES_REQUESTED' for r in reviews): action = 'RESPOND'
elif any(r['state'] == 'APPROVED' for r in reviews): action = 'APPROVED'
elif reviews or comments: action = 'RESPOND'
ci = f'{passed}/{total}' + (f' ({failed}F)' if failed else '')
print(f'#{n} CI:{ci:>10} Action:{action:>10} {t}')
"
done
```

## Step 2: Check recently closed/merged

```sh
echo ""
echo "=== Recently Closed ==="
gh pr list --repo openclaw/openclaw --author arosstale --state closed --limit 10 --json number,title,closedAt,mergedAt --jq '.[] | "#\(.number) \(if .mergedAt then "MERGED" else "CLOSED" end) \(.closedAt[:10]) \(.title[:55])"' 2>/dev/null
```

## Step 3: Check repo merge activity (who/what is getting merged)

```sh
echo ""
echo "=== Recent Merges (learn what gets through) ==="
gh api 'repos/openclaw/openclaw/pulls?state=closed&per_page=10&sort=updated&direction=desc' --jq '.[] | select(.merged_at != null) | "#\(.number) @\(.user.login) \(.title[:50])"' 2>/dev/null
```

## Step 4: Write .state/monitor.md

```
checked_at=<ISO timestamp>
open_count=<N>
needs_action=<PR numbers or "none">
recently_merged_by_others=<count in last 24h>
```

## Output
- PRs needing response: "Use /respond <PR>"
- Auto-closed: "Consider Discord escalation"
- All clean: "All <N> PRs healthy. No action needed."
- If others are getting merged but not us: note the pattern
