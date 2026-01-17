# Vibe Coding 101 - Curriculum

## Course Structure

**Format:** 2 live 1-on-1 sessions (90 minutes each)
**Total Duration:** 3 hours + homework
**Delivery:** Interactive sessions via video call
**Pace:** Intermediate (assumes Claude Code knowledge)

---

## Session 1: Planning & Setup (90 minutes)

### Module 1: Vibe Coding Mindset & Philosophy (20 minutes)

**Learning Objectives:**
- Understand what vibe coding is and isn't
- Learn the taste principle - how non-coders control outcomes
- Know when to use AI vs when to code manually
- Grasp the importance of structure in AI-assisted development

**Topics Covered:**
- What is vibe coding? (Directing AI strategically, not blindly)
- The taste principle - being specific, bringing examples, making choices
- Common vibe coding mistakes (random prompting, no planning, losing control)
- When AI excels vs when manual coding is better
- The role of structure and methodology in reliable vibe coding
- Introduction to the 6-phase process

**Hands-On Exercise:**
- Review examples of good vs bad vibe coding
- Discuss what makes specific prompts effective
- Identify architectural decisions in sample projects

**Duration:** 20 min

---

### Module 2: Project Planning with Claude (25 minutes)

**Learning Objectives:**
- Master the 6-phase vibe coding methodology
- Learn to make strategic upfront decisions
- Understand how deployment choices affect architecture
- Set up q-vibe-coder template for structured projects

**Topics Covered:**
- **The 6-Phase Methodology:**
  1. **Vision** - What you're building, who it's for, what success looks like
  2. **Constraints** - Where it runs, complexity scope, integrations, boundaries
  3. **Architecture** - Breaking into pieces, choosing stack, data flow, build sequence
  4. **Building** - Iterative development, testing as you go, staying in scope
  5. **Testing** - Functional testing, error handling, UX verification
  6. **Deployment** - Production hosting, real services, maintenance
- **Strategic Planning:**
  - Why deployment location matters (affects build architecture)
  - Choosing your stack (Next.js, Tailwind, Vercel, etc.)
  - Scope boundaries - what's in v1 vs later
- **q-vibe-coder Template:**
  - vibe-coder-profile.md - Your skills, tools, and taste
  - project.md - Project definition and decisions
  - session-log.md - Progress tracking across sessions
  - code/ - Where your project code lives

**Hands-On Exercise:**
- Set up q-vibe-coder template
- Define your project using Phase 1 (Vision)
- Work through Phase 2 (Constraints)
- Begin Phase 3 (Architecture) - choose your stack

**Duration:** 25 min

---

### Module 3: Tool Limitations & When to Use What (20 minutes)

**Learning Objectives:**
- Understand what AI can and cannot do reliably
- Learn when to use other tools or integrations
- Master Q-System for session management
- Manage context across long projects

**Topics Covered:**
- **AI Limitations:**
  - What Claude Code handles well (structure, boilerplate, iteration)
  - What requires caution (complex logic, security, performance optimization)
  - When to involve specialists or other tools
  - Red flags that signal you need help
- **Tool Integration:**
  - When to use design tools first (Figma, mockups)
  - When to use specialized libraries vs building from scratch
  - API services vs custom backend
- **Q-System Session Management:**
  - `/q-begin` - Start session with context refresh
  - `/q-end` - End session with documentation
  - `/q-checkpoint` - Save progress mid-session
  - `/q-status` - Check current state
  - Why session management matters for long projects
  - How Q-System preserves context across conversations
- **Context Management:**
  - Keeping context focused during builds
  - When to compact vs when to start fresh
  - Managing the 200K token limit

**Hands-On Exercise:**
- Start session with `/q-begin`
- Create vibe-coder profile
- Practice using Q-System commands
- Learn to read session notes from previous work

**Duration:** 20 min

---

### Module 4: Setting Up Your First Project - GitHub & Vercel (25 minutes)

**Learning Objectives:**
- Set up GitHub repository for your project
- Configure Vercel for deployment
- Understand git workflows for AI-assisted development
- Initialize project with proper structure

**Topics Covered:**
- **GitHub Setup:**
  - Creating a new repository
  - Cloning to local machine
  - Understanding git basics (commit, push, pull)
  - .gitignore for web projects
  - README.md best practices
  - Branch basics (main vs feature branches)
- **Vercel Configuration:**
  - Connecting GitHub to Vercel
  - Project settings and environment variables
  - Build settings (framework detection)
  - Deployment triggers (auto-deploy on push)
  - Preview deployments vs production
- **Project Initialization:**
  - Setting up Next.js (or chosen framework)
  - Installing Tailwind CSS
  - Project structure best practices
  - Initial commit and first deploy
- **Why This Order Matters:**
  - Setting up deployment first prevents rework
  - Git workflows are easier to establish early
  - Testing deployment pipeline before building features

