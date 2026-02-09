/checkdupe

Input
- ISSUE: <number>

Prerequisite: .state/analysis.md with verdict=FIX

DO (duplicate check only)
Goal: verify no existing PRs target this issue. HARD GATE. We closed 38 of 40 PRs because we skipped this.

SAFETY
- Read-only. No branches, no commits, no pushes.

EXECUTION RULE (CRITICAL)
- Run every search. Do not skip any.
- Do not stop after listing the searches. Run them.

Completion criteria
- All 5 search methods executed.
- .state/dupecheck.md written with existing_prs=<N>.
- If existing_prs > 0: STOPPED.

## Step 0: Verify prerequisite

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>
[ -f .state/analysis.md ] || { echo "ERROR: Run /analyze first"; exit 1; }
grep -q "^verdict=FIX" .state/analysis.md || { echo "ERROR: verdict not FIX"; exit 1; }
title=$(sed -n 's/^title=//p' .state/analysis.md)
echo "Checking duplicates for #$ISSUE: $title"
```

## Step 1: Search open PRs by issue number

```sh
gh search prs --repo openclaw/openclaw --state open "$ISSUE" --json number,author,title --jq '.[] | "#\(.number) @\(.author.login) \(.title[:60])"' 2>/dev/null
```

## Step 2: Search by keywords from issue title

```sh
gh search prs --repo openclaw/openclaw --state open "<2-3 keywords>" --json number,author,title --jq '.[] | "#\(.number) @\(.author.login) \(.title[:60])"' 2>/dev/null
```

## Step 3: Check issue comments for linked PRs

```sh
gh issue view $ISSUE --repo openclaw/openclaw --json comments --jq '.comments[].body' | grep -iE "pr\s*#|pull/|fixes\s*#" || echo "none"
```

## Step 4: Search by files we plan to change

From .state/analysis.md, get the target files:
```sh
gh search prs --repo openclaw/openclaw --state open "<filename without extension>" --json number,author,title --jq '.[] | "#\(.number) @\(.author.login) \(.title[:60])"' 2>/dev/null | head -5
```

If the same file has 10+ competing PRs (like session-tool-result-guard.ts), flag as HIGH RISK.

## Step 5: Check recently closed PRs

```sh
gh search prs --repo openclaw/openclaw --state closed "$ISSUE" --json number,author,title --jq '.[] | "#\(.number) @\(.author.login) \(.title[:60])"' 2>/dev/null | head -5
```

## Step 6: Write .state/dupecheck.md (MANDATORY)

Count unique open PRs found (exclude our own).

```
issue=<ISSUE>
existing_prs=<count>
file_competition=<low|medium|high>
searched_at=<ISO timestamp>

## Open PRs Found
<list or "none">

## File Competition
<how many other PRs touch the same files, or "low">

## Closed PRs Found
<list or "none">
```

Verify:
```sh
ls -la .state/dupecheck.md
grep "^existing_prs=" .state/dupecheck.md
```

## Output
- existing_prs=0, file_competition=low: "Clear. Ready for /fix ISSUE"
- existing_prs=0, file_competition=high: "No direct duplicates, but <N> PRs touch the same files. Proceed with caution."
- existing_prs>0: "STOP. Found <N> existing PRs: <list>. Do not duplicate."
