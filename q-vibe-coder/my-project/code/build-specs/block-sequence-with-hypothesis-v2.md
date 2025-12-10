# PeerLoop Block Sequence: From Zero to Flywheel

**Version:** 2.0  
**Date:** 2025-12-08  
**Author:** Gabriel Rymberg (with Claude)  
**Status:** DRAFT - For Review

---

## Document Overview

### Purpose
Break the MVP into small, testable, deployable increments while tracking hypothesis validation.

### What's New in v2.0
- User journey narratives for all actors
- Actor-block matrix showing when each persona gets functionality
- Dec 7 decisions integrated as Block 1.x features
- Brian's Block 1/2/3 mapped to our 0.x/1.x/2.x sequence

### Document Structure
- **Part 0:** User Journey Narratives - The human stories we're building for
- **Part 1:** Philosophy & Hypotheses - Why we build what we build
- **Part 2:** Block Structure & Actor Mapping - Who does what when
- **Part 3:** Block Sequence Detail - Overview of all blocks
- **Part 4:** Detailed Block Specifications - Deep dive into each block
- **Part 5:** Block 1.x Community Features - Dec 7 decisions
- **Parts 6-11:** Summaries, Timeline, Decisions, Next Steps

---

# Part 0: User Journey Narratives

Before diving into blocks and hypotheses, here are the human stories we're building for.

## Sarah's Journey (Student)

Sarah finds PeerLoop, browses courses without logging in, and enrolls in "AI Prompting Mastery" for $450. After payment, she schedules her first session with Marcus (a Student-Teacher), receives a confirmation email with video link, and starts learning.

> **🔴 Brian's Comment:** Missing step: Before paying $450, Sarah needs a way to ask questions or talk to Marcus/Guy. For a new platform with no reviews, this trust-building step is critical for H1 validation. Consider: Sarah messages Marcus with questions → gets comfortable → THEN enrolls.

Over 5 weeks, she watches course videos, attends weekly 1-on-1 BBB sessions with Marcus, messages him with questions, engages in the community feed, and marks her progress.

When she completes all modules, Marcus recommends her for certification, Guy (the Creator) approves, and Sarah receives her certificate. She then applies to become a Student-Teacher herself—Guy approves, and now Sarah can teach others and earn 70% per student.

**Blocks touched:** 0.1 → 0.2 → 0.3 → 0.4 → 0.5 → 0.6 → (becomes S-T)

---

## Marcus's Journey (Student-Teacher)

Marcus completed Guy's course three months ago and now teaches others. He sets his weekly availability in his dashboard, and when students like Sarah book with him, he receives email notifications with BBB links.

He conducts 1-on-1 video sessions, guides students through the material, answers their messages between sessions, and tracks each student's progress in his dashboard.

When a student completes the course, Marcus clicks "Recommend for Certification" and Guy makes the final approval. After approval, Marcus receives 70% ($315) of each student's payment via Stripe.

His profile shows his teaching badge and student count, building his reputation.

**Blocks touched:** 0.3 → 0.4 → 0.5 → 0.7 (payouts)

---

## Guy's Journey (Creator)

Guy created "AI Prompting Mastery" and worked with Brian to set it up on PeerLoop. He doesn't teach every student—his Student-Teachers (Marcus, Jessica) do that.

Guy monitors his Creator Dashboard daily: enrollments, student progress, session activity, and revenue.

When Student-Teachers recommend students for certification, Guy reviews and approves. When courses complete, Guy approves payouts and the 70/15/15 split processes automatically via Stripe.

When students apply to become Student-Teachers, Guy vets and approves them. He posts announcements to the community feed and manages his teaching team.

**He earns 15% of every enrollment while his Student-Teachers handle the teaching.**

**Blocks touched:** 0.0 (seed data) → 0.5 → 0.6 → 0.7

---

## Brian's Journey (Admin)

Brian runs PeerLoop but doesn't manage individual courses—Creators do that.

He onboards new Creators by evaluating their courses, collecting their content, and setting them up in the system.

He monitors platform health through admin access to all Creator dashboards and the Stripe dashboard.

He handles platform-level exceptions: refunds, disputes Creators can't resolve, and technical issues. He messages Creators and students for support and announcements.

**His weekly time is 3-4 hours—strategic oversight, not daily operations.** Each Creator manages their own certifications, payouts, and Student-Teacher approvals.

**Blocks touched:** 0.0 (setup) → monitoring via Stripe dashboard

---

## Visitor's Journey (Before Login)

