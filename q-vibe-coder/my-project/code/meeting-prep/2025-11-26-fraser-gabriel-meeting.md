# Meeting Prep: Fraser + Gabriel

**Date:** 2025-11-26 (or scheduled date)
**Purpose:** MVP Feature Review - BBB, getstream.io, and Core Features
**Duration:** 60-90 minutes
**Attendees:** Brian + Fraser (Developer) + Gabriel (Strategic Advisor)

---

## Meeting Objectives

1. Get Fraser's technical assessment on Big Blue Button vs Jitsi for video conferencing
2. Get Fraser's technical assessment on getstream.io community feed integration
3. Align on remaining MUST HAVE features for MVP
4. Confirm $75K budget and 4-month timeline feasibility
5. Identify any technical blockers or concerns before Dec 6 dev start
6. Prioritize features if scope needs adjustment

---

## Context for Fraser & Gabriel

### Major Scope Change (Nov 25)

**OLD Scope:**
- Budget: $15-25K
- Timeline: 10 weeks
- 2 creators, 30 students

**NEW Scope:**
- Budget: $75,000
- Timeline: 4 months (Dec 6 → Apr 1, 2026)
- 4-5 creators, 60-80 students
- Multi-creator marketplace from Day 1
- Moderators (1 per creator)

**Why This Matters:**
- 3x budget increase enables more features
- Multi-creator platform = more complex infrastructure
- 75-100 total users = critical mass for community features
- Same timeline (4 months), but more budget for outsourcing/services

### Current MVP Decisions

**✅ MUST HAVE (Decided):**
1. **Video Conferencing Integration (Big Blue Button or Jitsi)**
   - Est: 1.5-2 weeks, $1,700-3,800
   - Live 1-on-1 sessions (students + Student-Teachers)
   - Calendar/scheduling integration
   - Session recordings
   
2. **AI-Sorted Community Feed (getstream.io)**
   - Est: 2-3 weeks, $3,400-5,700
   - Social feed connecting all users
   - Follow system, likes, comments, reposts
   - Critical for Student-Teacher recruitment (H6 validation)

**⏳ MUST HAVE (Likely, Not Yet Decided):**
3. Payment & Enrollment System (Stripe)
4. Course Content Delivery
5. Student Dashboard
6. Professional Landing Page
7. "Become a Student-Teacher" Flow
8. Progress Tracking & Analytics

**❓ UNDECIDED:**
- Student-Teacher management tools (or manual?)
- Moderator tools (or manual?)
- Creator dashboard features
- Multi-course catalog/browsing

### Six Core Hypotheses (What We're Testing)