**Hands-On Exercise:**
- Create GitHub repository for your project
- Connect repository to Vercel
- Initialize Next.js project with Tailwind
- Make initial commit and push
- Verify first deployment is live
- Test the deployment URL

**Duration:** 25 min

---

### Session 1 Wrap-Up (5 minutes)

**Review:**
- Vibe coding mindset and the taste principle ✓
- 6-phase methodology (Vision → Deployment) ✓
- q-vibe-coder template setup ✓
- Tool limitations and Q-System session management ✓
- GitHub and Vercel infrastructure ready ✓

**Homework Assignment:**
Continue developing your project:
- Complete Phase 3 (Architecture) - plan your components
- Begin Phase 4 (Building) - build 1-2 components
- Practice using Q-System (`/q-end` when done, `/q-begin` when returning)
- Commit and push changes to GitHub
- Verify Vercel auto-deploys your changes
- Keep session-log.md updated with progress

**Prepare for Session 2:**
- Come with questions from homework
- Note any errors or blockers you encountered
- Have your project open and ready
- Review what you built so far

---

## Session 2: Building & Deployment (90 minutes)

### Module 5: Building with Claude - Component by Component (30 minutes)

**Learning Objectives:**
- Build iteratively using the q-vibe-coder methodology
- Work component by component with clear goals
- Stay within scope and avoid feature creep
- Commit regularly and test as you go

**Topics Covered:**
- **Iterative Development Workflow:**
  - Breaking features into small, testable pieces
  - Building one component at a time
  - Testing each piece before moving on
  - Using q-vibe-coder project.md to track decisions
- **Working with Claude:**
  - Providing clear, specific instructions
  - Bringing examples of what you like
  - Reviewing AI-generated code before accepting
  - Iterating based on results ("closer to X" approach)
- **Staying in Scope:**
  - Recognizing scope creep ("oh, and it should also...")
  - Deferring features to v2
  - Focusing on core functionality first
  - Tracking deferred features in project.md
- **Git Workflow:**
  - Committing after each working feature
  - Writing clear commit messages
  - Pushing to GitHub regularly
  - Verifying deployment after pushes

**Hands-On Exercise:**
- Build 2-3 components for your project
- Practice iterative refinement ("make it more like X")
- Commit each working component
- Verify auto-deployment to Vercel
- Update session-log.md with progress

**Duration:** 30 min

---

### Module 6: Troubleshooting & Problem-Solving (25 minutes)

**Learning Objectives:**
- Debug common errors in AI-generated code
- Recover from mistakes using git
- Know when to simplify vs when to push through
- Develop problem-solving strategies that work

**Topics Covered:**
- **Common Errors:**
  - Build failures (missing dependencies, syntax errors)
  - Deployment issues (environment variables, build settings)
  - Styling problems (Tailwind not loading, CSS conflicts)
  - Component errors (React hooks, prop passing)
- **Debugging Strategies:**
  - Reading error messages effectively
  - Using Claude to explain and fix errors
  - Testing in isolation (comment out code, narrow down issue)
  - Checking Vercel deployment logs
- **Git Recovery:**
  - Viewing commit history
  - Reverting to last working state
  - Undoing changes before commit
  - When to reset vs when to debug forward