A visitor lands on PeerLoop's homepage and sees the "Learn, Teach, Earn" value proposition. They browse available courses, view pricing, read course descriptions and curriculum outlines—all without logging in.

They click into Creator profiles to see credentials and Student-Teacher profiles to see who might teach them. When they try to enroll or access community features, they're prompted to sign up.

They create an account with email/password, and become a Student.

**Blocks touched:** 0.1 (discovery, signup, payment)

> **🔴 Brian's Comment:** Add: Visitor can message Creator or S-T with questions before enrolling. Even a simple contact form or chat helps build trust for a high-ticket purchase on an unproven platform. Also consider: Visitor books a FREE 15-min intro session to meet their potential S-T before committing $450.

---

## Community Moderator (Post-MVP)

A Community Moderator is appointed by a Creator to help manage their course community. They monitor the community feed, answer student questions, delete inappropriate posts, ban repeat offenders, pin important announcements, and manage a queue of flagged content.

**Deferred to:** Block 2+ (after flywheel validation)

---

## Employer/Funder (Post-MVP)

An employer wants to sponsor employee learning. They pay for a student's enrollment, receive progress updates as the student advances, and get a copy of the certification upon completion.

**Deferred to:** P1+ (post-validation)

---

# Part 1: Philosophy

> **We are not building features. We are proving hypotheses.**

Each block delivers working software that real humans can use. Each block tests specific hypotheses. We don't move to the next block until we've learned what we need to learn.

**The schema grows with each block.** We don't design everything upfront. Each block adds only the tables and fields it needs.

### The Approach
- Small, testable, deployable increments
- Each block proves something specific
- GO / FIX / PIVOT decision after each block
- Data-driven validation of hypotheses

---

## The Six Core Hypotheses

These are the fundamental assumptions we must validate. Everything we build should test one or more of these.

| ID | Hypothesis | Success Criteria | Uncertainty |
|----|------------|------------------|-------------|
| **H1** | **Market Positioning:** Students will pay tutoring prices ($300-600) | Students complete purchase at these price points | Medium-High |
| **H2** | **Completion Rates:** 75%+ completion (vs 10-20% for MOOCs) | Measured completion rate ≥75% | Medium |
| **H3** | **Customer Segmentation:** Attract both "Earn-While-Learn" and "Premium Learner-Only" | See both segments in user behavior | Low |
| **H4** | **Conversion to Teaching:** 10%+ become Student-Teachers | ≥10% of certified students apply to teach | Medium-High |
| **H5** | **Peer Teaching Quality:** Match expert outcomes | Student learning outcomes comparable to expert teaching | Medium |
| **H6** | **Flywheel Validation:** Second generation emerges | Student-Teachers successfully teach new students | **HIGHEST** |

### Brian's Top 3 Uncertainties (ranked)
1. Will Student-Teachers recruit 2+ students? **← MOST uncertain**
2. Will second-generation emerge?
3. Will students pay $400-600?

---

# Part 2: Block Terminology Mapping

Brian's planning documents use "Block 1" and "Block 2" terminology. Here's how they map to our detailed 0.x sequence:

| Brian's Terminology | Our Blocks | What's Included |
|---------------------|------------|-----------------|
| **Block 1** (Core Flow) | 0.0 → 0.7 | Foundation through Flywheel validation |
| **Block 2** (Community + Profiles) | 1.0 → 1.x | Messaging, community feed, follows, file uploads |
| **Block 3** (Polish) | 2.0+ | Advanced features, employer/funder, moderators |

### Summary
- **Block 0.x** = Prove the flywheel works
- **Block 1.x** = Add community features
- **Block 2.x** = Scale and polish

---

## Actor-Block Matrix

This shows when each actor gets meaningful functionality:

```
                    Block Sequence (0.x = Flywheel Validation)
Actor          0.0   0.1   0.2   0.3   0.4   0.5   0.6   0.7   1.x   2.x
─────────────────────────────────────────────────────────────────────────
Visitor         ·    ████   ·     ·     ·     ·     ·     ·    ░░░░  ░░░░
Student         ·    ████  ████  ████  ████  ████   ·     ·    ████  ████
Student-Teacher ·     ·     ·    ████  ████  ████  ████  ████  ████  ████
Creator        ████   ·     ·     ·    ░░░░  ████  ████  ████  ████  ████
Admin (Brian)  ████  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ░░░░  ████  ████
Moderator       ·     ·     ·     ·     ·     ·     ·     ·    ████  ████
Employer        ·     ·     ·     ·     ·     ·     ·     ·     ·    ████
─────────────────────────────────────────────────────────────────────────

Legend: ████ = Primary functionality  ░░░░ = Supporting/viewing role  · = Not active yet
```