1. **H1: Market Positioning** - Students will pay $300-600
2. **H2: Completion Rates** - 75%+ completion (vs 10-20% MOOCs)
3. **H3: Customer Segmentation** - Both "Earn-While-Learn" and "Premium" students
4. **H4: Conversion to Teaching** - 10%+ become Student-Teachers
5. **H5: Peer Teaching Quality** - Student-Teachers match expert outcomes
6. **H6: Flywheel Validation** - Second generation emerges *(Brian's #1 uncertainty)*

---

## Agenda

### 1. Technical Feasibility Review (30 minutes)

**1.1: Video Conferencing - BBB vs Jitsi (15 min)**

*For Fraser:*
- Have you reviewed Big Blue Button and Jitsi APIs?
- Which platform do you recommend and why?
- Timeline estimate: Is 1.5-2 weeks realistic?
- Integration complexity: What's involved?
- Calendar integration: Google Cal/Outlook sync feasibility?
- Hosting recommendation: Which service provider?
- Any technical blockers or concerns?

*For Gabriel:*
- Does this approach align with your strategic vision?
- Any concerns about relying on hosted service vs self-hosting?
- Thoughts on per-session pricing model (BBB) vs per-user (Zoom)?

**1.2: Community Feed - getstream.io (15 min)**

*For Fraser:*
- Have you reviewed getstream.io documentation?
- Timeline estimate: Is 2-3 weeks realistic?
- React SDK integration complexity?
- Authentication integration concerns?
- Moderation tools: What's included vs what we build?
- Mobile responsiveness: Handled by SDK?
- Which getstream.io pricing tier for 75-100 users?
- Any technical blockers or concerns?

*For Gabriel:*
- Is in-platform community critical for marketplace positioning?
- Should we consider Discord/Slack as alternative? (Brian rejected these)
- How important is AI-sorted feed vs chronological?
- Concerns about community moderation at scale?

---

### 2. Remaining MUST HAVE Features (20 minutes)

**2.1: Core Business Features**

Brian needs decisions on:

1. **Payment & Enrollment (Stripe)**
   - Fraser: Timeline estimate?
   - Gabriel: Critical for H1 validation (premium pricing)
   
2. **Course Content Delivery**
   - Fraser: Video hosting approach? (Vimeo, YouTube unlisted, AWS?)
   - Gabriel: What's minimum viable content delivery?
   
3. **Student Dashboard**
   - Fraser: Complexity estimate?
   - Gabriel: What's critical to show vs nice-to-have?

4. **Landing Page & Course Catalog**
   - Fraser: Timeline for professional landing page?
   - Gabriel: Multi-creator catalog vs simple list?

**2.2: Teaching Economy Features**

5. **"Become a Student-Teacher" Flow**
   - Fraser: Application system complexity?
   - Gabriel: How important for H4 validation?

6. **Progress Tracking**
   - Fraser: What tracking is feasible in 4 months?
   - Gabriel: Minimum data needed for hypothesis validation?

**2.3: Multi-Creator Infrastructure**

7. **Creator Dashboard**
   - Fraser: What's required for 4-5 creators?
   - Gabriel: Can creators manage via admin panel, or need custom tools?

8. **Moderator Tools**
   - Fraser: Separate from community feed moderation?
   - Gabriel: Can this be 100% manual (Brian + moderators)?

---

### 3. Budget & Timeline Reality Check (15 minutes)

**Current Estimates:**
- Video conferencing: $1,700-3,800 (2-4% of budget)
- Community feed: $3,400-5,700 (4.5-7.6% of budget)
- Subtotal so far: $5,100-9,500 (6.8-12.7% of budget)
- Remaining: ~$65,000-70,000

**Questions:**

*For Fraser:*
- With $75K budget and 4 months, can you build all MUST HAVE features?
- What features might need to be cut or simplified?
- Should we plan to outsource any components?
- Any third-party services you recommend to save development time?
- Biggest technical risks or unknowns?

*For Gabriel:*
- Are we trying to do too much for Genesis cohort?
- Which features are truly critical vs "would be nice"?
- Can we test hypotheses with more manual operations?
- Should Brian recruit fewer creators (3 instead of 4-5) to reduce complexity?

---

### 4. Decision: Manual vs Automated (10 minutes)

**Polished Concierge Philosophy:**
- Students see professional platform
- Behind scenes, Brian can operate manually

**Which features can be manual?**

| Feature | Automated? | Manual Alternative? | Decision Needed |
|---------|------------|---------------------|-----------------|
| Video conferencing | YES | ❌ Core to model | MUST BUILD |
| Community feed | YES | ❌ Critical for H6 | MUST BUILD |
| Payment/Stripe | YES | ⚠️ Brian invoices manually? | DISCUSS |
| Student-Teacher tools | ? | ✅ Brian coordinates | DISCUSS |
| Moderator tools | ? | ✅ Manual moderation | DISCUSS |
| Progress tracking | ? | ✅ Brian tracks in spreadsheet | DISCUSS |
| Creator analytics | ? | ✅ Brian provides reports | DISCUSS |

*For Fraser:*
- What's the cost difference between automated vs manual for each?

*For Gabriel:*
- Which manual operations compromise hypothesis validation?
- Which are acceptable for Genesis cohort?

---

### 5. Prioritization & Trade-offs (10 minutes)

**If we need to cut scope, what goes first?**

*For Gabriel (Strategic Priority):*
- Rank features by hypothesis validation importance
- What's critical for Genesis cohort trust?
- What can be added in Phase 2 (post-June)?

*For Fraser (Technical Complexity):*
- Rank features by development effort
- What's quick wins vs heavy lifts?
- What has highest technical risk?

**Goal:** Create prioritized feature list where:
- Top features = definite MUST HAVE
- Middle features = build if time allows
- Bottom features = defer to Phase 2

---

### 6. Timeline & Next Steps (5 minutes)

**Dec 6 Deadline:**
- Fraser: Can we finalize complete spec by Dec 6?
- Gabriel: Any strategic decisions Brian needs to make first?
- Brian: What documentation does Fraser need before starting?

**Development Milestones:**
- Week 4 (Jan 3): What should be done?
- Week 8 (Jan 31): What should be done?
- Week 12 (Feb 28): What should be done?
- Week 16 (Apr 1): Launch-ready

**Action Items:**
- Fraser: Technical specs for BBB, getstream.io (by Dec 2?)
- Gabriel: Strategic feature prioritization (by Dec 2?)
- Brian: Creator recruitment plan (by Dec 6?)
- Team: Finalized feature list (by Dec 6)

---

## Questions to Ask

### For Fraser (Technical)

**Video Conferencing:**
1. BBB or Jitsi - which do you recommend after technical evaluation?
2. Can we complete integration in 1.5-2 weeks?
3. Best hosted service provider for MVP?
4. Calendar sync complexity (Google Cal, Outlook)?
5. Session recording storage approach?

**Community Feed:**
6. Can we complete getstream.io integration in 2-3 weeks?
7. Which getstream.io pricing tier for 75-100 users?
8. Auth integration with PeerLoop - any challenges?
9. How much UI customization vs default components?
10. Moderation tools - what's included vs custom build?

**Overall MVP:**
11. With $75K and 4 months, what's realistically achievable?
12. Biggest technical risks or blockers you foresee?
13. Should we outsource any components (e.g., landing page design)?
14. What third-party services would you recommend to save time?
15. Any features you think are too complex for MVP?

### For Gabriel (Strategic)

**Positioning:**
1. Is multi-creator marketplace essential for Genesis cohort, or could we start with 2-3 creators?
2. Should community feed be in-platform, or is Discord/Slack acceptable?
3. How important is "professional polish" vs "functional MVP"?

**Hypothesis Validation:**
4. Which features are absolutely critical to test the 6 hypotheses?
5. Can we validate H6 (Flywheel) without community feed?
6. Is Student-Teacher recruitment manual or platform-enabled?

**Scope:**
7. Are we trying to do too much for Genesis cohort?
8. What features could be 100% manual without compromising validation?
9. Should we reduce Genesis cohort size to reduce complexity?

**Timeline:**
10. Is Apr 1 launch realistic with this scope?
11. Should we push Genesis cohort to May 1 to give more dev time?

---

## Materials to Share

**Before Meeting:**
- [x] This meeting prep document
- [ ] `docs/SCOPE-CHANGE-2025-11-25.md` - Context on 3x scope increase
- [ ] `mvp-decisions/2025-11-25-video-conferencing-integration.md` - BBB decision rationale
- [ ] `mvp-decisions/2025-11-25-community-feed-getstream.md` - getstream.io decision rationale
- [ ] `features/must-have/video-conferencing-integration.md` - Feature spec
- [ ] `features/must-have/community-feed-getstream.md` - Feature spec

**During Meeting:**
- Whiteboard or shared doc for feature prioritization exercise
- Budget/timeline tracker

---

## Expected Outcomes

By end of meeting, we should have:

- [ ] Fraser's recommendation: BBB or Jitsi
- [ ] Fraser's recommendation: getstream.io feasible? Which tier?
- [ ] Fraser's timeline estimates for both features confirmed or revised
- [ ] Agreement on remaining MUST HAVE features (final list)
- [ ] Agreement on which features can be manual vs automated
- [ ] Prioritized feature list (if scope needs cutting)
- [ ] Fraser's overall feasibility assessment ($75K, 4 months)
- [ ] Gabriel's strategic validation of approach
- [ ] Action items with owners and deadlines
- [ ] Go/no-go decision on Dec 6 dev start

---

## Follow-Up Actions

**After meeting:**
- [ ] Document all decisions (use Q-DECIDE for each feature)
- [ ] Update feature specs based on Fraser's technical feedback
- [ ] Create final MVP specification document for Fraser
- [ ] Share meeting summary with Fraser, Gabriel, Guy (if needed)
- [ ] Update budget tracker with revised estimates
- [ ] Update timeline with development milestones
- [ ] Schedule follow-up if major decisions remain

---

## Meeting Notes Section

*(Fill during/after meeting)*

### Fraser's Technical Assessments

**BBB vs Jitsi:**
- Recommendation:
- Rationale:
- Timeline:
- Cost:

**getstream.io:**
- Feasibility:
- Timeline:
- Tier recommendation:
- Concerns:

**Overall MVP:**
- Go/no-go on Dec 6 start:
- Features to cut/simplify:
- Additional services needed:
- Biggest risks:

### Gabriel's Strategic Input

**Scope:**
- Too ambitious?
- Features to deprioritize:
- Manual vs automated decisions:

**Hypothesis Validation:**
- Critical features confirmed:
- Acceptable trade-offs:

**Timeline:**
- Apr 1 realistic?
- Recommendations:

### Decisions Made

1. 
2. 
3. 
4. 
5. 

### Action Items

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| | | | |
| | | | |
| | | | |

---

## Key Insights

*(Add during meeting)*

- 
- 
- 

---

**Last Updated:** 2025-11-26
**Meeting Status:** Scheduled / Completed
**Follow-up Required:** Yes / No









