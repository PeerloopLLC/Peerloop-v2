# Feature Spec: AI-Sorted Community Feed (getstream.io)

**Category:** MUST HAVE
**Priority:** Critical Infrastructure (Multi-Creator Marketplace)
**Status:** Approved (pending Fraser feasibility confirmation)
**Decision Log:** `mvp-decisions/2025-11-25-community-feed-getstream.md`

---

## Overview

Integrated social community feed connecting all platform users in a personalized, AI-sorted feed experience using getstream.io's infrastructure.

**Technology:** getstream.io (SaaS feed service)
**Deployment:** getstream.io hosted (cloud)
**Integration:** React SDK + API

---

## User Stories

### As a Student
- I can see a personalized feed of updates from people and courses I follow
- I can post questions, progress updates, and achievements
- I can like, bookmark, reply to, and repost content
- I can follow other students, Student-Teachers, creators, and courses
- I discover Student-Teachers and other courses through the feed
- I feel part of a learning community, not isolated

### As a Student-Teacher
- I can share teaching tips and success stories
- I can post my availability to attract new students
- I can build a following and reputation in the community
- I get advice from other Student-Teachers
- I recruit students through the feed (H6 validation!)
- I see what topics students are interested in

### As a Creator
- I can share course updates and announcements
- I can engage with students across cohorts
- I see cross-promotion opportunities with other creators
- I build community around my course
- I understand student needs through feed conversations

### As a Moderator
- I can monitor community content in my course
- I can flag, delete inappropriate posts
- I can ban or suspend users if needed
- I can pin important announcements
- I guide discussions to stay on-topic and supportive

### As Brian (Admin)
- I can see all community activity across courses
- I can track engagement metrics
- I can identify which features drive hypothesis validation
- I see Student-Teacher recruitment happening (H6!)
- I can intervene in moderation issues

---

## Core Requirements

### Feed Display & Personalization

