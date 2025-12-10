# Feature Spec: Video Conferencing Integration (BBB or Jitsi)

**Category:** MUST HAVE
**Priority:** Critical Infrastructure
**Status:** Approved (pending Fraser feasibility confirmation)
**Decision Log:** `mvp-decisions/2025-11-25-video-conferencing-integration.md`

---

## Overview

Integrated video conferencing system enabling live 1-on-1 teaching sessions between Student-Teachers and students via Big Blue Button or Jitsi Meet (Fraser to recommend).

**Platform:** BBB (preferred) or Jitsi (alternative)
**Deployment:** Hosted service (Phase 1), self-hosted (Phase 2+)
**Integration:** API-based (NOT building from scratch)

---

## User Stories

### As a Student
- I can schedule a session with my Student-Teacher through the PeerLoop dashboard
- I receive email confirmation with session link and calendar invite
- I can click "Join Session" from dashboard or email to enter video call
- I can see my upcoming sessions in my dashboard calendar
- I can access recordings of past sessions for review

### As a Student-Teacher
- I can set my availability in the calendar system
- I can see which students have booked sessions with me
- I receive notifications when students book sessions
- I can start sessions with one click from my dashboard
- I can access teaching tools (screen share, whiteboard)
- I can review session recordings to improve teaching

### As Brian (Admin)
- I can track session attendance across all Student-Teachers
- I can see completion rates for scheduled sessions
- I can access recordings if quality issues arise
- I can collect data for H5 and H6 validation

---

## Core Requirements

### Calendar/Scheduling System

