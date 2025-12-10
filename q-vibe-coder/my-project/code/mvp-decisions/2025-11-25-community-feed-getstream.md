# MVP Decision: AI-Sorted Community Feed (getstream.io)

**Date:** 2025-11-25
**Decision Maker:** Brian (CEO/Founder)
**Decision:** MUST HAVE
**Status:** Approved (pending Fraser feasibility confirmation)

---

## Feature Description

AI-sorted social community feed connecting all users (students, Student-Teachers, moderators, creators) in an integrated, in-platform social experience.

**Technology:** getstream.io (SaaS feed infrastructure)
**Approach:** Integration via getstream.io SDK (NOT building feed infrastructure from scratch)

### Core Functionality

**Follow System:**
- Users can follow other users (students, Student-Teachers, moderators, creators)
- Users can follow courses
- Users can follow creators
- Feed shows content from followed entities

**Content Types:**
- Questions and answers
- Progress updates and achievements
- Teaching tips and advice
- Course announcements
- Student success stories
- Student-Teacher availability
- Creator updates

**Social Interactions:**
- ❤️ Like/Heart button
- 🔖 Bookmark button (save for later)
- 💬 Reply/Comment button
- 🔄 Repost button
- Additional engagement features (polls, reactions, etc.)

**AI/Algorithmic Feed:**
- getstream.io's AI analyzes all posts and responses
- Generates personalized feed based on:
  - User interests
  - Follow relationships
  - Engagement patterns
  - Content relevance
  - Recency

**For Students:**
- See updates from their course, Student-Teacher, and classmates
- Ask questions to the community
- Share progress and achievements
- Get encouragement from peers
- Discover other courses/creators

**For Student-Teachers:**
- Share teaching tips and success stories
- Find potential students (recruitment for H6!)
- Build reputation and following
- Get advice from other teachers
- Announce availability

**For Creators:**
- Share course updates and content
- Build community around their course
- Engage with students across cohorts
- Cross-promote with other creators
- Announce new offerings

**For Moderators:**
- Monitor community content
- Flag/remove inappropriate posts
- Guide discussions
- Support community health
- Escalate issues to Brian

---

## Decision Framework Analysis

### 1. Hypothesis Validation ✅

**Primary Hypotheses Validated:**

**H1: Market Positioning**
- Community feed serves as marketing funnel
- Students see vibrant community BEFORE enrolling
- Social proof encourages enrollment
- Justifies premium pricing ($300-600) vs isolated MOOC experience

**H3: Customer Segmentation**
- Feed reveals user motivations through content
- "Earn-While-Learn" students post about teaching opportunities
- "Premium Learn-Only" students post about learning goals
- Clear segmentation emerges from social behavior

**H4: Conversion to Teaching**
- Student-Teachers share success stories (encourages others)
- Students see earning potential from Student-Teacher posts
- Social modeling: "If they can teach, I can too"
- Community celebrates new Student-Teacher certifications

**H5: Peer Teaching Quality**
- Student-Teachers share tips and get advice
- Community feedback on teaching approaches
- Peer learning among Student-Teachers
- Quality improvements through social learning

