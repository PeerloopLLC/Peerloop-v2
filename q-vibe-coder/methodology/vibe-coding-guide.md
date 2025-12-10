# The Vibe Coding Guide

**A methodology for building software without writing code.**

---

## What Is Vibe Coding?

Vibe coding is directing AI coding agents to build software for you. You describe what you want, review what they build, and guide them toward your vision. You don't write code - you control the outcome through:

- **Specificity** - The more precise your descriptions, the better the results
- **Examples** - Showing what you like helps more than describing it
- **Taste** - Recognizing quality when you see it and knowing what you want
- **Iteration** - Building, reviewing, adjusting, repeat

---

## The 6 Phases

Every vibe coding project moves through these phases. Some projects zip through in one session. Complex projects may spend multiple sessions on a single phase.

---

### Phase 1: Vision

**Goal:** Know what you're building before you build it.

**Questions to answer:**

| Question | Why It Matters |
|----------|----------------|
| What are you building? | Clarity prevents wasted effort |
| What problem does it solve? | Keeps you focused on what matters |
| Who is it for? | Shapes every decision |
| What does success look like? | Defines "done" |
| What inspired you? | Helps communicate your taste |

**Activities:**
- Describe the idea in plain language
- Share examples, screenshots, references
- Define the minimum viable version (what's the smallest thing that would be useful?)

**Output:**
- Clear project description in `project.md`
- References and inspiration documented
- Scope boundaries defined

**Red flags:**
- "I'm not sure what I want" → Need more vision work
- "It should do everything" → Scope is too big
- No examples or references → Hard to hit target you can't see

---

### Phase 2: Constraints

**Goal:** Know your boundaries before hitting them.

**Questions to answer:**

| Question | Why It Matters |
|----------|----------------|
| Where will it run? | Determines the technology choices |
| What's the complexity? | Sets expectations for time and effort |
| What does it need to connect to? | Identifies external dependencies |
| What's NOT included? | Prevents scope creep |

**Platform options:**
- **Web app** - Accessible anywhere, needs hosting
- **Desktop app** - Runs locally, more complexity
- **Mobile app** - Native or web-based, distribution challenges
- **Script/automation** - Runs locally, simplest deployment
- **Claude skill** - Lives in Claude Code, simplest of all

**Complexity spectrum:**
- **Simple (1 session)** - Single-purpose tool, no external dependencies
- **Medium (2-5 sessions)** - Multiple features, some integrations
- **Complex (many sessions)** - Full application, real users, ongoing maintenance

**Output:**
- Platform decision documented
- Integration requirements listed
- Explicit "out of scope" list

---

### Phase 3: Architecture

**Goal:** Design before building. This prevents pain later.

**Why architecture matters:**

Non-programmers often want to skip this. Don't. Bad architecture creates:
- Code that's hard to change
- Bugs that are hard to find
- Features that can't be added without rewriting

Good architecture creates:
- Code that's easy to modify
- Clear separation of concerns
- Ability to add features later

**Activities:**

1. **Break it into pieces**
   - What are the main parts? (UI, data, logic, integrations)
   - How do they talk to each other?
   - What could be built independently?

2. **Choose the stack**
   - What frameworks/languages? (Let Claude recommend based on your project)
   - What services? (Database, auth, hosting)
   - What's the simplest option that works?

3. **Plan the build sequence**
   - What to build first?
   - What depends on what?
   - Where are the risks?

**Output:**
- Component diagram (can be simple text description)
- Stack decision with rationale
- Build order documented

**Common stack choices:**

| Project Type | Typical Stack |
|--------------|---------------|
| Simple web app | Next.js + Vercel |
| Web app with data | Next.js + Supabase + Vercel |
| Automation/script | Python or Node.js |
| Claude skill | Markdown + prompt engineering |

---

### Phase 4: Building

**Goal:** Build in small, testable pieces.

**The iteration loop:**
1. Build one small piece
2. Test it (does it work?)
3. Review it (is it what you wanted?)
4. Adjust if needed
5. Commit (save your work)
6. Repeat

**Best practices:**

| Practice | Why |
|----------|-----|
| Build small pieces | Easier to find bugs, easier to change |
| Test as you go | Catch problems early |
| Commit frequently | Create save points you can return to |
| Stay in scope | Resist "while we're at it..." |
| Document decisions | Future you will thank present you |

**When things break:**

This is normal. Code breaks. When it does:
1. Read the error message - it usually tells you what's wrong
2. Ask Claude to explain it in simple terms
3. Don't panic - git has your history
4. Fix forward or revert back

**Scope creep warning signs:**
- "Oh, and it should also..."
- "What if we added..."
- "Can it also do X?"

Response: "Good idea. Let's note that for v2 and finish the current scope first."

---

### Phase 5: Testing

**Goal:** Make sure it works before shipping it.

**Types of testing:**

| Type | What You're Checking |
|------|---------------------|
| Functional | Does it do what it should? |
| Edge cases | What happens with weird input? |
| Visual | Does it look right? |
| User flow | Can someone actually use this? |

**How to test as a non-programmer:**
- Use the app like a real user would
- Try to break it (empty input, weird characters, rapid clicking)
- Have someone else try it without instructions
- Check it on different devices/browsers if it's a web app

**Questions to ask:**
- What happens if the user does [unexpected thing]?
- What happens if the network is slow?
- What happens if an API is down?
- Is the error messaging helpful?

---

### Phase 6: Deployment

**Goal:** Get it running somewhere real.

**What deployment means:**
- Your code moves from your computer to a server
- It gets a URL (or runs on startup, or whatever's appropriate)
- Real users can access it
- It needs to stay running

**Deployment checklist:**

| Item | Notes |
|------|-------|
| Environment variables | Secrets configured for production |
| Database | Production database separate from dev |
| Domain | Custom domain if needed |
| SSL | HTTPS enabled (usually automatic) |
| Monitoring | Know when things break |
| Backups | Data is safe if something goes wrong |

**Common deployment targets:**

| Platform | Good For |
|----------|----------|
| Vercel | Next.js apps, static sites |
| Netlify | Static sites, simple web apps |
| Railway | Full-stack apps, databases |
| Fly.io | More control, containerized apps |
| Your own server | Maximum control, more work |

---

## Bridge to Real World

These topics often trip up non-programmers. Know they exist before you need them.

### Git & Version Control

Git saves versions of your code. Key concepts:
- **Commit** - A snapshot of your code at a point in time
- **Branch** - A parallel version of your code
- **Push** - Send your commits to GitHub/remote
- **Pull** - Get updates from GitHub/remote

Commands you'll use:
```
git add .              # Stage all changes
git commit -m "msg"    # Save a snapshot
git push               # Upload to GitHub
git pull               # Download changes
```

When things go wrong, git can usually save you. Ask Claude for help.

### Environment Variables

Secrets (API keys, passwords) should NOT be in your code. Instead:
- Store them in `.env` files locally
- Configure them in your hosting platform for production
- Reference them in code as `process.env.VARIABLE_NAME`

The `.env` file is in `.gitignore` so it never gets committed.

### Domains & DNS

To use a custom domain:
1. Buy a domain (Namecheap, Google Domains, etc.)
2. Point it at your hosting (usually A record or CNAME)
3. Wait for propagation (can take hours)
4. Configure SSL (usually automatic)

### APIs & Integrations

APIs let your app talk to other services. You'll need:
- An API key (sign up for the service)
- Understanding of rate limits (how often you can call)
- Error handling (what if the API is down?)

### Payments

If you're charging money:
- Use Stripe, Square, or similar (never build your own)
- Understand test mode vs live mode
- Know what PCI compliance means

---

## Common Gotchas

Problems you'll likely encounter:

### CORS Errors
**What it looks like:** "Access to fetch has been blocked by CORS policy"
**What it means:** Your browser is blocking a request for security reasons
**How to fix:** Add proper CORS headers to your API, or use a proxy

### Environment Variables Not Working
**What it looks like:** `undefined` values, missing API keys
**What it means:** The variable isn't set in the current environment
**How to fix:** Check .env file exists, restart dev server, check production config

### Git Conflicts
**What it looks like:** Git refuses to merge/pull
**What it means:** Same line changed in two places
**How to fix:** Manually resolve the conflict, or ask Claude for help

### Node Modules Issues
**What it looks like:** Missing module errors, version conflicts
**What it means:** Dependencies are out of sync
**How to fix:** Delete `node_modules`, run `npm install` again

### Build vs Runtime Errors
**What it looks like:** Works locally, fails in production
**What it means:** Production environment is different
**How to fix:** Check environment variables, check logs, compare configs

---

## When Things Go Wrong

### Claude Broke Something

Don't panic. Options:
1. **Undo:** `git checkout .` (discard uncommitted changes)
2. **Revert:** `git revert HEAD` (undo last commit)
3. **Reset:** `git reset --hard HEAD~1` (remove last commit entirely)
4. **Debug:** Look at what changed and fix it

Always commit before trying big changes so you have a save point.

### Lost in Complexity

Signs you're lost:
- You don't know what the code does anymore
- Changes have unexpected effects
- You're afraid to touch anything

Recovery:
1. Stop building
2. Map out what exists
3. Identify what's core vs what's cruft
4. Simplify ruthlessly
5. Consider starting over if the core is solid

### Project Recovery

When a project has gone off track:
1. Stop and assess (don't keep building)
2. What works? What doesn't?
3. What went wrong? (Scope creep? Wrong approach? Unclear requirements?)
4. Decide: Continue, pivot, or restart
5. Document the lessons

---

## Developing Taste

Taste is the key skill in vibe coding. It's learnable.

**How to develop taste:**

1. **Notice what you like**
   - Screenshot UIs that feel good
   - Bookmark sites with nice interactions
   - Note features that delight you

2. **Analyze why**
   - What makes this better than alternatives?
   - What would make it worse?
   - What's the core principle?

3. **Practice specificity**
   - Not "make it look nice" → "use more whitespace, softer colors, rounded corners"
   - Not "make it faster" → "this list should load in under 200ms"
   - Not "fix the UX" → "users should never see a loading spinner for more than 1 second"

4. **Iterate deliberately**
   - Ask Claude for 3 options
   - Compare them consciously
   - Articulate why you prefer one

**Signs of developing taste:**
- You can articulate what's wrong with something
- You notice details others miss
- Your requests become more specific over time
- You start having opinions about things you didn't before
