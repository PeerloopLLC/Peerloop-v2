# PeerLoop: Feature Block Breakdown for Fraser Review

**Date:** December 6, 2025  
**From:** Brian  
**To:** Fraser  
**Purpose:** Review feature scope by block and provide feedback

---

## How to Read This Document

Each feature shows what's included in Block 1, 2, and 3:
- **Block 1:** Minimal viable (end-to-end flow works)
- **Block 2:** Operational (Creator manages without Brian)
- **Block 3:** Full features (scale and polish)

**Please review and provide feedback on:**
1. Are the Block 1 scopes realistic for 3-4 weeks total?
2. Any scope that should move between blocks?
3. Technical concerns or dependencies I'm missing?
4. Your recommended build order within Block 1?

---

# Core Features (Block 1 Scope Defined)

---

## 1. User Authentication

| Block | Scope |
|-------|-------|
| **Block 1** | Signup, login, password reset, role assignment (student/S-T/creator/admin) |
| **Block 2** | Social login (Google), remember me, account settings |
| **Block 3** | 2FA, SSO, login history, device management |

---

## 2. Payments (Stripe)

| Block | Scope |
|-------|-------|
| **Block 1** | Stripe Checkout, instant enrollment, receipts, webhooks |
| **Block 2** | 70/15/15 split calculation, payout dashboard, "Process Payout" button |
| **Block 3** | Stripe Connect (auto payouts), subscriptions, refunds, discount codes |

---

## 3. Calendar/Scheduling

| Block | Scope |
|-------|-------|
| **Block 1** | S-T availability, student booking, confirmations, calendar invite (.ics) |
| **Block 2** | Reminders (24h, 1h), cancel/reschedule, blocked dates |
| **Block 3** | Recurring sessions, waitlists, calendar sync (Google/Outlook) |

**Question for Fraser:** Which approach do you recommend?
- A) Cal.com integration
- B) react-big-calendar + custom
- C) Google Calendar API

