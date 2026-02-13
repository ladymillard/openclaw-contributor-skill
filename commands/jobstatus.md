/jobstatus

Check GitHub Actions workflow runs and job status for openclaw/openclaw repository.

```sh
cd /tmp/openclaw-fork

# List recent workflow runs with their status
gh run list --repo openclaw/openclaw --limit 20 --json databaseId,displayTitle,event,status,conclusion,createdAt,updatedAt,workflowName --jq '.[] | "#\(.databaseId) [\(.status)] \(.conclusion // "running") - \(.workflowName) - \(.displayTitle[:50])"'
```

Check specific workflow run details:
```sh
# Replace <RUN_ID> with the run ID from above
gh run view <RUN_ID> --repo openclaw/openclaw --json jobs --jq '.jobs[] | "Job: \(.name) | Status: \(.status) | Conclusion: \(.conclusion // "in progress")"'
```

Check workflow run logs:
```sh
# View logs for a specific run
gh run view <RUN_ID> --repo openclaw/openclaw --log
```

Check failed jobs:
```sh
# List failed jobs in recent runs
gh run list --repo openclaw/openclaw --limit 10 --json databaseId,jobs --jq '.[] | select(.jobs != null) | .jobs[] | select(.conclusion == "failure") | "Run #\(.databaseId) - Job: \(.name) - \(.conclusion)"'
```

## Usage

To check if CI is passing for current work:
1. Run the list command to see recent workflow runs
2. Check your branch's latest run status
3. If failed, use view command to see which job failed
4. Use log command to investigate failure details

## Status Values

- **status**: queued, in_progress, completed
- **conclusion**: success, failure, cancelled, skipped, timed_out, action_required, neutral

## Integration

This command complements `/monitor` by providing deeper visibility into GitHub Actions workflow execution details beyond PR check status.
