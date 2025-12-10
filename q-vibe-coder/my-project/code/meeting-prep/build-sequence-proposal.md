# Build Sequence Proposal for Fraser

**Created:** December 3, 2025  
**Purpose:** Define the order Fraser builds MVP features  
**Timeline:** Dec 6, 2025 → Apr 1, 2026 (~16 weeks)  
**Status:** DRAFT - For discussion with Fraser

---

## Executive Summary

**8 MUST HAVE Features to Build:**

| # | Feature | Dev Cost | Dev Time | Dependencies |
|---|---------|----------|----------|--------------|
| 1 | Creator Profiles | $500 | <1 week | None |
| 2 | Payment & Escrow | $11K-15K | 2-3 weeks | Creator Profiles |
| 3 | Student Profile System | $14K-18.7K | 3-4 weeks | Payment (enrollment) |
| 4 | Calendar/Scheduling | $1.7K-3.8K | 1-2 weeks | Student Profiles |
| 5 | Video Conferencing (BBB) | Integration | ~1 week | Calendar |
| 6 | Course Content Delivery | $2K-4K | ~1 week | BBB (content between sessions) |
| 7 | Community Feed | Integration | ~1 week | User Profiles |
| 8 | Rebrand to PeerLoop | - | ✅ DONE | - |

**Total Feature Dev Time:** ~10-14 weeks  
**Buffer for Testing/Polish:** ~2-6 weeks  
**Timeline Fit:** ✅ YES (16 weeks available)

---

## Recommended Build Sequence

### 🔧 Phase 0: Foundation (Week 1)
**Dec 6-13**

Build core platform infrastructure:
- [ ] Authentication system (signup/login)
- [ ] Database schema design
- [ ] Basic app structure / routing
- [ ] Admin role for Brian
- [ ] Base UI components / design system

**Deliverable:** Working app shell with auth

---

### 🎨 Phase 1: Creator Foundation (Week 2)
**Dec 13-20**

**Feature: Creator Profiles** ($500, <1 week)

Why first:
- ✅ Simplest feature (quick win)
- ✅ Creators are the foundation - courses need creators
- ✅ Only 4-5 creators for Genesis
- ✅ Brian can start onboarding creators immediately

Scope:
- Basic creator info page
- Creator photo, bio, credentials
- List of courses they offer
- Public profile URLs

**Deliverable:** Creator pages live, ready for course creation

---

### 💳 Phase 2: Payment System (Weeks 3-5)
**Dec 20 - Jan 10**

**Feature: Payment & Escrow** ($11K-15K, 2-3 weeks)

Why second:
- ✅ Depends on Creator Profiles ✅
- ✅ Critical infrastructure - cannot operate without it
- ✅ Must work before students can enroll
- ✅ Validates H1 (will students pay $400-600?)

Scope:
- Stripe Checkout integration
- Course purchase flow (basic course info page for checkout)
- 70/15/15 split calculation
- Admin payout dashboard
- Semi-automated payout processing (Brian clicks)

**Deliverable:** Students can pay, payouts work

---

### 👤 Phase 3: Student Profiles (Weeks 5-8)
**Jan 10 - Feb 7**

**Feature: Student Profile System** ($14K-18.7K, 3-4 weeks)

Why third:
- ✅ Largest feature - needs solid foundation
- ✅ Depends on payment (enrolled users)
- ✅ Critical for H4 (conversion to teaching) and H6 (flywheel)

Scope:
- Profile pages (name, photo, bio, interests)
- Follow/unfollow users and courses
- Student-Teacher toggle
- Student-Teacher directory
- Ratings display (read-only)

**Deliverable:** Full social graph functionality

---

### 📅 Phase 4: Scheduling (Weeks 9-10)
**Feb 7-21**

**Feature: Calendar/Scheduling** ($1.7K-3.8K, 1-2 weeks)

Why fourth:
- ✅ Depends on Student Profiles (need Student-Teachers)
- ✅ Enrolled students need to book sessions
- ✅ ~60 sessions/week for Genesis cohort

Scope:
- Student-Teacher availability management
- Student booking interface
- Auto-notifications (email + calendar invite)
- Session management

**Question for Fraser:** Cal.com (B) vs Custom (D) vs Google API (E)?

**Deliverable:** Students can book sessions with Student-Teachers

---

### 🎥 Phase 5: Video Integration (Week 11)
**Feb 21-28**

**Feature: Video Conferencing (BBB)** (~1 week integration)

Why fifth:
- ✅ Depends on Calendar (sessions trigger video rooms)
- ✅ RIADVICE offers 10 hours integration support ($500)
- ✅ Integration work, not full build

Scope:
- BBB API integration (create rooms, generate links)
- Auto-generate session links on booking
- Link delivery in notifications
- Recording access (if included)

**Deliverable:** Video sessions work end-to-end

---

### 📚 Phase 6: Course Content (Week 12)
**Feb 28 - Mar 7**

**Feature: Course Content Delivery** ($2K-4K, ~1 week)

Why sixth (after BBB):
- ✅ Sessions drive learning - content is what students study BETWEEN sessions
- ✅ User journey: Pay → Schedule → Attend → Study content → Repeat
- ✅ Can use basic course info page for enrollment; full content comes later

Scope:
- Course landing pages with full module structure
- Module structure with checkboxes
- Video links (YouTube/Vimeo external)
- Document links (Google Drive)
- Student progress tracking (self-mark)

**Deliverable:** Full course content accessible between sessions

---

### 💬 Phase 7: Community Feed (Week 13)
**Mar 7-14**

**Feature: Community Feed (GetStream.io)** (~1 week integration)

