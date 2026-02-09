/checkdupe

Input: ISSUE=<number>
Prerequisite: .state/analysis.md with verdict=FIX
Produces: .state/dupecheck.md with existing_prs=<N>
Gate: existing_prs must be 0

EXECUTION RULE: Run every search. This gate killed 38 of our 40 PRs.

## Steps

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>
grep -q "^verdict=FIX" .state/analysis.md || { echo "ERROR: Run /analyze first"; exit 1; }
```

1) Search open PRs by issue number:
```sh
gh search prs --repo openclaw/openclaw --state open "$ISSUE"
```

2) Search by keywords from issue title:
```sh
gh search prs --repo openclaw/openclaw --state open "<keywords>"
```

3) Check issue comments for linked PRs:
```sh
gh issue view $ISSUE --repo openclaw/openclaw --json comments --jq '.comments[].body' | grep -iE "pr|pull|#[0-9]" || echo "none"
```

4) Write .state/dupecheck.md:
```
issue=<N>
existing_prs=<count>
searched_at=<timestamp>

## Found
<list or "none">
```

Output:
- 0 PRs: "Clear. Ready for /fix ISSUE"
- >0 PRs: "STOP. <N> existing PRs found."
