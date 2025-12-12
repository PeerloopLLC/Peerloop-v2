# Goodwill Points System Specification

**Version:** 1.0  
**Date:** December 12, 2025  
**Status:** DRAFT  
**Author:** Brian LeBlanc

---

## Overview

Goodwill Points are a community currency that rewards users for helping others. They replace traditional 5-star reviews with a more meaningful metric that shows a user's contribution to the community.

---

## Core Concept

| Term | Description |
|------|-------------|
| **Total Earned** | Lifetime points earned (public, shows credibility) |
| **Balance** | Points available to award others (private) |
| **Spent** | Points given to helpers (private) |

**Formula:** `Balance = Total Earned - Spent`

---

## How Points Are Earned

| Action | Points | Awarded By | Limits |
|--------|--------|------------|--------|
| Answer a help request (Summon) | 10-25 | System (auto) | Must be certified in that course |
| Answer question in course chat | 5 | Requester | Max 3 awards per day to same person |
| Help S-T through first teaching session | 50 | System (auto) | One-time per new S-T |
| Refer new student who enrolls | 100 | PeerLoop | One-time per referral |
| Volunteer for remedial session | 30 | Student | Max 2 per week from same student |
| Turn on "Available to Help" status | 5/day | System (auto) | Only while actively available |

---

## Anti-Gaming Safeguards

| Rule | Why |
|------|-----|
| Must be certified in course to earn points for that course | Ties to paying courses |
| Daily cap on points given TO any single user | Prevents friend-farming |
| Daily cap on points given BY any single user | Prevents point inflation |
| Minimum time in help session (5 min) before points awarded | Prevents quick clicks |
| Cooldown between awarding same person | 24-48 hours |

---

## The "Summon" Help Button

```
┌─────────────────────────────────────────────────────────────┐
│  📚 AI Prompting Mastery - Module 3                         │
│                                                             │
│  [Video Player]                                             │
│                                                             │
│  Stuck? Get help from a certified peer:                     │
│  [🆘 Summon Help]                                           │
│                                                             │
│  Available helpers: 3 online                                │
└─────────────────────────────────────────────────────────────┘
```

**Who can use it:** Only enrolled students  
**Who responds:** Certified S-Ts who have "Available to Help" turned on  

**What happens:**
1. Student clicks Summon
2. Available helpers get notification
3. First responder joins chat/video
4. After 5+ min session, student awards points (10-25 slider)
5. Points added to helper's Total Earned

---

## Course Chat Room with Help Queue

```
┌─────────────────────────────────────────────────────────────┐
│  💬 AI Prompting Mastery - Community Chat                   │
│                                                             │
│  [Chat messages...]                                         │
│                                                             │
│  Sarah: Can someone explain chain prompting?                │
│         [❓ Mark as Question]                               │
│                                                             │
│  Marcus: Sure! Chain prompting is when you...               │
│          [✅ This Helped] ← awards 5 points                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## User Profile Display

### Public View (visible to all)

```
┌─────────────────────────────────────────────────────────────┐
│  👤 Marcus Chen                                             │
│  Student-Teacher | AI Prompting Mastery                     │
│                                                             │
│  🏆 Goodwill Points: 847 earned                             │
│  ├── 12 students helped via Summon                          │
│  ├── 45 questions answered                                  │
│  └── 2 referrals                                            │
│                                                             │
│  [View Full Activity]                                       │
└─────────────────────────────────────────────────────────────┘
```

### Private View (only the user sees)

```
┌─────────────────────────────────────────────────────────────┐
│  💰 My Goodwill Balance                                     │
│                                                             │
│  Total Earned: 847                                          │
│  Spent (given to helpers): 120                              │
│  Available to Award: 727                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Future Monetization (Phase 2+)

| Points Threshold | Reward |
|------------------|--------|
| 500 points | Badge: "Community Helper" |
| 1,000 points | 10% discount on next course |
| 2,500 points | Free 1-on-1 session with any Creator |
| 5,000 points | Revenue share bonus (extra 5% on teaching) |

---

## Database Schema

### User Object Addition

```javascript
// Add to user object
goodwillPoints: {
  totalEarned: 847,        // Public - lifetime total
  balance: 727,            // Private - available to give
  spent: 120,              // Private - given to others
  lastAwardedTo: {         // Anti-gaming tracking
    userId: "user_123",
    timestamp: "2025-12-12T10:00:00Z"
  }
}
```

### New Collection: goodwillTransactions

```javascript
{
  id: "txn_001",
  fromUserId: "sarah_123",     // Who gave points
  toUserId: "marcus_456",      // Who received
  points: 15,
  reason: "summon_help",       // or "question_answer", "referral"
  courseId: 15,                // Tied to course
  timestamp: "2025-12-12T10:30:00Z"
}
```

### Transaction Reasons (enum)

| Reason | Description |
|--------|-------------|
| `summon_help` | Responded to a Summon request |
| `question_answer` | Answered a question in chat |
| `first_session_mentor` | Helped new S-T through first session |
| `referral` | Referred a student who enrolled |
| `remedial_volunteer` | Volunteered for remedial session |
| `availability_bonus` | Daily bonus for being available |

---

## Block Roadmap

| Block | Goodwill Feature |
|-------|------------------|
| Block 1 | ❌ Not included (MVP) |
| Block 2 | ✅ Basic points + Summon button |
| Block 3 | ✅ Chat room questions + rewards |
| Block 4 | ✅ Referral tracking + monetization |

---

## Original Notes (Brian's Vision)

> Goodwill points earned and awarded for volunteering. We need to add Goodwill points when someone helps someone else in our community. These points have to be limited when being awarded otherwise people could give 1 million points or game the system. And we can make the points worth something with tangible value sort of like reward points for airlines.
>
> This system can take the place of a 5 star review. How many points has a user earned. We can call them Goodwill points. These points can be figuratively spent, awarding points to other people who help – with limitations. The total points earned would indicate how active the user has been in the community.
>
> Privately, he may have spent all of the points he earned by asking other people for help that will not be displayed publicly, only the total points. He can look at the balance of Goodwill points. So other helpers would be incentivized to earn goodwill points if they're helping someone through a problem without a fee, and the motivation is to build up total earned Goodwill points to demonstrate his usefulness in building the community. As the value increases, his trustworthiness and credibility increases.
>
> Maybe we tie a "summon" help button to a student enrolled in a course. He summons someone else who has taken that course. This ties the goodwill points to a paying course. Otherwise people might abuse the summon button and game the system earning points between friends constantly insincerely asking each other for help.
>
> Another idea is to ask established student teachers to introduce a new potential student to the platform and earn goodwill credits. Some credits will be awarded by PeerLoop and others will be awarded by individuals within our system of restraints. The restraints prevent abuse.

---

*Document created: December 12, 2025*


