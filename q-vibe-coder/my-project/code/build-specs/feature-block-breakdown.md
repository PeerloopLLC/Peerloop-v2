# PeerLoop: Feature Block Breakdown

**Date:** December 6, 2025  
**Purpose:** Define Block 1, 2, 3 scope for every major feature  
**For:** Fraser (Developer) + Brian (Product)

---

## How to Read This Document

Each feature is broken into 3 blocks:
- **Block 1:** Minimal viable functionality (end-to-end works)
- **Block 2:** Operational features (Creator can manage without Brian)
- **Block 3:** Full features (scale and polish)

---

# Feature 1: User Authentication

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Email + password signup
- [ ] Email + password login
- [ ] Email verification
- [ ] Password reset via email
- [ ] Role assignment (student, student_teacher, creator, admin)
- [ ] Session management (JWT or cookie-based)
- [ ] Protected routes by role

### Block 2 (Operational)
- [ ] Social login (Google)
- [ ] Remember me functionality
- [ ] Session timeout handling
- [ ] Account deactivation
- [ ] Email change with verification

### Block 3 (Full)
- [ ] Social login (Apple, LinkedIn)
- [ ] Two-factor authentication (2FA)
- [ ] Single sign-on (SSO)
- [ ] Login history / security log
- [ ] Device management
- [ ] Advanced password requirements

---

# Feature 2: Course Page (Public)

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Course title and description
- [ ] Creator info (name, photo, bio)
- [ ] Price display ($450)
- [ ] Course outcomes (what you'll learn)
- [ ] Module list (titles visible, not content)
- [ ] "Enroll Now" button → Stripe Checkout
- [ ] Public URL (`/courses/[slug]`)
- [ ] Mobile responsive

### Block 2 (Operational)
- [ ] Course preview/sample content
- [ ] Student-Teacher list for this course
- [ ] Ratings/reviews display
- [ ] FAQ section
- [ ] Syllabus download
- [ ] Share buttons (social)

### Block 3 (Full)
- [ ] Video trailer embed
- [ ] Testimonials section
- [ ] Comparison with similar courses
- [ ] "Ask a question" feature
- [ ] Discount code input
- [ ] Waitlist for sold-out courses
- [ ] Course recommendations

---

# Feature 3: Payment (Stripe)

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Stripe Checkout integration
- [ ] Credit card processing
- [ ] Course purchase flow
- [ ] Instant enrollment on payment success
- [ ] Payment confirmation email
- [ ] Receipt generation
- [ ] Webhook handling (`checkout.session.completed`)
- [ ] Stripe test mode for development

### Block 2 (Operational)
- [ ] 70/15/15 split calculation (automatic)
- [ ] Per-transaction tracking in database
- [ ] Creator earnings dashboard view
- [ ] Student-Teacher earnings dashboard view
- [ ] Admin payout dashboard
- [ ] "Process Payout" button (semi-automated)
- [ ] Payout history and audit trail
- [ ] Monthly summary reports

### Block 3 (Full)
- [ ] Stripe Connect (fully automated payouts)
- [ ] Subscription/recurring billing
- [ ] Multiple currency support
- [ ] Automated refund processing
- [ ] Payment plans/installments
- [ ] Discount codes / promo codes
- [ ] Tax document generation (1099s)
- [ ] Invoice generation
- [ ] Failed payment recovery

---

# Feature 4: Course Content (Student View)

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Module list display
- [ ] Module items (videos, documents)
- [ ] External links (YouTube, Google Drive)
- [ ] Student self-marks progress (checkboxes)
- [ ] Overall progress percentage
- [ ] "Schedule Next Session" button
- [ ] View assigned Student-Teacher
- [ ] Mobile responsive

### Block 2 (Operational)
- [ ] Module locking (complete previous first)
- [ ] Last accessed tracking
- [ ] Resume where you left off
- [ ] Notes per module
- [ ] Download materials option
- [ ] Estimated time per module

### Block 3 (Full)
- [ ] Video hosting (not external links)
- [ ] In-video progress tracking
- [ ] Quiz/assessment engine
- [ ] Auto-grading
- [ ] Drip content (time-locked modules)
- [ ] Interactive exercises
- [ ] Discussion per module
- [ ] Certificate generation
- [ ] SCORM/xAPI compliance

---

# Feature 5: Calendar/Scheduling

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Student-Teacher sets weekly availability
- [ ] Timezone handling
- [ ] Student views available S-T's for course
- [ ] Student sees available time slots
- [ ] Student books session (one-click)
- [ ] Booking confirmation email (to both)
- [ ] Calendar invite (.ics) attached
- [ ] BBB link included in confirmation
- [ ] View upcoming sessions in dashboard

### Block 2 (Operational)
- [ ] Automated reminders (24h before, 1h before)
- [ ] Cancel session (with notification)
- [ ] Reschedule session
- [ ] Block specific dates (holidays)
- [ ] Minimum advance booking notice
- [ ] Maximum advance booking window
- [ ] Session notes (S-T can add notes before)

### Block 3 (Full)
- [ ] Recurring session scheduling
- [ ] Bulk booking (book 10 sessions at once)
- [ ] Waitlist for popular S-T's
- [ ] Buffer time between sessions
- [ ] Multiple session durations (30/45/60 min)
- [ ] Group sessions
- [ ] Calendar sync (Google, Outlook)
- [ ] SMS reminders

---

# Feature 6: Video Conferencing (BBB)

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] BBB hosted provider integration
- [ ] Create room per session (API call)
- [ ] Generate unique join links
- [ ] Separate links for Student (attendee) and S-T (moderator)
- [ ] Join via link (opens in new tab)
- [ ] Basic video/audio/screen share
- [ ] Chat functionality

