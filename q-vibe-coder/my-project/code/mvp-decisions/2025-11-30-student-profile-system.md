# MVP Decision: Student Profile System

**Decision Date:** November 30, 2025  
**Decision Maker:** Brian (CEO/Founder)  
**Decision:** MUST HAVE for MVP  
**Framework Used:** Q-DECIDE  

---

## Executive Summary

**APPROVED:** Student Profile System is a MUST HAVE feature for PeerLoop MVP.

**Rationale:** Directly validates Hypotheses #4 (Conversion to Teaching) and #6 (Flywheel Validation) - Brian's top two uncertainties. Cannot adequately test these hypotheses without visible student profiles and social graph functionality. No viable manual alternative exists for measuring organic Student-Teacher recruitment and network effects.

**Budget Allocation:** ~$14K-$18.7K (~20% of Phase 1 budget)  
**Timeline Allocation:** ~3-4 weeks (~18-25% of build timeline)

---

## Feature Description

A public profile page system for students that enables:

### Core Profile Features:
- Name, @handle, profile photo
- Bio (160 characters visible by default, expandable to full length)
- Interests/topics (3-5 tags to help discovery)
- Privacy toggle (public/private profile)

### Social Features:
- Follow/unfollow other users (students, Student-Teachers)
- Follow/unfolallow courses
- Display follower/following counts
- View lists of followers/following

### Reputation Display (Read-Only in MVP):
- Average star rating
- Number of ratings received
- *(Brian manually grants ratings after course completion)*

### Student-Teacher Signaling:
- "Available as Student-Teacher" toggle
- "Teaching" badge display
- Basic availability indicator

---

## User Flow

### Profile Creation:
1. Student signs up for PeerLoop
2. During onboarding, prompted to add:
   - Profile photo (optional)
   - Bio (optional)
   - Interests (optional)
   - Privacy setting (default: TBD with Fraser)
3. Profile auto-created with name from signup
4. Student can edit anytime from dashboard

### Profile Discovery:
1. Student browses courses
2. Sees Student-Teachers teaching that course
3. Clicks Student-Teacher name → Views profile
4. Decides to follow Student-Teacher
5. Later enrolls in course taught by followed Student-Teacher

### Student-Teacher Conversion:
1. Student completes course
2. Earns Learning Certificate
3. Decides to become Student-Teacher
4. Toggles "Available as Student-Teacher" ON in profile
5. Profile now visible in Student-Teacher directory
6. Other students can discover and follow
7. Follower → Student conversion = organic recruitment

---

## Hypothesis Validation

### Primary Validation:

**Hypothesis #4: Conversion to Teaching**
- **Test:** % of students who toggle "Available as Student-Teacher" ON
- **Data Collected:** Student completion → S-T activation rate
- **Success Metric:** 10%+ of Genesis students activate S-T profiles
- **Validation Strength:** 🟢 STRONG - Direct measurement

**Hypothesis #6: Flywheel Validation**
- **Test:** Do Student-Teachers recruit students through platform connections?
- **Data Collected:** 
  - Follow relationships (who follows whom)
  - Follower → enrollment conversion rates
  - Source of enrollments (profile-driven vs external)
  - Second generation emergence (S-T's students become S-T's)
- **Success Metric:** 
  - Student-Teachers recruit 2+ students each
  - 30%+ of enrollments come from profile connections (vs external recruiting)
- **Validation Strength:** 🟢 CRITICAL - Cannot test without social graph visibility

### Secondary Validation:

**Hypothesis #2: Completion Rates**
- **Test:** Do public profiles increase accountability and completion?
- **Data Collected:** Completion rates with/without active profiles
- **Validation Strength:** 🟡 INDIRECT - Minor impact, supplementary data

**Hypothesis #3: Customer Segmentation**
- **Test:** Do "Earn-While-Learn" vs "Premium Learner-Only" students use profiles differently?
- **Data Collected:** Profile completion, engagement patterns by segment
- **Validation Strength:** 🟡 MODERATE - Useful behavioral data

