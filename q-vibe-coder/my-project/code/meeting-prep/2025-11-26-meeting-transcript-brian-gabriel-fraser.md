# Meeting Transcript: Brian, Gabriel, Fraser
**Date:** 2025-11-26  
**Attendees:** Brian LeBlanc, Gabriel Rymberg, Fraser Gorrie  
**Duration:** ~1 hour  
**Topics:** Community Feed, Big Blue Button, getstream.io, MVP feasibility

---

## Key Discussion Points

### 1. Q-Command System Capabilities
- Gabriel demonstrated creating a new co-pilot for Urantia Book content
- Built skill to scrape YouTube videos and generate smart comments
- System installed from URL in 20 minutes, fully functional

### 2. Budget & Timeline Confirmation
- **Budget:** $75,000 (Brian increased from conservative $15-25K)
- **Timeline:** 4 months (Dec 6 → Apr 1)
- Brian: "I want to take a bigger risk... I've been working on this 6-8 months"

### 3. Community Feed - Deep Dive

**Brian's Position:**
- Community feed is critical, sees it as a marketing funnel
- Students can follow creators/courses before purchasing
- Public forum for discussions about course value
- Cites Substack's success after adding community features
- Wants to replicate aspects of Skool and X.com

**Gabriel's Pushback:**
- Challenged Brian to define specific value proposition
- Concerned about "community feed" being too vague
- Most feeds (Discord, Twitter, Facebook) = overwhelming noise, no signal
- Wants concrete connection to hypotheses and measurable outcomes

**Resolution:**
- Use **Skool platform as prototype** for feed design
- Brian to distill specific features from Skool he wants
- getstream.io selected for implementation
- Feed structure: General peerloop feed + creator-specific feeds

**Quote - Gabriel:** 
> "Can you explain what is the value to the user of this community feed, specifically in PeerLoop, not in general?"

**Quote - Brian:**
> "I see it as a marketing funnel... overcome all the resistance. If you just go to a course listing, you're on your own. You're exploring a course on your own. You're in isolation. I'm trying to bring in the community."

### 4. Alternative: AI Chatbot vs Community Feed

**Gabriel's Suggestion:**
- Use intelligent chatbot as site navigation center
- Tailored, private experience vs overwhelming public feed
- Chatbot knows all courses, can recommend, curate

**Brian's Counter:**
- Human connections are critical, computers don't motivate
- "I've been watching this for 25 years... everyone assumes people can be motivated. That's the missing link - people motivate people, computers don't"
- One-hour paid session alone isn't enough connection

**Compromise:**
- Implement community feed (Skool-style)
- Measure impact on specific hypotheses
- Brian accepts need to define what success looks like

### 5. Big Blue Button vs Jitsi

**Requirements:**
1. **Screen sharing** (PRIMARY) - students bring their work to share
2. **Video** (SECONDARY) - video in corner for personal connection
3. **Whiteboard** (OPTIONAL) - education-focused feature, can disable if not needed

**Brian's Reasoning:**
- BBB is version 3, mature, education-focused
- Open source → can self-host later for cost control
- Providers charge per-session vs per-user (critical for business model)
- Analytics available (not a "black box")
- Screen sharing more important than video quality

