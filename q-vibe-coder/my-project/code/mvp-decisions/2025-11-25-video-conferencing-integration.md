# MVP Decision: Video Conferencing Integration (Big Blue Button or Jitsi)

**Date:** 2025-11-25
**Decision Maker:** Brian (CEO/Founder)
**Decision:** MUST HAVE
**Status:** Approved (pending Fraser feasibility confirmation)

---

## Feature Description

Integrated video conferencing system enabling live 1-on-1 sessions between Student-Teachers and students.

**Preferred Platform:** Big Blue Button (or Jitsi if Fraser recommends)
**Approach:** Integration via API (NOT building from scratch)
**Deployment:** Hosted service (self-hosting in Phase 2+)

### Core Functionality

**For Students:**
- Schedule sessions through PeerLoop dashboard
- Receive email notifications with session links
- Calendar integration (Google Calendar/Outlook sync)
- Click to join from dashboard or email
- Join video session in browser (no downloads)

**For Student-Teachers:**
- Manage session availability via calendar
- Schedule sessions with multiple students
- Access session recordings
- Use teaching features (screen share, whiteboard, etc.)

**For Platform:**
- Track session attendance
- Store session recordings
- Analytics on session completion
- Integration with progress tracking

---

## Decision Framework Analysis

### 1. Hypothesis Validation ✅

**Primary Hypotheses Validated:**

**H5: Peer Teaching Quality**
- Enables Student-Teachers to deliver high-quality 1-on-1 instruction
- Live video sessions are core to teaching model
- Without this, Student-Teachers cannot teach effectively

