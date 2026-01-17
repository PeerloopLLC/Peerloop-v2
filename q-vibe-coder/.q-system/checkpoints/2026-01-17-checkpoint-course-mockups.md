# Checkpoint: Course Card & Detail View Mockups
**Date:** 2026-01-17
**Participant:** Jesse

---

## Session Summary

Designed and iterated on HTML mockups for enhanced course summary cards and detail views in PeerLoop.

---

## Key Decisions Made

### Summary Card (Discover Page) - Final Design:
- **Layout:** Thumbnail square on left, title + description next to it, Enroll button on right
- **Stats line below (full width):** `★ 4.8 (234) • 1,250 students • 5 Modules • 12 hours`
- **Benefits line below stats (horizontal flow):**
  - `• Full curriculum • 1-on-1 sessions with Student-Teacher • Access to AI Prompters Community • Certificate`
- **Styling:** Same font size (14px) and brightness (#e7e9ea) as rest of card text

### Detail View (Course Page) - Final Design:
- **Removed:** "About This Course" heading (redundant)
- **Stats line under title:** `★ 4.8 (234) • 1,250 students • 5 Modules • 12 Lessons • 12 hours`
- **Description:** Flows naturally under stats (no heading)
- **What's Included section:** Horizontal flow (not vertical list)
  - `• Full curriculum • 1-on-1 sessions with Student-Teacher • Access to AI Prompters Community • Certificate`
- **Styling:** Same font size (15px) and brightness (#e7e9ea) as description
- **Tabs:** Moved below the key info section

### Content Order for Benefits:
1. Full curriculum
2. 1-on-1 sessions with Student-Teacher
3. Access to AI Prompters Community
4. Certificate

### Removed from Stats Line (to avoid duplication):
- $450 (already in Enroll button)
- 1-on-1 Teaching (already in benefits as "1-on-1 sessions with Student-Teacher")

---

## Files Created/Modified

### Created:
- `my-project/mockups/course-card-mockup.html` - Final HTML mockup with both designs

### To Be Modified (Implementation):
- `my-project/code/src/components/DiscoverView.js` - Summary card changes
- `my-project/code/src/components/CourseDetailView.js` - Detail view changes

---

## Current Status

**Phase:** Mockup Complete - Ready for Implementation

**Next Steps:**
1. Implement summary card changes in DiscoverView.js
2. Implement detail view changes in CourseDetailView.js
3. Test in browser
4. Commit changes

---

## Wireframe Reference

### Summary Card:
```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────┐  AI Prompting Mastery                                                 [Enroll $450]│
│  │      │  Learn to write effective AI prompts for business use. Master the art of           │
│  │      │  communicating with AI to boost your productivity.                                 │
│  └──────┘                                                                                    │
│                                                                                              │
│  ★ 4.8 (234) • 1,250 students • 5 Modules • 12 hours                                         │
│  • Full curriculum  • 1-on-1 sessions with Student-Teacher  • Access to AI Prompters Community  • Certificate │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Detail View Header:
```
AI Prompting Mastery                                    [Enroll for $450]
Guy Rymberg

★ 4.8 (234) • 1,250 students • 5 Modules • 12 Lessons • 12 hours

[Description text...]

WHAT'S INCLUDED
• Full curriculum  • 1-on-1 sessions with Student-Teacher  • Access to AI Prompters Community  • Certificate

[Overview] [Course Feed] [Curriculum] [Reviews]
```

---

## Notes

- Mockup file viewable at: http://localhost:3333/course-card-mockup.html (when serve is running)
- Benefits use bullet points (•) not checkmarks
- Horizontal flow uses CSS flexbox with wrap
