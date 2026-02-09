/monitor

Input: none
Produces: .state/monitor.md

Check all open PRs by arosstale for CI status, reviews, auto-closes.

```sh
for pr in $(gh pr list --repo openclaw/openclaw --author arosstale --state open --json number -q '.[].number'); do
  gh pr view $pr --repo openclaw/openclaw --json number,title,state,statusCheckRollup,reviews,comments 2>/dev/null | python3 -c "
import json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
d = json.load(sys.stdin)
n = d['number']; t = d['title'][:50]
checks = d.get('statusCheckRollup', [])
green = sum(1 for c in checks if c.get('conclusion') == 'SUCCESS')
total = sum(1 for c in checks if c.get('conclusion') not in (None, 'SKIPPED'))
reviews = [r for r in d.get('reviews', []) if r['author']['login'] not in ('greptile-apps','arosstale')]
comments = [c for c in d.get('comments', []) if c['author']['login'] not in ('greptile-apps','arosstale')]
action = 'respond' if (reviews or comments) else 'none'
print(f'#{n} {green}/{total} {action} {t}')
"
done
```

Flag PRs needing /respond or escalation.
