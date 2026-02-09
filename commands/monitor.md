/monitor

Check all open PRs for CI, reviews, auto-closes.

```sh
cd /tmp/openclaw-fork
for pr in $(gh pr list --repo openclaw/openclaw --author arosstale --state open --json number -q '.[].number' | sort -n); do
  gh pr view $pr --repo openclaw/openclaw --json number,title,statusCheckRollup,reviews,comments 2>/dev/null | python3 -c "
import json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
d = json.load(sys.stdin)
n = d['number']; t = d['title'][:55]
checks = d.get('statusCheckRollup') or []
passed = sum(1 for c in checks if c.get('conclusion') == 'SUCCESS')
total = len([c for c in checks if c.get('conclusion') not in (None, 'SKIPPED')])
reviews = [r for r in (d.get('reviews') or []) if r.get('author',{}).get('login','') not in ('greptile-apps','arosstale')]
comments = [c for c in (d.get('comments') or []) if c.get('author',{}).get('login','') not in ('greptile-apps','arosstale')]
action = 'RESPOND' if (reviews or comments) else 'wait'
print(f'#{n} CI:{passed}/{total} {action} {t}')
"
done
```

Check recently closed:
```sh
gh pr list --repo openclaw/openclaw --author arosstale --state closed --limit 5 --json number,title,mergedAt --jq '.[] | "#\(.number) \(if .mergedAt then "MERGED" else "CLOSED" end) \(.title[:50])"'
```

If feedback found: use /respond. If auto-closed: consider Discord escalation (6h slowmode).
