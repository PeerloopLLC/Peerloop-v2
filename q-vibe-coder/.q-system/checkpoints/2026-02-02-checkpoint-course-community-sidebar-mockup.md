# Checkpoint: Course-Community Sidebar Mockup Research

**Date:** 2026-02-02
**Participant:** Guy

---

## Summary

User asked to find old course listing layout where course and community were shown side-by-side in one card. After extensive git history search, found the original layout in `MyCoursesView.js` before commit `9341a38d` (Jan 11, 2026).

---

## Key Accomplishments

1. **Found the old layout** - Course card with community sidebar on the right (280px)
2. **Created HTML mockup** - `mockup-course-community-sidebar.html` recreating the layout
3. **Documented the structure**:
   - Left side: Course info (status badge, title, instructor, description, rating, students, progress bar, Continue button)
   - Right side: "About the Community" (bio quote, creator avatar, name, title, View Profile button)

---

## Files Created

- `my-project/code/public/mockup-course-community-sidebar.html` - Full mockup with light/dark modes

---

## Key Findings

### Original Layout Structure (from git history)
```javascript
// Card container
display: 'flex',
flexDirection: 'row'

// Right column (community sidebar)
width: 280,
flexShrink: 0,
background: isDarkMode ? '#1f2937' : '#f9fafb',
borderLeft: '1px solid #e5e7eb'
```

### When It Was Removed
- Commit `9341a38d` (Jan 11, 2026) - "UI improvements: flyout behavior, navigation, Enroll buttons"
- MyCoursesView was refactored to group courses by instructor instead

---

## Other Mockups Found During Search

1. `wireframe-split.html` - Two-column layout: Course content LEFT, Community feed RIGHT
2. `wireframe-courses-nested.html` - 5 options for courses nested inside community cards
3. `wireframe-community-separation.html` - 5 options for separating community from course cards
4. `mockup-discover-card.html` (v1, v2, v3) - Community header on top, course below

---

## Next Actions

- [ ] Review mockup and decide if this layout should be restored
- [ ] Determine which view(s) should use this layout (My Courses, Discover, etc.)

---

## Technical Notes

- Dev server running on localhost:3000
- App is functional, browser open to login screen
- 1 commit ahead of GitHub (ready to push)