### Actor Story Counts

| Actor | Total Stories | P0 (MVP Critical) | In Block 0.x |
|-------|---------------|-------------------|--------------|
| Visitor | 15 | 15 | 15 |
| Student | 56 | ~35 | ~25 |
| Student-Teacher | 23 | ~18 | ~15 |
| Creator | 36 | ~25 | ~12 |
| Admin (Brian) | 29 | ~15 | ~5 |
| System/Platform | 84 | ~45 | ~30 |
| Community Moderator | 9 | 2 | 0 |
| Employer/Funder | 6 | 0 | 0 |
| **TOTAL** | **258** | **~135** | **~72** |

---

## The Critical Journey (Actor View)

This is the path we must prove works, showing which actor is active at each step:

> **🔴 Brian's Comment:** Gap: The jump from "discovers course" to "pays $450" skips trust-building. Real journey likely needs: Visitor → asks question/books free intro → gets response/meets S-T → feels confident → pays. Especially critical for Genesis cohort with no social proof.

```
[VISITOR] discovers course on homepage
       ↓                                    ← Block 0.1
[VISITOR → STUDENT] pays $450
       ↓                                    ← Tests H1 (Market Positioning)
[STUDENT] accesses content
       ↓                                    ← Block 0.2, Enables H2, H5
[STUDENT] schedules session with [STUDENT-TEACHER]
       ↓                                    ← Block 0.3
[STUDENT] + [STUDENT-TEACHER] attend 1-on-1 session
       ↓                                    ← Tests H5 (Peer Teaching Quality)
[STUDENT] marks progress, repeats sessions
       ↓                                    ← Block 0.4, Tests H2
[STUDENT] completes all modules
       ↓                                    ← Validates H2
[STUDENT-TEACHER] recommends for certification
       ↓                                    ← Block 0.5
[CREATOR] approves certification
       ↓                                    ← Validates H5 (quality control)
[STUDENT → APPLICANT] applies to become Student-Teacher
       ↓                                    ← Block 0.6, Tests H4
[CREATOR] approves → [APPLICANT → STUDENT-TEACHER]
       ↓                                    ← Validates H4, Tests H3
[NEW STUDENT] enrolls, books with [NEW STUDENT-TEACHER]
       ↓                                    ← Block 0.7, Tests H6
[CREATOR] approves payout → [STUDENT-TEACHER] gets paid
       ↓                                    ← Validates H3, H6
🔄 FLYWHEEL VALIDATED
```

---

# Part 3: Block Sequence Overview

| Block | Name | Actors Active | Hypotheses | Duration |
|-------|------|---------------|------------|----------|
| **0.0** | Foundation | Creator, Admin | (Enables all) | 1 week |
| **0.1** | Discovery & Payment | Visitor, Student | H1 | 1 week |
| **0.2** | Content Access | Student | (Enables H2, H5) | 1 week |
| **0.3** | Scheduling & Sessions | Student, S-T | H5 | 1-2 weeks |
| **0.4** | Progress & Completion | Student, S-T, Creator | H2 | 1 week |
| **0.5** | Certification | Student, S-T, Creator | H2, H5 | 1 week |
| **0.6** | Become Student-Teacher | Student, Creator | H4, H3 | 1 week |
| **0.7** | Flywheel & Payouts | All core actors | H6, H3 | 1-2 weeks |

**Total: 8-11 weeks** to test all 6 hypotheses

---

## Hypothesis Coverage by Block

```
          H1    H2    H3    H4    H5    H6
          Market Compl Segmt Conv  Qual  Flywheel
Block 0.0  ·     ·     ·     ·     ·     ·       (infrastructure)
Block 0.1  ████  ·     ·     ·     ·     ·       H1 tested
Block 0.2  ·     ░░░░  ·     ·     ░░░░  ·       H2,H5 enabled
Block 0.3  ·     ·     ·     ·     ████  ·       H5 tested
Block 0.4  ·     ████  ·     ·     ·     ·       H2 tested
Block 0.5  ·     ████  ·     ·     ████  ·       H2,H5 validated
Block 0.6  ·     ·     ████  ████  ·     ·       H3,H4 tested
Block 0.7  ·     ·     ████  ·     ·     ████    H3,H6 validated

Legend: ████ = Primary test  ░░░░ = Enabled/partial
```

---

## The Growing Data Model

The database schema grows incrementally. Each block adds only what it needs.

