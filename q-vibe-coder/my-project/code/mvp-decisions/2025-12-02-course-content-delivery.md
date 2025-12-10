# Decision: Course Content Delivery

**Date:** 2025-12-02  
**Decider:** Brian  
**Status:** ✅ MUST HAVE  
**Option Selected:** Option A (Minimal)

---

## Feature Description

System for students to access course materials (videos + documents) at their own pace, with creator-defined milestones tracking progress toward certification.

**What's Included:**
- Simple course page with organized module structure
- Video links (YouTube/Vimeo unlisted)
- Document links (Google Drive / Notion)
- Student self-marks progress (checkboxes)
- Creator monitors completion

**What's NOT Included (Phase 2):**
- Video hosting (use external links)
- Quiz/assessment engine (peer validates mastery)
- Auto-grading
- Drip content / time-locked modules
- SCORM/xAPI
- Advanced analytics

---

## Hypothesis Validation

| Hypothesis | Impact | Explanation |
|------------|--------|-------------|
| H1: Market Positioning | ⚠️ Indirect | Professional content = perceived value |
| **H2: Completion Rates** | ✅ **PRIMARY** | This IS how students complete the course |
| H3: Customer Segmentation | ❌ No | |
| H4: Conversion to Teaching | ✅ Yes | Path to certification = become Student-Teacher |
| H5: Peer Teaching Quality | ⚠️ Indirect | Content consistency across Student-Teachers |
| H6: Flywheel | ❌ No | |

**Validation Score:** HIGH - Directly validates H2 (75% completion promise) and H4 (conversion to teaching)

---

## Budget & Timeline

**Development Cost:** $2,000-4,000  
**Timeline:** ~1 week  
**Monthly Recurring:** $0 (external hosting)

**Running Total (8 MUST HAVE features):**
| Feature | Cost |
|---------|------|
| Video Conferencing (BBB) | $2.4K-3.6K/yr |
| Community Feed (getstream.io) | $3.4K-5.7K/yr |
| Calendar/Scheduling | $1.7K-3.8K |
| Student Profile System | $14K-18.7K |
| Creator Profiles | $500 |
| Payment & Escrow | $11K-15K |
| **Course Content Delivery** | **$2K-4K** |
| **Total Allocated:** | **$46K-62K** |
| **Remaining:** | **$13K-29K** |

---

## Role Clarification (Important!)

This decision clarified the operational model:

### Creator (e.g., Guy) Controls Their Course:
| Action | Creator Does It |
|--------|-----------------|
| Creates course content | ✅ |
| Approves certifications | ✅ |
| Approves payouts | ✅ |
| Approves new Student-Teachers | ✅ |

### Brian (Platform Owner) - Strategic Only:
| Action | Brian Does It |
|--------|---------------|
| Recruits/onboards Creators | ✅ |
| Platform-level disputes | ✅ |
| Monitors overall health | ✅ |
| Day-to-day course ops | ❌ |

---

## Complete User Journey

