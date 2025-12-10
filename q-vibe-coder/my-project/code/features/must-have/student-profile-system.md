# Feature Spec: Unified Profile System (Student, Student-Teacher, Creator)

**Status:** MUST HAVE  
**Decision Date:** November 30, 2025  
**Decision Docs:** 
- `mvp-decisions/2025-11-30-student-profile-system.md`
- `mvp-decisions/2025-11-30-creator-profiles.md`  
**Owner:** Fraser (Development)  
**Estimated Timeline:** 3-4 weeks  
**Estimated Cost:** ~$14.5K-$19.2K

---

## Overview

A unified public profile page system that supports three user roles: Students, Student-Teachers, and Creators. All roles use the same infrastructure with role-based display logic. Critical for testing Hypothesis #4 (Conversion to Teaching) and Hypothesis #6 (Flywheel Validation), plus enables payment system integration for creators.

---

## User Stories

### As a Student:
- I want to create a profile so other students can learn about me
- I want to follow other students and Student-Teachers so I can stay connected
- I want to see who is available to teach courses I'm interested in
- I want to control my privacy so I can choose who sees my information

### As a Student-Teacher:
- I want to signal I'm available to teach so students can find me
- I want to showcase my certifications so students trust my credentials
- I want students to discover me through my profile so I can recruit organically
- I want to display my teaching stats so students can evaluate my experience

### As a Creator:
- I want a public profile so students can learn about my expertise
- I want to showcase all courses I've created in one place
- I want students to discover my other courses easily
- I want my profile linked to payment tracking so revenue is attributed correctly

### As Brian (Platform Admin):
- I want to track who follows whom so I can measure network effects
- I want to see which Student-Teachers attract students via profiles so I can validate the flywheel
- I want to measure profile → enrollment conversion so I can optimize discovery
- I want creator profiles linked to payment system for semi-automated payouts

---

## Core Features

### 1. Basic Profile Page

**Display Fields:**
- Profile photo (uploaded or default avatar)
- Name (from signup)
- @handle (unique username)
- Bio (160 chars preview, expandable)
- Interests/tags (3-5 max)
- Role badge (Student, Student-Teacher, Creator)
- Join date
- Privacy status (public/private indicator)

**Profile URL Structure:**
- Option A: `peerloop.com/@{username}`
- Option B: `peerloop.com/profile/{username}`
- *(Fraser decides based on technical preference)*

**Responsive Design:**
- Desktop optimized
- Mobile responsive (basic support)

---

### 2. Edit Profile Functionality

**Editable Fields:**
- Profile photo (upload + basic crop)
- Bio (text area, max 500 characters)
- Interests/tags (select from predefined list OR free-form text - Fraser decides)
- Privacy toggle (public/private)
- "Available as Student-Teacher" toggle (if eligible)

**Access:**
- "Edit Profile" button on own profile page
- Or from Dashboard → Settings → Profile

**Validation:**
- @handle: Unique, alphanumeric + underscore/hyphen, 3-20 chars
- Bio: Max 500 characters
- Photo: Max 5MB, JPG/PNG only
- Interests: Max 5 tags

**UX:**
- Inline editing OR modal dialog (Fraser decides)
- Save/Cancel buttons
- Success/error notifications
- "Profile strength" indicator (optional: encourages completion)

---

### 3. Profile Photo Upload

**Requirements:**
- File upload interface
- Basic crop functionality (square aspect ratio)
- File validation (size, type)
- Storage solution (Cloudinary, AWS S3, or similar)

**Default Avatar:**
- If no photo uploaded, display default avatar
- Initials-based avatar OR generic silhouette (Fraser decides)

**Security:**
- Max file size: 5MB
- Allowed types: JPG, PNG
- Validation before upload
- Brian manually approves photos for Genesis cohort (manual moderation)

---

### 4. Social Features - Follow/Unfollow

**Follow Users:**
- "Follow" button on any user's profile
- Click → Follow relationship created
- Button changes to "Unfollow"
- Counter increments on followed user's profile

**Follow Courses:**
- "Follow" button on course pages
- Same mechanics as user follows
- Displays in "Following" tab on profile

**Display Counts:**
- Follower count (users following this profile)
- Following count (users + courses this profile follows)

**View Lists:**
- "Followers" tab → list of users following this profile
- "Following" tab → list of users + courses this profile follows
- List format: Avatar, name, @handle, role badge

