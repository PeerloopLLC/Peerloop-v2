# Session Checkpoint - December 17, 2025

## Session Focus
Community layout redesign - moving creator profiles from horizontal top bar to left sidebar, with feed switching between Town Hall and purchased courses.

## Key Decisions Made

1. **Creators moved to sidebar** - Profile avatars now in left sidebar under nav menu (like Learning Commons mockup)

2. **Town Hall always first** - In the "Your Creators" list, Town Hall is always at the top, followed by individual creators

3. **Feed switcher tabs** - When clicking a creator profile:
   - Profile card shows at top
   - Tab bar appears below: Town Hall | Course 1 | Course 2 (locked) | etc.
   - Town Hall = free for followers
   - Courses = only if purchased (locked ones show 🔒)

4. **The Commons** - Global aggregated AI-curated feed from all communities

5. **PeerLoop is 1-on-1 focused**:
   - NOT one-to-many broadcast
   - Sessions are scheduled with curriculum structure
   - Last-minute scheduling only for paid courses
   - Goodwill points earned in feeds (helping peers), not sessions
   - AI-powered algorithmic feeds surface most relevant content

## Mockups Created

| File | Description |
|------|-------------|
| `mockup-community-sidebar-creators.html` | V1: Creators in sidebar, no feed switcher |
| `mockup-community-sidebar-v2.html` | V2: Added Town Hall at top, profile card changes on click |
| `mockup-community-v3.html` | V3: Full implementation with feed switcher tabs, locked courses, goodwill points |

## mockup-community-v3.html Structure

**Left Sidebar:**
- Nav menu (Community, Browse, Dashboard, Messages, Profile)
- "Your Creators" section:
  - The Commons (aggregated feed)
  - Creator profiles (Einstein, Jane, Maria, etc.)

**Center - Main Content:**
- Profile card (changes based on selected creator)
- Feed switcher tabs (Town Hall + purchased courses, locked courses grayed with 🔒)
- Post composer
- Feed posts (questions, helpful answers, wins, scheduling)

**Right Sidebar:**
- Your Goodwill (1,240 points, +35 today)
- Your Sessions (upcoming scheduled sessions)
- Your Progress (course progress bars)

## Feed Content Types
- ❓ Question - Peer asking for help (+goodwill to answer)
- ✅ Helpful - Peer helping peer (earns goodwill)
- 🎉 Win - Celebrating progress
- 📅 Available - Student-Teacher offering session slots
- 🏛️ Town Hall - General discussions

## Open Question
Should creators sidebar stay visible on ALL pages (Browse, Dashboard, etc.) or only on Community page?

User asked about "collapsing" sidebar - was about to show expanded/collapsed state when interrupted.

## Files Changed This Session
- Created: `public/mockup-community-sidebar-creators.html`
- Created: `public/mockup-community-sidebar-v2.html`
- Created: `public/mockup-community-v3.html`

## Next Steps
1. Clarify sidebar behavior on non-Community pages (collapse vs hide)
2. Potentially update mockup to show collapsed state
3. When ready, implement changes in actual React code