### Block 2 (Operational)
- [ ] Session recording (opt-in)
- [ ] Recording playback interface
- [ ] Recording storage (90 days)
- [ ] Recording access control
- [ ] Session duration tracking
- [ ] Attendance tracking (who joined, when)

### Block 3 (Full)
- [ ] Embedded video (within PeerLoop, not new tab)
- [ ] Interactive whiteboard
- [ ] Breakout rooms
- [ ] Polls/quizzes during session
- [ ] Virtual background
- [ ] Hand raise / reactions
- [ ] Recording transcription
- [ ] Recording clips/highlights
- [ ] Self-hosted BBB (cost savings)

---

# Feature 7: Creator Dashboard

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Welcome message with course name
- [ ] Quick stats (students enrolled, sessions this week, total revenue, active S-T's)
- [ ] Enrolled students list
- [ ] Student progress view (modules completed)
- [ ] Upcoming sessions list
- [ ] Active Student-Teachers list

### Block 2 (Operational)
- [ ] Action alerts (certifications pending, payouts pending, S-T applications)
- [ ] Certification approval workflow (approve/decline/request info)
- [ ] Payout approval workflow (approve S-T payouts)
- [ ] Student-Teacher application workflow (approve/decline/interview)
- [ ] Student progress funnel visualization
- [ ] Revenue this month breakdown
- [ ] Search and filter students
- [ ] Message students
- [ ] Export student list (CSV)

### Block 3 (Full)
- [ ] Full analytics dashboard
- [ ] Enrollment trends chart
- [ ] Completion funnel analysis
- [ ] Drop-off alerts
- [ ] Revenue projections
- [ ] S-T performance comparison
- [ ] Flywheel metrics (H4, H6 tracking)
- [ ] Course content editor
- [ ] Course settings management
- [ ] Notification preferences
- [ ] Multiple courses management

---

# Feature 8: Student Dashboard

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Welcome message
- [ ] Enrolled course display
- [ ] Course progress bar
- [ ] Assigned Student-Teacher info
- [ ] "Continue Learning" button
- [ ] Upcoming session display (date, time, S-T)
- [ ] "Join Session" button (visible 5 min before)
- [ ] "Schedule a Session" button

### Block 2 (Operational)
- [ ] Session history
- [ ] Past session recordings access
- [ ] Session notes from S-T
- [ ] Next steps recommendations
- [ ] Progress milestones
- [ ] "Become a Student-Teacher" prompt (when eligible)

### Block 3 (Full)
- [ ] Multiple enrolled courses
- [ ] Achievement badges
- [ ] Learning streaks
- [ ] Certificates display
- [ ] Recommended courses
- [ ] Community feed preview
- [ ] Notifications center
- [ ] Profile settings

---

# Feature 9: Student-Teacher Dashboard

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Welcome message with course name
- [ ] Quick stats (students assigned, sessions this week, total sessions)
- [ ] Assigned students list
- [ ] Student progress view
- [ ] Upcoming sessions list
- [ ] "Join Session" button
- [ ] "Edit Availability" link

### Block 2 (Operational)
- [ ] Earnings tracking (pending, paid)
- [ ] Earnings history
- [ ] "Recommend for Certification" button
- [ ] Session notes (add notes after session)
- [ ] Student messaging
- [ ] Session history with student

### Block 3 (Full)
- [ ] Teaching tips/resources
- [ ] Performance metrics (rating, completion rate)
- [ ] Student feedback view
- [ ] Earnings projections
- [ ] Tax documents
- [ ] Multiple courses teaching
- [ ] Calendar sync

---

# Feature 10: Community Feed

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ❌ Skip | |
| **Block 2** | ✅ In Scope | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Skip - Not Critical for MVP)
*Community can use Discord/WhatsApp for Genesis cohort*

