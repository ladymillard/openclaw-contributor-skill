/checkdupe

Input
- ISSUE: <number>
  - If missing: ALWAYS ask.

DO (duplicate check only)
Goal: verify no existing PRs target this issue. This is the most important gate. We closed 38 of 40 PRs because we skipped this.

SAFETY
- This is a read-only operation. Do NOT create branches, commit, or push.

EXECUTION RULE (CRITICAL)
- EXECUTE THIS COMMAND. Run every search command.
- Do not skip any search. Each one catches different duplicates.
- Do not stop after listing the searches. Actually run them.

Completion criteria
- You ran all 4 search methods.
- You produced .state/dupecheck.md with existing_prs=<N>.
- If existing_prs > 0, you STOPPED and did not proceed.

## Step 0: Load prerequisites

```sh
cd /tmp/openclaw-fork
ISSUE=<ISSUE>

if [ ! -f .state/analysis.md ]; then
  echo "ERROR: .state/analysis.md missing. Run /analyze $ISSUE first."
  exit 1
fi

verdict=$(sed -n 's/^verdict=//p' .state/analysis.md)
if [ "$verdict" != "FIX" ]; then
  echo "ERROR: verdict is $verdict, not FIX. Cannot proceed."
  exit 1
fi

title=$(sed -n 's/^title=//p' .state/analysis.md)
echo "Checking duplicates for #$ISSUE: $title"
```

## Step 1: Search open PRs by issue number

```sh
gh search prs --repo openclaw/openclaw --state open "$ISSUE" 2>/dev/null
```

Record every PR found.

## Step 2: Search open PRs by keywords from issue title

Extract 2-3 distinctive keywords from the title and search:

```sh
gh search prs --repo openclaw/openclaw --state open "<keyword1> <keyword2>" 2>/dev/null
```

## Step 3: Check issue comments for linked PRs

Contributors and bots often link PRs in issue comments:

```sh
gh issue view $ISSUE --repo openclaw/openclaw --json comments --jq '.comments[].body' | grep -iE "pr\s*#|pull/|/pull/|fixes\s*#|fixed\s*in" || echo "No PR references in comments"
```

## Step 4: Search recently closed PRs (someone may have tried and failed)

```sh
gh search prs --repo openclaw/openclaw --state closed "$ISSUE" 2>/dev/null | head -10
```

## Step 5: Count and write results (MANDATORY)

Count unique open PRs found across all searches (deduplicate by PR number).

Write to `.state/dupecheck.md`:

```
issue=<ISSUE>
existing_prs=<count of unique open PRs>
searched_at=<ISO timestamp>

## Open PRs Found
<PR number, title, author for each, or "none">

## Closed PRs Found
<PR number, title, or "none">

## Issue Comment References
<any PR links found, or "none">
```

Verify:
```sh
ls -la .state/dupecheck.md
grep "^existing_prs=" .state/dupecheck.md
```

## Output

- If existing_prs=0: "No existing PRs for #<ISSUE>. Clear to proceed. Ready for /fix <ISSUE>"
- If existing_prs>0: "STOP. Found <N> existing open PRs for #<ISSUE>: <list with numbers and authors>. Do not create a duplicate."