---

## Critical for Genesis Cohort?

### For Enrollment/Payment:
- ❌ NOT required to enroll or pay
- ❌ NOT required to access course content

### For Student Experience:
- ✅ YES for students who want to become Student-Teachers (need profile to attract students)
- ⚠️ EXPECTED in modern platforms (signals legitimacy)
- ✅ YES for discovery (how students find Student-Teachers)

### For Hypothesis Testing:
- ✅ CRITICAL for testing H4 and H6
- ✅ Cannot measure flywheel without profiles and social connections

### Assessment:
🟡 **MODERATE CRITICAL** for individual students, but **ESSENTIAL** for validating Brian's highest uncertainty hypotheses.

---

## Manual Alternative Assessment

### What Brian COULD do manually:
- ✅ Create static "Meet Your Student-Teachers" page with photos/bios
- ✅ Track "who follows whom" in spreadsheets
- ✅ Manually introduce students to Student-Teachers via email

### What Brian CANNOT do manually:
- ❌ Public discoverability (students browsing profiles to find Student-Teachers)
- ❌ Social graph visibility (measuring network effects)
- ❌ Self-service Student-Teacher signaling ("I want to teach" toggle)
- ❌ Organic recruitment tracking (did S-T X attract students via profile or external?)

### Would manual approach compromise validation?
🚨 **YES - Major compromise to Hypothesis #6 testing**

Without profiles and social graph, Brian cannot distinguish between:
- Platform-driven recruitment (network effects) ✅ What we want
- External recruitment (S-T uses LinkedIn/email) ❌ Not platform value

**Conclusion:** No adequate manual workaround exists for measuring network effects and organic recruitment.

---

## Budget & Timeline Assessment

### Estimated Development Cost:

**Feature Components:**
- User profile page (name, photo, bio, @handle) → ~3-5 days
- Edit profile functionality → ~2-3 days
- Privacy toggle (public/private) → ~1 day
- Follow/unfollow functionality → ~3-5 days
- Display followers/following counts → ~1 day
- Profile photo upload → ~2 days
- Interests/tags display → ~2-3 days
- Ratings display (read-only) → ~1-2 days

**Total Estimate:** 15-22 developer days = **~3-4 weeks**

**Cost Calculation:**
- Fraser's Rate: $75K / 16 weeks = ~$4,687/week
- Feature Cost: 3-4 weeks × $4,687 = **~$14K-$18.7K**

### Budget Impact:
- ✅ **Fits within $75K Phase 1 budget**
- ✅ Represents ~20% of budget for feature validating top uncertainties
- ✅ Leaves ~$56K-$61K for other MUST HAVE features

### Timeline Impact:
- ✅ **Fits within 16-week build timeline**
- ✅ 3-4 weeks = 18-25% of timeline
- ✅ Core platform feature, should be built early
- ✅ Enables testing throughout Genesis cohort (not last-minute addition)

**Assessment:** 🟢 Reasonable investment for validation value

---

## MVP Scope Definition

### ✅ IN SCOPE for MVP:

**Basic Profile:**
- Name, @handle, profile photo
- Bio (160 character preview, expandable to full bio)
- Interests/tags (limit: 3-5 tags)
- Privacy toggle (public/private)
- Profile photo upload + basic crop

**Social Features:**
- Follow/unfollow users
- Follow/unfollow courses
- Display follower count
- Display following count
- View list of followers
- View list of following (users/courses)

**Reputation (Read-Only):**
- Display average star rating (1-5 stars)
- Display number of ratings received
- Display total courses completed (count)
- *(Brian manually grants ratings after course completion)*

**Student-Teacher Signaling:**
- "Available as Student-Teacher" toggle
- "Teaching" badge display when active
- Basic availability indicator (available/unavailable)
- List of courses certified to teach

