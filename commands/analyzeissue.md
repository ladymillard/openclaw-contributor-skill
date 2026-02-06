# Analyze Issue Command

## Task
Analyze the GitHub issue provided. Do NOT fix yet. Just analyze and propose.

## Steps

1. **Fetch Issue Details**
   ```bash
   gh issue view $ISSUE_NUMBER --repo openclaw/openclaw --json number,title,body,labels,createdAt
   ```

2. **Understand the Problem**
   - Read the issue description carefully
   - Note the reproduction steps (if provided)
   - Identify user-reported symptoms
   - Check for related issues or PRs mentioned

3. **Deep Code Analysis**
   - Examine the relevant source files
   - Trace the code path from symptom to root cause
   - Identify where the bug manifests
   - Document the root cause with file paths and line numbers

4. **Propose Solution**
   - Explain the root cause in detail
   - Propose a fix approach
   - Identify files that need changes
   - Estimate difficulty (15 min / 25 min / 45 min / 60+ min)

5. **Quality Check**
   - Can this be fixed defensively? (no band-aids)
   - Will this need 3+ test cases? (yes/no)
   - Does it require config changes? (yes/no)
   - Is it in a critical path? (security/stability/user-facing)

6. **Report Findings**
   ```
   Issue #NUMBER: [Title]
   
   Symptoms: [User reports X, Y, Z]
   
   Root Cause: [File.ts line 123: description]
   
   Solution: [Approach]
   
   Files to modify: [list]
   
   Difficulty: 25 min
   
   Test coverage needed: 3 cases minimum
   
   Risk level: LOW (config change only) / MEDIUM (logic change) / HIGH (critical path)
   
   Ready to fix? YES / NEEDS MORE ANALYSIS / SKIP
   ```

## Safety Rules
- Do NOT make any code changes
- Do NOT commit anything
- Do NOT push anything
- Just analyze and report

## Success Criteria
- Root cause clearly identified
- Solution approach explained
- Files to modify listed
- Test coverage estimated
- Report provided to user
