# Feature Spec: Calendar/Scheduling System

**Status:** MUST HAVE  
**Timeline:** 1.5-2 weeks (pending Fraser's option selection)  
**Budget:** $1,700-3,800 one-time + $0-960/month recurring  
**Owner:** Fraser (Developer)  
**Decision Doc:** `mvp-decisions/2025-11-26-calendar-scheduling-system.md`

---

## Overview

Automated booking system enabling students to schedule 1-on-1 sessions with Student-Teachers without manual intervention. Critical marketplace infrastructure for 60 sessions/week capacity.

---

## Phase 1 Scope (MUST HAVE - Genesis Cohort)

### Core Functionality

#### 1. Availability Management
- Student-Teachers set recurring weekly schedule
- Block out specific dates (holidays, conflicts)
- Set session duration (30min, 45min, 60min options)
- Minimum advance booking notice (e.g., 4 hours)
- Maximum advance booking window (e.g., 2 weeks)

#### 2. Student Booking Flow
```
Course Page → "Schedule Session" button → Calendar View
                                              ↓
                                    Select Day (date picker)
                                              ↓
                    View Available Slots (list of Student-Teachers + times)
                                              ↓
                              Click Slot → Confirm Booking
                                              ↓
                    Confirmation Screen (email + message sent)
```

#### 3. Notifications
**When booking confirmed:**
- Email to Student (confirmation + BBB link)
- Email to Student-Teacher (confirmation + BBB link)
- In-app message to both

**Reminders:**
- 24h before session: Email to both parties
- 1h before session: Email + in-app notification

#### 4. Session Management
- View upcoming sessions in dashboard
- Cancel session (with notification to other party)
- Reschedule (cancel + rebook flow)

---

## Implementation Options (For Fraser)

### Option B: Cal.com (Open Source)
**Timeline:** 1-1.5 weeks  
**Cost:** $1,700-2,850 dev + $720-960/month

### Option D: Booking Library (react-big-calendar + custom)
**Timeline:** 1.5-2 weeks  
**Cost:** $2,550-3,800 one-time, $0/month

### Option E: Google Calendar API + Custom UI
**Timeline:** 2 weeks  
**Cost:** $3,400 one-time, $0/month

---

## Questions for Fraser

1. **Which option (B, D, or E) do you recommend?**
2. **Timeline:** Are the estimates realistic?
3. **Integration:** Email + in-app messaging + BBB link generation feasible?
4. **Scalability:** Any concerns at 60 sessions/week?

---

## Success Metrics

- 80%+ students book at least 1 session
- <5% booking errors
- <2 minute average booking time

---

## Related Documents

- `mvp-decisions/2025-11-26-calendar-scheduling-system.md` - Decision rationale
- `features/must-have/video-conferencing-integration.md` - BBB/Jitsi integration








