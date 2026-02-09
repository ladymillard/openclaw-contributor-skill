/respond

Input: PR=<number>
Goal: address ALL review feedback.

1) Get feedback:
```sh
gh api "repos/openclaw/openclaw/pulls/$PR/comments" | python3 -c "
import json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
for c in json.load(sys.stdin):
    print(f'[{c[\"user\"][\"login\"]}] {c[\"path\"]}:{c.get(\"line\",\"?\")}')
    print(f'  {c[\"body\"][:500]}')
"
```

2) Fix code on branch, format, lint, push.
3) Reply: `gh pr comment $PR --repo openclaw/openclaw --body '<reply>'`
4) If told to close: `gh pr close $PR --repo openclaw/openclaw --comment 'Closing — <reason>.'`
