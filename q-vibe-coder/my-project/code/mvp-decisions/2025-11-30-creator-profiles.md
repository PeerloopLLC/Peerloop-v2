# MVP Decision: Creator Profiles

**Decision Date:** November 30, 2025  
**Decision Maker:** Brian (CEO/Founder)  
**Decision:** MUST HAVE (Basic Profile Only)  
**Framework Used:** Q-DECIDE  

---

## Executive Summary

**APPROVED:** Basic Creator Profile is MUST HAVE for PeerLoop MVP.

**Rationale:** Creators need profiles for platform consistency (students/S-T's have profiles, so creators must too). Minimal additional cost since we're already building unified profile system. Provides basic creator presence for students to follow and discover courses, plus links creator accounts to payment tracking system.

**Scope:** Basic public profile using same system as Student/Student-Teacher profiles, with "Creator" role badge. Advanced creator features (revenue dashboard, course management portal, analytics) deferred to Phase 2.

**Budget Allocation:** ~$500 incremental (1 day, already included in profile system budget)  
**Timeline Allocation:** 1 day (part of 3-4 week profile system build)

---

## Feature Description

**Basic Creator Profile (MVP Scope):**

### Uses Unified Profile System:
- Same infrastructure as Student and Student-Teacher profiles
- Role-based display logic
- Creator badge differentiates from other roles

### Core Profile Features:
- Name, @handle, profile photo
- Bio (expandable, same as S-T profiles)
- Interests/tags (3-5 tags)
- Public profile (no privacy toggle - creators must be discoverable)

### Creator-Specific Display:
- **Role Badge:** "🎓 Creator" (visually distinct)
- **Courses Display:** "Courses Created" (vs "Courses Teaching" for S-T's)
- **Aggregate Stats:**
  - Total students (across all courses)
  - Average rating (aggregate from all courses)
  - Number of courses created
- **Course List:** Links to all courses created by this creator

### Social Features:
- Students can follow creators
- Creators can follow students/S-T's/other creators
- Display follower/following counts
- View follower/following lists

### Payment System Integration:
- Creator profile links to creator account (backend)
- Enables payment tracking and revenue split attribution
- Creator ID used in payment records

---

## User Flow

### Creator Profile Creation:
1. Brian invites Gabriel as creator
2. Gabriel signs up, selects "Creator" role
3. Profile auto-created with basic info
4. Gabriel adds:
   - Profile photo
   - Bio (expertise, background)
   - Interests/topics
5. Profile publicly visible at `peerloop.com/@gabriel`

### Student Discovery:
1. Student browses courses
2. Sees "Node.js Backend Development by Gabriel Rymberg"
3. Clicks Gabriel's name → Views creator profile
4. Sees:
   - Gabriel's bio and credentials
   - Other courses Gabriel created
   - Aggregate rating and student count
5. Student clicks "Follow" button
6. Student can browse Gabriel's other courses
7. Student enrolls in course

### Payment Flow Integration:
1. Student pays $500 for Gabriel's course
2. System records:
   - Enrollment tied to Gabriel's creator_id
   - Revenue split: $75 to Gabriel (15%)
3. Brian's admin dashboard shows:
   - Gabriel has earned $75 from this enrollment
   - Total owed to Gabriel: $X (aggregate)
4. Brian processes payout (semi-automated - see Payment System decision)

---

## Hypothesis Validation

### Primary Validation:

**No Direct Hypothesis Validation**
- Creator profiles don't directly test any of the 6 core hypotheses
- Students pay for course value, not creator portfolio
- Flywheel is about S-T recruitment, not creators

### Secondary Benefits:

**Hypothesis #1 (Market Positioning) - INDIRECT**
- Professional creator presence signals premium platform
- Creator credentials build trust → students willing to pay higher prices
- **Rating: Weak / Indirect**

**Hypothesis #3 (Customer Segmentation) - INDIRECT**
- Professional creator profiles may attract "Premium Learner-Only" segment
- Helps differentiate PeerLoop from low-cost MOOC platforms
- **Rating: Weak / Indirect**

### Summary:
Creator profiles provide **minimal hypothesis validation** but are necessary for platform consistency and payment tracking.

---

## Critical for Genesis Cohort?

### For Platform Consistency:
- ✅ **YES** - If students/S-T's have profiles with follow functionality, creators must too
- ✅ Students expect to see "who created this course"
- ✅ Provides discoverable creator presence

### For Payment Tracking:
- ✅ **YES** - Creator profiles link to creator accounts in payment system
- ✅ Enables revenue attribution and payout tracking
- ✅ Semi-automated payment system requires creator account records

### For Enrollment/Payment:
- ❌ NOT required for students to enroll
- ❌ NOT blocking for payment processing
- ⚠️ BUT expected in modern course platforms

### For Professional Appearance:
- ✅ **YES** - Modern platforms (Udemy, Coursera) have creator profiles
- ✅ Missing this signals "incomplete platform"
- ✅ Creator credentials build trust

### Assessment:
🟢 **MODERATE-HIGH CRITICAL** - Necessary for platform consistency, expected by users, links to payment system.

---

## Manual Alternative Assessment

### What Brian COULD do manually:
- ✅ Display creator info on course page (no dedicated profile)
- ✅ Track creator payment info in spreadsheet

### What Brian CANNOT do manually:
- ❌ Social follow functionality (students can't follow creators without profiles)
- ❌ Platform consistency (students/S-T's have profiles, creators should too)
- ❌ Scalable payment attribution (needs creator_id in database)

### Would manual approach compromise validation?
🟡 **MINOR COMPROMISE** - Doesn't affect hypothesis testing, but reduces platform professionalism and social functionality.

### Assessment:
🟡 **WEAK MANUAL WORKAROUNDS** - Technically possible but creates inconsistent user experience and complicates payment tracking.

---

## Budget & Timeline Assessment

### Estimated Development Cost:

**Incremental Cost for Creator Role:**
- Add "Creator" role to profile system → ~0.5 days
- Change display logic ("Courses Created" label) → ~0.25 days
- Aggregate stats across courses → ~0.25 days
- Creator badge design/display → ~0.25 days

**Total Incremental Estimate:** ~1.5 days = **~$500**

**Note:** Full profile system cost ($14K-$18.7K) already covers Student + Student-Teacher + Creator profiles as one unified system.

### Budget Impact:
- ✅ **Minimal incremental cost** (~$500 out of $75K budget)
- ✅ Already building profile system, just adding Creator role
- ✅ No separate build required

### Timeline Impact:
- ✅ **1 day added to profile system build**
- ✅ Fits within existing 3-4 week profile system timeline
- ✅ No separate timeline impact

**Assessment:** 🟢 Negligible cost/timeline impact

---

## MVP Scope Definition

### ✅ IN SCOPE for MVP:

**Basic Profile (Same as Student/S-T):**
- Name, @handle, profile photo
- Bio (160 char preview, expandable)
- Interests/tags (3-5 max)
- Public profile (no privacy toggle)

**Creator-Specific Display:**
- "Creator" role badge
- "Courses Created" label (not "Courses Teaching")
- Aggregate statistics:
  - Total students (across all courses)
  - Average rating (aggregate)
  - Number of courses created
- List of courses created (clickable links)

**Social Features:**
- Follow/unfollow functionality
- Display follower/following counts
- View follower/following lists

**Payment Integration:**
- Creator account links to payment records
- Creator ID used for revenue attribution
- Backend only (no public payment info)

---

### ⏸️ DEFER to Phase 2:

**Advanced Creator Dashboard:**
- ❌ Revenue tracking interface (Brian reports manually)
- ❌ Per-course analytics (students, revenue, ratings)
- ❌ Payout history view (Brian tracks in admin dashboard)
- ❌ Student demographics breakdown
- ❌ Course performance metrics
- ❌ Engagement analytics

**Course Management Portal:**
- ❌ Course creation wizard (Brian helps creators set up)
- ❌ Content upload interface (simple admin form or Brian uploads)
- ❌ Curriculum builder (Google Docs/Notion for MVP)
- ❌ Student progress tracking per course (Brian tracks)
- ❌ Assignment/assessment grading system

**Advanced Portfolio Features:**
- ❌ Featured courses highlight
- ❌ Creator achievements/badges
- ❌ Student testimonials section
- ❌ "Creator of the Month" showcase
- ❌ Cross-promotion tools

**Creator-to-Creator Features:**
- ❌ Messaging between creators
- ❌ Collaboration tools
- ❌ Revenue comparison dashboard
- ❌ Best practices forum

**Automated Systems:**
- ❌ Automated payout system (Stripe Connect)
- ❌ Automated revenue reporting
- ❌ Automated tax reporting

---

## Implementation Notes

### Unified Profile System:

**Single Profile Table with Role Field:**
```
users table:
- id
- name
- email
- handle
- role (enum: student, student_teacher, creator)
- profile_photo_url
- bio
- join_date
- ... (other shared fields)
```

**Display Logic Based on Role:**
- If role = "student" → Show "Courses Learning"
- If role = "student_teacher" → Show "Courses Teaching" + S-T badge
- If role = "creator" → Show "Courses Created" + Creator badge

**Aggregate Stats for Creators:**
- Query all courses where creator_id = this user
- Sum total students across courses
- Calculate average rating across courses
- Count number of courses

### Payment System Integration:

**Creator Account Info (Backend):**
- Creator profile links to payment_accounts table
- Stores: PayPal email, bank info (for semi-automated payouts)
- Used by admin dashboard for payout processing

**Revenue Attribution:**
```
enrollments table:
- id
- student_id
- course_id
- creator_id (links to creator profile)
- amount_paid
- payment_date
```

**Semi-Automated Payouts (See Payment System Decision):**
- Admin dashboard shows: "Gabriel owed $225"
- Brian clicks "Process Payout" button
- System sends payment via Stripe/PayPal API
- Marks payout as complete

---

## Questions for Fraser (Technical Validation)

### 1. **Unified Profile Architecture:**
- [ ] Confirm single profile table with role field is best approach
- [ ] Or separate tables per role? (student_profiles, creator_profiles)
- [ ] How to handle role transitions? (Student → S-T, S-T → Creator)

### 2. **Aggregate Stats Performance:**
- [ ] Querying total students across multiple courses - performance concerns?
- [ ] Pre-compute stats (cron job) or calculate on page load?
- [ ] Caching strategy for creator profiles?

### 3. **Timeline Validation:**
- [ ] Is 1 day realistic for adding Creator role to profile system?
- [ ] Any additional complexity vs S-T profiles?

### 4. **Payment Integration:**
- [ ] Creator profile → payment account linkage straightforward?
- [ ] Does this affect payment system architecture? (see Payment System decision)

---

## Risks & Mitigations

### Risk 1: Creators Expect Advanced Features
**Risk:** Gabriel/Guy might expect revenue dashboards, analytics, course management tools  
**Impact:** 🟡 MEDIUM - Could affect creator satisfaction  
**Mitigation:**
- ✅ Set expectations early: "MVP focuses on student experience"
- ✅ Brian provides excellent manual support (monthly reports, personal check-ins)
- ✅ Promise Phase 2 creator tools after Genesis validation
- ✅ Gabriel is advisor, understands MVP trade-offs

### Risk 2: Confusing Role Distinctions
**Risk:** Students confused: "Is Gabriel a Creator or Student-Teacher?"  
**Impact:** 🟡 MEDIUM - Could reduce clarity  
**Mitigation:**
- ✅ Clear "Creator" badge (visually distinct from S-T badge)
- ✅ Profile labels: "Courses Created" (not "Courses Teaching")
- ✅ Course page clearly shows "Created by Gabriel" vs "Taught by Sarah (S-T)"

### Risk 3: Low Creator Profile Engagement
**Risk:** Only 4-5 creators, profiles may seem empty/underused  
**Impact:** 🟢 LOW - Students care about courses, not creator popularity  
**Mitigation:**
- ✅ Focus on course quality, not creator social metrics
- ✅ Creator profiles secondary to course pages
- ✅ Genesis cohort understands early-stage platform

---

## Payment System Connection

### Semi-Automated Payments (Brian's Decision):

**What This Means for Creator Profiles:**
- Creator profiles MUST link to payment accounts (backend)
- Creator ID used for revenue attribution
- Admin dashboard shows payouts owed per creator
- Brian clicks button to process payouts (1 click per creator)

**Integration Points:**
1. **Creator Profile → Payment Account:** Backend link to payment_accounts table
2. **Enrollment → Creator Attribution:** Every enrollment records creator_id
3. **Revenue Split → Creator Payout:** System calculates 15% to creator automatically
4. **Admin Dashboard → Payout Button:** Brian processes monthly payouts (semi-automated)

**See:** `mvp-decisions/2025-11-30-payment-escrow-system.md` (to be created)

---

## Success Metrics (Post-Launch)

### Creator Profile Completion (Genesis Cohort):
- **Target:** 100% of 4-5 creators complete profiles (photo, bio, courses listed)

### Student Engagement:
- **Target:** 40%+ of students follow at least one creator
- **Track:** Creator follower counts
- **Track:** Creator profile views

### Payment Attribution:
- **Target:** 100% of enrollments correctly attributed to creators
- **Track:** Revenue split calculations accurate
- **Track:** Payout processing time (Brian's manual effort)

### Hypothesis Validation:
- **H1, H3:** Monitor if professional creator presence affects enrollment rates (indirect)
- **Not Primary Validation:** Creator profiles support business, don't test core model

---

## Integration with Other Features

### Student Profile System:
- Same infrastructure, shared codebase
- Creator profiles use Student/S-T profile components

### Payment System:
- Creator profile links to payment account
- Creator ID used for revenue attribution and payouts

### Course Pages:
- Course page displays creator info (pulled from profile)
- "Created by [Creator Name]" links to creator profile
- "Other courses by this creator" query based on creator_id

### Community Feed:
- Creator posts appear in feed (same as S-T's)
- Creator badge displayed in feed posts
- Click creator name → navigate to profile

### Calendar/Scheduling:
- Not applicable (creators don't teach individual sessions)
- Student-Teachers teach, not creators

---

## Open Questions

1. **Course Management:**
   - How do creators upload course content? (Separate decision needed)
   - Admin panel, Google Docs, or Brian uploads?

2. **Creator Onboarding:**
   - How does Brian invite creators to platform?
   - Special signup link with "Creator" role pre-selected?

3. **Multiple Creators Per Course:**
   - Can courses have co-creators?
   - Or always 1 creator per course?

4. **Creator Revenue Reports:**
   - Brian emails monthly reports to creators?
   - What format? (PDF, spreadsheet, email summary?)

---

## Next Steps

### Immediate (This Week):
1. ✅ Document decision (this file)
2. ✅ Update Student Profile spec to include Creator role
3. ⏭️ Fraser reviews Creator profile additions (1 day estimate)
4. ⏭️ Q-DECIDE: Payment & Escrow System (semi-automated payments)

### Before Development:
5. ⏭️ Design Creator badge (visual distinction from S-T badge)
6. ⏭️ Define creator onboarding flow (how Brian invites creators)
7. ⏭️ Specify admin dashboard payout interface (Brian's view)

### During Development:
8. ⏭️ Build unified profile system (Students + S-T's + Creators)
9. ⏭️ Test creator-specific display logic
10. ⏭️ Integrate with payment system

---

## Decision Rationale Summary

### Why MUST HAVE (Basic):

1. ✅ **Platform consistency** - Students/S-T's have profiles, creators must too
2. ✅ **Minimal cost** - $500 incremental, already building profile system
3. ✅ **Payment integration** - Links creator accounts to revenue tracking
4. ✅ **Professional appearance** - Expected in modern course platforms
5. ✅ **Social functionality** - Students can follow creators, discover courses

### Why NOT Advanced Features:

- ❌ Don't validate core hypotheses
- ❌ Expensive ($10K-$20K for dashboard, analytics, course management)
- ❌ Excellent manual alternatives for 4-5 creators
- ❌ Can add in Phase 2 when scaling to 50+ creators
- ❌ Budget better spent on hypothesis-validating features

### Trade-offs Accepted:

- ⚠️ Creators don't get revenue dashboard (Brian emails monthly reports)
- ⚠️ Creators don't get course management portal (Brian helps upload content)
- ⚠️ Creators don't get advanced analytics (too early, not enough data)
- ⚠️ Manual support required from Brian (acceptable for 4-5 creators)

**Decision stands: Basic creator profiles necessary for consistency and payment tracking, advanced features deferred to Phase 2.**

---

**Status:** ✅ APPROVED (Basic Profile Only)  
**Approved By:** Brian (CEO/Founder)  
**Date:** November 30, 2025  
**Next Review:** After Fraser technical validation + Payment System decision

---

**Related Documents:**
- Student Profile Decision: `mvp-decisions/2025-11-30-student-profile-system.md`
- Feature Spec: `features/must-have/student-profile-system.md` (to be updated)
- Payment System: `mvp-decisions/2025-11-30-payment-escrow-system.md` (to be created)
- Context: `docs/brian-mvp-context.md`
- Framework: `docs/DECISION-FRAMEWORK.md`

