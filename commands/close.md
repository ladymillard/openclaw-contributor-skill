/close

Input
- PR: <number>
  - If missing: ALWAYS ask.
- REASON: <duplicate|broken|per-maintainer|superseded>

DO
Goal: close a PR honestly with a clear, respectful reason.

EXECUTION RULE
- EXECUTE THIS. Close the PR.
- Do not just describe what to do.

## Step 1: Build close comment

Based on reason:
- duplicate: "Closing, this duplicates #<other_PR> which was submitted first. Sorry for the noise."
- broken: "Closing, this has quality issues I cannot fix cleanly: <brief detail>."
- per-maintainer: "Closing per <maintainer>'s feedback: <what they said>. Thanks for the review."
- superseded: "Closing, superseded by <what replaced it>."

## Step 2: Close

```sh
gh pr close <PR> --repo openclaw/openclaw --comment '<close comment from step 1>'
```

## Step 3: Verify

```sh
gh pr view <PR> --repo openclaw/openclaw --json state --jq .state
```

Must show CLOSED.

## Step 4: Write state (MANDATORY)

Write to `.state/closed.md`:

```
pr=<PR>
reason=<reason>
closed_at=<ISO timestamp>
comment=<what we said>
```

## Output

"PR #<PR> closed: <reason>"
