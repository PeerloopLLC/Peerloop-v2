# Checkpoint: Lesson-Level Homework Upload Implementation

**Date:** 2026-02-01
**Participant:** Guy

---

## Summary

Moved homework upload feature from session-level to lesson-level. Creators can now enable homework uploads on individual lessons in Course Builder, and students see upload sections only under specific lessons that have it enabled.

---

## Key Accomplishments

1. **Course Builder** - Moved "Allow Homework Upload" toggle from Session Details to Lesson Details
2. **Database** - `allowHomework` now saved per curriculum item (lesson) instead of per session
3. **Student View** - Homework upload section now appears under each lesson with `allowHomework: true`
4. **Supabase** - Added `lesson_index` column to `homework_submissions` table

---

## Files Changed

### my-project/code/src/components/CourseBuilder.js
- Added homework toggle to Lesson Details section (after Lesson Files)
- Removed session-level homework toggle from Session Details
- Toggle uses `updateLesson(selectedSession, selectedLesson, 'allowHomework', e.target.checked)`

### my-project/code/src/data/database.js
- Changed `convertBuilderToDbFormat()` to save `allowHomework` on curriculum items:
```javascript
curriculum.push({
  session: sessionIdx + 1,
  module: moduleNum++,
  title: lesson.name,
  duration: lesson.duration || '30 min',
  description: lesson.description || '',
  allowHomework: lesson.allowHomework || false  // NEW
});
```
- Removed `allowHomework` from sessions list

### my-project/code/src/components/CourseDetailView.js
- Updated useEffect to load homework by `${sessionNumber}_${lessonIndex}` key
- Updated `handleHomeworkUpload` to accept `lessonIndex` parameter
- Changed homework section from session-level to lesson-level in the curriculum render:
  - Now uses `React.Fragment` to wrap module + homework section
  - Homework section appears directly after each lesson with `allowHomework: true`
  - Uses amber/gold color scheme (#ca8a04) to differentiate from course materials

### my-project/code/src/services/homeworkFiles.js
- Added `lessonIndex` parameter to:
  - `uploadHomework(file, studentId, studentName, courseId, sessionNumber, lessonIndex)`
  - `getStudentHomework(studentId, courseId, sessionNumber, lessonIndex)`
  - `replaceHomework(..., lessonIndex)`
- Updated file path to include lesson: `${courseId}/session-${sessionNumber}/lesson-${lessonIndex}/${studentId}/...`
- Database insert now includes `lesson_index` field

---

## SQL Run in Supabase

```sql
-- Add lesson_index column to homework_submissions
ALTER TABLE homework_submissions ADD COLUMN lesson_index INTEGER DEFAULT 0;

-- Update index to include lesson_index
DROP INDEX IF EXISTS idx_homework_student_course;
CREATE INDEX idx_homework_student_course_lesson ON homework_submissions(student_id, course_id, session_number, lesson_index);
```

---

## Bug Fixed

Fixed `course.sessions.filter is not a function` error by changing:
- `course.sessions?.filter(...)` to `course.sessions?.list?.filter(...)`

---

## Wireframe Created

- `my-project/wireframes/lesson-homework-toggle.html` - Shows the lesson-level homework design

---

## Testing Performed

1. **As Guy (Creator):**
   - Workspace → Content → Edit AI Tools Overview → Curriculum
   - Clicked on "What is AI and Why It Matters" lesson
   - Saw "Allow Homework Upload" toggle in Lesson Details
   - Enabled toggle, saved draft

2. **As Sarah (Student):**
   - My Courses → AI Tools Overview
   - Session 1 → "What is AI and Why It Matters" shows homework upload section
   - Session 1 → "The AI Landscape" does NOT show homework (not enabled)
   - Previous test submission still visible under correct lesson

---

## Data Structure

### Before (Session Level)
```javascript
sessions: [
  { number: 1, allowHomework: true, modules: [1, 2] }
]
curriculum: [
  { session: 1, module: 1, title: "What is AI" }
]
```

### After (Lesson Level)
```javascript
sessions: [
  { number: 1, modules: [1, 2] }  // No allowHomework
]
curriculum: [
  { session: 1, module: 1, title: "What is AI", allowHomework: true },
  { session: 1, module: 2, title: "AI Landscape", allowHomework: false }
]
```

---

## App Status

- Dev server running at http://localhost:3000/Peerloop-v2
- App compiling successfully
- All homework features working at lesson level