**H6: Flywheel Validation** (Brian's #1 uncertainty!)
- **CRITICAL:** Student-Teachers can recruit students via community
- Student-Teachers post availability and attract students
- Second-generation students discover Student-Teachers through feed
- Network effects enable flywheel mechanism
- Without community, Student-Teachers recruit via external channels (WhatsApp, Instagram) - harder to track and measure

**Assessment:** Validates 5 of 6 hypotheses, including top uncertainty (#6). Strongest multi-hypothesis coverage of any feature.

---

### 2. Genesis Cohort Critical Check ✅

**Is this critical for 60-80 Genesis students + 4-5 creators?**

**YES - Critical for multi-creator marketplace:**

**Scale Consideration:**
- 60-80 students + 6-8 Student-Teachers + 4-5 creators + 4-5 moderators = **75-100 people**
- This is EXACTLY the right scale for community dynamics
- Below 50 people: Community feels empty
- Above 150 people: Community feels overwhelming
- 75-100: Perfect "village size" for engagement

**Multi-Creator Marketplace Requires Community:**
- Without feed: Students only see their own course (siloed)
- With feed: Students discover other courses and creators
- Cross-course community creates marketplace feel
- Shared community = shared value proposition

**Student-Teacher Recruitment (H6):**
- Without feed: How do Student-Teachers find students? (Manual, external)
- With feed: Student-Teachers post availability, students discover them
- This is HOW the flywheel works at MVP scale

**Would students lose trust without it?**
- Multi-creator platform without community = just a course hosting site
- Students expect social features in modern learning platforms
- Community differentiates PeerLoop from Udemy/Coursera (instructor → student only)

**Assessment:** Critical for Genesis cohort. Without this, multi-creator marketplace doesn't work, and H6 (flywheel) can't be validated.

---

### 3. Manual Alternative Check ✅

**Could Brian handle community manually?**

**Manual alternatives considered and REJECTED:**

**Option A: Discord/Slack**
- ❌ Students leave PeerLoop platform (breaks integration)
- ❌ No AI-sorted feed (chronological only)
- ❌ Separate login (friction)
- ❌ Not tied to course/Student-Teacher data
- ❌ Brian explicitly rejected this option

**Option B: Facebook Group/WhatsApp**
- ❌ Even worse integration (completely external)
- ❌ Privacy concerns
- ❌ Not professional
- ❌ Can't track for hypothesis validation

**Option C: Email newsletter**
- ❌ One-way communication (not social)
- ❌ No real-time interaction
- ❌ Doesn't enable Student-Teacher recruitment

**Why manual alternatives don't work:**
- Students are IN the platform daily (courses, videos, sessions)
- If community is external, students must context-switch
- Can't validate H6 (flywheel) without in-platform discovery
- Manual moderation of external tools = same work, worse data

**Fraser's role:**
- Fraser will INTEGRATE getstream.io (not build feed infrastructure)
- getstream.io handles: AI ranking, real-time updates, storage, infrastructure
- Fraser builds: UI integration, post creation, moderation tools
- This is integration work, not building from scratch ✅

**Assessment:** Manual alternatives rejected. In-platform integration required for hypothesis validation and user experience.

---

### 4. Budget & Timeline Impact ✅

**Development Cost:**
- Fraser integration work: 2-3 weeks (verified via research)
- Estimated cost: $3,000-4,500
- Percentage of $75K budget: 4-6%

**Service Cost:**
- getstream.io hosted: ~$100-300/month (Growth tier)
- 4-month MVP period: $400-1,200
- Ongoing cost manageable

**Total Phase 1 Cost:** ~$3,400-5,700

**What getstream.io provides (saves development time):**
- ✅ Feed storage and infrastructure
- ✅ AI-sorting algorithms
- ✅ Real-time updates
- ✅ Pre-built React components (feed display, activity cards, buttons)
- ✅ Follow/unfollow system
- ✅ Like, comment, repost functionality
- ✅ Notification system
- ✅ ~9ms API response time

**What Fraser builds:**
- Week 1: Core integration, authentication, basic feed display, post creation
- Week 2: Social features (like, bookmark, reply, repost), notifications, profiles
- Week 3: Moderation tools, testing, mobile responsiveness, polish

**Timeline Impact:**
- 2-3 weeks of Fraser's 4-month timeline (12-18%)
- Reasonable allocation for feature validating 5 hypotheses
- Does not jeopardize other MUST HAVE features

**Timeline Risk:**
- ⚠️ Could extend to 3-4 weeks if heavy UI customization required
- ✅ Mitigated by accepting getstream.io's default styling with light branding

**Assessment:** Fits within budget and timeline constraints. Strong ROI for 5-hypothesis coverage.

---

### 5. Polished Concierge Test ✅

**What Students SEE (Must Be Built):**
- ✅ In-platform community feed (professionally designed)
- ✅ Post creation interface
- ✅ Social interaction buttons (like, bookmark, reply, repost)
- ✅ Follow/unfollow functionality
- ✅ Personalized feed (AI-sorted)
- ✅ Notifications for interactions
- ✅ User profiles with feed activity

**What Happens Behind Scenes:**
- ⚠️ getstream.io handles infrastructure (NOT manual)
- ✅ Moderators review flagged content manually (Brian + 4-5 moderators)
- ✅ Brian can manually boost important posts (if needed)
- ✅ Community guidelines enforced manually initially

**Assessment:** This is "what students see" - must be built professionally. Community moderation can be manual (Polished Concierge applies to moderation, not the feed itself).

---

## Final Decision: MUST HAVE ✅

**Rationale:**

1. **Strongest Multi-Hypothesis Coverage:** Validates 5 of 6 hypotheses (H1, H3, H4, H5, H6), including Brian's top uncertainty (H6 - Flywheel)

2. **Enables Flywheel Mechanism:** Without in-platform community, Student-Teachers can't discover students at scale. This is HOW H6 gets validated.

3. **Multi-Creator Marketplace Glue:** With 4-5 creators, community is what creates "marketplace" feel vs isolated courses

4. **Right Scale for Community:** 75-100 people is perfect critical mass for vibrant community (not too small, not overwhelming)

5. **Reasonable Cost:** 2-3 weeks, $3,400-5,700 (4.5-7.6% of budget) for 5-hypothesis coverage = excellent ROI

6. **Smart Technology Choice:** getstream.io provides infrastructure (AI ranking, real-time, components) - Fraser integrates, doesn't build from scratch

7. **Differentiation:** Social community differentiates PeerLoop from traditional course platforms (Udemy = no peer community)

**This is infrastructure for the multi-creator marketplace, not a "nice to have" feature.**

---

## Implementation Notes

### Scope for Phase 1 (MVP)

**MUST HAVE:**
- getstream.io SDK integration
- User authentication integration
- Post creation (text, maybe images)
- Feed display (AI-sorted, personalized)
- Follow/unfollow (users, courses, creators)
- Like, bookmark, reply, repost buttons
- Notifications (new likes, comments, follows)
- Basic moderation tools (flag, delete, ban)
- Mobile-responsive feed UI

**NICE TO HAVE (if time allows):**
- Rich media posts (videos, links with previews)
- Polls in feed
- Advanced moderation dashboard
- Analytics (post reach, engagement metrics)
- Hashtags or topic tagging
- Direct messages (may use separate tool)

**OUT OF SCOPE (Phase 2):**
- Advanced AI customization (beyond getstream.io defaults)
- Live video streaming in feed
- Gamification (karma points, badges)
- Advanced content recommendations
- Multi-language support

### Technical Requirements for Fraser

**Before Dec 6 (Spec Finalization):**
1. Review getstream.io documentation and React SDK
2. Confirm 2-3 week timeline estimate
3. Identify any integration challenges with PeerLoop auth
4. Provide cost estimate
5. Recommend getstream.io tier (likely Growth tier)

**Integration Phase (during 4-month build):**
1. **Week 1:** Core setup
   - Set up getstream.io account
   - Integrate SDK with PeerLoop
   - Connect authentication system
   - Basic feed display
   - Post creation interface

2. **Week 2:** Social features
   - Follow/unfollow system
   - Like, bookmark, reply, repost functionality
   - User profiles in feed
   - Notifications system

3. **Week 3:** Moderation & polish
   - Moderator tools (flag, delete, ban users)
   - Testing across all user roles
   - Mobile responsiveness
   - UI polish and branding
   - Performance optimization

### User Roles & Permissions

**Students:**
- ✅ Create posts
- ✅ Like, bookmark, reply, repost
- ✅ Follow users, courses, creators
- ✅ Flag inappropriate content

**Student-Teachers:**
- ✅ All student permissions
- ✅ Post teaching tips and availability
- ✅ Build following/reputation

**Moderators:**
- ✅ All user permissions
- ✅ Delete posts
- ✅ Ban users (temp or permanent)
- ✅ Pin important posts
- ✅ See flagged content queue

**Creators:**
- ✅ All user permissions
- ✅ Post course announcements
- ✅ Pin posts to their course feed
- ✅ See analytics (if available)

**Brian (Admin):**
- ✅ Full moderation powers
- ✅ Override any moderation decision
- ✅ Access all analytics
- ✅ Manage moderator permissions

---

## Open Questions

### For Fraser Meeting (High Priority)

1. **Timeline Confirmation:** Can you complete integration in 2-3 weeks?
2. **getstream.io Tier:** Which pricing tier do we need for 75-100 active users?
3. **Authentication:** Any challenges integrating with PeerLoop's auth system?
4. **UI Customization:** How much custom styling vs default getstream.io components?
5. **Moderation Tools:** What's included vs what needs to be built?
6. **Mobile:** Does getstream.io SDK handle mobile web responsively?

### For Business/Product

7. **Content Policy:** What community guidelines? Who writes them?
8. **Moderation Workflow:** How do moderators get trained? Who trains them?
9. **Launch Strategy:** Seed content before students arrive? Or organic from day 1?
10. **Creator Onboarding:** Do creators need training on using the feed effectively?

### For Moderators

11. **Moderator Capacity:** Can 4-5 moderators handle 75-100 users? (Probably yes for MVP)
12. **Escalation Path:** When do moderators escalate to Brian?
13. **Response Time:** How quickly should moderators respond to flags?

---

## Success Metrics

### By Apr 1 Launch (MVP Ready)

- ✅ Community feed live and accessible
- ✅ All social features working (like, bookmark, reply, repost, follow)
- ✅ AI-sorted feed personalizing based on user activity
- ✅ Moderation tools functional
- ✅ Mobile-responsive
- ✅ Tested with 10-15 beta users

### By Jun 1 (Genesis Cohort Complete)

**Engagement Metrics:**
- ✅ 60%+ of students post at least once per week
- ✅ 40%+ of students engage daily (view feed)
- ✅ Average 3-5 posts per day per course (15-25 total posts/day)
- ✅ Student-Teachers actively recruiting via feed

**Hypothesis Validation:**
- ✅ H1: Students cite community as reason to enroll (qualitative)
- ✅ H3: Can identify Earn-While-Learn vs Premium via feed behavior
- ✅ H4: Students inspired by Student-Teacher posts (qualitative)
- ✅ H5: Student-Teachers share teaching tips and improve
- ✅ H6: At least 2-3 second-generation students found their Student-Teacher via feed

**Community Health:**
- ✅ <5% of posts flagged by moderators
- ✅ <1% of users banned or suspended
- ✅ Positive community sentiment (survey)
- ✅ Cross-course interactions (students engaging beyond their course)

---

## Risk Assessment

**Technical Risks:**
- 🟢 Low: getstream.io is mature, well-documented platform
- 🟡 Medium: Integration complexity with PeerLoop auth (need Fraser assessment)
- 🟢 Low: Timeline risk (2-3 weeks is achievable per research)

**Business Risks:**
- 🟡 Medium: Community doesn't take off (low engagement)
  - Mitigation: Seed content, creator participation, community guidelines
- 🟡 Medium: Moderation burden exceeds capacity
  - Mitigation: Start with 4-5 moderators, add more if needed
- 🟢 Low: Student adoption (students familiar with social feeds)

**Budget Risks:**
- 🟢 Low: Development cost overrun (getstream.io provides infrastructure)
- 🟢 Low: Service cost ($100-300/month manageable)

**Hypothesis Validation Risks:**
- 🟡 Medium: H6 not validated (Student-Teachers don't use feed to recruit)
  - Mitigation: Train Student-Teachers on using feed, incentivize posting
- 🟢 Low: Other hypotheses (H1, H3, H4, H5 have alternative validation methods)

---

## Next Steps

### Immediate (This Week)
1. ✅ Decision documented (this file)
2. ⏳ Create feature spec in `features/must-have/`
3. ⏳ Add to Fraser meeting prep agenda
4. ⏳ Define moderator role fully (separate document)

### Before Dec 6 (Spec Finalization)
5. Fraser reviews getstream.io and confirms timeline
6. Fraser provides cost estimate
7. Finalize getstream.io tier (likely Growth)
8. Write community guidelines draft
9. Design moderator training plan

### During Build (Dec 6 → Apr 1)
10. Fraser implements integration (weeks TBD)
11. Beta test with Brian + 5-10 users
12. Train moderators on tools
13. Seed initial content (creator posts, announcements)
14. Iterate based on feedback

---

## Related Decisions

**Depends On:**
- User authentication system (to identify users in feed)
- User profiles (to display in feed)
- Course/creator data (for follow system)

**Enables:**
- Student-Teacher recruitment (H6 validation)
- Cross-course discovery (marketplace dynamics)
- Community engagement (H1, H3, H4, H5 validation)
- Social proof (marketing funnel)

**New Features Needed (discovered):**
- Moderator role and permissions (not fully defined yet)
- Community guidelines and policies
- Moderator training and workflow

---

## Notes

**Key Insight:** This is the "social layer" that makes PeerLoop a MARKETPLACE, not just a course hosting platform. Without this, you have 4-5 separate courses. With this, you have a community-driven learning platform.

**Brian's Vision:** Integrated, in-platform community (not external Discord/Slack). This is critical for professional appearance and hypothesis validation.

**Technology Choice:** getstream.io is smart - provides AI ranking, infrastructure, components out-of-the-box. Fraser integrates, doesn't build feed from scratch. This makes 2-3 week timeline realistic.

**Scale Consideration:** 75-100 people is PERFECT for community dynamics. This wasn't viable at 30 people (old scope), but is critical at current scope.

**H6 (Flywheel) Enabler:** This is HOW Student-Teachers recruit students at scale. Without this, recruitment happens externally (WhatsApp, Instagram) - harder to measure and validate.

---

**Decision Status:** ✅ MUST HAVE (approved by Brian, pending Fraser technical confirmation)

**Documentation Complete:** 2025-11-25

**Next Review:** After Fraser provides getstream.io integration assessment

