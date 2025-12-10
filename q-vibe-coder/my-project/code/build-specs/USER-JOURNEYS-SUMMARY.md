# PeerLoop User Journeys & Summary

**Version:** 1.0  
**Date:** 2025-12-07  
**Purpose:** Quick reference for user journeys and story summary

---

# Part 1: User Journey Narratives

---

## 🎓 STUDENT (Sarah)

Sarah finds PeerLoop, browses courses without logging in, and enrolls in "AI Prompting Mastery" for $450. After payment, she schedules her first session with Marcus (a Student-Teacher), receives a confirmation email with video link, and starts learning. Over 5 weeks, she watches course videos, attends weekly 1-on-1 BBB sessions with Marcus, messages him with questions, engages in the community feed, and marks her progress. When she completes all modules, Marcus recommends her for certification, Guy (the Creator) approves, and Sarah receives her certificate. She then applies to become a Student-Teacher herself—Guy approves, and now Sarah can teach others and earn 70% per student.

---

## 👨‍🏫 STUDENT-TEACHER (Marcus)

Marcus completed Guy's course three months ago and now teaches others. He sets his weekly availability in his dashboard, and when students like Sarah book with him, he receives email notifications with BBB links. He conducts 1-on-1 video sessions, guides students through the material, answers their messages between sessions, and tracks each student's progress in his dashboard. When a student completes the course, Marcus clicks "Recommend for Certification" and Guy makes the final approval. After approval, Marcus receives 70% ($315) of each student's payment via Stripe. His profile shows his teaching badge and student count, building his reputation.

---

## 🎨 CREATOR (Guy)

Guy created "AI Prompting Mastery" and worked with Brian to set it up on PeerLoop. He doesn't teach every student—his Student-Teachers (Marcus, Jessica) do that. Guy monitors his Creator Dashboard daily: enrollments, student progress, session activity, and revenue. When Student-Teachers recommend students for certification, Guy reviews and approves. When courses complete, Guy approves payouts and the 70/15/15 split processes automatically via Stripe. When students apply to become Student-Teachers, Guy vets and approves them. He posts announcements to the community feed and manages his teaching team. He earns 15% of every enrollment while his Student-Teachers handle the teaching.

---

## 🔧 ADMIN (Brian)

Brian runs PeerLoop but doesn't manage individual courses—Creators do that. He onboards new Creators by evaluating their courses, collecting their content, and setting them up in the system. He monitors platform health through admin access to all Creator dashboards and the Stripe dashboard. He handles platform-level exceptions: refunds, disputes Creators can't resolve, and technical issues. He messages Creators and students for support and announcements. His weekly time is 3-4 hours—strategic oversight, not daily operations. Each Creator manages their own certifications, payouts, and Student-Teacher approvals.

---

## 👀 VISITOR (Before Login)

A visitor lands on PeerLoop's homepage and sees the "Learn, Teach, Earn" value proposition. They browse available courses, view pricing, read course descriptions and curriculum outlines—all without logging in. They click into Creator profiles to see credentials and Student-Teacher profiles to see who might teach them. When they try to enroll or access community features, they're prompted to sign up. They create an account with email/password, and become a Student.

---

## 🛡️ COMMUNITY MODERATOR

A Community Moderator is appointed by a Creator to help manage their course community. They monitor the community feed, answer student questions, delete inappropriate posts, ban repeat offenders, pin important announcements, and manage a queue of flagged content. They're the front-line support for day-to-day community issues, freeing the Creator to focus on content and approvals.

---

## 🏢 EMPLOYER/FUNDER

An employer wants to sponsor employee learning. They pay for a student's enrollment, receive progress updates as the student advances, and get a copy of the certification upon completion. They can message their sponsored students and contact Brian for support. This enables corporate training budgets to flow through PeerLoop.

---

# Part 2: One-Page Story Summary

**Total: 258 stories | P0 (MVP Critical): 135 | Building full platform per Fraser's spec**

---

