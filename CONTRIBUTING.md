# Contributing to openclaw-contributor-skill

This skill automates the issue analysis → fix → testing → PR submission workflow for OpenClaw contributors. We use this skill to ship production-ready fixes sustainably.

## The One Rule

**You must understand the issue before fixing.** The skill enforces this by requiring:
1. Deep issue analysis (subagent analyzes root cause)
2. Comprehensive tests (3+ test cases minimum)
3. Local verification (build + tests must pass)
4. Professional communication (clear commits + thorough PRs)

Using this skill is fine. What's not fine is bypassing the quality gates or submitting fixes without understanding the root cause.

## Getting Started

### Prerequisites
- GitHub CLI (`gh`) authenticated
- Git configured
- OpenClaw fork cloned locally
- Local build passes (`npm run build`)
- Local tests pass (`npm test`)

### First-Time Contributors

1. **Read the documentation**
   - README.md (skill overview)
   - SKILL.md (workflow definitions)
   - AGENTS.md (agent instructions)

2. **Test the skill locally**
   ```bash
   ./setup.sh  # Verify prerequisites
   ```

3. **Run the analysis workflow**
   ```
   /analyzeissue #10238
   ```
   This spawns a subagent that digs into the issue and returns findings.

4. **Wait for maintainer feedback**
   Before submitting fixes, ensure you understand the root cause and proposed solution.

## Before Using the Skill

### Prerequisites Check
```bash
# Must pass
npm run build
npm test

# GitHub CLI auth required
gh auth status
```

### Issue Understanding
- Read the GitHub issue completely
- Understand the user's symptoms
- Trace the code path mentally
- Identify suspected root cause
- Write down your hypothesis

## Workflow

### Step 1: Analyze (`/analyzeissue #NUMBER`)
- Subagent (opus) digs into issue
- Identifies root cause with file:line references
- Proposes solution approach
- Estimates difficulty

Expected output:
```
Issue #NUMBER: [Title]
Symptoms: [What user reports]
Root Cause: [File.ts line 123: explanation]
Solution: [Approach]
Files to modify: [list]
Difficulty: 25 min
Test coverage: 3 cases minimum
Ready to fix? YES / NO
```

### Step 2: Fix (`/createfix`)
Only after you approve the analysis:
- Subagent (gpt + thinking) implements fix
- Writes 3+ test cases
- Runs local `npm run build`
- Runs local `npm test`
- Creates professional commit message
- Pushes to fix/* branch

Expected output:
```
✅ Branch: fix/NUMBER-description
✅ Local build: PASS
✅ Tests: PASS
✅ Commits: 1
✅ Pushed to GitHub
Ready to submit? YES / NO
```

### Step 3: Submit (`/submitpr`)
Only after fix subagent confirms:
- Subagent (gpt + thinking) creates PR
- Uses professional title: `fix: Description (fixes #NUMBER)`
- Includes test evidence in description
- Submits via GitHub CLI
- Returns PR link

Expected output:
```
✅ PR created: #NEW_NUMBER
✅ Title: fix: Description (fixes #NUMBER)
✅ Branch: arosstale:fix/NUMBER-description
✅ Description: Professional + tests included
PR URL: https://github.com/openclaw/openclaw/pull/NEW_NUMBER
Status: SUBMITTED ✅
```

## Quality Gates

All three steps enforce these gates:

### Analysis Phase
- ✅ Root cause identified with code references
- ✅ Solution approach documented
- ✅ Files to modify listed
- ✅ Difficulty estimated
- ✅ Risk assessment completed

### Fix Phase
- ✅ Local `npm run build` passes (no errors, warnings, infos)
- ✅ Local `npm test` passes (100% pass rate)
- ✅ 3+ test cases written
- ✅ Defensive patterns used
- ✅ Professional commit message
- ✅ Branch pushed to fork (verified SHA match)

### Submit Phase
- ✅ Professional PR title following pattern
- ✅ Comprehensive description with testing evidence
- ✅ Issue referenced in description
- ✅ PR created to openclaw/openclaw main
- ✅ Branch from fork (arosstale/*)

## Philosophy

This skill is built on proven principles:

✅ **Deep Understanding First** - Analyze before coding
✅ **Quality Gates** - Build passes, tests pass, no exceptions
✅ **Comprehensive Testing** - 3+ test cases covering edge cases
✅ **Professional Communication** - Clear commits, thorough PRs
✅ **Sustainable Pace** - 25 minutes per fix target (no burnout)
✅ **Feedback Iteration** - Respond to maintainer reviews same-day

## Safety Rules

- NEVER skip quality gates
- NEVER force-push to main
- NEVER commit without tests passing locally
- NEVER submit without local build passing
- NEVER submit without understanding the root cause
- All fixes pushed to fix/* branches only
- Code reaches main only via PR merge

## Expected Timeline

- **Week 1**: 5-8 PRs merge (credibility established)
- **Week 2**: 10-13 cumulative merged (momentum builds)
- **Week 3**: 20-25 cumulative merged (core contributor)
- **Week 4**: 35-50+ cumulative merged (core team track)

## Questions?

1. Read SKILL.md for workflow details
2. Check AGENTS.md for agent instructions
3. Review command files in `commands/` for step-by-step workflows
4. Open an issue in this repo if stuck

## Inspiration

This skill is inspired by:
- Mario Zechner's shipping philosophy (deep understanding > volume)
- Tyler's maintainer-skill (subagent workflows, quality gates)
- OpenClaw's quality culture (professional standards)
- Real contributor experience (sustainable pace)
