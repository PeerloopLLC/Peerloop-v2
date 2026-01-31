# Checkpoint: Hover Card Popups

**Date:** 2026-01-31
**Participant:** Guy

---

## Summary

Implemented X.com-style hover card popups for usernames, community titles, and course titles throughout the app.

---

## Key Accomplishments

1. **UserHoverCard Component** - For post author names in feeds
   - Shows: avatar, name, handle, bio, Follow button, Message button, follower/following stats
   - 300ms delay before showing, stays visible when hovering over card
   - Integrated into Community.js for post cards

2. **CommunityHoverCard Component** - For community titles on Discover page
   - Shows: community icon, name, handle, creator name, bio, Follow Community button, follower/course counts
   - Integrated into DiscoverView.js (compact, thirdtry, and standard formats)

3. **CourseHoverCard Component** - For course titles on Discover page
   - Shows: course icon with abbreviation, title, instructor, description, rating/students/duration stats, Enroll button
   - Green "Enroll Free" or "Enroll $X" button
   - Shows "Continue Learning" for enrolled courses
   - Integrated into DiscoverView.js (all formats)

---

## Files Created

| File | Purpose |
|------|---------|
| `src/components/UserHoverCard.js` | User hover popup component |
| `src/components/UserHoverCard.css` | Shared CSS for all hover cards |
| `src/components/CommunityHoverCard.js` | Community hover popup component |
| `src/components/CourseHoverCard.js` | Course hover popup component |

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/Community.js` | Added UserHoverCard import, wrapped post author names |
| `src/components/PostCard.js` | Added UserHoverCard import and props (onFollowUser, onMessageUser, etc.) |
| `src/components/DiscoverView.js` | Added CommunityHoverCard and CourseHoverCard imports, wrapped community and course titles in compact, thirdtry, and standard formats |

---

## Technical Notes

- All hover cards use fixed positioning with viewport boundary detection
- Cards appear below trigger element, or above if insufficient space below
- Shared CSS in UserHoverCard.css supports dark mode
- Callbacks provided for Follow, Message, Enroll, and View Profile actions
- Current user ID passed to prevent showing hover card on own profile

---

## Next Actions

- [ ] Add hover cards to BrowseView if needed
- [ ] Add hover cards to MyCoursesView if needed
- [ ] Wire up Follow/Message buttons to actual functionality
- [ ] Consider adding hover cards to ActivityFeed actor names