**MUST HAVE:**
- Student-facing booking interface (select time, Student-Teacher)
- Student-Teacher availability calendar management
- Time zone handling
- Email notifications (booking confirmation, reminders)
- Google Calendar integration (add to student's calendar)
- Outlook calendar integration
- Session rescheduling and cancellation
- "Join Session" buttons in dashboard

**NICE TO HAVE:**
- Recurring session scheduling
- Bulk booking (book 10 sessions at once)
- Automated reminders (1 day before, 1 hour before)
- Waitlist for popular Student-Teachers

### Video Integration (BBB or Jitsi)

**MUST HAVE:**
- API integration to start/join sessions
- Unique session URLs per booking
- Browser-based (no downloads required)
- Screen sharing capability
- Basic chat functionality
- Session recording (optional per session)
- Recording playback interface
- Session attendance tracking

**NICE TO HAVE:**
- Embedded video (within PeerLoop, not separate window)
- Interactive whiteboard
- Breakout rooms (if group sessions in future)
- Polls/quizzes (for teaching)
- Virtual background
- Hand raise / reactions

### Recording & Storage

**MUST HAVE:**
- Recordings stored for 90 days minimum
- Students can access their session recordings
- Student-Teachers can access recordings to review teaching
- Basic playback interface

**NICE TO HAVE:**
- Searchable recording library
- Download recordings
- Transcript generation (auto-captions)
- Clip/highlight creation
- Indefinite storage (vs 90-day deletion)

---

## Technical Specifications

### Platform Evaluation Criteria (for Fraser)

**Big Blue Button:**
- API documentation quality
- Hosted service options (reliability, cost)
- Integration complexity
- Education-specific features
- Recording capabilities
- Self-hosting feasibility

**Jitsi Meet:**
- API documentation quality
- Hosted service options (or free self-host)
- Integration complexity
- Lightweight / performance
- Self-hosting feasibility

### Integration Requirements

**Authentication:**
- Secure session creation (only booked participants can join)
- Single sign-on from PeerLoop (no separate login)
- Role-based access (Student-Teacher = moderator, Student = participant)

**Scheduling:**
- Google Calendar API integration
- Outlook/Microsoft Graph API integration
- Email delivery (SendGrid, Postmark, or similar)
- Time zone conversion library

**Session Management:**
- Create session via BBB/Jitsi API
- Generate unique join URLs
- Track session start/end times
- Track participant attendance
- Retrieve recordings after session ends

**Data Storage:**
- Session metadata (date, time, participants, duration)
- Recording URLs and access permissions
- Attendance records
- Student-Teacher availability schedules

---

## Design Requirements

### User Experience

**Booking Flow:**
1. Student clicks "Schedule Session" in dashboard
2. Selects Student-Teacher from dropdown
3. Views Student-Teacher's available time slots
4. Selects date/time
5. Confirms booking
6. Receives email confirmation + calendar invite
7. Session appears in "Upcoming Sessions" dashboard widget

**Joining Flow:**
1. Student receives reminder email (1 day before, 1 hour before)
2. At session time, student clicks "Join Session" in:
   - Dashboard (preferred)
   - Email link (backup)
3. Video window opens (separate or embedded)
4. Student-Teacher already in session or joins shortly
5. Session proceeds

**Post-Session:**
1. Recording available 15-30 minutes after session ends
2. Student receives email: "Your recording is ready"
3. Student can access in "Past Sessions" dashboard section
4. Recording available for 90 days

### Visual Design

**Calendar UI:**
- Clean, modern calendar interface (FullCalendar.js or similar)
- Color-coded sessions (upcoming, completed, cancelled)
- Quick view of session details (hover/click)

**Dashboard Widgets:**
- "Upcoming Sessions" (next 3 sessions with countdown timer)
- "Join Session" button (appears 5 min before start time)
- "Past Sessions" with recording links

**Video Interface:**
- Clean, distraction-free video window
- Prominent screen share button for Student-Teachers
- Simple chat interface
- "End Session" button (Student-Teacher only)

---

## Success Criteria

### Phase 1 (MVP Launch - Apr 1)
- ✅ 100% of students can book sessions successfully
- ✅ 95%+ of video sessions connect without technical issues
- ✅ Email notifications delivered within 1 minute
- ✅ Calendar invites work for Google Calendar and Outlook
- ✅ Recordings available within 30 minutes of session end
- ✅ Session attendance tracked for all sessions

### Genesis Cohort (Apr 1 → Jun 1)
- ✅ 80%+ scheduled sessions actually happen (not cancelled)
- ✅ <5% technical support requests for video issues
- ✅ Student satisfaction >4/5 for video quality
- ✅ Student-Teacher satisfaction >4/5 for teaching tools
- ✅ Average session length = 45-60 minutes (validates engagement)

### Hypothesis Validation
- ✅ H5: Can measure Student-Teacher teaching quality via recordings
- ✅ H6: Track which Student-Teachers hold sessions with their recruited students
- ✅ H2: Measure completion rates (sessions attended vs scheduled)

---

## Cost Estimate

### Development (One-Time)
- Fraser integration work: **1.5-2 weeks**
- Estimated cost: **$1,500-3,000**

### Service Costs (Ongoing)
- BBB/Jitsi hosted: **$50-200/month**
- Email delivery: **$10-20/month** (included in general email service)
- Storage (recordings): **$10-30/month** (AWS S3 or similar)

**Phase 1 Total (4 months):** ~$1,700-3,800

**Annual (if self-hosting in Phase 2):** Server costs only (~$50-100/month)

---

## Timeline

**Before Dec 6 (Spec Finalization):**
- Fraser evaluates BBB vs Jitsi
- Fraser provides time/cost estimate
- Platform choice finalized

**Dec 6 → Dec 20 (Week 1-2 of build):**
- Fraser sets up hosted BBB/Jitsi account
- Fraser builds calendar/scheduling system
- Fraser integrates BBB/Jitsi API

**Dec 20 → Jan 15 (Week 3-6):**
- Email notification system
- Calendar integration (Google/Outlook)
- Recording playback interface
- Dashboard UI integration

**Jan 15 → Feb 1 (Week 7-8):**
- Beta testing with Brian + 3-5 users
- Bug fixes and refinements
- Student-Teacher onboarding materials

**Feb 1 → Apr 1 (Week 9-16):**
- Other features built
- Ongoing testing of video system
- Final polish before launch

---

## Dependencies

**Requires:**
- User authentication system (students/Student-Teachers can log in)
- Student dashboard (to house calendar and join buttons)
- Email delivery system (for notifications)
- Student-Teacher profiles (to show who students can book with)

**Enables:**
- Teaching sessions (core product)
- H5, H6, H2 validation
- Student-Teacher workflow
- Premium positioning ($300-600 pricing justified)

---

## Risks & Mitigation

**Risk:** BBB/Jitsi API more complex than expected
**Mitigation:** Fraser evaluates before Dec 6; chooses simpler platform if needed

**Risk:** Students experience video quality issues
**Mitigation:** Use reputable hosted service; have technical support plan

**Risk:** Calendar integration breaks with provider API changes
**Mitigation:** Use established libraries (maintained by community)

**Risk:** Recording storage costs escalate
**Mitigation:** 90-day auto-deletion; monitor usage; self-host if needed

---

## Open Questions

1. **Platform Choice:** BBB or Jitsi? (Fraser to recommend)
2. **Session Length:** Average length for cost modeling? (45-60 min assumed)
3. **Concurrent Sessions:** How many at peak? (affects service tier)
4. **Recording Policy:** All sessions recorded? Opt-in? Opt-out?
5. **Moderator Role:** Do "moderators" also use video? (Brian mentioned this role)
6. **Technical Support:** Who handles video troubleshooting? Brian? Fraser? Outsource?

---

## Notes

**Critical Success Factor:** This must work reliably from day 1. Video quality issues will kill trust in the platform.

**Fraser's Role:** Integration only (NOT building video infrastructure from scratch). This was explicitly confirmed.

**Future Enhancement:** Self-host BBB/Jitsi in Phase 2+ to eliminate monthly service fees and have full control.

---

**Status:** ✅ Approved as MUST HAVE

**Next Steps:** 
1. Add to Fraser meeting agenda
2. Get Fraser's BBB vs Jitsi recommendation
3. Finalize timeline and cost estimate
4. Begin implementation Dec 6

---

**Last Updated:** 2025-11-25