## VISITOR (Pre-Login) — 15 stories
- View homepage, value proposition, pricing
- Browse courses and creator profiles
- Signup, login, password reset

## STUDENT — 56 stories

| P0 Block 1 | P0 Block 2 | P1+ |
|------------|------------|-----|
| Pay & enroll | Apply to become S-T | Related courses |
| View course content | Earn certificates | Referrals |
| Mark progress | Profile privacy | Goodwill points |
| Book sessions | Follow creators | Power user tiers |
| Join BBB video | Community feed posts | |
| See dashboard | Like/reply to posts | |
| Message teachers | Earnings tracking | |
| Search courses | | |

## STUDENT-TEACHER — 23 stories

| P0 Block 1 | P0 Block 2 | P1+ |
|------------|------------|-----|
| Set availability | Earnings dashboard | Session recordings |
| View students | Recommend for cert | AI assistance |
| Join BBB sessions | Post to feed | Opt-out of student |
| Message students | Public profile | Mastery credentials |
| Receive 70% payout | Teaching badge | |

## CREATOR — 36 stories

| P0 Block 1 | P0 Block 2 | P1+ |
|------------|------------|-----|
| View enrolled students | Course editor | AMA sessions |
| View S-T list | Upload content | Newsletters |
| View sessions | Community hubs | Revenue sharing |
| Approve certifications | Post announcements | Extended analytics |
| Approve payouts | Message students | |
| Approve S-T apps | Pin posts | |

## ADMIN (Brian) — 29 stories

| P0 Block 1 | P0 Block 2 | P1+ |
|------------|------------|-----|
| Onboard creators | Admin dashboard | User analytics |
| Process refunds | Payout reports | Acquisition tracking |
| Monitor Stripe | Cancel users | Chargeback teachers |
| Message users | Session monitoring | |

## SYSTEM/PLATFORM — 84 stories

| P0 Block 1 | P0 Block 2 | P1+ |
|------------|------------|-----|
| Auth (signup/login/reset) | Session recording | Social login |
| Stripe payments | AI transcripts | Calendar sync |
| BBB video integration | Image optimization | Tax docs (1099) |
| Email notifications | File storage/CDN | Gamification |
| Calendar booking | Timezone handling | |
| Progress tracking | Follow system | |
| Messaging system | Social graph | |
| Community feed | | |

## COMMUNITY MODERATOR — 9 stories

| P0 | P1+ |
|----|-----|
| Delete inappropriate posts | Answer questions |
| See flagged content queue | Pin posts |
| | Ban users |

## EMPLOYER/FUNDER — 6 stories (All P1)
- Pay for employee learning
- Receive progress/completion reports
- Receive certifications

---

# Part 3: Timeline & Decisions

## Timeline (Full 135 P0 Scope)

| Phase | Weeks | What's Done |
|-------|-------|-------------|
| **Block 1** | 4-5 | Core flow + basic messaging |
| **Block 2** | 4-5 | Community feed + profiles |
| **Block 3** | 4-6 | Full features + polish |
| **Buffer** | 2 | Testing |
| **TOTAL** | **14-18** | **Launch: April-May 2026** |

---

## Key Decisions (Brian - Dec 7, 2025)

### Retained from Earlier Sessions:
- ✅ Creator approves certs/payouts/S-T apps (not Brian)
- ✅ S-T recommends → Creator approves certification workflow
- ✅ Stripe automated payouts (after Creator approval)
- ✅ No ratings in Block 1 (add later)
- ✅ Brian's time: 3-4 hrs/week (strategic only)

### Updated Dec 7:
- ✅ **Build messaging system** (full in-platform messaging)
- ✅ **Build community feed** (posts, likes, replies, follows)
- ✅ **Build follow system** (social graph)
- ✅ **Build file uploads** (profiles, course materials)

---

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

**Document Status:** APPROVED  
**Created:** 2025-12-07  
**Author:** Brian + Claude (Q-Command System)

---

*End of Document*