```
Block 0.0: Foundation
┌─────────────────────────────────────────────────────────────────┐
│  users                        │  courses                        │
│  ─────                        │  ───────                        │
│  id                           │  id                             │
│  email                        │  title                          │
│  password_hash                │  description                    │
│  name                         │  price                          │
│  role                         │  creator_id → users             │
│  created_at                   │  created_at                     │
└─────────────────────────────────────────────────────────────────┘

Block 0.1: + enrollments (user_id, course_id, stripe_payment_id, amount_paid)
Block 0.2: + modules (course_id, title, order, video_url)
           + progress (enrollment_id, module_id, completed)
Block 0.3: + availability (user_id, day_of_week, start_time, end_time)
           + sessions (student_id, teacher_id, course_id, bbb_room_url)
Block 0.4: + certification_requests (enrollment_id, recommended_by, status)
Block 0.5: + certifications (enrollment_id, approved_by, issued_at)
Block 0.6: + st_applications (user_id, course_id, status, approved_by)
Block 0.7: + payouts (enrollment_id, teacher_amount, creator_amount, status)
```

**Total tables after Block 0.7:** 10 tables

---

# Part 4: Detailed Block Specifications

## Block 0.0: Foundation

> We can deploy a working application with data in it.

### Actors Active
| Actor | Role in This Block |
|-------|-------------------|
| Creator (Guy) | Account created via seed data |
| Admin (Brian) | Sets up infrastructure, enters seed data |

### What's Built
- Tech stack: Next.js, PostgreSQL, hosting
- Database with schema
- Initial schema: `users` and `courses` tables
- Seed data: Guy's account, Guy's course
- Deployment: Live at staging URL
- Basic shell: Homepage exists

### The Test
**Can we deploy to a URL, and does the database have Guy's course in it?**

### Acceptance Criteria
- [ ] Application deploys to a URL
- [ ] Database is accessible
- [ ] `users` table exists with Guy's account
- [ ] `courses` table exists with Guy's course
- [ ] Team can access the deployed application
- [ ] Basic monitoring/logging works

**Stories covered: 3**

---

## Block 0.1: Discovery & Payment

> A visitor can find a course, understand what it offers, and pay for it.

### Hypothesis Coverage
| ID | Hypothesis | Test | Success Criteria |
|----|------------|------|------------------|
| **H1** | **Market Positioning** | Do people complete purchase at $450? | ≥1 paid enrollment |

**This is the primary test of H1.** If no one pays, we have a pricing/positioning problem.

> **🔴 Brian's Comment:** Consider testing H1 with lower entry point ($150 for Course 1 of 3) instead of $450 all-in. Lower barrier = more likely to get paid enrollments = faster H1 validation. Also: can we properly test H1 without a way for visitors to communicate first?

### Actors Active
| Actor | Role |
|-------|------|
| Visitor | Browses, signs up |
| Student | Visitor becomes Student after payment |

### What's Built
- Landing page with value proposition
- Course listing
- Course detail page
- Sign up form (email + password)
- Stripe Checkout
- Enrollment confirmation
- Confirmation email

> **🔴 Brian's Comment:** Missing from "What's Built": No way for potential students to communicate before paying. For H1 validation, we're asking people to pay $450 with zero human interaction. Suggest adding:
> - Basic "Contact Creator" or "Ask a Question" feature
> - OR: Free 15-min intro session booking
> 
> Full messaging can wait for Block 1.x, but SOME communication is critical here.

### Acceptance Criteria
- [ ] Visitor can view homepage
- [ ] Visitor can see at least one course listed
- [ ] Visitor can view course details
- [ ] Visitor can create account
- [ ] Visitor can pay via Stripe
- [ ] After payment, visitor is enrolled as Student
- [ ] Student receives confirmation email
- [ ] **H1 Criterion:** At least 1 person pays $450

**Stories covered: 15**

---

## Block 0.2: Content Access

> An enrolled student can access the course materials.

### Hypothesis Coverage
This block **enables** H2 and H5 testing but doesn't validate them yet.

### Actors Active
| Actor | Role |
|-------|------|
| Student | Logs in, accesses course content |

### What's Built
- Student dashboard (basic)
- Course content page with module structure
- External video links (YouTube/Vimeo)
- Document links (Google Drive/Notion)
- Login functionality

### The Test
**Can Sarah (enrolled student) log in, see Guy's course, and access the videos/documents?**

### Acceptance Criteria
- [ ] Student can log in
- [ ] Student sees enrolled course in dashboard
- [ ] Student can access course content page
- [ ] Course shows module structure
- [ ] Video links open YouTube/Vimeo in new tab
- [ ] Document links open Google Drive/Notion

