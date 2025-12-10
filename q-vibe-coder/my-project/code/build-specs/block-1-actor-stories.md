# PeerLoop Block 1: Actor Stories

**Version:** 1.1 (Corrected)
**Date:** 2025-12-07
**Original Author:** Gabriel Rymberg (with Claude)
**Corrections:** Brian LeBlanc
**Status:** APPROVED
**Source:** Synthesized from Brian's MVP decisions (Dec 2-6, 2025)

---

## Purpose of This Document

This document describes **what each type of person can DO** with PeerLoop in Block 1. It is organized by **actor** (human user), not by feature.

**Why actor stories?**
- Features tell us what we BUILD
- Actor stories tell us what people can DO
- This informs which features must work together for each actor to complete their tasks
- It helps us validate: "Can we put this person in front of the system and let them do their job?"

---

## The Four Actors

| Actor | Example | Role |
|-------|---------|------|
| **Student** | Sarah | Pays for course, learns from Student-Teacher |
| **Student-Teacher** | Marcus | Certified former student who now teaches others |
| **Creator** | Guy | Expert who created the course content, manages their course |
| **Platform Owner** | Brian | Runs PeerLoop, handles platform-level operations |

---

## How to Read This Document

For each actor, you'll see:

1. **Context** - Who is this person?
2. **What they CAN do** - Capabilities in Block 1
3. **What they CANNOT do** - Explicitly out of scope for Block 1
4. **Dependencies** - What must work for this actor to succeed

At the end:
- Summary of automated vs manual operations
- Open questions for discussion

---

# Actor 1: STUDENT

## Context

**Who:** Sarah, a marketing professional
**Goal:** Learn AI prompting skills from a certified peer teacher
**Entry point:** Finds PeerLoop, sees a course she wants to take

---

## What Sarah CAN Do in Block 1

### 1.1 Discover and Evaluate a Course

Sarah can:

