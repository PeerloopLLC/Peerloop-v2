# Meeting Prep: MVP Spec Review with Fraser & Gabriel

**Date:** [Schedule TBD]  
**Prepared:** December 2, 2025  
**Purpose:** MVP Spec Review, Technical Validation, Gap Analysis  
**Duration:** 60-90 minutes recommended  
**Attendees:** Brian (Founder), Fraser (Developer), Gabriel (Strategic Advisor)

---

## Meeting Objectives

1. **MVP Spec Review** - Walk through all 8 decided features, confirm alignment
2. **Technical Validation** - Fraser confirms estimates, architecture, timeline
3. **Gap Analysis** - Discuss 3 potential gaps, decide if they need budget
4. **Lock Feature Set** - Final decisions before Dec 6 deadline

---

## Executive Summary for Fraser & Gabriel

### What's Been Decided (8 MUST HAVE Features)

| # | Feature | Status | Dev Cost | Timeline |
|---|---------|--------|----------|----------|
| 1 | Video Conferencing (BBB) | ✅ MUST HAVE | $2.4K-3.6K/yr | - |
| 2 | Community Feed (getstream.io) | ✅ MUST HAVE | $3.4K-5.7K/yr | - |
| 3 | Calendar/Scheduling | ✅ MUST HAVE | $1.7K-3.8K | 1-2 weeks |
| 4 | Student Profile System | ✅ MUST HAVE | $14K-18.7K | 3-4 weeks |
| 5 | Creator Profiles | ✅ MUST HAVE | $500 | <1 week |
| 6 | Rebrand to PeerLoop | ✅ COMPLETE | - | Done |
| 7 | Payment & Escrow | ✅ MUST HAVE | $11K-15K | 2-3 weeks |
| 8 | Course Content Delivery | ✅ MUST HAVE | $2K-4K | ~1 week |

### Budget Status

| Metric | Value |
|--------|-------|
| **Phase 1 Budget** | $75,000 |
| **Allocated** | $46K-62K (61-83%) |
| **Remaining** | $13K-29K |
| **Status** | ⚠️ Getting tight |

### Timeline Status

| Milestone | Date | Status |
|-----------|------|--------|
| MVP Spec Deadline | Dec 6, 2025 | **4 days away** |
| Build Period | Dec 6 → Apr 1 | ~4 months |
| Genesis Cohort | Apr 1 → Jun 1 | 60-80 students |

---

## Context: What We're Building

### The PeerLoop Model

- **Learn, Teach, Earn** flywheel
- Student completes course → Becomes Student-Teacher → Teaches others → Earns 70%
- Revenue split: 70% Student-Teacher / 15% Creator / 15% Platform
- Genesis cohort: 60-80 students across 4-5 courses

### Key Operational Insight (from Dec 2 session)

**Creators control their courses:**
- Creator approves certifications
- Creator approves payouts
- Creator approves new Student-Teachers

**Brian (Platform) = Strategic oversight only:**
- ~3-4 hours/week for 60-80 students
- Creator onboarding
- Exception handling
- Platform monitoring

---

## Agenda

### 1. Feature-by-Feature Review (30 min)

Walk through each MUST HAVE feature, confirm:
- ✅ Scope understood correctly
- ✅ Estimate is realistic
- ✅ Dependencies identified
- ✅ Any blockers?

**Features to review:**

#### 1.1 Video Conferencing (BigBlueButton)
- **Decision:** Use hosted BBB provider
- **Cost:** $200-300/month
- **Question for Fraser:** Integration complexity? Estimated dev time for BBB room creation + link delivery?

#### 1.2 Community Feed (getstream.io)
- **Decision:** Use GetStream.io for activity feeds
- **Cost:** $99-299/month (Activity Feeds tier)
- **Question for Fraser:** SDK integration experience? Timeline estimate?

#### 1.3 Calendar/Scheduling
- **Options for Fraser:** Cal.com (B), Custom react-big-calendar (D), or Google Calendar API (E)
- **Question for Fraser:** Which do you recommend? Why?
- **Requirements:** ~60 sessions/week, Student-Teacher availability, auto-notifications

#### 1.4 Student Profile System
- **Scope:** Profile pages, follow/followers, Student-Teacher toggle, discovery
- **Estimate:** $14K-18.7K, 3-4 weeks
- **Question for Fraser:** Is this estimate accurate? Can we phase it?

#### 1.5 Creator Profiles
- **Scope:** Basic info page for 4-5 creators
- **Estimate:** $500, <1 week
- **Question for Fraser:** Can this be simplified further?

#### 1.6 Payment & Escrow
- **Approach:** Semi-automated (Stripe + Brian clicks to process payouts)
- **Estimate:** $11K-15K, 2-3 weeks
- **Question for Fraser:** Stripe Checkout vs custom form? Webhook complexity?

#### 1.7 Course Content Delivery
- **Scope:** Simple course page, external video links, self-mark progress
- **Estimate:** $2K-4K, ~1 week
- **Question for Fraser:** Does this include Creator Dashboard views for certification/payout approval?

---

### 2. Gap Analysis (15 min)

Three potential gaps identified in session today:

#### Gap 1: Certification Workflow

**Described in user journey but possibly not budgeted:**
```
Student-Teacher clicks [Recommend for Certification]
→ Creator sees request in dashboard
→ Creator clicks [Approve Certification]
→ Certificate issued to student
```

**Question for Fraser:**
- Is this UI included in Course Content ($2K-4K)?
- If not, what's the additional cost?
- Could we handle this semi-manually for Genesis? (ST emails Creator, Creator updates system)