**📝 BRIAN'S NOTE - AI-Powered S-T Matching:**
When students view available Student-Teachers, we want AI/algorithm-based listing (not random or alphabetical). Similar to algorithmic feeds, the system should recommend the BEST MATCH for each student. Consider factors like:
- S-T availability alignment with student's preferred times
- S-T teaching style / student learning style compatibility
- S-T rating and completion rates
- S-T capacity (don't overload top performers)
- Student's stated goals/interests matched to S-T strengths

Block 1: Simple listing (student chooses)
Block 2: Basic sorting (by rating, availability)
Block 3: Full AI-powered matching algorithm

---

## 4. Video Conferencing (BigBlueButton)

| Block | Scope |
|-------|-------|
| **Block 1** | Room creation, join links, basic video/audio/screenshare |
| **Block 2** | Session recording, playback interface, attendance tracking |
| **Block 3** | Embedded video, whiteboard, breakout rooms, transcription |

**Note:** Using hosted BBB provider (not self-hosted)

---

## 5. Course Content

| Block | Scope |
|-------|-------|
| **Block 1** | Module list, external links (YouTube/Drive), progress checkboxes |
| **Block 2** | Module locking, resume progress, notes, download materials |
| **Block 3** | Video hosting, quizzes, auto-grading, certificates, drip content |

---

## 6. Creator Dashboard

| Block | Scope |
|-------|-------|
| **Block 1** | Stats, enrolled students list, student progress, upcoming sessions, S-T list |
| **Block 2** | Certification approval workflow, payout approval workflow, S-T application approval, action alerts |
| **Block 3** | Full analytics, funnels, revenue charts, flywheel metrics, course editor |

---

## 7. Student Dashboard

| Block | Scope |
|-------|-------|
| **Block 1** | Enrolled course, progress bar, upcoming session, "Join Session" button |
| **Block 2** | Session history, recordings access, "Become S-T" prompt |
| **Block 3** | Multiple courses, badges, streaks, certificates, recommendations |

---

## 8. Student-Teacher Dashboard

| Block | Scope |
|-------|-------|
| **Block 1** | Assigned students, student progress, upcoming sessions, set availability |
| **Block 2** | Earnings tracking, "Recommend for Certification" button, session notes |
| **Block 3** | Performance metrics, teaching tips, tax documents |

---

## 9. Email Notifications

| Block | Scope |
|-------|-------|
| **Block 1** | Enrollment confirmation, booking confirmation, BBB link, password reset |
| **Block 2** | Session reminders (24h, 1h), certification approved, payout processed |
| **Block 3** | Inactivity nudges, marketing emails, notification preferences |

---

# Deferred Features (Block 2+ Only)

---

## 10. Profile System

| Block | Scope |
|-------|-------|
| **Block 1** | Basic info in dashboards only (name, photo) |
| **Block 2** | Public profile page, follow/unfollow, S-T directory, privacy settings |
| **Block 3** | Profile search, badges, endorsements, mutual connections |

---

## 11. Community Feed

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip (use Discord for Genesis) |
| **Block 2** | GetStream integration, posts, likes, comments, follows |
| **Block 3** | AI-sorted feed, DMs, moderation tools, polls |

---

## 12. Creator Journey (Onboarding)

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip (Brian onboards 4-5 creators manually) |
| **Block 2** | Application form, onboarding checklist, course setup, publish flow |
| **Block 3** | AI screening, self-service creation, creator community |

---

## 13. Admin Dashboard (Brian's View)

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip (Brian uses Creator dashboards + Stripe) |
| **Block 2** | Platform stats, all courses/creators list, exception handling |
| **Block 3** | Full analytics, hypothesis tracking, moderation queue |

---

# Undecided Features (Need Discussion)

---

## 14. Ratings & Reviews

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip |
| **Block 2** | ⚠️ **UNDECIDED** |
| **Block 3** | Full reviews, rating breakdown, public display |

**Open Questions:**
- Who rates whom? (Student rates S-T? Both ways?)
- When does rating happen? (After completion? After each session?)
- Are ratings public or private?

---

## 15. Certification System

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip (Brian grants manually) |
| **Block 2** | S-T recommends → Creator approves → Certificate issued |
| **Block 3** | ⚠️ **UNDECIDED** - Auto-cert? Templates? Verification link? |

**Open Questions:**
- What does the certificate look like? (PDF? Digital badge?)
- Do we need public verification URL?

---

## 16. Waitlist / Capacity Management

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip |
| **Block 2** | ⚠️ **UNDECIDED** |
| **Block 3** | Waitlist, auto-assignment, load balancing |

**Open Questions:**
- Max students per S-T? (5? 10? Unlimited?)
- What happens when S-T is full?

---

## 17. Session Quality / Feedback

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip |
| **Block 2** | ⚠️ **UNDECIDED** |
| **Block 3** | Session ratings, feedback forms |

**Open Questions:**
- How do we measure S-T teaching quality? (H5 validation)
- Post-session feedback form?

**📝 BRIAN'S NOTE - S-T Feedback on Students:**
After each session, we need to gather feedback FROM the Student-Teacher ABOUT the student:
- Was the student prepared for the session?
- Was the student engaged and participatory?
- Was the student rude or difficult?
- Does the student need to revisit earlier material?
- Any concerns about this student's progress?
- Ready to move forward to next module?

This is SECONDARY assessment data (S-T assessing student readiness/behavior), separate from student rating the S-T. Important for:
- Identifying struggling students early
- Quality control on student engagement
- Helping Creators understand student needs
- Flagging potential issues before they escalate

---

## 18. Refunds & Disputes

| Block | Scope |
|-------|-------|
| **Block 1** | ❌ Skip (Brian handles manually) |
| **Block 2** | ⚠️ **UNDECIDED** |
| **Block 3** | Refund requests, dispute resolution |

**Open Questions:**
- What's the refund policy?
- When is money released from escrow?

---

## 19. Multi-Course Support

| Block | Scope |
|-------|-------|
| **Block 1** | One course per Creator |
| **Block 2** | ⚠️ **UNDECIDED** |
| **Block 3** | Multiple courses, bundles, cross-selling |

**Open Questions:**
- Can Creator have 2+ courses in MVP?
- Can S-T teach multiple courses?

---

# Block 1 Summary

## What's IN Block 1 (9 Features)

| # | Feature | Block 1 Deliverable |
|---|---------|---------------------|
| 1 | User Auth | Signup, login, password reset, roles |
| 2 | Payments | Stripe Checkout → instant enrollment |
| 3 | Calendar | S-T availability + student booking |
| 4 | Video | BBB room creation + join links |
| 5 | Course Content | Modules + external links + checkboxes |
| 6 | Creator Dashboard | Stats, students, progress, sessions |
| 7 | Student Dashboard | Course, progress, upcoming session |
| 8 | S-T Dashboard | Students, sessions, availability |
| 9 | Email | Enrollment, booking, password reset |

## What's OUT of Block 1 (Deferred)

| Feature | Reason |
|---------|--------|
| Profile System (full) | Basic info in dashboards sufficient |
| Community Feed | Discord/WhatsApp for Genesis |
| Creator Journey | Brian onboards manually |
| Admin Dashboard | Brian uses Creator dashboards |
| Certifications | Brian grants manually |
| Payouts | Brian tracks manually |
| S-T Applications | Brian/Creator handles manually |
| Ratings | Not needed for Block 1 |

---

# Questions for Fraser

## Technical Questions

1. **Calendar:** Which approach - Cal.com, react-big-calendar, or Google Calendar API?
2. **BBB:** Any concerns with hosted provider integration?
3. **Stripe:** Stripe Checkout vs custom payment form?
4. **Database:** PostgreSQL OK? Any schema concerns?
5. **Hosting:** Vercel + Railway? Or different recommendation?

## Scope Questions

6. **Block 1 Timeline:** Is 3-4 weeks realistic for Block 1 scope?
7. **Build Order:** Within Block 1, what do you build first?
8. **Risk:** Which Block 1 feature has highest risk of overrun?
9. **Simplify:** Anything in Block 1 that could be simplified?
10. **Dependencies:** Any dependencies I'm missing?

## Block 2 Questions

11. **Certification Workflow:** How complex is the approval UI?
12. **Payout Processing:** Stripe Transfer or PayPal for payouts?
13. **GetStream:** Any experience with their SDK?

---

# Timeline Overview

| Block | Duration | Deliverable |
|-------|----------|-------------|
| **Block 1** | 3-4 weeks | End-to-end flow works |
| **Block 2** | 3-4 weeks | Creator manages course |
| **Block 3** | 4-6 weeks | Full features |
| **Buffer** | 2 weeks | Testing + polish |
| **Total** | 12-16 weeks | Complete MVP |

**Target Launch:** April 1, 2026

---

# Next Steps

1. Fraser reviews this document
2. Fraser provides feedback / asks questions
3. Brian + Fraser align on Block 1 scope
4. Fraser provides Block 1 time estimate
5. Development begins

---

**Document Status:** Ready for Fraser Review  
**Feedback Requested By:** [Date TBD]

---

*End of Document*