**Privacy:**
- If profile is private, only show counts (not lists)
- OR hide everything from non-followers (Fraser decides based on UX)

**Technical Notes:**
- Simple many-to-many relationship (users ↔ users, users ↔ courses)
- No notifications in MVP (defer to Phase 2)
- No activity feed (defer to Phase 2)
- Read-only lists (no real-time updates needed)

---

### 5. Reputation Display (Read-Only)

**Display Fields:**
- Average star rating (1-5 stars, visual display)
- Number of ratings received
- Total courses completed (count)

**Data Source:**
- Brian manually grants ratings after course completion
- Ratings stored in database (Brian has admin interface or spreadsheet sync)
- Profile pulls rating data for display

**MVP Scope:**
- Read-only display (students cannot rate each other in MVP)
- No detailed review text (just star ratings)
- No rating breakdown by course (just overall average)

**Deferred to Phase 2:**
- Student-initiated ratings
- Review text submissions
- Rating breakdown (as student vs as Student-Teacher)

---

### 6. Student-Teacher Features

**"Available as Student-Teacher" Toggle:**
- Only visible to students who have completed at least one course
- Toggle ON → Profile displays in Student-Teacher directory
- Toggle OFF → Profile hidden from S-T directory (still visible as student profile)

**Student-Teacher Badge:**
- Visual badge on profile (e.g., "🎓 Student-Teacher")
- Displayed prominently near name

**Additional S-T Fields (Auto-Display when toggle ON):**
- Courses certified to teach (list)
- Availability indicator (Available/Unavailable - manual toggle)
- Link to calendar/booking (integration with calendar feature)
- Teaching stats:
  - Students taught (count)
  - Average rating as teacher
  - Total teaching hours (optional, if tracked)

**Eligibility Logic:**
- Student must have completed ≥1 course
- Student must have earned Learning Certificate
- *(Brian manually grants S-T certification - could be automatic OR manual approval)*

---

### 7. Profile Discovery

**Student-Teacher Directory:**
- Page: `peerloop.com/student-teachers` (or `/instructors`)
- Lists all profiles with "Available as Student-Teacher" toggle ON
- Display format: Grid of cards OR list view (Fraser decides)
- Each card shows:
  - Photo, name, @handle
  - Bio preview (1-2 lines)
  - Rating, students taught
  - Courses they teach
  - "Follow" button

**Search Functionality:**
- Search by name or @handle
- Search by interests/tags (if feasible)
- Implementation: Simple database query OR search service like Algolia (Fraser decides based on complexity)

