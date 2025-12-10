# q-vibe-coder

**Build real software without writing code.**

---

## What This Is

q-vibe-coder helps non-programmers build real software by directing AI coding agents. You bring the vision and taste. The template provides structure, coaching, and architecture expertise.

**You bring:** What you want to build, examples of what you like, decisions about how it should work
**The template provides:** Engineering expertise, the process, guidance through the unknowns

---

## Quick Start

```bash
# Extract the downloaded zip
unzip q-vibe-coder.zip

# Navigate to the folder
cd q-vibe-coder

# Start Claude Code
claude
```

Then just say: "I want to build [your idea]"

That's it. Claude will guide you from there.

---

## How It Works

q-vibe-coder follows a 6-phase process:

### The Phases

| Phase | What Happens |
|-------|--------------|
| **1. Vision** | Define what you're building and why |
| **2. Constraints** | Where it runs, what it connects to, scope boundaries |
| **3. Architecture** | Break it into pieces, choose the stack, plan the build |
| **4. Building** | Build in iterations, test as you go |
| **5. Testing** | Make sure it works, handles errors, looks right |
| **6. Deployment** | Get it running somewhere real |

### Your Files

| File | Purpose |
|------|------------|
| `my-project/vibe-coder-profile.md` | Your skills, tools, and taste |
| `my-project/project.md` | This project's definition and decisions |
| `my-project/session-log.md` | Track your progress |
| `my-project/code/` | Your project code goes here |

---

## Working Across Multiple Sessions

This template is built on the **Q-Command System** - a session management layer that gives Claude memory across conversations. This matters because:

- Claude Code sessions can end (context limit, you close the app, your laptop dies)
- Without session management, Claude forgets everything
- With Q-System, Claude picks up where you left off

### Essential Commands

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/q-begin` | Starting a session | Reviews where you left off, loads your context |
| `/q-end` | Finishing for now | Saves progress, documents what was done |
| `/q-checkpoint` | Mid-session | Saves progress without ending the session |
| `/q-status` | Anytime | Shows current state |

**First session?** Just start chatting - Claude will help you set up. Use `/q-end` when you're done.

**Returning?** Start with `/q-begin` so Claude remembers your project.

---

## Who This Is For

**Good fit:**
- AI early adopters who want to build but don't code
- People with ideas who need structure
- Anyone who's tried vibe coding and gotten stuck

**Not a good fit:**
- Seasoned developers (you already have the expertise)
- People who want to learn to code (this teaches directing AI, not coding)

---

## What You'll Learn

Along the way, you'll pick up:
- How to think architecturally (breaking big things into small things)
- How to make technical decisions (even without technical background)
- How to work with git (saving your work, recovering from mistakes)
- How to deploy (getting your app live on the internet)
- How to maintain what you built

---

## Tips

**Be specific.** The more specific you are about what you want, the better the results.

**Bring examples.** Screenshots, links, descriptions of things you like help Claude understand your taste.

**Trust the process.** The phases exist for a reason. Architecture before building prevents pain.

**Ask questions.** If Claude uses jargon you don't understand, ask. That's what it's here for.

**Ship early.** A working app beats a perfect plan. Get something live, then iterate.

---

## What This Is NOT

- A coding tutorial (you won't learn to write code)
- A no-code platform (you're building real code, just not writing it)
- A magic wand (complex projects still take time)
- A replacement for programmers (for complex enterprise work, hire someone)

---

## Need More?

Want hands-on help with this template, or curious what else is possible with AI-powered workflows?

[The AI Masters](https://the-ai-masters.com) offers VIP implementation sessions.

---

## Built With

- Q-Command System - Session management for Claude Code
- [Claude Code](https://claude.ai/claude-code) - AI-powered development environment

---

*Created by The AI Masters*
