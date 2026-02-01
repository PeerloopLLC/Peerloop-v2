# Checkpoint: Course Files & Preview Plan

**Date:** 2026-01-31
**Session:** Course Builder - Files Linking & Preview Planning

---

## Summary

Removed 4 static draft courses from database.js, then recreated them as user-created courses in localStorage. Analyzed the file upload system and created a detailed plan for linking files to courses and adding preview functionality.

---

## Key Accomplishments

### 1. Removed Static Draft Courses from database.js
- Deleted courses with IDs 22-25 (AI Tools Overview, Intro to Claude Code, Intro to n8n, Vibe Coding 101)
- These were placeholder courses at $249 that weren't linked to the Course Builder system
- Updated Guy Rymberg's instructor record: `courses: []`

### 2. Recreated Courses as User-Created
Added 4 courses to localStorage via browser JavaScript:
- **AI Tools Overview** ($249) - ID 29
- **Intro to Claude Code** ($249) - ID 30
- **Intro to n8n** ($249) - ID 31
- **Vibe Coding 101** ($249) - ID 32

All courses:
- Have full curriculum, learning objectives, session structure
- Marked as `isCreatorCourse: true`
- Status: `published`
- instructorId: 8 (Guy Rymberg)

### 3. Fixed Module Initialization
- Added console.log to database.js to force webpack rebuild
- Courses now load properly from localStorage on page refresh

### 4. Analyzed File Upload System
Current implementation:
- Files upload to Supabase Storage (bucket: `session-files`)
- Upload endpoint: `https://vnleonyfgwkfpvprpbqa.supabase.co/functions/v1/upload-session-file`
- Files stored in component state only - NOT linked to courses
- Supports PDF and PowerPoint, max 30MB

### 5. Created Implementation Plan
User approved plan for:
- **Option A**: Course-specific file upload (move upload INTO each course)
- **Preview button**: Add next to Edit, opens modal with student view
- **NOT implementing** Course Modules section changes (skip for now)

---

## Files Changed

**Modified:**
- `src/data/database.js`:
  - Removed courses 22-25 (static placeholder courses)
  - Updated Guy Rymberg courses array to `[]`
  - Added console.log for module initialization debugging

**No new files created this session**

---

## Current State

**MY COURSES list (5 courses):**
1. AI Tools Overview - $149 - Published (ID 28, original user-created)
2. AI Tools Overview - $249 - Published (ID 29, recreated)
3. Intro to Claude Code - $249 - Published (ID 30, recreated)
4. Intro to n8n - $249 - Published (ID 31, recreated)
5. Vibe Coding 101 - $249 - Published (ID 32, recreated)

All stored in localStorage key: `peerloop_creator_courses`

---

## Implementation Plan (Approved)

### 1. Course-Specific File Upload (Option A)
- Move file upload from top of Content tab INTO each course
- Click course row → expands to show that course's files + upload area
- Files linked to specific course via `sessionFiles` array

### 2. Add Preview Button
- Add "Preview" button next to "Edit" in each course row
- Opens modal showing read-only course view
- Shows: title, description, curriculum, objectives, price, files

### Data Structure Change
```javascript
// Add to each course object:
sessionFiles: [
  {
    name: "presentation.pdf",
    filename: "hash-123.pdf",
    url: "https://...",
    isPrimary: true,
    uploadedAt: "2025-01-31T..."
  }
]
```

### Files to Modify
1. **database.js** - Add sessionFiles to course structure, update convertBuilderToDbFormat()
2. **CreatorDashboard.js** - Add selectedCourse state, make rows clickable, move file upload into expanded course, add Preview button

### NOT Implementing (Skip for now)
- Course Modules section changes
- BigBlueButton integration changes

---

## Technical Details

### File Upload Flow (Current)
```
1. User selects file via <input type="file">
2. Validation: file type + size (30MB max)
3. POST to Supabase edge function
4. Response: { name, filename, url }
5. Added to sessionFiles state
```

### Course Storage
- Runtime: `coursesDatabase` array in database.js
- Persistence: `peerloop_creator_courses` in localStorage
- Loaded on module init via `loadCreatorCourses()`

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Recreate courses in localStorage | Makes them editable via CourseBuilder |
| Option A (per-course upload) | Clearer UX, files obviously belong to course |
| Skip Course Modules section | User decision, focus on files + preview first |
| Keep duplicate AI Tools Overview | User can delete manually if desired |

---

## Next Actions

- [ ] Update course data structure with sessionFiles field
- [ ] Add selectedCourse state for expandable rows
- [ ] Make course rows clickable to expand/collapse
- [ ] Move file upload UI into expanded course section
- [ ] Link file upload to save to course.sessionFiles
- [ ] Add Preview button next to Edit
- [ ] Create CoursePreviewModal component

---

## Access Path

Workspace → Content → MY COURSES section

---

## Dev Server Status

Running in background (task be19638)
URL: http://localhost:3000/Peerloop-v2
Compiling successfully