**Stories covered: 7** (cumulative: 25)

---

## Block 0.3: Scheduling & Sessions

> A student can schedule and attend a 1-on-1 video session with a Student-Teacher.

### Hypothesis Coverage
| ID | Hypothesis | Test | Success Criteria |
|----|------------|------|------------------|
| **H5** | **Peer Teaching Quality** | Is the 1-on-1 format effective? | Student reports value |

**This is the primary test of H5.** Can a peer effectively teach?

### Actors Active
| Actor | Role |
|-------|------|
| Student | Books session, attends video call |
| Student-Teacher | Sets availability, conducts session |

### What's Built
- S-T availability settings
- Scheduling interface
- Booking confirmation
- Email notifications with BBB link + .ics
- BBB room creation
- Join session button
- S-T dashboard (basic)

### Acceptance Criteria
- [ ] S-T can set availability (days/times)
- [ ] Student sees S-T with available slots
- [ ] Student can book a slot
- [ ] Both receive confirmation email with BBB link
- [ ] BBB room is created
- [ ] Both can join video session
- [ ] Video/audio/screenshare work
- [ ] **H5 Criterion:** Student reports session was valuable

**Stories covered: 18** (cumulative: 43)

---

## Block 0.4: Progress & Completion

> A student can track their progress, and an S-T can recommend them for certification.

### Hypothesis Coverage
| ID | Hypothesis | Test | Success Criteria |
|----|------------|------|------------------|
| **H2** | **Completion Rates** | Do students complete all modules? | ≥75% module completion |

**This is the primary test of H2.** Do students finish what they start?

### Actors Active
| Actor | Role |
|-------|------|
| Student | Marks progress, completes modules |
| Student-Teacher | Monitors progress, recommends for certification |
| Creator | Receives notification of recommendation |

### What's Built
- Progress checkboxes
- Progress bar
- Enhanced student dashboard
- S-T sees student progress
- Recommend button
- Notification to Creator

### Acceptance Criteria
- [ ] Student can mark modules as complete
- [ ] Progress bar updates
- [ ] S-T can see assigned student's progress
- [ ] S-T can click "Recommend for Certification"
- [ ] Creator receives notification
- [ ] **H2 Criterion:** First student completes all modules

**Stories covered: 6** (cumulative: 49)

---

## Block 0.5: Certification

> A Creator can approve certification, and the student receives their certificate.

### Hypothesis Coverage
| ID | Hypothesis | Test | Success Criteria |
|----|------------|------|------------------|
| **H2** | **Completion Rates** | Students reach certification | Certification granted |
| **H5** | **Peer Teaching Quality** | Did peer teaching achieve learning goals? | Creator approves |

**This block validates both H2 and H5.** Certification = completed + quality.

### What's Built
- Creator dashboard with certification requests
- Approval UI
- Certificate generation
- Certificate notification email
- Student sees certificate in dashboard

### Acceptance Criteria
- [ ] Creator sees pending certification request
- [ ] Creator can click "Approve Certification"
- [ ] Student is marked as certified
- [ ] Student receives certificate notification email
- [ ] **H2 Criterion:** First certification granted
- [ ] **H5 Criterion:** Creator confirms student learned the material

**Stories covered: 5** (cumulative: 54)

---

## Block 0.6: Become Student-Teacher

> A certified student can apply to become a Student-Teacher, and the Creator can approve.

### Hypothesis Coverage
| ID | Hypothesis | Test | Success Criteria |
|----|------------|------|------------------|
| **H4** | **Conversion to Teaching** | Will 10%+ become S-Ts? | ≥10% apply |
| **H3** | **Customer Segmentation** | Does Earn-While-Learn segment exist? | Some apply to teach |

**This is the primary test of H4 and first test of H3.**

### What's Built
- "Become a Student-Teacher" button
- Application submission
- Creator sees applications in dashboard
- Approval UI
- Role change
- S-T dashboard access
- S-T appears in scheduling

### Acceptance Criteria
- [ ] Certified student sees "Become a Student-Teacher" option
- [ ] Student can submit application
- [ ] Creator can approve
- [ ] Student's role changes to include S-T
- [ ] New S-T can set availability
- [ ] New S-T appears in scheduling for new students
- [ ] **H4 Criterion:** At least one certified student applies to teach
- [ ] **H3 Criterion:** Can observe both segments

**Stories covered: 8** (cumulative: 62)

---

## Block 0.7: Flywheel & Payouts

> The flywheel works: a new student can learn from a Student-Teacher who was once a student, and money flows correctly.