**Filtering (Nice-to-Have):**
- Filter by course (show S-T's for specific course)
- Filter by rating (4+ stars)
- *(If time allows, otherwise defer to Phase 2)*

---

### 8. Privacy Settings

**Privacy Toggle:**
- Public: Profile visible to all users (logged in or not)
- Private: Profile visible only to [TBD: connections? logged-in users? no one?]

**Default Setting:**
- TBD with Fraser (public vs private default)
- Recommendation: Public by default for Student-Teachers (need discovery), Private by default for Students (safety)

**Granular Privacy (Nice-to-Have):**
- Hide follower/following lists (but show counts)
- Hide interests
- Hide bio
- *(If technically feasible, otherwise all-or-nothing toggle)*

**Privacy for Student-Teachers:**
- If Student-Teacher toggle is ON, profile MUST be public (can't recruit with private profile)
- UX: Warn user when toggling S-T ON that profile becomes public

---

## Technical Requirements

### Database Schema (Suggested):

**users table additions:**
```
- profile_photo_url (string, nullable)
- bio (text, max 500 chars, nullable)
- handle (string, unique, indexed)
- privacy (enum: public/private)
- is_student_teacher (boolean, default false)
- student_teacher_available (boolean, default false)
- join_date (timestamp)
```

**interests table:**
```
- id (primary key)
- name (string, unique)
```

**user_interests (junction table):**
```
- user_id (foreign key)
- interest_id (foreign key)
```

**follows table:**
```
- id (primary key)
- follower_id (foreign key → users)
- followee_id (foreign key → users, nullable)
- course_id (foreign key → courses, nullable)
- created_at (timestamp)
- UNIQUE(follower_id, followee_id) OR UNIQUE(follower_id, course_id)
```

**ratings table:**
```
- id (primary key)
- user_id (foreign key → users, the person being rated)
- rater_id (foreign key → users, nullable in MVP - Brian is rater)
- rating (integer, 1-5)
- course_id (foreign key → courses)
- created_at (timestamp)
```

### API Endpoints (Suggested):

**Profiles:**
- `GET /api/profiles/:handle` - Get profile by handle
- `PUT /api/profiles/me` - Update own profile
- `POST /api/profiles/me/photo` - Upload profile photo

**Social:**
- `POST /api/follows` - Follow user or course
- `DELETE /api/follows/:id` - Unfollow
- `GET /api/profiles/:handle/followers` - Get followers list
- `GET /api/profiles/:handle/following` - Get following list

**Discovery:**
- `GET /api/student-teachers` - List all S-T profiles
- `GET /api/student-teachers/search?q=query` - Search S-T's

**Admin (Brian only):**
- `POST /api/admin/ratings` - Brian submits rating for student
- `PUT /api/admin/users/:id/student-teacher` - Brian approves S-T status

### Third-Party Services:

**Photo Storage:**
- Cloudinary (recommended - has free tier, easy integration)
- OR AWS S3 + CloudFront
- OR Firebase Storage
- Fraser decides based on experience

**Search (Optional):**
- Algolia (if complex search needed)
- OR simple PostgreSQL full-text search (probably sufficient for 60-80 users)

---

## User Flows

### Flow 1: Student Creates Profile

1. Student signs up for PeerLoop
2. After email verification, redirected to dashboard
3. Dashboard shows "Complete Your Profile" prompt
4. Click prompt → Profile edit page
5. Student adds:
   - Profile photo (optional, uploads image)
   - Bio (types 1-2 sentences)
   - Interests (selects 3-5 tags)
   - Privacy (defaults to public/private - TBD)
6. Click "Save Profile"
7. Success message: "Profile created! Other students can now find you."
8. Redirected to own profile page

### Flow 2: Student Discovers Student-Teacher

1. Student logs into PeerLoop
2. Navigates to "Browse Student-Teachers" (from nav menu)
3. Sees directory of S-T profiles
4. Filters by course: "Node.js Backend Development"
5. Sees 3 S-T profiles available for that course
6. Clicks on "Sarah M." profile
7. Views Sarah's profile:
   - Bio: "Full-stack developer, love teaching!"
   - Courses: Node.js Backend Development (certified)
   - Rating: 4.8 stars (12 ratings)
   - Students taught: 18
8. Student clicks "Follow" button
9. Follows Sarah (follower count increments)
10. Student clicks "Book Session" (links to calendar/payment)
11. Proceeds to enrollment

### Flow 3: Student Becomes Student-Teacher

1. Student completes "Node.js Backend Development" course
2. Brian manually grants Learning Certificate
3. Student sees dashboard notification: "Congratulations! You can now become a Student-Teacher."
4. Student clicks notification → Profile page
5. "Available as Student-Teacher" toggle now visible (was hidden before)
6. Student toggles ON
7. Modal appears: "Your profile will become public. Students will be able to discover and book sessions with you. Continue?"
8. Student clicks "Yes, I'm ready to teach"
9. Profile updated:
   - "Student-Teacher" badge displayed
   - "Certified to teach: Node.js Backend Development" added
   - Profile now appears in Student-Teacher directory
10. Student can now be discovered by other students

### Flow 4: Brian Tracks Flywheel (Admin View)

1. Brian logs into admin dashboard
2. Navigates to "Social Graph Analytics"
3. Sees report:
   - Total follows: 247
   - Most followed S-T: Sarah M. (42 followers)
   - Average followers per S-T: 12
   - Follow → enrollment conversion: 35%
4. Brian drills into Sarah's profile:
   - 42 followers
   - 18 students taught
   - 12 enrollments came from followers (67% conversion!)
   - Conclusion: Sarah is recruiting organically via profile
5. Brian compares to Mike:
   - 8 followers
   - 15 students taught
   - 2 enrollments came from followers (Mike recruiting externally)
6. **Hypothesis #6 validated:** Sarah's success proves platform-driven recruitment works

---

## Edge Cases & Considerations

### Duplicate Handles:
- @handle must be unique
- If collision during signup, suggest alternatives: @john_doe, @johndoe2, etc.

### Profile Photo Moderation:
- Brian manually reviews all photos (Genesis cohort = small)
- Admin interface to approve/reject photos
- Default avatar until approved

### Student → Student-Teacher → Student:
- If S-T stops teaching, they can toggle OFF
- Profile remains but disappears from S-T directory
- Preserve historical data (students taught, ratings)

### Following Yourself:
- Blocked by system (cannot follow own profile)

### Private Profiles but S-T Enabled:
- Not allowed - S-T requires public profile
- Toggle S-T ON → force profile public (with warning)

### Deleted Accounts:
- Remove from follows tables
- Decrement follower/following counts
- Archive profile data (don't hard delete - preserve for analytics)

### Empty Profiles:
- Allow profile creation without photo/bio (optional fields)
- Show "Complete your profile" prompt on dashboard
- "Profile strength" indicator: 0% (no info) → 100% (all fields filled)

---

## Success Metrics

### Profile Completion (Genesis Cohort):
- **Target:** 60%+ students complete profile (name, photo, bio)
- **Target:** 80%+ Student-Teachers complete profile

### Social Graph Growth:
- **Target:** Average 5+ connections per student
- **Target:** 30%+ students follow ≥1 Student-Teacher
- **Target:** 50%+ students follow ≥1 course

### Student-Teacher Activation:
- **Target:** 10%+ students toggle "Available as Student-Teacher"
- **Target:** 6-8 active S-T profiles in Genesis cohort (60-80 students)

### Organic Recruitment:
- **Target:** 30%+ enrollments come from profile connections (vs external)
- **Track:** Follow → enrollment conversion rate
- **Track:** Student-Teachers with 2+ students recruited via profile

### Hypothesis Validation:
- **H4:** % of students converting to S-T's (via toggle)
- **H6:** Evidence of organic recruitment through profiles
- **H6:** Second generation emergence

---

## Open Questions for Fraser

### 1. Architecture:
- [ ] Unified profile table with role flags OR separate tables per role?
- [ ] How to handle Student → Student-Teacher transition in DB?

### 2. Timeline:
- [ ] Is 3-4 weeks realistic for full scope?
- [ ] What's minimum viable? (Can we launch with partial features?)
- [ ] Phased rollout: Basic profile (Week 1) → Social (Week 2) → S-T features (Week 3)?

### 3. Follow Functionality:
- [ ] Follow users + courses → same system or separate?
- [ ] Social graph storage: PostgreSQL or separate graph DB?
- [ ] Performance: How to optimize follower/following queries?

### 4. Photo Upload:
- [ ] Cloudinary vs AWS S3 vs other?
- [ ] Cost estimate for 60-80 students + photos?
- [ ] Cropping: Library recommendation? (e.g., React Cropper)

### 5. Privacy:
- [ ] Default to public or private?
- [ ] Granular field-level privacy feasible in timeline?
- [ ] How to enforce "S-T must be public" rule?

### 6. Search & Discovery:
- [ ] Simple DB query sufficient or need search service (Algolia)?
- [ ] Directory view: Grid cards or list table?
- [ ] Filtering: Feasible in MVP timeline?

### 7. Interests/Tags:
- [ ] Predefined tag list (who maintains?) or free-form text?
- [ ] Tag autocomplete needed?
- [ ] Tag taxonomy management?

### 8. Profile URLs:
- [ ] Prefer `/@handle` or `/profile/handle`?
- [ ] Custom slugs or auto-generated IDs?

---

## Dependencies

### Depends On:
- **User Authentication System** (must be complete)
- **Course Management System** (to link courses to S-T profiles)
- **Certificate System** (to determine S-T eligibility)

### Integrates With:
- **Community Feed** (profile photo/name in posts, click → profile)
- **Calendar/Scheduling** (S-T profile shows booking link)
- **Video Conferencing** (profile photo in video interface)
- **Payment System** ("Book Session" button links to payment)

### Blocks:
- **Student-Teacher Matching** (needs profile data)
- **Network Effects Measurement** (needs social graph data)
- **Hypothesis #6 Testing** (entire feature is blocker)

---

## Phase 2 Enhancements (Out of MVP Scope)

### Advanced Social:
- Activity feed on profile page
- "Mutual connections" display
- Direct messaging
- Social recommendations ("Suggested users to follow")
- "Who viewed your profile" tracking
- Follow notifications

### Advanced Reputation:
- Goodwill points display
- Achievement badges
- Leaderboards
- Detailed review text
- Endorsements/skill validations

### Advanced Matchmaking:
- Gender preference filtering
- "Right now" instant connection
- Experience level tiers
- AI-powered recommendations
- Compatibility scores

### Stats & Analytics:
- Detailed learning hours breakdown
- Course completion percentages
- "Days active" streaks
- Teaching effectiveness metrics
- Progress visualizations

### Advanced Discovery:
- Featured Student-Teachers (curated)
- Trending students/topics
- Category-based browsing
- Advanced filtering (rating, price, availability)
- Student-Teacher recommendations based on interests

---

## Design Notes

**Visual Style:**
- Clean, professional appearance
- Inspired by: LinkedIn (professional) + X.com (social) + course platforms
- Focus on readability and trust signals

**Key UI Elements:**
- Large profile photo (circular, 150x150px)
- Prominent name and @handle
- Clear role badge (Student vs Student-Teacher)
- Star ratings highly visible
- "Follow" button prominent and accessible
- Bio text readable (16px font, good contrast)

**Responsive:**
- Desktop: 2-column layout (profile left, content right)
- Mobile: Single column, stacked elements

**Accessibility:**
- Alt text for profile photos
- Screen reader friendly
- Keyboard navigation for all actions
- High contrast text

---

## Testing Plan

### Unit Tests:
- Profile CRUD operations
- Follow/unfollow logic
- Privacy settings enforcement
- S-T toggle eligibility checks

### Integration Tests:
- Profile → Course linkage
- Profile → Rating display
- Profile → Calendar integration
- Profile → Feed integration

### User Acceptance Testing (Genesis Cohort):
- 5-10 beta users test profile creation
- Verify follow functionality works
- Test S-T toggle and directory discovery
- Collect feedback on UX

### Load Testing:
- Not critical for 60-80 users
- Basic smoke tests sufficient

---

## Documentation Needs

### For Fraser (Developer Docs):
- API endpoint specifications
- Database schema
- Third-party service setup (Cloudinary, etc.)
- Admin interface for Brian (rating submission, photo moderation)

### For Brian (Admin Guide):
- How to grant S-T certification
- How to submit ratings for students
- How to moderate photos
- How to access social graph analytics

### For Students (User Guide):
- How to create/edit profile
- How to follow users/courses
- How to become Student-Teacher
- Privacy settings explanation

---

## Timeline Estimate (Fraser to Validate)

**Week 1: Basic Profile (5 days)**
- Database schema setup
- Profile page UI
- Edit profile functionality
- Profile photo upload

**Week 2: Social Features (5 days)**
- Follow/unfollow logic
- Follower/following counts and lists
- Directory page (basic list)

**Week 3: Student-Teacher Features (5 days)**
- S-T toggle and eligibility checks
- S-T badge and additional fields
- S-T directory filtering
- Integration with calendar/payment

**Week 4: Polish & Testing (5 days)**
- Privacy settings
- Search functionality
- Responsive design polish
- Bug fixes and testing
- Admin interface for Brian

**Total: ~20 days = 4 weeks**

**Buffer:** If timeline slips, Week 4 can be reduced (defer search, privacy granularity to Phase 2)

---

## Cost Estimate

**Development Time:** 15-22 days (3-4 weeks)  
**Fraser's Rate:** $75K / 16 weeks = $4,687/week  
**Feature Cost:** 3-4 weeks × $4,687 = **$14,061 - $18,748**

**Third-Party Costs (Ongoing):**
- Cloudinary (photo storage): Free tier covers MVP (25 GB storage, 25 GB bandwidth)
- Search service (if needed): Algolia free tier OR $0 (use PostgreSQL)

**Total MVP Cost:** ~$14K-$18.7K (one-time) + minimal ongoing costs

---

## Approval & Sign-Off

**Decision:** ✅ MUST HAVE  
**Approved By:** Brian (CEO/Founder)  
**Date:** November 30, 2025  

**Next Steps:**
1. Fraser reviews this spec
2. Fraser validates timeline and cost estimate
3. Fraser asks clarifying questions (open questions above)
4. Fraser provides implementation plan
5. Development begins after Q-DECIDE on Creator Profiles

---

**Related Documents:**
- Decision Log: `mvp-decisions/2025-11-30-student-profile-system.md`
- Context: `docs/brian-mvp-context.md`
- Framework: `docs/DECISION-FRAMEWORK.md`