**MUST HAVE:**
- AI-sorted feed (getstream.io's algorithms)
- Personalized based on follows and interests
- Real-time updates (new posts appear live)
- Infinite scroll or pagination
- Mobile-responsive feed design
- Empty state (when no content yet)
- Loading states

**NICE TO HAVE:**
- Filter feed by content type (questions, achievements, announcements)
- Toggle between "Following" and "Discover" feeds
- Save feed position when navigating away

### Post Creation

**MUST HAVE:**
- Text post creation (with character limit, e.g., 500 chars)
- Post to feed from any page
- Tag post type (question, update, achievement, announcement)
- @mention other users
- Post as student, Student-Teacher, creator, or moderator
- Edit own posts (short time window, e.g., 5 minutes)
- Delete own posts

**NICE TO HAVE:**
- Image upload in posts
- Link previews (auto-generate from URLs)
- Rich text formatting (bold, italic, lists)
- Draft posts (save before publishing)
- Schedule posts (for creators/moderators)

### Social Interactions

**MUST HAVE:**
- ❤️ Like/Heart button (toggle on/off)
- 🔖 Bookmark button (save for later viewing)
- 💬 Reply/Comment button (threaded comments)
- 🔄 Repost button (share to followers)
- View like count, reply count, repost count
- Notifications for interactions on your posts

**NICE TO HAVE:**
- Multiple reaction types (like, celebrate, helpful, insightful)
- Share post via direct link
- Quote repost (add commentary when reposting)
- Polls in posts

### Follow System

**MUST HAVE:**
- Follow/unfollow other users (students, Student-Teachers, creators, moderators)
- Follow courses (see updates from that course)
- Follow creators (see all their courses and posts)
- See follower/following counts on profiles
- View list of followers and following
- Unfollow functionality

**NICE TO HAVE:**
- Suggested users to follow (based on course, interests)
- Bulk follow (follow all students in your course)
- Follow notifications (get notified when someone follows you)
- Private accounts (must approve followers)

### Notifications

**MUST HAVE:**
- Notification bell icon (unread count)
- Notifications for: likes, comments, reposts, follows, mentions
- Mark as read/unread
- Click notification to go to post
- Clear all notifications

**NICE TO HAVE:**
- Email digest of notifications (daily/weekly)
- Push notifications (if mobile)
- Notification preferences (choose which types)
- Mute specific posts (stop getting notifications)

### Moderation Tools

**MUST HAVE:**
- Flag post button (for all users)
- Flagged posts queue (for moderators)
- Delete post button (moderators only)
- Ban user button (moderators only)
- Temp suspension (1 day, 7 days, 30 days)
- Permanent ban
- Moderator activity log

**NICE TO HAVE:**
- Auto-flag based on keywords
- Moderation dashboard with stats
- Appeal system for banned users
- Warning system (3 strikes before ban)
- Hide post (from feed but not delete)

---

## Technical Specifications

### getstream.io Integration

**SDK:** React SDK (Stream React)  
**Backend:** Node.js/Python SDK for server-side operations

**Key Components to Use:**
- `StreamApp` - Main wrapper
- `FlatFeed` - Feed display component
- `Activity` - Individual post component
- `LikeButton`, `CommentButton`, `RepostButton` - Interaction components
- `NotificationDropdown` - Notifications UI
- `StatusUpdateForm` - Post creation component

**API Endpoints:**
- `feeds.get()` - Retrieve feed
- `feeds.addActivity()` - Create post
- `reactions.add()` - Like, comment, repost
- `follow()` / `unfollow()` - Follow system
- `activities.delete()` - Delete post (moderation)

### Data Models

**Activity (Post):**
```javascript
{
  actor: "user:123",
  verb: "post",
  object: "post:456",
  content: "Just completed my first lesson!",
  type: "achievement",
  course_id: "course:789",
  time: "2025-04-01T12:00:00Z"
}
```

**Reaction (Like, Comment, Repost):**
```javascript
{
  kind: "like" | "comment" | "repost",
  activity_id: "post:456",
  user_id: "user:123",
  data: { text: "Great work!" } // for comments
}
```

**Follow Relationship:**
```javascript
{
  source: "user:123", // follower
  target: "user:456"  // followee
}
```

### Authentication Integration

**Requirements:**
- getstream.io tokens generated server-side
- Token includes: user_id, permissions, expiration
- Token passed to React client
- Client authenticates with getstream.io using token

**Security:**
- Users can only post as themselves
- Moderators get elevated permissions
- Admins get full permissions

### Performance

**getstream.io Specs:**
- Average API response time: ~9ms
- Real-time updates via websockets
- Scalable to millions of activities

**Optimization:**
- Lazy load images in feed
- Virtual scrolling for long feeds
- Cache user profiles locally
- Debounce like/unlike actions

---

## Design Requirements

### Feed UI

**Layout:**
- Left sidebar: Navigation, filters
- Center: Feed (main focus)
- Right sidebar: Suggested follows, trending topics (optional)

**Post Card:**
- User avatar + name
- Post timestamp (relative: "2 hours ago")
- Post content (text, image if applicable)
- Interaction buttons (like, bookmark, comment, repost)
- Interaction counts
- "View comments" if replies exist

**Feed Controls:**
- "New posts" button (when new content available)
- Pull to refresh (mobile)
- Jump to top button (after scrolling)

### Post Creation UI

**Composer:**
- Text area (auto-expand as typing)
- Character count (show remaining)
- Post type selector (question, update, achievement, announcement)
- @mention autocomplete
- Image upload button (optional)
- "Post" button (disabled until valid content)

**Location:**
- Fixed composer at top of feed
- Or "Create Post" button that opens modal

### Notification UI

**Bell Icon:**
- Red dot for unread notifications
- Number badge (unread count)
- Dropdown on click

**Notification List:**
- Avatar + name of actor
- Action description ("liked your post", "commented on your post")
- Post preview
- Timestamp
- Unread indicator (bold text or blue dot)

### Mobile Responsiveness

**Breakpoints:**
- Desktop: 3-column layout
- Tablet: 2-column (hide right sidebar)
- Mobile: Single column, full-width feed

**Touch Interactions:**
- Swipe to go back
- Pull to refresh
- Double-tap to like (optional)
- Long-press for context menu

---

## Success Criteria

### Phase 1 (MVP Launch - Apr 1)
- ✅ 100% of users can access feed
- ✅ Post creation works flawlessly
- ✅ All social interactions functional (like, bookmark, comment, repost)
- ✅ Follow system working
- ✅ Notifications delivered in real-time
- ✅ Moderators can flag/delete posts
- ✅ Feed personalizes based on follows
- ✅ Mobile-responsive

### Genesis Cohort (Apr 1 → Jun 1)
- ✅ 60%+ students post at least weekly
- ✅ 40%+ students view feed daily
- ✅ 15-25 posts per day across platform
- ✅ Student-Teachers actively posting and recruiting
- ✅ Cross-course engagement (students interacting beyond their course)
- ✅ <5% posts flagged
- ✅ <1% users banned
- ✅ Positive community sentiment (survey)

### Hypothesis Validation
- ✅ H1: Students cite community as enrollment reason
- ✅ H3: Can identify user segments via feed behavior
- ✅ H4: Students inspired by Student-Teacher posts
- ✅ H5: Student-Teachers share teaching tips
- ✅ H6: 2-3 students found Student-Teacher via feed (second generation!)

---

## Cost Estimate

### Development (One-Time)
- Fraser integration work: **2-3 weeks**
- Estimated cost: **$3,000-4,500**

### Service Costs (Ongoing)
- getstream.io Growth tier: **$100-300/month**
- Image storage (if needed): **$10-20/month**

**Phase 1 Total (4 months):** ~$3,400-5,700  
**Percentage of $75K budget:** 4.5-7.6%

**Annual (if scaling):** getstream.io costs scale with usage, but open-source alternatives exist for Phase 2+ if needed

---

## Timeline

**Before Dec 6 (Spec Finalization):**
- Fraser reviews getstream.io documentation
- Fraser confirms 2-3 week estimate
- Finalize getstream.io tier

**Week 1-2 of Build:**
- Set up getstream.io account
- Integrate SDK with PeerLoop
- Basic feed display
- Post creation interface
- Authentication integration

**Week 3-4:**
- Social interactions (like, bookmark, reply, repost)
- Follow/unfollow system
- User profiles in feed
- Notifications

**Week 5:**
- Moderation tools
- Testing across all user roles
- Mobile responsiveness
- UI polish and branding

**Before Launch:**
- Beta test with 10-15 users
- Train moderators
- Write community guidelines
- Seed initial content

---

## Dependencies

**Requires:**
- User authentication system
- User profiles (name, avatar, role)
- Course data (for following courses)
- Creator profiles

**Enables:**
- Student-Teacher recruitment (H6!)
- Cross-course discovery
- Community engagement
- Social proof for marketing

---

## Risks & Mitigation

**Risk:** Community doesn't take off (low engagement)  
**Mitigation:** Seed content from creators, train Student-Teachers on posting, gamification (future)

**Risk:** Moderation burden too high  
**Mitigation:** 4-5 moderators, clear guidelines, auto-flagging (future), escalation path to Brian

**Risk:** Timeline extends beyond 3 weeks  
**Mitigation:** Accept getstream.io default UI with minimal customization, cut NICE TO HAVE features

**Risk:** getstream.io costs escalate  
**Mitigation:** Monitor usage, choose appropriate tier, open-source alternatives exist for Phase 2+

---

## Open Questions

1. **UI Customization:** How much custom design vs getstream.io defaults?
2. **Content Policy:** What are community guidelines? Who writes them?
3. **Moderator Training:** How do we train 4-5 moderators?
4. **Launch Strategy:** Seed content or organic from day 1?
5. **Direct Messages:** In feed or separate feature?
6. **Rich Media:** Support images in MVP or defer to Phase 2?

---

## Notes

**Critical Success Factor:** This is HOW the multi-creator marketplace feels like a community, not just isolated courses.

**H6 Enabler:** Student-Teachers recruit via feed. Without this, H6 validation is much harder.

**Scale Consideration:** 75-100 people is perfect for community dynamics. Below 50 = feels empty. Above 150 = overwhelming.

**Technology Choice:** getstream.io handles hard parts (AI ranking, infrastructure, real-time). Fraser integrates, doesn't build from scratch. This makes 2-3 weeks realistic.

---

**Status:** ✅ Approved as MUST HAVE

**Next Steps:**
1. Add to Fraser meeting agenda
2. Get Fraser's technical assessment
3. Define moderator role fully
4. Write community guidelines
5. Begin implementation after spec finalized

---

**Last Updated:** 2025-11-25

