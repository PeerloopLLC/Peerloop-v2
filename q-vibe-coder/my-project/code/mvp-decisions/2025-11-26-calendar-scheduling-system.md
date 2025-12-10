# Decision: Calendar/Scheduling System

**Date:** 2025-11-26  
**Decider:** Brian  
**Status:** ✅ MUST HAVE  
**Pending:** Fraser needs to evaluate Options B, D, or E

---

## Feature Description

Automated booking system enabling students to schedule 1-on-1 sessions with Student-Teachers without manual intervention.

**User Flow:**
1. Student navigates to course listing
2. Clicks "Schedule Session" button
3. Views calendar, selects day
4. Sees list of available Student-Teacher time slots for that day
5. Clicks on Student-Teacher listing, books time
6. Both Student and Student-Teacher receive:
   - Email notification
   - In-app private message
   - Big Blue Button link for session

**Capacity Required:** ~60 sessions/week

---

## Hypothesis Validation

| Hypothesis | Impact | Explanation |
|------------|---------|-------------|
| **H1: Market Positioning** | ✅ VALIDATES | Professional automated booking is table stakes for marketplace platforms |
| **H2: Completion Rates** | ✅ VALIDATES | Easy booking increases session participation and course completion |
| **H3: Customer Segmentation** | ⚠️ INDIRECT | Booking data identifies engaged vs passive students |
| **H4: Conversion to Teaching** | ✅ VALIDATES | Student-Teachers must set availability, creating commitment |
| **H5: Peer Teaching Quality** | ➖ INDIRECT | Enables sessions but doesn't directly affect teaching quality |
| **H6: Flywheel** | ✅ VALIDATES | Critical marketplace infrastructure for Student-Teacher recruitment |

**Validation Score:** 5/6 hypotheses (HIGH)

---

## Genesis Cohort Criticality

**Scale:** 60-80 students, 4-5 creators, estimated 60 sessions/week

**Is it critical for first 60-80 students?** ✅ YES

**Reasoning:**
- 60 sessions/week cannot be manually coordinated
- Marketplace requires automated availability matching
- Student-Teachers need self-service scheduling to function
- Professional booking experience is core to value proposition

---

## Manual Alternative Assessment

**Could Brian/Moderators coordinate manually?** ❌ NO

**Why not:**
- 60 sessions/week = 8-9 sessions/day requiring coordination
- Real-time availability matching across multiple Student-Teachers
- Would consume 10-15 hours/week of manual coordination
- Poor user experience (delays, friction, dropped bookings)
- Defeats "marketplace" positioning

**Polished Concierge Test:** ❌ FAILS - Backend automation required

---

## Budget & Timeline Impact

### Implementation Options for Fraser

Brian has narrowed to THREE options for Fraser to evaluate:

#### Option B: Cal.com (Open Source)
- **Dev Time:** 1-1.5 weeks
- **Dev Cost:** $1,700-2,850
- **Monthly Cost:** $12/Student-Teacher = $720-960/month (60-80 Student-Teachers)
- **Pros:** Open source, can self-host later, proven UX, fast implementation
- **Cons:** Recurring per-user cost, marketplace customization needed
- **Best for:** Fast launch with migration path to self-hosted

#### Option D: Booking Library (react-big-calendar + custom)
- **Dev Time:** 1.5-2 weeks
- **Dev Cost:** $2,550-3,800
- **Monthly Cost:** $0
- **Pros:** No recurring fees, full control, customizable for exact flow
- **Cons:** More dev time than Cal.com, moderate complexity
- **Best for:** Cost control, custom marketplace logic, scalable

#### Option E: Google Calendar API + Custom UI
- **Dev Time:** 2 weeks
- **Dev Cost:** $3,400
- **Monthly Cost:** $0
- **Pros:** Leverage Google infrastructure, no per-user fees, students can sync to personal calendar
- **Cons:** Google Calendar API complexity, potential quota limits
- **Best for:** Free infrastructure, native calendar sync

### Questions for Fraser

1. **Which option (B, D, or E) do you recommend?**
2. **Timeline:** Are the dev time estimates realistic?
3. **Technical Risks:** What are the biggest blockers for each option?
4. **Cal.com customization:** If Option B, can we customize for marketplace (show multiple Student-Teacher slots)?
5. **Integration complexity:** Email + in-app messaging + BBB link generation - included in timeline?
6. **Scalability:** Any concerns at 60-80 users or 60 sessions/week?

### Budget Impact (Conservative Estimate)

**One-time development:** $1,700-3,800  
**Monthly recurring (Option B only):** $720-960/month = $8,640-11,520/year

**Running Total (3 MUST HAVE features):**
- BBB/Jitsi: $1,700-3,800
- getstream.io: $3,400-5,700
- Calendar/Scheduling: $1,700-3,800
- **Total:** $6,800-13,300 (9-18% of $75K budget)
- **Remaining:** $61,700-68,200

**Note:** Option D or E eliminates $8,640-11,520/year recurring cost

---

## Success Metrics

**For Genesis Cohort (60-80 students, Apr 1-Jun 1):**
- [ ] 80%+ of students book at least 1 session via calendar
- [ ] <5% booking errors or failed notifications
- [ ] Student-Teachers report easy availability management
- [ ] Average <2 minutes from "Schedule Session" click to confirmed booking
- [ ] Zero manual intervention required for bookings

---

## Related Documents

- `features/must-have/calendar-scheduling-system.md` - Full feature spec
- `mvp-decisions/2025-11-25-video-conferencing-integration.md` - BBB integration (dependent feature)
- `docs/SCOPE-CHANGE-2025-11-25.md` - Context on Genesis cohort scale

---

## Decision Log

- **2025-11-26:** Classified as MUST HAVE, narrowed to Options B/D/E for Fraser evaluation
- **Pending:** Fraser's technical recommendation