### Hypothesis Coverage
| ID | Hypothesis | Test | Success Criteria |
|----|------------|------|------------------|
| **H6** | **Flywheel Validation** | Does the model reproduce? | New student completes with new S-T |
| **H3** | **Customer Segmentation** | Does payment motivate S-Ts? | S-T continues after payout |

**This is THE critical test. H6 is Brian's biggest uncertainty.**

### The Test
**Can Alex (new student) enroll, book with Sarah (new S-T), complete, and does Sarah get paid?**

If yes → ✅ **FLYWHEEL VALIDATED**

### What's Built
- Payout tracking
- Creator payout approval
- Stripe payout (70/15/15 split)
- Earnings visibility in dashboard
- Payout confirmation notification

### Acceptance Criteria
- [ ] New student can enroll and pay
- [ ] New student can book with NEW S-T (Sarah)
- [ ] New student completes course
- [ ] Guy approves payout
- [ ] System calculates 70/15/15 split
- [ ] Sarah receives $315 (70%)
- [ ] Guy receives $67.50 (15%)
- [ ] Platform receives $67.50 (15%)
- [ ] **H6 Criterion:** Full flywheel cycle completes

**Stories covered: 10** (cumulative: 72)

---

# Part 5: Block 1.x - Community Features

Based on Brian's Dec 7 decisions, these features are planned for Block 1.x (after flywheel validation):

> **🔴 Brian's Comment:** Concern: Full messaging can wait for Block 1.x, but SOME communication capability needs to exist in Block 0.1-0.2 for flywheel validation to actually work. We're selling live human interaction—visitors need to experience that before paying. Suggestion: Add "Basic Inquiry" or "Contact Creator" feature to Block 0.1, keep full messaging system for Block 1.0.

## Block 1.0: Messaging System
- Full in-platform messaging between Students, S-Ts, Creators
- Message threads and history
- Notification system for new messages

## Block 1.1: Community Feed
- Course community posts
- Likes and replies
- Creator announcements
- Pin posts functionality

## Block 1.2: Follow System & Social Graph
- Follow Creators
- Follow other Students
- Activity feed from followed accounts

## Block 1.3: File Uploads & Profiles
- Profile photo uploads
- Course material file storage
- CDN for optimized delivery

---

# Part 6: Hypothesis & Coverage Summary

## Hypothesis Status by Block

| Hypothesis | Introduced | Validated | How We Know |
|------------|------------|-----------|-------------|
| H1: Market Positioning | 0.1 | 0.1 | Someone pays $450 |
| H2: Completion Rates | 0.2 (enabled) | 0.5 | 75%+ complete, get certified |
| H3: Customer Segmentation | 0.6 | 0.7 | Both segments observable |
| H4: Conversion to Teaching | 0.6 | 0.6 | ≥10% of certified apply to teach |
| H5: Peer Teaching Quality | 0.2 (enabled) | 0.5 | Creator approves quality |
| H6: Flywheel Validation | 0.7 | 0.7 | Second generation completes |

## Validation Milestones

| Milestone | Block | Hypotheses Validated | Confidence |
|-----------|-------|----------------------|------------|
| First Payment | 0.1 | H1 (partial) | Low |
| First Completion | 0.5 | H2, H5 | Medium |
| First S-T Application | 0.6 | H4, H3 (partial) | Medium |
| First Flywheel | 0.7 | H6, H3 | High |

## Risk Matrix

| Hypothesis | If FALSE | Mitigation |
|------------|----------|------------|
| H1 | No one pays → No revenue | Test lower prices, improve value prop |
| H2 | Low completion → No S-Ts | Add support, gamification |
| H3 | Only one segment → Limited growth | Adjust marketing |
| H4 | <10% teach → Slow growth | Increase incentives |
| H5 | Poor quality → Bad reviews | Better S-T training |
| H6 | Flywheel fails → Model doesn't scale | **Existential. Complete rethink.** |

---

# Part 7: User Story Coverage Summary

## Stories Covered by Block

| Block | Stories | Cumulative | Actors Active |
|-------|---------|------------|---------------|
| 0.0 Foundation | 3 | 3 | Creator, Admin |
| 0.1 Discovery & Payment | 15 | 18 | Visitor, Student |
| 0.2 Content Access | 7 | 25 | Student |
| 0.3 Scheduling & Sessions | 18 | 43 | Student, S-T |
| 0.4 Progress & Completion | 6 | 49 | Student, S-T, Creator |
| 0.5 Certification | 5 | 54 | Student, S-T, Creator |
| 0.6 Become Student-Teacher | 8 | 62 | Student, Creator |
| 0.7 Flywheel & Payouts | 10 | 72 | All core |

