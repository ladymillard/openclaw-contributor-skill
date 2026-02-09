/checkdupe <issue>

ISSUE must be provided. Prerequisite: `.state/analysis.md` with `verdict=FIX`.

1. Verify:
```sh
cd /tmp/openclaw-fork
grep -q "^verdict=FIX" .state/analysis.md || { echo "ERROR: Run /analyze first"; exit 1; }
```

2. Search by issue number:
```sh
gh search prs --repo openclaw/openclaw --state open "<ISSUE>" --json number,author,title --jq '.[] | "#\(.number) @\(.author.login) \(.title[:60])"'
```

3. Search by keywords:
```sh
gh search prs --repo openclaw/openclaw --state open "<keywords>" --json number,author,title --jq '.[] | "#\(.number) @\(.author.login) \(.title[:60])"'
```

4. Check issue comments:
```sh
gh issue view <ISSUE> --repo openclaw/openclaw --json comments --jq '.comments[].body' | grep -iE "pr|pull|fixes" || echo "none"
```

5. Write `.state/dupecheck.md`:
```
issue=<N>
existing_prs=<count excluding our own>
searched_at=<timestamp>
```

6. STOP if existing_prs > 0. Do not proceed.