### Block 2 (Basic Feed)
- [ ] GetStream.io SDK integration
- [ ] Activity feed display
- [ ] Create text posts
- [ ] Post types (question, update, achievement)
- [ ] Like/heart posts
- [ ] Comment on posts
- [ ] Follow users
- [ ] Follow courses
- [ ] Basic notifications (likes, comments)

### Block 3 (Full Social)
- [ ] AI-sorted personalized feed
- [ ] Repost functionality
- [ ] Bookmark posts
- [ ] @mentions
- [ ] Image uploads in posts
- [ ] Rich text formatting
- [ ] Polls
- [ ] Moderation tools (flag, delete, ban)
- [ ] Auto-flagging keywords
- [ ] Direct messaging
- [ ] Push notifications

---

# Feature 11: Profile System

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ Partial | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal - Embedded in Dashboards)
- [ ] Name display in dashboards
- [ ] Profile photo (upload)
- [ ] Basic bio
- [ ] Role badge (Student, S-T, Creator)

### Block 2 (Operational)
- [ ] Public profile page (`/@username`)
- [ ] Edit profile functionality
- [ ] Interests/tags
- [ ] Follow/unfollow users
- [ ] Follow/unfollow courses
- [ ] Follower/following counts
- [ ] "Available as Student-Teacher" toggle
- [ ] Student-Teacher directory
- [ ] Privacy settings (public/private)

### Block 3 (Full)
- [ ] Profile search
- [ ] Profile filters (by course, rating)
- [ ] Reputation display (ratings, courses completed)
- [ ] Achievement badges
- [ ] Activity feed on profile
- [ ] Mutual connections display
- [ ] Suggested users to follow
- [ ] Endorsements

---

# Feature 12: Creator Journey (Onboarding)

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ❌ Skip | |
| **Block 2** | ✅ In Scope | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Skip - Brian Onboards Manually)
*Brian manually onboards 4-5 Genesis creators*

### Block 2 (Basic Onboarding)
- [ ] "Become a Creator" landing page
- [ ] Application form (name, email, course proposal)
- [ ] Brian reviews in admin dashboard
- [ ] Approve/decline/request info
- [ ] Creator onboarding checklist
- [ ] Course content entry (paste external links)
- [ ] Course details form (price, description)
- [ ] Submit for review flow
- [ ] Course publication by Brian

### Block 3 (Full)
- [ ] AI-assisted application screening
- [ ] Self-service course creation
- [ ] Video upload (not external links)
- [ ] Creator help system
- [ ] Best practices library
- [ ] Creator community forum
- [ ] Application funnel analytics
- [ ] Creator onboarding tutorials