**Total P0 stories covered in Block 0.x:** 72 out of 135 (53%)  
**Total hypotheses tested:** 6 out of 6 (100%)

---

# Part 8: Timeline Summary

## Block 0.x Timeline (Flywheel Validation)

```
Week 1:     Block 0.0 - Foundation
Week 2:     Block 0.1 - Discovery & Payment     → H1 tested
Week 3:     Block 0.2 - Content Access          → H2, H5 enabled
Week 4-5:   Block 0.3 - Scheduling & Sessions   → H5 tested
Week 6:     Block 0.4 - Progress & Completion   → H2 tested
Week 7:     Block 0.5 - Certification           → H2, H5 validated
Week 8:     Block 0.6 - Become Student-Teacher  → H3, H4 tested
Week 9-10:  Block 0.7 - Flywheel & Payouts      → H3, H6 validated
Week 11:    Buffer / Testing / Polish

TOTAL BLOCK 0.x: ~11 weeks to test all 6 hypotheses
```

## Full Timeline (Brian's View)

| Phase | Our Blocks | Duration | What's Done |
|-------|------------|----------|-------------|
| **Block 1** | 0.0 → 0.7 | 11 weeks | Core flow + flywheel validation |
| **Block 2** | 1.0 → 1.3 | 4-5 weeks | Messaging, community, follows, files |
| **Block 3** | 2.0+ | 4-6 weeks | Full features + polish |
| **Buffer** | - | 2 weeks | Testing |
| **TOTAL** | - | **21-24 weeks** | **Launch: May-June 2026** |

---

# Part 9: Decision Points

After each block, the team decides:

1. **GO** - Block works, hypothesis looks good, proceed
2. **FIX** - Block has issues, fix before proceeding
3. **PIVOT** - Hypothesis failed, need to change approach

## Hypothesis-Driven Decision Framework

| Block | If Hypothesis FAILS |
|-------|---------------------|
| 0.1 | H1 fails → Test lower price ($300), improve value prop |
| 0.3 | H5 fails → Improve S-T training, more Creator involvement |
| 0.4 | H2 fails → Add support, reduce friction, more sessions |
| 0.5 | H2/H5 fail → Quality or completion problem, investigate |
| 0.6 | H4 fails → Increase incentives, improve S-T proposition |
| 0.7 | H6 fails → **Critical. Core model may not work.** |

---

# Part 10: Open Questions

1. **Block 0.1 first user:** Who is the first real student? Gabriel? A volunteer?
2. **Block 0.3 first S-T:** Who is the first Student-Teacher? Someone manually set up?
3. **Block duration flexibility:** Should blocks be calendar-fixed or completion-fixed?
4. **Testing between blocks:** Who tests? Just team, or real users?
5. **Deployment strategy:** Deploy after each block, or batch deploy?
6. **Hypothesis failure threshold:** At what point do we declare a hypothesis failed?
7. **Data collection:** How do we systematically capture hypothesis data?
8. **Block 1.x prioritization:** Which Dec 7 feature first? Messaging or community?

> **🔴 Brian's Additional Questions:**
> 
> 9. **Pre-enrollment communication:** How do potential students build trust before paying $450? Should Block 0.1 include a basic inquiry/contact feature? Full messaging can wait for 1.x, but some communication is needed for H1 validation.
> 
> 10. **Tiered pricing model:** Should we split $450 into three $150 courses instead? Lower entry barrier = faster H1 validation. How does this affect the 70/15/15 split?
> 
> 11. **Free intro sessions:** Should we offer a free 15-minute intro session before payment? This lets visitors experience our differentiation (live humans) before committing. Does this need to be in Block 0.1 or can it wait for Block 0.3?

---

# Part 11: Next Steps

1. Gabriel and Brian review this v2.0 document
2. Fraser validates timeline estimates and tech stack
3. Agree on Block 0.0 scope and start date
4. Build Block 0.0 (infrastructure, deploy, seed data)
5. Build Block 0.1 (landing page, payment)
6. Test Block 0.1 with real user (Gabriel?) → **H1 first test**
7. Proceed through blocks sequentially
8. Track hypothesis status at each block completion

## The Flywheel

```
Student enrolls ($450)
    ↓
Student learns from Student-Teacher
    ↓
Student completes → S-T recommends → Creator certifies
    ↓
Creator approves payout → 70/15/15 split via Stripe
    ↓
Student becomes Student-Teacher → Teaches new students
    ↓
Cycle repeats 🔄
```