- **Problem-Solving Framework:**
  1. What changed? (identify what broke it)
  2. What does the error say? (read carefully)
  3. Can I isolate it? (test smaller pieces)
  4. Do I need to simplify? (reduce complexity)
  5. Should I ask for help? (know when you're stuck)
- **When to Pivot:**
  - Recognizing when something is too complex
  - Simplifying the approach
  - Choosing easier alternatives
  - Staying unblocked vs perfectionism

**Hands-On Exercise:**
- Intentionally break something and fix it
- Practice reading deployment errors
- Use git to revert changes
- Debug a component error with Claude
- Simplify an overly complex feature

**Duration:** 25 min

---

### Module 7: Refining & Polishing Your Project (20 minutes)

**Learning Objectives:**
- Iterate on design and functionality
- Test user experience and edge cases
- Polish visual details
- Validate that your project meets Phase 1 vision

**Topics Covered:**
- **Phase 5: Testing (from 6-phase methodology):**
  - Functional testing - does it work as intended?
  - Error handling - what happens when things go wrong?
  - Visual verification - does it look right?
  - UX check - would a user understand it?
- **Iterative Refinement:**
  - Getting feedback (from yourself or others)
  - Making incremental improvements
  - Knowing when "good enough" is good enough
  - Avoiding endless tweaking
- **Visual Polish:**
  - Spacing and alignment
  - Typography and readability
  - Color consistency
  - Mobile responsiveness
- **Edge Cases:**
  - What if fields are empty?
  - What if screen is very small/large?
  - What if user does something unexpected?

**Hands-On Exercise:**
- Test your project on different screen sizes
- Check for visual issues and fix them
- Test error scenarios
- Make final refinements
- Get project to "shippable" state

**Duration:** 20 min

---

### Module 8: Deploy to Production & Final Review (15 minutes)

**Learning Objectives:**
- Verify production deployment is live and working
- Understand Vercel deployment settings
- Learn basic maintenance and updates
- Plan next steps for your project

**Topics Covered:**
- **Phase 6: Deployment (from 6-phase methodology):**
  - Verifying production build
  - Testing live URL
  - Checking deployment logs
  - Understanding Vercel dashboard
- **Domain & DNS (Optional):**
  - Connecting custom domain
  - DNS basics (A records, CNAME)
  - SSL certificates (automatic with Vercel)
- **Maintenance & Updates:**
  - How to make changes (git commit → push → auto-deploy)
  - Monitoring for errors (Vercel logs)
  - When to refactor vs when to rebuild
- **Next Steps:**
  - v2 features (from deferred list)
  - Adding complexity (APIs, databases)
  - Learning advanced topics
  - Building new projects with same methodology

**Hands-On Exercise:**
- Verify your live deployment works
- Test on mobile device
- Share URL and get feedback
- Plan v2 features
- Document what you learned

**Duration:** 15 min

---

### Session 2 Wrap-Up & Next Steps (5 minutes)

**What You've Mastered:**
- Vibe coding with structure and methodology ✓
- 6-phase process from vision to deployment ✓
- q-vibe-coder template and Q-System ✓
- GitHub and git workflows ✓
- Vercel deployment and hosting ✓
- Troubleshooting and problem-solving ✓
- Strategic thinking and architecture ✓
- Building and shipping real projects ✓

**Your Accomplishments:**
- Live website deployed to production
- GitHub repository with clean code
- Experience with professional tools and workflows
- Methodology you can use for future projects

**Next Steps:**
- **Keep Building** - Apply the 6-phase methodology to new projects
- **Advanced Topics** - APIs, databases, authentication (future courses)
- **Join the Community** - Share your project, get feedback, help others
- **Become a Student-Teacher** - Apply to teach Vibe Coding 101 and earn 70% per student
- **Build Your Portfolio** - Use what you learned to create more projects

**Resources:**
- q-vibe-coder template (yours to keep and reuse)
- Q-System documentation
- PeerLoop community forum
- Your instructor for ongoing questions

**Certification:**
Upon completion, you'll receive your certificate and be eligible to apply as a student-teacher for Vibe Coding 101!

---

## Learning Methodology

**Live 1-on-1 Format:**
- Personalized attention to your specific project
- Ask questions anytime, get immediate answers
- Work at your own pace with expert guidance
- Real-time troubleshooting and debugging

**Project-Based Learning:**
- 70% hands-on building
- 30% instruction and demonstration
- Build a real project you'll actually use
- Deploy to production, not just localhost

**Structured Process:**
- Follow proven 6-phase methodology
- Learn architectural thinking
- Make strategic decisions upfront
- Build systematically, not randomly

**Professional Tools:**
- GitHub for version control (industry standard)
- Vercel for deployment (used by professionals)
- Q-System for session management
- q-vibe-coder for project structure

---

## Prerequisites Checklist

Before Session 1, ensure you have:

✓ **Claude Code Knowledge** (from "Intro to Claude Code" or equivalent experience)
✓ **Computer** with terminal access (Windows 10+ or macOS 10.15+)
✓ **Claude Account** (Pro $17/month or Max plan)
✓ **GitHub Account** (free tier is fine - sign up at github.com)
✓ **Node.js 18+** installed (for npm and framework installation)
✓ **Vercel Account** (free tier is fine - sign up at vercel.com)
✓ **Stable internet connection** for live sessions
✓ **Code editor** installed (VS Code recommended)
✓ **Project idea** (landing page, portfolio, simple website)

**Required Skills:**
✓ Know how to use Claude Code
✓ Comfortable with terminal basics
✓ Understand context management
✓ Can work with Claude's tools and permissions

**Not Required:**
✗ No git/GitHub expertise
✗ No deployment experience
✗ No advanced coding knowledge
✗ No web development background

---

## What Students Say

*"After Intro to Claude Code, I wanted to build real things. This course taught me the structured process I needed. I deployed my first website in week one and haven't stopped building since."* - Marcus, Course Graduate

*"The 6-phase methodology changed everything. I went from random vibe coding to strategic building. Now I plan, build, and deploy with confidence."* - Sarah, Now a Student-Teacher

*"Learning GitHub and Vercel felt intimidating, but the course made it simple. Now I deploy every project I build and actually ship things instead of leaving them on my laptop."* - Jessica, Entrepreneur

*"The q-vibe-coder template is gold. I use it for every project now. It keeps me organized and prevents the chaos that used to derail my builds."* - Kevin, AI Enthusiast
