# Create Fix Command

## Task
Implement the fix for the issue analyzed. Write tests. Verify locally. Push to branch.

## Pre-Fix Checklist
- [ ] Issue analysis completed
- [ ] Root cause identified
- [ ] Solution approach approved
- [ ] Working on fresh branch

## Steps

1. **Create Branch**
   ```bash
   git checkout -b fix/ISSUE_NUMBER-description main
   ```

2. **Implement Fix**
   - Make changes to identified files
   - Follow defensive programming patterns
   - Add comments for non-obvious logic
   - Keep changes focused (single responsibility)

3. **Write Tests**
   - Minimum 3 test cases required
   - Test the fix directly
   - Test edge cases
   - Test defensive patterns
   - Follow existing test patterns in repo

4. **Local Verification**
   ```bash
   npm run build    # Must pass
   npm test         # All tests must pass
   ```
   - If build fails: fix and retest
   - If tests fail: review test logic or fix
   - Do NOT proceed to submission if either fails

5. **Professional Commit**
   ```bash
   git add [changed files]
   git commit -m "fix: Brief description (#ISSUE_NUMBER)

   ## Problem
   [User-facing symptom]

   ## Root Cause
   [Technical explanation with file:line references]

   ## Solution
   [What was changed and why]

   ## Testing
   - ✅ Local build passes
   - ✅ All tests pass
   - ✅ 3+ test cases added

   Fixes #ISSUE_NUMBER"
   ```

6. **Push to Fork**
   ```bash
   git push -u origin fix/ISSUE_NUMBER-description
   
   # Verify push succeeded
   git rev-parse HEAD  # Local SHA
   git rev-parse origin/fix/ISSUE_NUMBER-description  # Remote SHA
   # Must match
   ```

7. **Report Status**
   ```
   ✅ Branch: fix/ISSUE_NUMBER-description
   ✅ Local build: PASS
   ✅ Tests: PASS (15 passing)
   ✅ Commits: 1
   ✅ Pushed to GitHub
   
   Ready to submit? YES / NEEDS CHANGES
   ```

## Quality Gates (MUST PASS)
- [ ] Local `npm run build` passes
- [ ] Local `npm test` passes (100% pass rate)
- [ ] 3+ test cases written
- [ ] Defensive patterns used
- [ ] No band-aids or workarounds
- [ ] Professional commit message
- [ ] Branch pushed to origin

## Safety Rules
- NEVER force push to main
- NEVER push to main directly
- NEVER commit without tests passing locally
- Only push to fix/* branches
- Verify push landed on GitHub (SHA match)

## Success Criteria
- All quality gates pass
- Tests pass locally
- Branch pushed to fork
- Status report provided
- Ready for PR submission