**H6: Flywheel Validation** (Brian's #1 uncertainty)
- Enables Student-Teachers to teach their own students
- Critical infrastructure for second-generation emergence
- Student-Teachers need professional tools to recruit and teach

**H2: Completion Rates**
- Live 1-on-1 sessions improve accountability
- Personal connection increases completion likelihood
- Regular check-ins prevent dropout

**H1: Market Positioning**
- Professional video conferencing justifies premium pricing
- Integrated experience signals "real platform" not DIY solution
- Students expect tutoring-level service at tutoring prices

**Assessment:** Strong validation across 4 of 6 hypotheses, including top uncertainty (#6).

---

### 2. Genesis Cohort Critical Check ✅

**Is this critical for 60-80 Genesis students?**

**YES - Core to business model:**
- PeerLoop's model is live 1-on-1 teaching (not asynchronous MOOCs)
- Student-Teachers need video infrastructure to teach
- Students paying $300-600 expect professional video tutoring
- Cannot deliver core value proposition without video conferencing

**Would students lose trust without integrated video?**
- Yes - sending Zoom links feels DIY/unprofessional
- Integrated scheduling + video = professional platform
- Manual workarounds undermine "polished concierge" positioning

**Assessment:** This is not optional for Genesis cohort. Core infrastructure.

---

### 3. Manual Alternative Check ✅

**Can Brian handle this manually?**

**Partial - but compromises hypothesis validation:**

**What could be manual:**
- Brian could distribute Zoom Pro accounts to Student-Teachers
- Student-Teachers manage their own Zoom scheduling
- Cost: ~$15/user/month x 5-10 Student-Teachers = $75-150/month

**Why manual approach is inadequate:**
- Doesn't integrate with PeerLoop platform (students see Zoom, not PeerLoop)
- User-based pricing scales poorly (every Student-Teacher = $15/month)
- No unified analytics or tracking
- Compromises professional appearance
- Zoom has 40-minute time limits on free tier

**Fraser's role:**
- Fraser will INTEGRATE existing service (BBB or Jitsi)
- Fraser will NOT build video conferencing from scratch (confirmed)
- Integration = 1-2 weeks vs building from scratch = months

**Assessment:** Manual workaround exists but compromises core value proposition and hypothesis validation.

---

### 4. Budget & Timeline Impact ✅

**Development Cost:**
- Fraser integration work: 1-2 weeks
- Estimated cost: $1,500-3,000 (assuming $1,500/week rate)
- Percentage of $75K budget: 2-4%

**Ongoing Service Cost:**
- Big Blue Button hosted: $50-200/month
- Jitsi hosted: $50-150/month (or free self-hosted)
- 4-month MVP period: $200-800 total

**Total Phase 1 Cost:** ~$1,700-3,800

**Timeline Impact:**
- 1-2 weeks of Fraser's 4-month timeline (9-12%)
- Reasonable allocation for core infrastructure
- Does not jeopardize other MUST HAVE features

**Future Cost Control:**
- BBB/Jitsi are open source (can self-host in Phase 2+)
- Self-hosting eliminates monthly service fees
- Strategic investment with exit option

**Assessment:** Fits within budget and timeline constraints. Strong ROI for core infrastructure.

---

### 5. Polished Concierge Test ✅

**What Students SEE (Must Be Built):**
- ✅ Integrated calendar/scheduling in dashboard
- ✅ "Join Session" button in PeerLoop platform
- ✅ Automated email notifications
- ✅ Calendar sync (Google Cal/Outlook)
- ✅ Professional video interface (branded or embedded)

**What Happens Behind Scenes (Can Be Manual):**
- ❌ Video infrastructure (BBB/Jitsi handles this via API)
- ❌ Recording storage (service provider handles)
- ❌ Connection quality management (service provider)

**Assessment:** This is "what students see" - must be built professionally.

---

## Final Decision: MUST HAVE ✅

**Rationale:**

1. **Core Business Model:** Live 1-on-1 video teaching is not optional - it IS the product
2. **Hypothesis Validation:** Validates 4 of 6 hypotheses including #6 (top uncertainty)
3. **Professional Positioning:** $300-600 price point requires professional video experience
4. **Economic Model:** Per-session pricing (BBB/Jitsi) scales better than per-user (Zoom)
5. **Strategic Investment:** Open source enables future self-hosting and cost control
6. **Reasonable Cost:** 9-12% of timeline, 12-20% of budget for core infrastructure

**This is foundational infrastructure, not a "nice to have" feature.**

---

## Platform Selection: BBB vs Jitsi

**Big Blue Button (Preferred):**
- ✅ Education-specific features (whiteboard, breakout rooms, polls)
- ✅ Mature platform (v3.0)
- ✅ Excellent recording/playback
- ✅ Strong analytics
- ✅ Per-session pricing model

**Jitsi Meet (Alternative):**
- ✅ Also open source
- ✅ Lighter weight (may be easier integration)
- ✅ Free self-hosting option
- ✅ Good for simple 1-on-1 calls
- ⚠️ Fewer education-specific features

**Decision:** Prefer BBB, but defer to Fraser's recommendation after technical evaluation.

**Fraser should evaluate:**
- Integration complexity (API documentation, developer experience)
- Hosted service reliability and cost
- Feature set alignment with PeerLoop needs
- Self-hosting feasibility for Phase 2

---

## Implementation Notes

### Scope for Phase 1 (MVP)

**MUST HAVE:**
- Calendar/scheduling system in dashboard
- Session booking interface
- Automated email notifications with links
- Google Calendar/Outlook integration
- BBB/Jitsi API integration (start/join sessions)
- Session attendance tracking
- Basic recording storage/playback

**NICE TO HAVE (if time allows):**
- Embedded video (vs separate window)
- Advanced scheduling (recurring sessions, bulk booking)
- In-platform recording library
- Session quality metrics

**OUT OF SCOPE (Phase 2):**
- Self-hosted BBB/Jitsi server
- Custom video features
- Advanced analytics dashboard
- Mobile app integration

### Technical Requirements for Fraser

1. **Research Phase (before Dec 6 spec finalization):**
   - Evaluate BBB vs Jitsi APIs
   - Confirm integration approach and timeline
   - Validate hosted service providers
   - Provide time and cost estimates

2. **Integration Phase (during 4-month build):**
   - Build calendar/scheduling system
   - Integrate BBB or Jitsi API
   - Implement email notifications
   - Add calendar sync (Google/Outlook)
   - Test with multiple users
   - Document for Student-Teacher onboarding

3. **What Fraser Should NOT Do:**
   - ❌ Build video conferencing from scratch
   - ❌ Build WebRTC infrastructure
   - ❌ Manage TURN/STUN servers
   - ❌ Handle video/audio codec complexity

---

## Open Questions

### For Fraser Meeting (High Priority)

1. **BBB vs Jitsi:** Which platform do you recommend after technical evaluation?
2. **Integration Timeline:** Confirm 1-2 week estimate is realistic
3. **Integration Cost:** Provide development cost estimate
4. **Hosted Services:** Which BBB/Jitsi hosting provider do you recommend?
5. **Calendar System:** How complex is calendar/scheduling integration? (Google Cal, Outlook sync)
6. **Recording Storage:** Where do session recordings get stored? How much storage needed?

### For Business/Product

7. **Session Length:** What's average session length? (affects bandwidth/cost)
8. **Concurrent Sessions:** How many simultaneous sessions at peak? (affects service tier)
9. **Recording Policy:** Do all sessions get recorded? Student opt-out?
10. **Session Limits:** Any time limits per session? (BBB host decides, Zoom free = 40 min)

### For Student-Teachers

11. **Training:** What onboarding do Student-Teachers need for video platform?
12. **Technical Support:** Who handles video troubleshooting for students?
13. **Backup Plan:** What if video fails during session? (phone? reschedule?)

---

## Success Metrics

**By Apr 1 Launch (MVP Ready):**
- ✅ Students can schedule sessions via dashboard
- ✅ Email notifications with links working
- ✅ Calendar sync functional (Google/Outlook)
- ✅ Video sessions launch from dashboard/email
- ✅ Session attendance tracked
- ✅ Recordings accessible to students
- ✅ Student-Teachers can manage their calendars
- ✅ System tested with 5-10 beta users

**By Jun 1 (Genesis Cohort Complete):**
- ✅ 60-80 students using video sessions successfully across 4-5 courses
- ✅ Session completion rate >80%
- ✅ Video quality acceptable (no major complaints)
- ✅ Student-Teachers comfortable with platform
- ✅ Session data informing H5 and H6 validation

---

## Risk Assessment

**Technical Risks:**
- 🟡 Medium: API integration more complex than expected (mitigation: Fraser evaluates before committing)
- 🟢 Low: Hosted service reliability (mitigation: choose reputable provider)
- 🟢 Low: Calendar integration complexity (mitigation: use established libraries)

**Business Risks:**
- 🟢 Low: Service cost escalation (mitigation: open source = self-host option)
- 🟢 Low: Student adoption (mitigation: video calls are familiar to everyone)
- 🟡 Medium: Student-Teacher training needs (mitigation: simple interface, onboarding materials)

**Budget Risks:**
- 🟢 Low: Development cost overrun (mitigation: 1-2 weeks well-scoped, not complex)
- 🟢 Low: Service cost (mitigation: $50-200/month manageable)

**Timeline Risks:**
- 🟢 Low: Integration delays (mitigation: 1-2 weeks has buffer in 4-month timeline)
- 🟡 Medium: Fraser discovers complexity (mitigation: evaluate before Dec 6 commitment)

---

## Next Steps

### Immediate (This Week)
1. ✅ Decision documented (this file)
2. ⏳ Create feature spec in `features/must-have/`
3. ⏳ Add to Fraser meeting prep agenda

### Before Dec 6 (Spec Finalization)
4. Fraser evaluates BBB vs Jitsi
5. Fraser provides time/cost estimate
6. Finalize platform choice
7. Lock in requirements document

### During Build (Dec 6 → Apr 1)
8. Fraser implements integration
9. Beta test with Brian + 2-3 users
10. Iterate based on feedback
11. Prepare Student-Teacher training materials

---

## Related Decisions

**Depends On:**
- Student dashboard (to house calendar/scheduling)
- Email notification system (for session reminders)
- User authentication (to join sessions securely)

**Enables:**
- Student-Teacher teaching workflow
- Session attendance tracking (H2 validation)
- Teaching quality assessment (H5 validation)
- Second-generation teaching (H6 validation)

---

## Notes

**Key Insight:** This is infrastructure, not a feature. It's like deciding if a restaurant needs a kitchen. The answer is obvious: yes, you need it. The only question is BBB vs Jitsi and how to integrate it efficiently.

**Brian's Strategic Thinking:** Choosing BBB for per-session pricing (vs per-user) shows strong understanding of marketplace economics. This scales better as Student-Teacher count grows.

**New Role Discovered:** Brian mentioned "moderators appointed by course creator" in addition to Student-Teachers. Need to clarify if moderators also use video conferencing and what their role is. (Follow-up in future decision.)

---

**Decision Status:** ✅ MUST HAVE (approved by Brian, pending Fraser technical confirmation)

**Documentation Complete:** 2025-11-25

**Next Review:** After Fraser provides BBB vs Jitsi recommendation