Why last feature:
- ✅ Depends on user profiles existing
- ✅ Nice-to-have engagement layer
- ✅ Can launch Genesis without if needed

Scope:
- GetStream SDK integration
- Activity feed display
- Posting functionality
- Following feed (people + courses)

**Deliverable:** Social engagement layer

---

### 🧪 Phase 8: Testing & Polish (Weeks 15-16)
**Mar 14 - Apr 1**

Final prep for Genesis cohort:
- [ ] End-to-end testing of complete user journey
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Brian UAT (user acceptance testing)
- [ ] Creator onboarding finalization
- [ ] Documentation / help content
- [ ] Genesis launch prep

**Deliverable:** Production-ready platform

---

## Visual Timeline

```
Week 1  (Dec 6-13)    │ ████████ Foundation / Auth
Week 2  (Dec 13-20)   │ ████ Creator Profiles
Week 3  (Dec 20-27)   │ ████████████████
Week 4  (Dec 27-Jan 3)│ ████████████████ Payment & Escrow
Week 5  (Jan 3-10)    │ ████████████████
Week 6  (Jan 10-17)   │ ████████████████████████
Week 7  (Jan 17-24)   │ ████████████████████████ Student Profiles
Week 8  (Jan 24-31)   │ ████████████████████████
Week 9  (Jan 31-Feb 7)│ ████████████████████████
Week 10 (Feb 7-14)    │ ████████████████ Calendar/Scheduling
Week 11 (Feb 14-21)   │ ████████████████
Week 12 (Feb 21-28)   │ ████████ BBB Integration
Week 13 (Feb 28-Mar 7)│ ████████ Course Content
Week 14 (Mar 7-14)    │ ████████ GetStream Integration
Week 15 (Mar 14-21)   │ ████████████ Testing & Polish
Week 16 (Mar 21-Apr 1)│ ████████████ Launch Prep
                      │
                      └─────────────────────────────→ Apr 1: Genesis Launch
```

---

## Dependency Chain

```
Creator Profiles
       ↓
Payment & Escrow (basic course info for checkout)
       ↓
Student Profile System
       ↓
Calendar/Scheduling
       ↓
Video Conferencing (BBB)
       ↓
Course Content Delivery ← (full content between sessions)
       ↓
Community Feed (GetStream) ← (can build in parallel)
```

**User Journey Logic:**
```
Pay → Schedule → Attend Session → Study Content → Repeat
 │        │           │               │
 ▼        ▼           ▼               ▼
Payment  Calendar    BBB         Course Content
```

---

## Questions for Fraser

### Architecture
1. Does this build sequence make sense technically?
2. Any dependencies I'm missing?
3. Would you sequence anything differently?

### Timeline
4. Are the time estimates accurate?
5. Which features have the most risk of overrun?
6. Where should we build in more buffer?

### Technical Decisions Needed
7. **Calendar:** Cal.com (B) vs Custom react-big-calendar (D) vs Google API (E)?
8. **Video:** RIADVICE confirmed - what do you need to integrate BBB?
9. **Community:** GetStream SDK - any integration concerns?

### Risk Areas
10. What's the riskiest feature to build?
11. What would you cut first if we fall behind?
12. Any features that could slip to post-launch?

---

## Fallback Plan

**If timeline gets tight, here's the priority:**

### MUST have for Apr 1 launch:
1. ✅ Creator Profiles
2. ✅ Payment & Escrow
3. ✅ Basic Student Profiles (can defer advanced social)
4. ✅ Calendar/Scheduling
5. ✅ Video Integration
6. ✅ Course Content (can be basic module list initially)

### CAN defer post-launch if needed:
- ⏸️ Community Feed (GetStream) - students can use Discord/WhatsApp initially
- ⏸️ Advanced profile features (full social graph)
- ⏸️ Student-Teacher directory search/filter
- ⏸️ Advanced progress tracking (basic checkboxes OK)

**Minimum Viable Launch =** Students can pay, book sessions, attend video calls, access content between sessions

---

## Brian's Action Items

Before Fraser starts building:

- [ ] Stripe account setup (payment processing)
- [ ] RIADVICE contract signed (BBB hosting)
- [ ] GetStream account setup (community feed)
- [ ] Creator content ready (4-5 courses with video links)
- [ ] Domain/hosting decisions finalized

---

## Budget Reconciliation

| Phase | Feature | Est. Cost |
|-------|---------|-----------|
| 0 | Foundation/Auth | ~$5K-8K |
| 1 | Creator Profiles | $500 |
| 2 | Payment & Escrow | $11K-15K |
| 3 | Student Profiles | $14K-18.7K |
| 4 | Calendar/Scheduling | $1.7K-3.8K |
| 5 | BBB Integration | ~$1K-2K (+ $500 RIADVICE support) |
| 6 | Course Content | $2K-4K |
| 7 | GetStream Integration | ~$1K-2K |
| 8 | Testing/Polish | ~$5K-8K |
| **Total Estimate** | | **$42K - $62K** |

**Budget:** $75K  
**Remaining Buffer:** $13K-33K  
**Status:** ✅ Comfortable within range

---

## Next Steps

1. ⏭️ Review this sequence with Fraser
2. ⏭️ Fraser validates/adjusts estimates
3. ⏭️ Fraser answers technical questions
4. ⏭️ Lock build sequence by Dec 6
5. ⏭️ Fraser begins Phase 0 (Foundation)

---

**Document Status:** DRAFT  
**Needs:** Fraser review and validation  
**Deadline:** Lock by Dec 6, 2025

---

**End of Build Sequence Proposal**