- Browse to PeerLoop website
- See list of available courses
- Click on a course to see details:
  - Course title and description
  - Learning outcomes
  - Price ($450)
  - Creator information (Guy's credentials)
  - "Learn 1-on-1 with a certified peer teacher" messaging
- Decide whether to enroll

**What Sarah sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  AI Prompting Mastery                                       │
│  by Guy Rymberg                                             │
│                                                             │
│  Learn to write effective AI prompts for business use.     │
│  5 modules | 4-6 weeks | 1-on-1 with certified teacher     │
│                                                             │
│  What you'll learn:                                         │
│  • Fundamentals of prompt engineering                       │
│  • Advanced techniques for business applications            │
│  • Building your own prompt library                         │
│                                                             │
│  Price: $450                                                │
│                                                             │
│  [Enroll Now]                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 1.2 Create Account and Pay

Sarah can:

- Click "Enroll Now"
- Create an account:
  - Email address
  - Password
  - Basic profile info (name)
- Proceed to payment (Stripe Checkout)
- Pay via credit card
- Receive payment confirmation
- Be instantly enrolled in the course

**What happens behind the scenes:**

- Stripe processes payment ($450)
- Money is held (not yet distributed)
- Sarah's account is created with "Student" role
- Sarah is enrolled in the course
- Confirmation email is sent automatically

---

### 1.3 Schedule First Session

Immediately after payment, Sarah can:

- See the scheduling interface
- View available Student-Teachers for her course
- See each Student-Teacher's:
  - Name and photo
  - Number of students taught
  - Available time slots
- Select a day from the calendar
- Choose a Student-Teacher
- Book a specific time slot
- Receive confirmation

**What Sarah sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  You're enrolled! Now schedule your first session.         │
│                                                             │
│  Select a day:                                              │
│  [December 2025 Calendar - available dates highlighted]    │
│                                                             │
│  Tuesday, Dec 10th selected...                              │
│                                                             │
│  Available Student-Teachers:                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Marcus Chen                                          │   │
│  │ 12 students taught                                   │   │
│  │ Available: 10am, 2pm, 7pm                            │   │
│  │ [Book 7pm]                                           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Jessica Torres                                       │   │
│  │ 8 students taught                                    │   │
│  │ Available: 11am, 3pm                                 │   │
│  │ [Book 11am]                                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Note:** Ratings are NOT displayed in Block 1 (rating system is Block 2+).

**What happens after booking:**

- Session is confirmed in the system
- Sarah receives email with:
  - Session date and time
  - Student-Teacher name
  - Video link (BBB)
  - Calendar invite (.ics file)
- Student-Teacher (Marcus) receives notification

---

### 1.4 Access Course Content

Sarah can:

- Log in to her Student Dashboard
- See her enrolled course
- Click to access course content
- View organized module structure
- Click video links (opens YouTube/Vimeo in new tab)
- Click document links (downloads from Google Drive)
- Mark modules as complete (checkbox)
- See her progress bar update

**What Sarah sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  AI Prompting Mastery                                       │
│  by Guy | Your Teacher: Marcus                              │
│                                                             │
│  Progress: [████████░░░░░░░░] 40% complete                  │
│                                                             │
│  MODULE 1: Foundations ✓                                    │
│  ├── Video 1: What is AI Prompting [Watch]                  │
│  ├── Video 2: Your First Prompt [Watch]                     │
│  ├── Reading: Prompt Framework Guide [Download]             │
│  └── [✓] Module Complete                                    │
│                                                             │
│  MODULE 2: Intermediate Techniques ✓                        │
│  ├── Video 3: Context and Constraints [Watch]               │
│  ├── Video 4: Iteration Strategies [Watch]                  │
│  ├── Reading: 50 Prompt Templates [Download]                │
│  └── [✓] Module Complete                                    │
│                                                             │
│  MODULE 3: Advanced Applications (in progress)              │
│  ├── Video 5: Business Use Cases [Watch]                    │
│  ├── Video 6: Building Workflows [Watch]                    │
│  └── [ ] Module Complete                                    │
│                                                             │
│  MODULE 4: Specialization (upcoming)                        │
│  MODULE 5: Certification Prep (upcoming)                    │
│                                                             │
│  [Schedule Next Session]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### 1.5 Attend Video Sessions

Sarah can:

- Click the video link from her email or dashboard
- Join the BigBlueButton (BBB) video room
- See and hear her Student-Teacher
- Share her screen if needed
- Participate in 1-on-1 teaching session
- Discuss questions from the course material

---

### 1.6 Schedule Additional Sessions

Sarah can:

- Click "Schedule Next Session" in her dashboard
- See available times for her Student-Teacher (or choose a different one)
- Book another session
- Receive confirmation email with new video link

---

### 1.7 Track Progress

Sarah can:

- See her overall progress bar
- See which modules she's marked complete
- See her upcoming session
- See her assigned Student-Teacher

---

## What Sarah CANNOT Do in Block 1

| Capability | Why Not | Workaround |
|------------|---------|------------|
| Apply to become Student-Teacher | Button exists, Creator approves | Click "Apply" → Creator reviews |
| See certificate in a portal | Certificate display not built | Receives via email after Creator approval |
| Rate or review Student-Teacher | Rating system not in Block 1 | Provide feedback directly |
| Access community feed | Using Discord instead | Join Discord community |
| Cancel/reschedule via system | Feature not in Block 1 | Contact S-T or Creator |
| Pay in installments | Not supported | Full payment only |
| Request refund via system | Brian handles manually | Contact Brian |

---

## Dependencies for Student Success

For Sarah to complete her journey, these must work:

| Step | Features Required |
|------|-------------------|
| Find course | Landing pages, course listing |
| Create account | User auth (signup) |
| Pay | Stripe Checkout integration |
| Schedule | Calendar system, S-T availability |
| Get notifications | Email system |
| Access content | Course content pages, external links |
| Attend session | BBB video integration |
| Track progress | Student dashboard, progress checkboxes |

---

# Actor 2: STUDENT-TEACHER

## Context

**Who:** Marcus, former student of Guy's course
**Background:** Completed the course, was certified by Creator (Guy) to teach
**Goal:** Teach students and earn 70% of tuition ($315 per student)

---

## What Marcus CAN Do in Block 1

### 2.1 Set Availability

Marcus can:

- Log in to Student-Teacher Dashboard
- Access availability settings
- Select which days he can teach
- Select which time slots on each day
- Save his availability
- Update as his schedule changes

**What Marcus sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  My Availability                                            │
│                                                             │
│  Set when you're available to teach:                        │
│                                                             │
│  Monday:    [ ] 9am  [✓] 10am  [ ] 11am  [✓] 2pm  [ ] 7pm  │
│  Tuesday:   [ ] 9am  [ ] 10am  [✓] 11am  [ ] 2pm  [✓] 7pm  │
│  Wednesday: [✓] 9am  [ ] 10am  [ ] 11am  [✓] 2pm  [ ] 7pm  │
│  Thursday:  [ ] 9am  [✓] 10am  [ ] 11am  [ ] 2pm  [✓] 7pm  │
│  Friday:    [ ] 9am  [ ] 10am  [✓] 11am  [✓] 2pm  [ ] 7pm  │
│                                                             │
│  [Save Availability]                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.2 View Assigned Students

Marcus can:

- See list of students assigned to him
- See each student's name and contact info
- See each student's progress through the course (which modules complete)
- Understand where each student is in their journey

**What Marcus sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  My Students                                                │
│                                                             │
│  Sarah Johnson                                              │
│  Progress: [████████░░░░░░░░] 40% (Modules 1-2 complete)   │
│  Next Session: Dec 10, 7pm                                  │
│  [View Details]                                             │
│                                                             │
│  Alex Rivera                                                │
│  Progress: [████░░░░░░░░░░░░] 20% (Module 1 complete)      │
│  Next Session: Dec 11, 2pm                                  │
│  [View Details]                                             │
│                                                             │
│  Total: 2 active students                                   │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.3 View Upcoming Sessions

Marcus can:

- See all his scheduled sessions
- See date, time, and student name for each
- Access the video link for each session

**What Marcus sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  Upcoming Sessions                                          │
│                                                             │
│  Today, Dec 10                                              │
│  └── 7:00 PM - Sarah Johnson [Join Session]                │
│                                                             │
│  Tomorrow, Dec 11                                           │
│  └── 2:00 PM - Alex Rivera [Join Session]                  │
│                                                             │
│  Friday, Dec 13                                             │
│  └── 11:00 AM - Sarah Johnson [Join Session]               │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Conduct Teaching Sessions

Marcus can:

- Receive notification when student books with him
- Get email with session details and BBB link
- Join video room at scheduled time
- See and hear his student
- Share his screen to demonstrate concepts
- Guide student through course material
- Answer questions
- Advise on next steps

---

### 2.5 Recommend Students for Certification

Marcus can:

- When a student completes all modules
- Click [Recommend for Certification] button
- This sends notification to Creator (Guy) for approval

---

### 2.6 Receive Booking Notifications

Marcus automatically receives:

- Email when a student books a session
- Session details (date, time, student name)
- BBB video link
- Calendar invite (.ics)

---

### 2.7 Receive Payouts

Marcus can:

- See earnings in his dashboard (after Creator approves payout)
- Receive payment via Stripe (automated after Creator approval)

---

## What Marcus CANNOT Do in Block 1

| Capability | Why Not | Workaround |
|------------|---------|------------|
| Approve certifications | Creator's responsibility | Recommend → Creator approves |
| View session recordings | Recording/playback is Block 2 | Sessions not recorded yet |
| Add session notes in system | Feature not built | Use own notes |
| Cancel/reschedule student sessions | Feature not built | Coordinate with student directly |

---

## Dependencies for Student-Teacher Success

| Step | Features Required |
|------|-------------------|
| Log in | User auth |
| Set availability | Calendar/availability system |
| See students | S-T dashboard, student list |
| See sessions | Session/booking display |
| Join video | BBB integration |
| Get notified | Email system |
| Recommend certification | Certification workflow button |
| Receive payout | Stripe payout integration |

---

# Actor 3: CREATOR

## Context

**Who:** Guy Rymberg, AI teaching specialist
**Background:** Created the "AI Prompting Mastery" course
**Role:** Expert who owns the course content; manages Student-Teachers and approves operations
**Goal:** Monitor course performance, approve certifications, approve payouts, approve S-T applications

---

## What Guy CAN Do in Block 1

### 3.1 Monitor Course Performance

Guy can:

- Log in to Creator Dashboard
- See overall course stats:
  - Total enrollments
  - Active students
  - Completion rate
  - Revenue
- View high-level metrics

**What Guy sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  AI Prompting Mastery - Dashboard                           │
│                                                             │
│  Course Stats                                               │
│  ├── Total Enrollments: 15                                  │
│  ├── Active Students: 12                                    │
│  ├── Completed: 3                                           │
│  └── Completion Rate: 75%                                   │
│                                                             │
│  Revenue                                                    │
│  ├── Total Collected: $6,750 (15 × $450)                   │
│  └── Your Earnings (15%): $1,012.50                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 View Enrolled Students

Guy can:

- See list of all students enrolled in his course
- See each student's:
  - Name
  - Assigned Student-Teacher
  - Progress (% complete, modules finished)
  - Enrollment date

**What Guy sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  Enrolled Students                                          │
│                                                             │
│  Name            Teacher      Progress    Enrolled          │
│  ─────────────────────────────────────────────────────────  │
│  Sarah Johnson   Marcus       40%         Dec 3, 2025       │
│  Alex Rivera     Marcus       20%         Dec 5, 2025       │
│  Jordan Lee      Jessica      60%         Nov 28, 2025      │
│  Casey Kim       Marcus       100% ✓      Nov 15, 2025      │
│  ...                                                        │
│                                                             │
│  Showing 15 students                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 View Upcoming Sessions

Guy can:

- See all upcoming sessions for his course
- See which Student-Teacher is teaching which student
- Monitor activity level

---

### 3.4 View Student-Teachers

Guy can:

- See list of certified Student-Teachers for his course
- See how many students each is teaching
- See their availability status

**What Guy sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  Student-Teachers                                           │
│                                                             │
│  Marcus Chen                                                │
│  ├── Status: Active                                         │
│  ├── Students: 5                                            │
│  └── Sessions this week: 8                                  │
│                                                             │
│  Jessica Torres                                             │
│  ├── Status: Active                                         │
│  ├── Students: 4                                            │
│  └── Sessions this week: 6                                  │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.5 Approve Certifications

Guy can:

- See certification requests from Student-Teachers
- Review student's completion status
- Click [Approve Certification] to issue certificate
- Student receives certificate via email

**What Guy sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  🎓 CERTIFICATION REQUESTS                                  │
│                                                             │
│  Sarah Johnson                                              │
│  Student-Teacher: Marcus Chen                               │
│  Recommended: Dec 28, 2025                                  │
│  Modules completed: 5/5 ✓                                   │
│                                                             │
│  [Approve Certification]  [Request More Info]               │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.6 Approve Payouts

Guy can:

- See pending payouts after student completions
- Review the 70/15/15 split breakdown
- Click [Approve Payout] to trigger payment
- System automatically processes via Stripe

**What Guy sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  💰 PENDING PAYOUTS                                         │
│                                                             │
│  Sarah Johnson - Course Completed                           │
│  Total: $450                                                │
│  Split:                                                     │
│    → Marcus (Student-Teacher): $315 (70%)                   │
│    → You (Creator): $67.50 (15%)                            │
│    → PeerLoop: $67.50 (15%)                                 │
│                                                             │
│  [Approve Payout]  [Flag for Review]                        │
└─────────────────────────────────────────────────────────────┘
```

**After clicking Approve:**
- $315 → Marcus (via Stripe)
- $67.50 → Guy (via Stripe)
- $67.50 → PeerLoop

---

### 3.7 Approve Student-Teacher Applications

Guy can:

- See applications from students who want to become Student-Teachers
- Review their completion status
- Click [Approve as Student-Teacher] to promote them
- Student can now set availability and teach

**What Guy sees (example):**

```
┌─────────────────────────────────────────────────────────────┐
│  👩‍🏫 STUDENT-TEACHER APPLICATIONS                          │
│                                                             │
│  Sarah Johnson                                              │
│  Completed: Dec 28, 2025                                    │
│  Sessions Attended: 6                                       │
│  Modules: 5/5 ✓                                             │
│                                                             │
│  [Approve as Student-Teacher]  [Decline]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## What Guy CANNOT Do in Block 1

| Capability | Why Not | Workaround |
|------------|---------|------------|
| Edit course content in system | Course editor is Block 3 | Ask Brian to update links |
| Upload new content | No upload feature | Provide links to Brian |
| Message students directly | Messaging not built | Use email or Discord |
| See advanced analytics | Full analytics is Block 3 | Basic stats available |

---

## Key Insight: Block 1 Creator Dashboard is ACTIVE

In Block 1, Guy can **monitor AND act** through the system:
- ✅ Approve certifications
- ✅ Approve payouts
- ✅ Approve Student-Teacher applications

This is different from earlier assumptions. Creator manages their course operations.

---

## Dependencies for Creator Success

| Step | Features Required |
|------|-------------------|
| Log in | User auth |
| See stats | Creator dashboard with metrics |
| See students | Student list with progress |
| See S-Ts | Student-Teacher list |
| See sessions | Session display |
| Approve certifications | Certification workflow UI |
| Approve payouts | Payout approval UI + Stripe integration |
| Approve S-T applications | S-T approval workflow UI |

---

# Actor 4: PLATFORM OWNER (Brian)

## Context

**Who:** Brian LeBlanc, Founder & CEO
**Role:** Runs PeerLoop platform
**Block 1 Reality:** Strategic oversight, platform-level operations only

---

## What Brian CAN Do in Block 1

### 4.1 Onboard Creators (Manual Process)

Brian can:

- Meet with potential creators
- Evaluate their courses and credentials
- Decide who to bring onto the platform
- Collect their course content:
  - Course title and description
  - Module structure
  - Video links (YouTube/Vimeo)
  - Document links (Google Drive)
  - Pricing
- Set up the course in the system (directly in database/backend)
- Create their Creator account
- Walk them through the Creator Dashboard

**Process flow:**

```
Creator applies → Brian evaluates → Brian decides →
Brian collects content → Brian sets up in system →
Creator gets login → Creator manages their course
```

---

### 4.2 Monitor Platform Health

Brian can:

- Log in with admin access to see all courses
- View Creator dashboards for each course
- See enrollments, progress, sessions across platform
- Access Stripe dashboard directly for:
  - Payment monitoring
  - Transaction history
  - Revenue tracking

---

### 4.3 Handle Platform-Level Exceptions

Brian handles:

- Refund requests (decides case-by-case, processes through Stripe)
- Technical issues (troubleshoots or escalates)
- Disputes that Creators can't resolve
- Any edge cases not covered by Creator authority

---

### 4.4 Creator Support

Brian provides:

- Check-ins with Creators (1-2 hrs/week)
- Answers Creator questions
- Helps resolve issues escalated from Creators

---

## What Brian Does NOT Do in Block 1

| Task | Who Does It |
|------|-------------|
| Approve certifications | Creator |
| Approve payouts | Creator |
| Approve S-T applications | Creator |
| Day-to-day course operations | Creator |
| Track individual student progress | Creator |

---

## What Brian Has Access To

| System | Access |
|--------|--------|
| PeerLoop (as admin) | Can view all Creator dashboards |
| Stripe Dashboard | Direct access for payments, refunds |
| Database | Direct access for setup and edge cases |
| Email | For creator communications |

---

## Brian's Weekly Time Commitment (Estimated)

For 60-80 students across 4-5 creators:

| Task | Hours/Week |
|------|------------|
| Creator check-ins | 1-2 hrs |
| Exception handling | 1-2 hrs |
| Platform monitoring | 30 min |
| **Total** | **~3-4 hrs/week** |

**Note:** This is manageable because Creators handle their own course operations (certifications, payouts, S-T approvals).

---

# Summary: Automated vs Manual in Block 1

## What the SYSTEM Does (Automated)

| Function | How It Works |
|----------|--------------|
| Payment collection | Stripe Checkout |
| Account creation | User signup form |
| Course enrollment | Instant after payment |
| Content access | Links work automatically |
| Scheduling | Calendar + booking interface |
| Video sessions | BBB room creation + links |
| Progress tracking | Self-reported checkboxes |
| Notifications | Automated emails for enrollment, booking |
| Payout processing | Stripe (after Creator approval) |

## What CREATORS Do (In Dashboard)

| Function | How Creator Does It |
|----------|---------------------|
| Approve certifications | Click button in dashboard |
| Approve payouts | Click button → Stripe processes |
| Approve S-T applications | Click button in dashboard |
| Monitor students | View dashboard |
| Monitor S-Ts | View dashboard |

## What BRIAN Does (Manual/Strategic)

| Function | How Brian Does It |
|----------|-------------------|
| Creator onboarding | Manual vetting + setup |
| Course creation | Enters content in database |
| Refunds | Processes through Stripe |
| Platform exceptions | Handles case-by-case |
| Creator support | Check-ins, troubleshooting |

---

# Block 1 End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BLOCK 1 FLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SETUP (Manual - Brian)                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Brian onboards Creator → Brian sets up course → S-Ts added   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  ENROLLMENT (Automated)                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Student finds course → Pays (Stripe) → Enrolled instantly    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  SCHEDULING (Automated)                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Student sees S-T availability → Books session → Both notified│   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  LEARNING (Automated + Human Teaching)                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Student accesses content → Attends BBB sessions → Marks      │   │
│  │ progress → Repeats until complete                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  CERTIFICATION (Creator Approves)                                    │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ S-T recommends → CREATOR clicks Approve → Certificate issued │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  PAYOUT (Creator Approves → Stripe Processes)                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ CREATOR clicks Approve → Stripe sends 70/15/15 automatically │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│  FLYWHEEL (Creator Approves)                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Student applies → CREATOR clicks Approve → Student becomes   │   │
│  │ S-T → Can now teach others                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

# Open Questions (Reduced List)

1. **Certification Format:** What does the certificate look like? PDF? Email? Badge?

2. **Communication Channels:** How do S-T and Creator communicate? Email? Discord?

3. **Cancellation/Rescheduling:** How do students cancel or reschedule? Contact S-T directly?

4. **S-T Assignment:** Is a student permanently assigned to one S-T, or can they switch?

5. **Payout Timing:** When does Creator approve payouts? After each completion? Weekly batch?

6. **Content Updates:** How does Creator request content changes? Contact Brian?

7. **Progress Verification:** Students self-report progress. Is there any verification?

---

# What This Document Enables

With these actor stories, we can:

1. **Validate Block 1 scope** - Do we have everything each actor needs?
2. **Identify feature dependencies** - Which features must work together?
3. **Plan testing** - Put each actor type in front of the system
4. **Clarify responsibilities** - Creator manages course, Brian manages platform
5. **Prepare training** - What does each actor need to learn?

---

# Next Steps

1. Brian reviews and approves this document ✅
2. Share with Fraser for technical validation
3. Map actor stories to specific features from feature blocks
4. Use as basis for Block 1 development priorities

---

**Document Status:** APPROVED
**Corrections Made:** 2025-12-07 by Brian
**Key Changes from Original:**
- Creator (not Brian) approves certifications, payouts, S-T applications
- Brian's time reduced to 3-4 hrs/week (from 6-10)
- Payouts via Stripe (not PayPal/Venmo manual)
- Removed ratings from S-T cards (Block 2 feature)

---

*End of Document*








