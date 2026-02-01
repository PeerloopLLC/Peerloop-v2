# Checkpoint: Course Files & Preview Implementation Complete

**Date:** 2026-01-31
**Session:** Course Builder - Files Linking & Preview Implementation

---

## Summary

Implemented the approved plan for course-specific file uploads and preview functionality. Removed the global file upload section and moved it inside expandable course rows. Added Preview button with full course preview modal.

---

## Key Accomplishments

### 1. Database Changes (database.js)
- Added `sessionFiles: []` field to `convertBuilderToDbFormat()` function
- Created `updateCourseSessionFiles(courseId, sessionFiles)` function for updating files
- Files now persist to localStorage as part of course objects

### 2. Expandable Course Rows (CreatorDashboard.js)
- Added `selectedCourse` state for tracking expanded course
- Added `previewCourse` state for preview modal
- Course rows now clickable to expand/collapse
- Shows ▶/▼ arrow indicator for expand state
- Displays file count in row subtitle (e.g., "$149 • 0 files")

### 3. Course-Specific File Upload
- Removed old "SESSION PRESENTATION FILES" section from top of Content tab
- File upload now appears INSIDE expanded course row
- `handleFileUpload()` updated to save to `selectedCourse.sessionFiles`
- `handleDeleteFile()` updated to remove from course's files
- Files linked to specific course via `updateCourseSessionFiles()`

### 4. Preview Modal
- Added Preview button next to Edit button
- Modal shows read-only course view:
  - Title, price (large green), level, duration
  - Status badge (Published/Draft)
  - Description
  - Learning Objectives (bullet list)
  - Curriculum (lessons with duration)
  - Session Files (if any)
  - Tags
- Footer has Close and "Edit Course" buttons
- Click outside or X to close

---

## Files Changed

**database.js:**
- Line ~1522: Added `sessionFiles: builderData.sessionFiles || []`
- Lines 1570-1583: Added `updateCourseSessionFiles()` function

**CreatorDashboard.js:**
- Line 14: Added `updateCourseSessionFiles` to imports
- Line 35-36: Added `selectedCourse` and `previewCourse` state
- Lines 358-417: Updated `handleFileUpload()` to save to course
- Lines 419-445: Updated `handleDeleteFile()` to remove from course
- Lines 521-726: REMOVED old SESSION PRESENTATION FILES section
- Lines 762-900+: Replaced course rows with expandable version
- Lines 2682-2880+: Added Course Preview Modal

---

## Current State

**MY COURSES (5 courses in localStorage):**
1. AI Tools Overview - $149 - Published (ID 28)
2. AI Tools Overview - $249 - Published (ID 29)
3. Intro to Claude Code - $249 - Published (ID 30)
4. Intro to n8n - $249 - Published (ID 31)
5. Vibe Coding 101 - $249 - Published (ID 32)

**All features working:**
- Click course row → expands with file upload area
- Upload files → saves to that course's sessionFiles
- Preview button → opens modal with full course details
- Edit button → opens CourseBuilder with course data

---

## Data Storage

**Current:** localStorage (`peerloop_creator_courses`)
- Clears if browser data cleared

**Future Plan:** Supabase Database
- Create `courses` table with JSONB columns for arrays
- Replace localStorage functions with Supabase API calls
- See implementation summary below

---

## Supabase Database Plan (Next Session)

### SQL to Create Table:
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  level TEXT,
  duration TEXT,
  status TEXT DEFAULT 'draft',
  instructor_id INTEGER,
  category TEXT,
  tags JSONB DEFAULT '[]',
  curriculum JSONB DEFAULT '[]',
  learning_objectives JSONB DEFAULT '[]',
  sessions JSONB DEFAULT '{}',
  session_files JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON courses FOR ALL USING (true);
```

### Functions to Add to database.js:
- `loadCoursesFromSupabase()` - SELECT with instructor_id filter
- `addCourseToSupabase(courseData)` - INSERT
- `updateCourseInSupabase(id, courseData)` - UPDATE
- `deleteCourseFromSupabase(id)` - DELETE

### Supabase Credentials (already in code):
- URL: `https://vnleonyfgwkfpvprpbqa.supabase.co`
- Anon Key: In CreatorDashboard.js line 18-21

---

## Access Path

Workspace → Content → MY COURSES section
- Click row to expand → see file upload
- Click Preview → see course details modal
- Click Edit → open CourseBuilder

---

## Dev Server

Running in background (task be19638)
URL: http://localhost:3000/Peerloop-v2
Status: Compiling successfully

---

## Next Session Prompt

```
Continue from checkpoint-12. Implement Supabase database storage for courses:
1. Create courses table in Supabase using the SQL from the checkpoint
2. Update database.js to use Supabase instead of localStorage
3. Add loading states to CreatorDashboard while fetching courses
Use existing Supabase credentials already in the code.
```