---

# Appendix: Key Decisions (Dec 7, 2025)

## Retained from Earlier Sessions
- Creator approves certs/payouts/S-T apps (not Brian)
- S-T recommends → Creator approves certification workflow
- Stripe automated payouts (after Creator approval)
- No ratings in Block 1 (add later)
- Brian's time: 3-4 hrs/week (strategic only)

## Updated Dec 7
- Build messaging system (full in-platform messaging) → Block 1.0
- Build community feed (posts, likes, replies, follows) → Block 1.1
- Build follow system (social graph) → Block 1.2
- Build file uploads (profiles, course materials) → Block 1.3

---

# Brian's Review Comments (Dec 8, 2025)

## Overall Concern: Trust-Building Before Payment

For a **new platform** with **no reviews or track record**, asking someone to pay $450 with zero human interaction is a significant barrier. We're selling **live human interaction**—potential students need to experience that BEFORE committing.

---

## Comment 1: Pre-Enrollment Communication Needed

**Applies to:** Sarah's Journey, Visitor's Journey, Block 0.1, Critical Journey

**Concern:** The current flow shows:
```
Visitor discovers course → pays $450
```

This skips the trust-building step. Real user journey should be:
```
Visitor discovers course → asks questions → talks to someone → 
understands how system works → gets comfortable → THEN pays
```

**Suggestion:** Add basic communication feature to Block 0.1 or 0.2:
- Simple "Contact Creator" or "Ask a Question" form
- Or basic chat/inquiry system
- Full messaging can still wait for Block 1.x, but SOME communication is critical for H1 validation

**Rationale:** We can't properly test H1 (will people pay?) if we don't give them a way to build trust first. Especially critical for Genesis cohort.

---

## Comment 2: Tiered Pricing / Split Payment Model

**Applies to:** Block 0.1, H1 Hypothesis, Sarah's Journey

**Concern:** The document assumes a single $450 payment. This is a high barrier for:
- A brand new platform with no track record
- First-time users who don't know us
- People who want to "try before they buy"

**Suggestion:** Consider splitting into tiered courses:
- **Course 1 of 3:** $150 (lower entry point)
- **Course 2 of 3:** $150 (after completing Course 1)
- **Course 3 of 3:** $150 (full certification path)

**Benefits:**
- Lower initial commitment = higher conversion
- Students prove value before paying more
- Natural upsell path
- Easier H1 validation (more likely someone pays $150 than $450)

**Open Question:** Does this change the 70/15/15 split calculation? Per-course or per-completion?

---

## Comment 3: Free Introductory Session

**Applies to:** Block 0.1, Block 0.3, Visitor's Journey, H1 & H5 Hypotheses

**Concern:** We're selling **live 1-on-1 interaction** but asking people to pay before experiencing it.

**Suggestion:** Offer a **free 15-minute introductory session**:
- Visitor books free intro call with a Student-Teacher
- They meet, discuss goals, see how the platform works
- S-T answers questions about the course
- THEN visitor decides to enroll

**Benefits:**
- Builds trust before payment
- Demonstrates our differentiation (live humans, not videos)
- S-T can qualify the student (good fit?)
- Validates H5 (peer teaching quality) earlier
- Reduces refund risk (students know what they're getting)

**Implementation consideration:** This may need to be in Block 0.1 or 0.2, not deferred to Block 0.3. The scheduling/BBB infrastructure could be simplified for just intro calls.

---

## Comment 4: Impact on Hypothesis Testing

**H1 (Market Positioning)** currently tests: "Will people pay $450?"

With these changes, H1 could test:
- "Will people pay $150 for Course 1?" (lower bar, faster validation)
- "Will people who complete Course 1 pay for Course 2?" (upsell validation)
- "Do free intro sessions convert to paid enrollments?" (funnel validation)

This gives us **more data points** and **faster learning** about pricing and conversion.

---

## Summary: Suggested Changes to Block Sequence

| Current Plan | Brian's Suggestion |
|--------------|-------------------|
| Messaging in Block 1.x | Basic "Contact/Inquiry" in Block 0.1 |
| $450 single payment | Tiered pricing ($150 × 3) |
| Pay before any interaction | Free 15-min intro session option |
| Test H1 with $450 | Test H1 with $150 entry point |

**Request:** Discuss with Gabriel and Fraser whether these changes should be incorporated into the block sequence, and how they affect timeline estimates.

---

**Document Status:** DRAFT - For Review  
**Feedback requested from:** Gabriel, Brian, Fraser