### The Setup
- **Course:** "AI Prompting Mastery" by Guy (Creator)
- **Student:** Sarah, marketing professional
- **Price:** $450
- **Student-Teacher:** Marcus (certified to teach Guy's course)

---

### Phase 1: Enrollment & Scheduling (Self-Service)

#### Step 1: Sarah Finds Course
```
Sarah lands on PeerLoop → Views "AI Prompting Mastery" by Guy
```

**What Sarah sees:**
- Course details, price ($450), outcomes
- Creator Profile: Guy's credentials
- "Learn 1-on-1 with a certified peer teacher"
- [Enroll Now - $450] button

#### Step 2: Sarah Pays
1. Creates account (email, password)
2. Stripe Checkout → Pays $450 → Money held in escrow
3. ✅ Payment confirmed

#### Step 3: Sarah Schedules First Session (Immediately After Payment)

**What Sarah sees:**
```
┌─────────────────────────────────────────────────────────┐
│  ✅ You're enrolled! Now schedule your first session.   │
│                                                         │
│  Select a day:                                          │
│  [December Calendar - clickable dates highlighted]      │
│                                                         │
│  Tuesday, Dec 3rd selected...                          │
│                                                         │
│  Available Student-Teachers:                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 👤 Marcus Chen                                   │   │
│  │ ⭐ 4.9 rating | 12 students taught              │   │
│  │ Available: 10am, 2pm, 7pm                       │   │
│  │ [View Profile] [Book 7pm →]                     │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 👤 Jessica Torres                               │   │
│  │ ⭐ 4.8 rating | 8 students taught               │   │
│  │ Available: 11am, 3pm                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

Sarah clicks [Book 7pm →] with Marcus → Confirmed!

#### Step 4: Automatic Notifications (No Brian!)

**To Sarah:**
- ✉️ Email: "Your session with Marcus is confirmed - Dec 3, 7pm"
- 📱 In-app notification
- 🔗 BBB video link included
- 📅 Calendar invite (.ics) attached

**To Marcus:**
- ✉️ Email: "New session booked - Sarah, Dec 3, 7pm"
- 📱 In-app notification
- 🔗 Same BBB link

**Brian's involvement:** NONE ✅

---

### Phase 2: Learning (Student ↔ Student-Teacher)

#### Step 5: First Session
```
Dec 3, 7pm - Sarah joins BBB room
```

1. Sarah clicks link → Joins BBB video room
2. Marcus welcomes her, explains course structure
3. They cover Module 1 intro together
4. Marcus: "Watch videos 1-3 and read the PDF. Schedule our next session when ready."

#### Step 6: Sarah Accesses Content

**What Sarah sees (Option A - Simple Course Page):**
```
┌─────────────────────────────────────────────────────────┐
│  AI Prompting Mastery                                  │
│  by Guy | Your Teacher: Marcus                         │
│                                                         │
│  MODULE 1: Foundations                                 │
│  ├── 📹 Video 1: What is AI Prompting [Watch →]       │
│  ├── 📹 Video 2: Your First Prompt [Watch →]          │
│  ├── 📹 Video 3: Common Mistakes [Watch →]            │
│  ├── 📄 Reading: Prompt Framework Guide [Download →]  │
│  └── ☐ Mark Module 1 Complete                         │
│                                                         │
│  MODULE 2: Intermediate (upcoming)                     │
│  MODULE 3: Advanced (upcoming)                         │
│  MODULE 4: Specialization (upcoming)                   │
│  MODULE 5: Certification Prep (upcoming)               │
│                                                         │
│  [Schedule Next Session]                               │
└─────────────────────────────────────────────────────────┘
```

- Video links open YouTube in new tab
- PDF downloads from Google Drive
- Sarah checks "Mark Module 1 Complete" when done

#### Step 7: Sarah Schedules Next Session (Self-Service)
1. Sarah clicks "Schedule Next Session"
2. Sees Marcus's availability
3. Books Dec 6, 7pm
4. Auto-notifications sent
5. **Brian's involvement:** NONE ✅

#### Weekly Rhythm (Repeats for 4 weeks)
| Day | Activity |
|-----|----------|
| Mon | Sarah watches videos, reads materials |
| Tue | 1-on-1 session with Marcus via BBB |
| Wed-Thu | Practice, prepare questions |
| Fri | Community feed check-in |
| Weekend | Catch up if needed |

---

### Phase 3: Certification (Creator Approves)

#### Step 8: Sarah Completes All Modules
```
Week 4 - Sarah finishes Module 5
```

1. Sarah marks Module 5 complete
2. Sarah schedules "Certification Assessment" session
3. Marcus confirms mastery in BBB session
4. Marcus clicks: [Recommend for Certification]

#### Step 9: Guy (Creator) Approves Certification

**Guy sees in Creator Dashboard:**
```
┌─────────────────────────────────────────────────────────┐
│  🎓 CERTIFICATION REQUESTS - AI Prompting Mastery       │
│                                                         │
│  Sarah Johnson                                         │
│  Student-Teacher: Marcus Chen                          │
│  Recommended: Dec 28, 2025                             │
│  Modules completed: 5/5 ✅                              │
│                                                         │
│  [Approve Certification]  [Request More Info]          │
└─────────────────────────────────────────────────────────┘
```

Guy clicks [Approve Certification]:
- Certificate issued to Sarah
- Sarah notified via email

#### Step 10: Guy (Creator) Approves Payout

**Guy sees:**
```
┌─────────────────────────────────────────────────────────┐
│  💰 PENDING PAYOUTS - AI Prompting Mastery              │
│                                                         │
│  Sarah Johnson - Course Completed                      │
│  Total: $450                                           │
│  Split:                                                │
│    → Marcus (Student-Teacher): $315 (70%)              │
│    → You (Creator): $67.50 (15%)                       │
│    → PeerLoop: $67.50 (15%)                            │
│                                                         │
│  [Approve Payout]  [Flag for Review]                   │
└─────────────────────────────────────────────────────────┘
```

Guy clicks [Approve Payout]:
- $315 → Marcus
- $67.50 → Guy  
- $67.50 → PeerLoop

---

### Phase 4: Flywheel (Sarah Becomes Student-Teacher)

#### Step 11: Sarah Applies to Teach

**Sarah sees:**
- "Become a Student-Teacher" option in her dashboard
- Earnings potential: "Earn $315 (70%) for each student you teach"
- [Apply to Teach This Course]

Sarah clicks apply.

#### Step 12: Guy (Creator) Approves Student-Teacher

**Guy sees:**
```
┌─────────────────────────────────────────────────────────┐
│  👩‍🏫 STUDENT-TEACHER APPLICATIONS                      │
│                                                         │
│  Sarah Johnson                                         │
│  Completed: Dec 28, 2025                               │
│  Assessment Score: Passed                              │
│  Sessions Attended: 6                                  │
│                                                         │
│  [Approve as Student-Teacher]  [Decline]               │
└─────────────────────────────────────────────────────────┘
```

Guy clicks [Approve]:
- Sarah's profile updated to "Certified Student-Teacher"
- Sarah can now set availability
- Sarah appears in scheduling for new students

#### Step 13: The Flywheel Continues

New student Alex:
1. Enrolls in "AI Prompting Mastery" → Pays $450
2. Schedules with Sarah (now a Student-Teacher)
3. Learns from Sarah over 4 weeks
4. Completes → Guy certifies Alex
5. Guy approves payout → Sarah earns $315
6. Alex can become Student-Teacher
7. **Cycle repeats** 🔄

---

## Flow Summary

```
ENROLLMENT & SCHEDULING (Self-Service):
Student → Pays (Stripe) → Schedules (Calendar) → Auto-notifications → Done

LEARNING (Student ↔ Student-Teacher):
Student studies content → Attends BBB sessions → Marks progress → Repeats

CERTIFICATION (Creator Approves):
Student-Teacher recommends → CREATOR approves → Certificate issued

PAYOUT (Creator Approves):
CREATOR approves → System processes → 70/15/15 split paid

BECOME STUDENT-TEACHER (Creator Approves):
Student applies → CREATOR approves → Student can now teach → Flywheel continues
```

---

## Brian's Weekly Time (60-80 students across 4-5 creators)

| Task | Time |
|------|------|
| Course operations | 0 hrs (Creators handle) |
| Creator check-ins | 1-2 hrs |
| Exception handling | 1-2 hrs |
| Platform monitoring | 30 min |
| **Total** | **~3-4 hrs/week** |

---

## Success Metrics

**For Genesis Cohort:**
- [ ] Students can access all course content without issues
- [ ] 75%+ of students complete all modules
- [ ] Student-Teachers can guide students through content effectively
- [ ] Creators can monitor student progress
- [ ] Content delivery doesn't block certification pathway

---

## Decision Log

- **2025-12-02:** Classified as MUST HAVE, Option A (Minimal) selected
- **Key Insight:** Full user journey clarified Creator vs Platform roles
- **Creator Responsibilities:** Certification, Payouts, Student-Teacher approval
- **Brian's Role:** Strategic oversight only, ~3-4 hrs/week

---

**End of Decision Document**




























