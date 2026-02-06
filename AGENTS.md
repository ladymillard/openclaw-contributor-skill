# Development Rules for Subagents

This document defines how subagents operate within the openclaw-contributor-skill.

## Subagent Roles

### Analysis Subagent (Opus)
**Task**: Deep issue analysis and root cause identification

**Required**:
- Read GitHub issue completely (title, body, all comments)
- Fetch issue details via GitHub API if needed
- Trace code path through repository
- Identify root cause with file:line references
- Propose defensive solution
- Estimate difficulty (15/25/45/60+ minutes)
- List files to modify

**Output Format**:
```
Issue #NUMBER: [Title]

Symptoms: [What user reports]

Root Cause: [Technical explanation with file:line references]

Solution: [What will be changed and why]

Files to modify:
  - file1.ts (line X: change Y)
  - file2.ts (line Y: change Z)

Difficulty: 25 min (implementation) + 15 min (testing) = 40 min total

Test coverage needed: 3 cases minimum
  - Case 1: [description]
  - Case 2: [description]
  - Case 3: [description]

Risk level: LOW / MEDIUM / HIGH

Ready to fix? YES / NEEDS MORE ANALYSIS / SKIP
```

**Safety Rules**:
- Do NOT make code changes
- Do NOT commit anything
- Do NOT push anything
- Just analyze and report

### Fix Subagent (GPT + Thinking)
**Task**: Implement fix, write tests, verify locally

**Required**:
1. Create branch: `git checkout -b fix/NUMBER-description main`
2. Implement fix based on analysis
3. Write 3+ test cases covering edge cases
4. Run local `npm run build` (must pass)
5. Run local `npm test` (must pass 100%)
6. Create professional commit message
7. Push to branch and verify SHA match

**Commit Message Format**:
```
fix: Brief description (fixes #NUMBER)

## Problem
[User-facing symptom from analysis]

## Root Cause
[Technical explanation with file:line references]

## Solution
[What was changed and why]

## Testing
- ✅ Local build passes
- ✅ All tests pass
- ✅ 3 test cases added
- ✅ Defensive patterns implemented

Fixes #NUMBER
```

**Output Format**:
```
✅ Branch: fix/NUMBER-description
✅ Local build: PASS (no errors, warnings, infos)
✅ Tests: PASS (15 passing)
✅ Commits: 1
✅ Push verified: SHA matches local and remote

Files modified:
  - file1.ts
  - file1.test.ts

Ready to submit? YES / NEEDS CHANGES / ABANDON
```

**Quality Gates** (ALL must pass):
- [ ] Local `npm run build` passes (no errors/warnings/infos)
- [ ] Local `npm test` passes (100% pass rate)
- [ ] 3+ test cases written
- [ ] Defensive patterns used (null checks, edge cases)
- [ ] No band-aids or workarounds
- [ ] Professional commit message
- [ ] Branch pushed to fork
- [ ] Push SHA verified (git rev-parse HEAD == git rev-parse origin/fix/NUMBER-description)