**Profile Discovery:**
- Student-Teacher directory (list of profiles with S-T toggle ON)
- Basic search by name/interests
- Profile page accessible via direct link

---

### ⏸️ DEFER to Phase 2:

**Advanced Social:**
- ❌ Activity feed on profile page
- ❌ "Mutual connections" display
- ❌ Direct messaging (use WhatsApp/Discord for MVP)
- ❌ Social recommendations ("Suggested users to follow")
- ❌ "Who viewed your profile" tracking

**Advanced Reputation:**
- ❌ Goodwill points display
- ❌ Achievement badges (beyond certificates)
- ❌ Leaderboards or gamification
- ❌ Detailed review text (just star ratings for MVP)
- ❌ Endorsements or skill validations

**Advanced Matchmaking:**
- ❌ Gender preference filtering
- ❌ "Right now" instant connection
- ❌ Experience level tiers
- ❌ AI-powered Student-Teacher recommendations
- ❌ Compatibility scores

**Stats & Analytics:**
- ❌ Detailed learning hours breakdown
- ❌ Course completion percentages
- ❌ "Days active" streaks
- ❌ Teaching effectiveness metrics
- ❌ Detailed progress visualizations

**Advanced Discovery:**
- ❌ "Featured Student-Teachers" curated list
- ❌ Trending students/topics
- ❌ Category-based browsing
- ❌ Advanced filtering (rating, price, availability)

---

## Implementation Notes

### Profile Types:

**Unified Profile System with Role-Based Display:**

1. **Student Profile** (Default)
   - Shows: Basic info, bio, interests, courses learning, ratings as student

2. **Student-Teacher Profile** (Student + Teaching fields)
   - Shows: Everything from Student Profile, PLUS:
     - "Available as Student-Teacher" badge
     - Courses certified to teach
     - Teaching availability
     - Ratings as teacher
     - Students taught (count)

3. **Creator Profile** (Separate Q-DECIDE needed)
   - More complex requirements
   - Decision pending: Is this MUST HAVE for Genesis cohort with 4-5 creators?

**Technical Approach:** Single profile table with role fields (student, student_teacher, creator). Display logic based on role flags.

---

## Questions for Fraser (Technical Validation)

Before finalizing implementation, confirm with Fraser:

### 1. **Architecture:**
- Can we build unified profile system with role-based display?
- Single profile table or separate tables per role?
- How to handle Student → Student-Teacher transition?

### 2. **Timeline Validation:**
- Is 3-4 weeks realistic for scope defined above?
- What's minimum viable profile if we need to cut scope?
- Phased rollout possible? (Week 1: Basic profile, Week 2: Social, Week 3: S-T features)

### 3. **Follow Functionality:**
- Follow users + follow courses → same system or separate implementations?
- Social graph storage complexity (PostgreSQL, separate graph DB?)
- Performance considerations for follower/following queries

### 4. **Photo Upload:**
- Simple file upload + crop functionality?
- Or integrate third-party service (Cloudinary, AWS S3, etc.)?
- Storage cost implications for 60-80 students + photos?

### 5. **Privacy Settings:**
- Default to public or private profiles?
- Granular field-level privacy (e.g., hide follower count but show bio)?
- Or all-or-nothing toggle (entire profile public/private)?

### 6. **Search & Discovery:**
- Student-Teacher directory: List view, card view, or table?
- Search implementation (database query or search service like Algolia)?
- Performance for 60-80 students (simple DB query fine for MVP?)

### 7. **Interests/Tags:**
- Free-form text or predefined tag list?
- Tag autocomplete/suggestions?
- Tag taxonomy management (who maintains tag list?)

---

## Risks & Mitigations

### Risk 1: Scope Creep
**Risk:** Profiles are massive feature space; easy to over-build  
**Impact:** 🔴 HIGH - Could blow budget and timeline  
**Mitigation:** 
- ✅ Strict scope defined above
- ✅ Defer all social/gamification features to Phase 2
- ✅ Fraser reviews scope before starting
- ✅ Weekly check-ins during build to prevent feature additions