**Fraser's Assessment:**
- BBB requires Ubuntu 22 server + Docker (complex self-hosting)
- Recommends renting from provider for 4 months, learn requirements
- Will be sub-domain (e.g., class.peerloop.com)
- Integration: 1.5-2 weeks (Brian's Q-estimate)

**Brian's 4pm Follow-up:**
- Meeting scheduled with US-based BBB provider
- Fraser needs to confirm: SSH access? What APIs available? Analytics depth?

**Quote - Brian:**
> "Don't let Fraser build screen sharing. We can outsource it and save ourselves a lot of time and have a pretty robust system... it's version 3, so I think it's pretty advanced."

### 6. Integration Architecture

**Fraser's Mental Model:**
- PeerLoop = umbrella platform
- BBB = pluggable video sub-domain (can swap later)
- getstream.io = feed infrastructure (also replaceable)
- Custom glue code to integrate everything

**User Flow:**
1. **Main site** (peerloop.com): Browse, shop, community feed, scheduling
2. **Class sub-domain** (class.peerloop.com): Live sessions via BBB
   - User gets email with link
   - Clicks → logs in → session starts
   - Session recorded, transcribed, archived
   - Back to main site when done

**Fraser's Priority:**
- Measure everything - some metrics come from tutoring sessions
- Build modular - easy to swap BBB for something better later
- Edge deployment via Cloudflare for performance

**Quote - Fraser:**
> "The package is still called PeerLoop. It's not PeerLoop plus a video, it's PeerLoop has the ability to tutor people."

### 7. getstream.io for Community Feed

**Brian's Position:**
- Time-to-market > cost
- getstream.io = fast implementation, proven infrastructure
- Open platform → can migrate to custom later
- Edge servers for real-time performance

**Fraser's Response:**
- Will evaluate if custom feed is better
- Centralized feed = database-triggered, not as complex as chat
- Cloudflare workers = edge deployment by default
- Leans toward using getstream.io for speed

**Decision:**
- Use getstream.io for MVP
- Fraser to investigate exact integration requirements

### 8. Growth Model & Flywheel

**Brian's Spreadsheet Model:**
- One course at $150-400
- New cohort every week
- 10% of students → student-teachers
- Exponential growth over 6-12 months
- Sweet spot: Short courses (1-3 hours) with broad appeal

**Gabriel's Pushback - Conversion Rate:**
- 10% is too optimistic
- Suggests 0.1% - 1% (consumer vs creator ratio)
- Examples: Facebook groups, Substack (1:1 million ratio)
- "Most people are consumers, they're not creators"

**Gabriel's Pushback - Timeline:**
- Certification takes time (teacher must vet student-teacher)
- Student needs practice before teaching (3-5 repetitions)
- Example: "If I teach you cursor today, can you teach someone with zero VS Code experience in 5 days? No."
- Spread growth over weeks, not days

**Brian's Counter:**
- Research: One-to-one learning is 4x faster than one-to-many
- Motivation to teach = reinforcement of learning
- After 3-level course, student can teach level 1
- Psychology: Fear of embarrassment > AI learning (no stakes with computer)

**Resolution:**
- Run 3 scenarios: 10%, 1%, 0.1%
- Test assumptions with Genesis cohort
- If explosive growth happens = "good problem to have"

**Quote - Gabriel:**
> "A concert pianist, the top pianist in the world... 99.9% of them cannot teach a 10-year-old scales. They don't have the patience, the temperament... So if you say you want to teach, I want you to prove to me that you can teach."

### 9. Certification Process (Emerging Requirement)

**Fraser's Ideas:**
- Student-teacher submits syllabus
- Teach first student on video
- Interview student afterward to assess learning
- Feedback mechanism at no cost
- First student gets 50% discount (incentive + quality control)

**Implications:**
- Platform must handle video submissions
- Need review/approval workflow
- Quality gates before student-teacher goes live

### 10. Course Types

**Cohort Learning:**
- Professor + students, then students teach each other in groups
- Physics professor: "Blew his mind how much better students taught each other"
- Peer teaching = reinforcement, even if imperfect

**PeerLoop Model:**
- Student-teacher slightly ahead of student (not master → beginner)
- Focus: Rapid AI tool updates (Gemini, Claude, Cursor new features)
- 1-2 hour sessions for quick knowledge transfer
- Students can recoup cost by teaching next cohort
- "Win-win-win: Learn, earn, reinforce knowledge"

**Marketing Message:**
- Must set expectations: Not expert tutors, peer teachers
- Lowering barrier encourages participation
- AI hunger + rapid change = ideal conditions

### 11. Platform Flexibility

**Brian's Vision:**
- Creators control their own communities
- Custom courses beyond templates
- "Things we can't even envision"

**Fraser's Response:**
- Design for custom tutoring (not just syllabus-based)
- Example: "Latest tools this week" → one-hour session
- Keep system flexible for experimentation

---

## Action Items

### Brian
- [ ] Review Skool platform, distill specific feed features wanted
- [ ] Review Substack community features
- [ ] Connect feed features to 6 hypotheses (measurable outcomes)
- [ ] 4pm meeting with BBB provider - get API/analytics details
- [ ] Run 3 growth scenarios (10%, 1%, 0.1% conversion)

### Fraser
- [ ] Investigate getstream.io integration requirements
- [ ] Evaluate custom feed vs getstream.io (time/cost trade-off)
- [ ] Assess BBB integration complexity (1.5-2 weeks realistic?)
- [ ] Design modular architecture (easy to swap BBB/getstream later)
- [ ] Plan for video submission feature (certification workflow)

### Gabriel
- [ ] Send transcript to Slack
- [ ] Continue challenging assumptions (devil's advocate role)

---

## Key Quotes

**Brian on Human Connection:**
> "AI will always be an assistant to the human connection. It will never replace the human connection... People motivate people. Computers don't motivate people."

**Gabriel on Failing Fast:**
> "The key question... is you have enough money, but you want to fail or succeed fast and cheap. Don't build too much. It just takes more time to know if you failed or succeeded."

**Fraser on Time Estimates:**
> "Nothing takes a week and a half." (Gabriel agreeing with painful experience)

**Brian on Version 2/3:**
> "I feel like you're already thinking of version two and three ahead of time... my biggest fear is we do hit the jackpot, and we get network effects... explosive growth, it's like a constant nuclear bomb going off."

---

## Meeting Atmosphere

- Collaborative, challenging, productive
- Gabriel deliberately playing "devil's advocate" to test ideas
- Fraser focused on technical feasibility and edge cases
- Brian open to pushback, wants to be challenged
- Consensus: Better to test assumptions now than fail later

**Brian's Closing:**
> "I sure appreciate you guys. I finally feel like this could happen."

---

## Related Documents

- `meeting-prep/2025-11-26-fraser-gabriel-meeting.md` - Pre-meeting prep
- `mvp-decisions/2025-11-25-video-conferencing-integration.md` - BBB decision
- `mvp-decisions/2025-11-25-community-feed-getstream.md` - Feed decision
- `mvp-decisions/2025-11-26-calendar-scheduling-system.md` - Calendar decision

---

**Transcript Source:** Otter.ai  
**Added to Project:** 2025-11-26 by Brian