---

# Feature 13: Admin Dashboard (Brian's View)

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ❌ Skip | |
| **Block 2** | ✅ In Scope | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Skip - Brian Uses Creator Dashboards + Stripe)
*Brian monitors via individual Creator dashboards and Stripe dashboard*

### Block 2 (Platform Overview)
- [ ] Platform-wide stats (total students, total revenue, total sessions)
- [ ] All courses list
- [ ] All creators list
- [ ] Creator application queue
- [ ] Exception handling queue
- [ ] Manual user role assignment
- [ ] Manual S-T certification grant

### Block 3 (Full)
- [ ] Hypothesis validation metrics
- [ ] Flywheel tracking (H6)
- [ ] Revenue breakdown by course
- [ ] User growth charts
- [ ] Engagement analytics
- [ ] Moderation queue (flagged content)
- [ ] System health monitoring
- [ ] Email campaign management
- [ ] Feature flags

---

# Feature 14: Email Notifications

| Block | Scope | Status |
|-------|-------|--------|
| **Block 1** | ✅ In Scope | |
| **Block 2** | ⏳ Deferred | |
| **Block 3** | ⏳ Deferred | |

### Block 1 (Minimal)
- [ ] Enrollment confirmation (to Student)
- [ ] Enrollment notification (to Creator)
- [ ] Session booking confirmation (to Student + S-T)
- [ ] Session booking notification (to Creator)
- [ ] BBB link delivery in booking email
- [ ] Calendar invite (.ics) attachment
- [ ] Password reset email
- [ ] Email verification

### Block 2 (Operational)
- [ ] Session reminder (24h before)
- [ ] Session reminder (1h before)
- [ ] Certification approved email
- [ ] Payout processed email
- [ ] S-T application status email
- [ ] Weekly digest for Creators

### Block 3 (Full)
- [ ] Inactivity nudge ("We miss you!")
- [ ] Course completion congratulations
- [ ] Become S-T invitation (when eligible)
- [ ] Marketing emails
- [ ] Notification preferences
- [ ] Email templates management
- [ ] A/B testing emails

---

# Summary: Block 1 Scope

## What's IN Block 1 (10 Components)

| # | Feature | Block 1 Focus |
|---|---------|---------------|
| 1 | **User Auth** | Signup, login, password reset |
| 2 | **Course Page** | Info, creator, price, enroll button |
| 3 | **Payment** | Stripe Checkout, instant enrollment |
| 4 | **Course Content** | Modules, external links, checkboxes |
| 5 | **Calendar** | Availability, booking, confirmations |
| 6 | **Video (BBB)** | Room creation, join links |
| 7 | **Creator Dashboard** | Stats, students, progress, sessions |
| 8 | **Student Dashboard** | Course, progress, upcoming session |
| 9 | **S-T Dashboard** | Students, sessions, availability |
| 10 | **Email** | Enrollment, booking, password reset |

## What's OUT of Block 1 (Deferred)

| Feature | Deferred To |
|---------|-------------|
| Community Feed | Block 2 |
| Full Profile System | Block 2 |
| Certification Workflow | Block 2 |
| Payout Processing | Block 2 |
| S-T Application Workflow | Block 2 |
| Creator Journey | Block 2 |
| Admin Dashboard | Block 2 |
| Session Reminders | Block 2 |
| Ratings/Reviews | Block 3 |
| Advanced Analytics | Block 3 |

---

# Block Timeline Estimate

| Block | Duration | What's Delivered |
|-------|----------|------------------|
| **Block 1** | 3-4 weeks | End-to-end flow works |
| **Block 2** | 3-4 weeks | Creator can manage course |
| **Block 3** | 4-6 weeks | Full features + scale |
| **Total** | 10-14 weeks | Complete MVP |

---

**Document Created:** December 6, 2025  
**For:** Fraser + Brian  
**Status:** Block 1 Complete, Block 2/3 Outlined

---

*End of Feature Block Breakdown*