### Risk 2: Privacy Concerns
**Risk:** Students uncomfortable with public profiles; GDPR/privacy issues  
**Impact:** 🟡 MEDIUM - Could reduce profile completion, limit testing  
**Mitigation:** 
- ✅ Privacy toggle (default TBD - possibly private for safety)
- ✅ Clear opt-in messaging ("Public profiles help you connect with Student-Teachers")
- ✅ Field-level privacy if technically feasible
- ✅ Compliance review (GDPR, COPPA if students under 18)

### Risk 3: Empty Profiles = Bad UX
**Risk:** If most students don't complete profiles, feature looks abandoned  
**Impact:** 🟡 MEDIUM - Professional appearance compromised, reduces discovery  
**Mitigation:** 
- ✅ Simple onboarding prompts (not blocking)
- ✅ Pre-populate name/email from signup
- ✅ Brian encourages profile completion (especially for Student-Teachers)
- ✅ "Profile strength" indicator to encourage completion
- ✅ Genesis cohort = small group, Brian can personally follow up

### Risk 4: Timeline Estimate Too Low
**Risk:** Fraser estimates 3-4 weeks, but actually takes 5-6 weeks  
**Impact:** 🔴 HIGH - Delays entire MVP launch  
**Mitigation:** 
- ✅ Build in phases (basic profile first, then social, then S-T features)
- ✅ Minimum viable = basic profile + follow functionality (~2 weeks)
- ✅ Can launch with limited features if timeline slips
- ✅ Buffer time in overall schedule (don't pack 16 weeks to 100%)

### Risk 5: Social Graph Complexity
**Risk:** Follow functionality more complex than anticipated (performance, edge cases)  
**Impact:** 🟡 MEDIUM - Could extend timeline  
**Mitigation:** 
- ✅ Start with simple follow (no feed, no notifications)
- ✅ Read-only follower lists (no real-time updates needed)
- ✅ 60-80 students = small scale, performance not critical yet
- ✅ Can use basic database queries (no need for graph DB at this scale)

### Risk 6: Photo Upload Issues
**Risk:** File upload, storage, security vulnerabilities  
**Impact:** 🟡 MEDIUM - Security risk, user frustration  
**Mitigation:** 
- ✅ Use established service (Cloudinary, AWS S3)
- ✅ File size limits, type validation
- ✅ Moderation: Brian manually approves photos (Genesis cohort = small)
- ✅ Default avatar if no photo uploaded

---

## Success Metrics (Post-Launch)

### Genesis Cohort (60-80 students across 4-5 courses):

**Profile Completion:**
- Target: 60%+ students complete profile (name, photo, bio)
- Target: 80%+ Student-Teachers complete profile (critical for recruitment)

**Social Graph Growth:**
- Target: Average 5+ connections per student
- Target: 30%+ of students follow at least one Student-Teacher
- Target: 50%+ of students follow at least one course

**Student-Teacher Activation:**
- Target: 10%+ of students toggle "Available as Student-Teacher"
- Success: 6-8 active Student-Teacher profiles in Genesis cohort

**Organic Recruitment:**
- Target: 30%+ of enrollments come from profile connections (vs external recruiting)
- Track: Follower → enrollment conversion rate
- Track: Student-Teachers with 2+ students recruited via profile

**Hypothesis Validation:**
- **H4:** % of students converting to Student-Teachers (via profile toggle)
- **H6:** Evidence of organic recruitment through platform connections
- **H6:** Second generation emergence (Student's of S-T's becoming S-T's)

---

## Integration with Other Features

### Community Feed (GetStream.io):
- Profile photo/name displayed in feed posts
- Click post author → navigate to profile
- "Follow" button in feed → updates profile connections

### Calendar/Scheduling:
- Student-Teacher profile shows availability link
- Clicking availability → opens calendar booking

### Video Conferencing (BigBlueButton):
- Profile photo used in video interface
- Participant names link back to profiles

### Payment System (Stripe):
- Student-Teacher profile shows "Book Session" button
- Click → payment flow with S-T's rate

### Certificates:
- Certificates displayed on profile (Learning + Teaching certs)
- Public proof of credentials

---

## Open Questions

1. **Creator Profiles:**
   - Are Creator profiles MUST HAVE for Genesis cohort (4-5 creators)?
   - Or can creators use Student-Teacher profile view?
   - Need separate Q-DECIDE

2. **Default Privacy:**
   - Public by default (maximize discovery) or Private by default (maximize safety)?
   - Fraser's technical recommendation?

3. **Profile URLs:**
   - peerloop.com/profile/{username} or peerloop.com/@{username}?
   - Custom URL slugs or auto-generated IDs?

4. **Moderation:**
   - Brian manually reviews all profiles?
   - Or trust Genesis cohort (small, vetted group)?
   - Automated profanity filters?

5. **Mobile Responsiveness:**
   - Full mobile optimization required?
   - Or desktop-first, basic mobile support?

---

## Next Steps

### Immediate (This Week):
1. ✅ Document decision (this file)
2. ⏭️ Create detailed feature spec → `features/must-have/student-profile-system.md`
3. ⏭️ Fraser review: Validate timeline, architecture, technical approach
4. ⏭️ Q-DECIDE: Creator Profiles (MUST HAVE or NICE TO HAVE?)

### Before Development:
5. ⏭️ Finalize scope with Fraser (any cuts needed?)
6. ⏭️ Define privacy policy (default settings, compliance)
7. ⏭️ Design mockups (basic wireframes for Fraser)
8. ⏭️ Integration planning (how profiles connect to feed, calendar, video)

### During Development:
9. ⏭️ Weekly check-ins (prevent scope creep)
10. ⏭️ Phased builds (basic → social → S-T features)
11. ⏭️ Testing with small group before Genesis cohort

---

## Decision Rationale Summary

### Why MUST HAVE:

1. ✅ **Validates Brian's #1 uncertainty** - Hypothesis #6 (Flywheel/Recruitment) cannot be tested without social graph visibility
2. ✅ **Validates H4** - Conversion to teaching requires visible Student-Teacher profiles
3. ✅ **No manual alternative** - Social discovery and organic recruitment require platform features
4. ✅ **Within budget/timeline** - Reasonable investment (~$14K-$18.7K, 3-4 weeks) for critical validation
5. ✅ **Professional appearance** - Modern platforms have profiles; missing this signals "incomplete platform"
6. ✅ **Network effects measurement** - Only way to distinguish platform-driven growth from external recruiting

### Why NOT defer to Phase 2:

- ❌ Cannot test flywheel hypothesis without it
- ❌ Genesis cohort needs profiles to discover Student-Teachers
- ❌ Social dynamics emerge over time (need from Day 1, can't retrofit)
- ❌ Hypothesis validation requires baseline data from Genesis cohort

### Trade-offs Accepted:

- ⚠️ 20% of budget allocated to feature that's not directly required for enrollment
- ⚠️ Complexity of social graph functionality (follow/followers)
- ⚠️ Potential low profile completion (mitigation: Brian encourages completion)
- ⚠️ Privacy concerns (mitigation: privacy toggle, clear opt-in)

**Decision stands: Benefits (hypothesis validation) significantly outweigh costs and risks.**

---

**Status:** ✅ APPROVED  
**Approved By:** Brian (CEO/Founder)  
**Date:** November 30, 2025  
**Next Review:** After Fraser technical validation

---

**Related Documents:**
- Feature Spec: `features/must-have/student-profile-system.md` (to be created)
- Context: `docs/brian-mvp-context.md`
- Framework: `docs/DECISION-FRAMEWORK.md`
- Raccoon Document: `GeneratedMDs/transcripts/2025-11-30-1830-Brian.md`

