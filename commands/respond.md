/respond <pr>

PR must be provided. Read all feedback, fix code issues, reply.

1. Get feedback:
```sh
cd /tmp/openclaw-fork
PR=<PR>
gh api "repos/openclaw/openclaw/pulls/$PR/comments" | python3 -c "
import json, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
for c in json.load(sys.stdin):
    if c['user']['login'] == 'arosstale': continue
    print(f'[{c[\"user\"][\"login\"]}] {c.get(\"path\",\"?\")}:{c.get(\"line\",\"?\")}')
    print(f'  {c[\"body\"][:500]}')
"
gh pr view $PR --repo openclaw/openclaw --json reviews --jq '.reviews[] | select(.author.login != "arosstale" and .author.login != "greptile-apps") | "\(.author.login) [\(.state)]: \(.body[:300])"'
```

2. Fix code on branch, format, lint, push.
3. Reply: `gh pr comment $PR --repo openclaw/openclaw --body '<reply>'`
4. If told to close: `gh pr close $PR --repo openclaw/openclaw --comment 'Closing per feedback. Thanks.'`