**Safety Rules**:
- NEVER force-push to main
- NEVER push to main directly
- NEVER commit without tests passing locally
- Only push to fix/* branches
- Verify push landed (SHA match)

### Submit Subagent (GPT + Thinking)
**Task**: Create professional PR and submit to GitHub

**Required**:
1. Gather fix information (branch, commit, test count)
2. Create professional PR title
3. Write comprehensive description with evidence
4. Create PR via `gh pr create`
5. Verify PR created on GitHub
6. Return PR link

**PR Title Format**:
```
fix: Brief description (fixes #NUMBER)
```

**PR Description Format**:
```
Fixes #NUMBER

## Problem
[User-facing symptom]

## Root Cause
[Technical explanation with file:line references]

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

**Output Format**:
```
✅ PR created: #NEW_NUMBER
✅ Title: fix: Description (fixes #NUMBER)
✅ Branch: arosstale:fix/NUMBER-description
✅ Base: main
✅ Description: Professional + tests included

PR URL: https://github.com/openclaw/openclaw/pull/NEW_NUMBER
Status: SUBMITTED ✅
Next: Monitor for maintainer feedback
```

**Quality Checklist**:
- [ ] Title follows `fix: Description` pattern
- [ ] Description references original issue
- [ ] Testing section included with evidence
- [ ] Root cause explained with code references
- [ ] PR created to openclaw/openclaw main
- [ ] Branch from fork (arosstale/*)
- [ ] Description is professional (no typos, clear language)

**Safety Rules**:
- PR target MUST be openclaw/openclaw main
- Branch MUST come from arosstale fork
- Description MUST be professional
- Issue reference MUST be included
- Never manually push to main

## General Rules for All Subagents

### Code Quality
- Understand the code you're analyzing or modifying
- Ask questions if something is unclear
- Use defensive patterns (null checks, edge cases)
- Follow existing code style in the repository
- No `any` types (use proper typing)

### Testing
- Minimum 3 test cases per fix
- Test normal case, edge cases, error cases
- Run tests locally before reporting
- 100% pass rate required
- Clear test descriptions

### Communication
- Professional tone in commits and PRs
- Clear, technical language
- No fluff or filler text
- Be direct but kind
- Reference code locations (file:line)

### Git Discipline
- Single commit per fix
- Professional commit messages
- Only push to fix/* branches
- Verify push landed (SHA match)
- Never force-push or reset

### Documentation
- Update relevant README/docs if needed
- Add test cases with clear descriptions
- Include examples if applicable
- Link to related issues

## Model Preferences

Preferred models (fall back to session default if unavailable):
- Analysis: `model:opus` (best for code understanding)
- Fix: `model:gpt` with `thinking:high` (methodical implementation)
- Submit: `model:gpt` with `thinking:high` (careful PR creation)

## Commands You Can Run

**Analysis subagent**:
```bash
gh issue view #NUMBER --json number,title,body,comments,labels
```

**Fix subagent**:
```bash
git checkout -b fix/NUMBER-description main
npm run build
npm test
git status
git add [specific files]
git commit -m "message"
git push -u origin fix/NUMBER-description
git rev-parse HEAD
git rev-parse origin/fix/NUMBER-description
```

**Submit subagent**:
```bash
gh pr create --repo openclaw/openclaw --title "..." --head arosstale:fix/... --base main --body "..."
```

## Commands You Must NEVER Run

- `npm run dev` - local dev server
- `npm run build && npm test` - batched (run separately)
- `npm run release` - versioning
- `git reset --hard` - destroys changes
- `git checkout .` - destroys changes
- `git clean -fd` - deletes files
- `git stash` - stashes other changes
- `git add -A` - stages everything
- `git commit --no-verify` - bypasses checks
- `git push -f` - force-push

## Error Handling

**If local build fails**:
- Report error message
- Do NOT force-commit
- Ask user for guidance or try to fix
- Verify fix passes tests

**If tests fail**:
- Report which tests failed
- Do NOT submit
- Suggest debugging steps
- Iterate until 100% pass

**If PR creation fails**:
- Report error message
- Suggest manual creation via web UI
- Do NOT retry in loop

**If push verification fails**:
- Report SHA mismatch
- Do NOT force-push
- Ask user to investigate

## Success Criteria

### Analysis Phase
✅ Root cause clearly identified
✅ Solution approach explained
✅ Files to modify listed
✅ Test coverage estimated
✅ Report provided to user

### Fix Phase
✅ All quality gates pass
✅ Tests pass locally (100%)
✅ Branch pushed to fork
✅ Status report provided
✅ Ready for submission

### Submit Phase
✅ PR created on GitHub
✅ Title and description professional
✅ Branch correctly set
✅ Issue referenced
✅ Link provided to user

## Inspiration

These rules are inspired by:
- Mario Zechner's shipping philosophy
- Tyler's maintainer-skill workflow
- OpenClaw's quality standards
- Real contributor experience

**Core principle**: Quality gates enable speed. By enforcing tests, builds, and professional communication, we enable sustainable, compound growth.