#### Gap 2: Student-Teacher Application Workflow

**Described in user journey but possibly not budgeted:**
```
Student clicks [Apply to Teach This Course]
→ Creator sees application in dashboard
→ Creator clicks [Approve as Student-Teacher]
→ Student can now set availability and teach
```

**Question for Fraser:**
- Is this included in Student Profile System ($14K-18.7K)?
- If not, what's the additional cost?
- Could Brian/Creator manually update roles for Genesis?

#### Gap 3: Student Dashboard/Home

**After login, what does student see?**
- Enrolled courses
- Next upcoming session
- Progress at a glance
- Quick action buttons

**Question for Fraser:**
- Is a unified student home view included in existing estimates?
- Or does student navigate directly to Course Page / Calendar / Profile?
- What's minimal viable landing experience?

**Estimated gap budget:** $2K-4K total (if needed)

---

### 3. Technical Validation (15 min)

**Questions for Fraser:**

#### Architecture
1. What's the overall tech stack you're planning?
2. Any concerns about integrating BBB + GetStream + Stripe?
3. Database: PostgreSQL? Schema concerns?

#### Timeline
4. Is 4 months (Dec 6 → Apr 1) realistic for this scope?
5. What's the build sequence? (What first, what last?)
6. Any features that could slip to Phase 2 if needed?

#### Risk Assessment
7. What's the riskiest feature to build?
8. Any technical blockers you foresee?
9. What would you cut first if timeline gets tight?

#### Dependencies
10. What do you need from Brian to start? (Stripe account, BBB account, etc.)
11. Any third-party signups needed?

---

### 4. Strategic Alignment (10 min)

**Questions for Gabriel:**

#### Hypothesis Coverage
1. Looking at the 8 features, do you see gaps in hypothesis validation?
2. Brian's top uncertainty is H6 (Flywheel) - is Student Profile System enough to test this?
3. H5 (Peer Teaching Quality) has no direct feature - is manual feedback collection acceptable?

#### Prioritization
4. If budget gets tight, what would you cut?
5. What's the ONE feature that must be perfect vs "good enough"?

#### Risk
6. What's the biggest risk to Genesis cohort success?
7. Any concerns about the Dec 6 → Apr 1 timeline?

---

### 5. Decisions Needed (10 min)

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Calendar/Scheduling approach | Cal.com (B) vs Custom (D) vs Google (E) | Fraser to recommend |
| Gap 1: Certification workflow | Include in MVP vs Manual for Genesis | Likely manual OK |
| Gap 2: ST Application workflow | Include in MVP vs Manual for Genesis | Likely manual OK |
| Gap 3: Student Dashboard | Build minimal vs Defer | Need Fraser input |
| Session Quality Tracking (H5) | Build rating system vs Manual feedback | Manual OK for Genesis |

---

## Materials to Share Before Meeting

**Send to Fraser & Gabriel:**

- [ ] This meeting prep document
- [ ] `mvp-decisions/` folder (all 8 decision docs)
- [ ] `docs/brian-mvp-context.md` (full context)
- [ ] Course Content Delivery user journey (complete flow)

**Key documents:**
1. `mvp-decisions/2025-12-02-course-content-delivery.md` - Has complete user journey
2. `mvp-decisions/2025-11-30-student-profile-system.md` - Most detailed feature spec
3. `mvp-decisions/2025-12-02-payment-escrow-system.md` - Payment approach

---

## Expected Outcomes

By end of meeting, we should have:

- [ ] Fraser confirms all estimates are realistic
- [ ] Fraser recommends Calendar approach (B, D, or E)
- [ ] Gap analysis resolved (include vs manual)
- [ ] Gabriel confirms hypothesis coverage is adequate
- [ ] Build sequence agreed (what to build first)
- [ ] Any scope cuts identified (if needed)
- [ ] Green light to lock MVP spec on Dec 6

---

## Follow-Up Actions

**After meeting:**

- [ ] Update feature specs based on Fraser's feedback
- [ ] Document any scope changes (Q-DECIDE if needed)
- [ ] Create final MVP Spec document
- [ ] Share locked spec with team by Dec 6
- [ ] Fraser begins development

---

## Pre-Meeting Checklist

**Brian to do before meeting:**

- [ ] Schedule meeting with Fraser & Gabriel
- [ ] Send this document + supporting materials
- [ ] Review Course Content user journey (refresh on the flow)
- [ ] Prepare to make decisions (bring 70% mindset)

---

## Notes Section

*(Fill during/after meeting)*

### Fraser's Feedback:


### Gabriel's Feedback:


### Decisions Made:


### Action Items:
| Item | Owner | Due |
|------|-------|-----|
| | | |
| | | |
| | | |

---

## Quick Reference: The 6 Hypotheses

| # | Hypothesis | Test | Status |
|---|------------|------|--------|
| H1 | Students pay $300-600 | Genesis payments | Payment System ✅ |
| H2 | 75%+ completion rate | Track completions | Content Delivery ✅ |
| H3 | Two customer segments | Analyze enrollments | Profile System ✅ |
| H4 | 10%+ become Student-Teachers | Track conversions | Profile System ✅ |
| H5 | Peer teaching matches experts | Quality feedback | **Manual for MVP** |
| H6 | Flywheel (2+ students recruited) | Track network growth | Profile System ✅ |

---

**Document Created:** December 2, 2025  
**For Meeting:** Fraser & Gabriel MVP Review  
**Status:** Ready to share

---

**End of Meeting Prep Document**



























