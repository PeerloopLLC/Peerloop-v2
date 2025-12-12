---
description: Start session with context refresh
version: 2.1.3
---

# Start Session

**Purpose:** Initialize a new work session with full context refresh.

---

## MANDATORY PRE-FLIGHT CHECKLIST

**STOP. Before proceeding, confirm:**

- [ ] 1. I will execute ALL 5 steps in order
- [ ] 2. I will NOT skip reading session notes
- [ ] 3. I will report findings to user before asking what to work on

---

## Step 1: Read Project Context

**EXECUTE:**

```bash
cat CLAUDE.md 2>/dev/null || echo "No CLAUDE.md found"
```

- [ ] Read CLAUDE.md completely
- [ ] Note key policies (especially git push policy)
- [ ] Note team members if listed
- [ ] Note project status

**If CLAUDE.md not found:** Note this - it's okay to continue, but suggest running `/q-setup`.

---

## Step 2: MANDATORY - Find and Read Last Session Notes

### 2.1 List Session Notes

```bash
ls -la .q-system/session-notes/ 2>/dev/null | tail -5 || echo "No session notes found"
```

- [ ] Command executed
- [ ] Identified most recent file

### 2.2 Read Last Session Notes

**If session notes exist:**

```bash
# Read the most recent session notes file
cat .q-system/session-notes/[MOST_RECENT_FILE]
```

- [ ] File read completely
- [ ] Noted key accomplishments
- [ ] Noted pending "Next Actions"
- [ ] Noted any blockers or issues

**VERIFICATION GATE 1:**
```
Last session notes: [filename or "none found"]
Key items from last session:
- Accomplishments: [list or "N/A"]
- Pending actions: [list or "N/A"]
```

**If no session notes exist:** This is the first session - note this for the summary.

---

## Step 3: Check Current Repository Status

### 3.1 Git Status

```bash
git status
```

- [ ] Command executed
- [ ] Noted if working tree is clean or dirty
- [ ] Noted any uncommitted changes

### 3.2 Check GitHub Remote Status (IMPORTANT)

**Fetch latest info from remote (does NOT download code):**

```bash
git fetch origin 2>/dev/null
git status -sb
```

- [ ] Command executed
- [ ] Check if branch is ahead/behind remote
- [ ] Note any divergence warnings

**Interpret the output:**
- `## main...origin/main` = In sync ✅
- `## main...origin/main [ahead 3]` = You have 3 local commits not pushed
- `## main...origin/main [behind 5]` = GitHub has 5 commits you don't have
- `## main...origin/main [ahead 3, behind 5]` = ⚠️ DIVERGED - histories split

**If diverged:** WARN the user prominently. Ask if they want to:
- `git pull origin main` to get GitHub changes, OR
- Continue knowing local and remote are different

**DO NOT automatically pull or push.** Just inform the user.

### 3.3 Check for Uncommitted Session Work

```bash
git diff --stat HEAD 2>/dev/null || echo "No git history"
```

- [ ] Identified any uncommitted changes

### 3.4 Check for Orphaned Checkpoints

```bash
ls -la .q-system/checkpoints/ 2>/dev/null | tail -3 || echo "No checkpoints"
```

- [ ] Noted any checkpoints from previous sessions that weren't incorporated

**VERIFICATION GATE 2:**
```
Repository status:
- Git: [clean/dirty with N uncommitted changes]
- GitHub sync: [in sync / X ahead / X behind / ⚠️ DIVERGED]
- Orphaned checkpoints: [list or "none"]
```

---

## Step 4: Present Summary to User

**MANDATORY output format:**

```
=== Session Started ===

Project: [name from CLAUDE.md or "Unknown"]
Participant: [name if known or "TBD"]

Last session: [date from filename or "First session"]
- [Key accomplishment 1]
- [Key accomplishment 2]
- [Pending action from last session]

Current status:
- Git: [clean/dirty]
- Uncommitted work: [yes/no]
- GitHub sync: [✅ In sync / ⬆️ X commits to push / ⬇️ X commits to pull / ⚠️ DIVERGED]
- Checkpoints to review: [N or "none"]

[If diverged, add warning:]
⚠️ WARNING: Your local branch and GitHub have diverged!
   Run `git pull origin main` to get GitHub changes before starting.

What would you like to work on today?

---
Part of The Q Marketplace: the-ai-masters.com/q-marketplace
```

- [ ] Summary displayed to user
- [ ] Waited for user response

---

## Step 5: Initialize Task Tracking

**After user describes their goals:**

- [ ] If multi-step work: Use TodoWrite to create task list
- [ ] If single task: Proceed directly
- [ ] Note participant name for session files

---

## Error Handling

**If session notes unreadable:**
- Report the error
- Continue with session start
- Note this is a fresh start

**If git status fails:**
- Report the error
- Continue without git status
- Warn user to check repository state

---

## FINAL CHECKLIST

Before asking "What would you like to work on today?":

- [ ] CLAUDE.md read (or noted as missing)
- [ ] Last session notes read (or noted as first session)
- [ ] Git status checked
- [ ] GitHub remote status checked (fetch + compare)
- [ ] Summary presented to user (including sync status)

**If any item is unchecked, go back and complete it.**
