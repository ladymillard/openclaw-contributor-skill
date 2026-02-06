# Submit PR Command

## Task
Create the PR on GitHub. Make it professional. Get it submitted.

## Pre-Submit Checklist
- [ ] Fix implementation completed
- [ ] All tests passing locally
- [ ] Branch pushed to fork
- [ ] Professional commit message ready

## Steps

1. **Gather PR Information**
   - Issue number: from the analysis
   - Branch name: from the fix
   - Commit SHA: from local HEAD
   - Root cause: from analysis
   - Testing notes: from fix output

2. **Create Professional PR Title**
   Pattern: `fix: Brief description (fixes #NUMBER)`
   Example: `fix: TwiML parameter injection via unescaped locale string (fixes #10238)`

3. **Write Professional Description**
   ```markdown
   Fixes #ISSUE_NUMBER

   ## Problem
   [Symptom that user experiences]

   ## Root Cause
   [Technical root cause with file:line references]

   ## Solution
   [What was changed and why]

   ## Testing
   - ✅ Local build passes
   - ✅ All tests pass
   - ✅ 3 test cases added
   - ✅ Defensive patterns implemented

   ## Impact
   [User-facing or internal impact]
   ```

4. **Create PR via GitHub CLI**
   ```bash
   gh pr create \
     --repo openclaw/openclaw \
     --title "fix: Description (fixes #NUMBER)" \
     --head arosstale:fix/ISSUE_NUMBER-description \
     --base main \
     --body "[Full description from step 3]"
   ```

5. **Verify Submission**
   - Confirm PR created on GitHub
   - Verify branch set correctly
   - Verify description formatted correctly
   - Verify issue reference included
   - Get PR number from GitHub

6. **Report Success**
   ```
   ✅ PR created: #NEW_NUMBER
   ✅ Title: fix: Description (fixes #ISSUE_NUMBER)
   ✅ Branch: arosstale:fix/ISSUE_NUMBER-description
   ✅ Base: main
   ✅ Description: Professional + tests included
   
   PR URL: https://github.com/openclaw/openclaw/pull/NEW_NUMBER
   
   Status: SUBMITTED ✅
   Next: Monitor for maintainer feedback
   ```

## Quality Checklist
- [ ] Title follows `fix: Description` pattern
- [ ] Description references original issue
- [ ] Testing section included
- [ ] Root cause explained
- [ ] PR created to openclaw/openclaw main
- [ ] Branch from fork (arosstale/*)
- [ ] No force-push or direct main commits

## Safety Rules
- PR target MUST be openclaw/openclaw main
- Branch MUST come from arosstale fork
- Description MUST be professional
- Issue reference MUST be included
- Never manually push to main

## Success Criteria
- PR created on GitHub
- Title and description professional
- Branch correctly set
- Issue referenced
- Link provided to user
- Ready for maintainer review
