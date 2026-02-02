# Checkpoint: Homework Submission Backend Implementation

**Date:** 2026-02-01
**Participant:** Guy

---

## Summary

Implemented the backend for homework submissions including Supabase service, storage policies, and database table. The frontend UI was already created in a previous session.

---

## Key Accomplishments

1. **Created homeworkFiles.js Service** - Full Supabase service for homework file operations
2. **Updated CourseDetailView.js** - Added state, handlers, and UI for homework uploads
3. **Created Storage Policies** - RLS policies for homework-files bucket (SELECT, INSERT, DELETE)
4. **Prepared Database Table SQL** - homework_submissions table with RLS policies

---

## Files Created

### my-project/code/src/services/homeworkFiles.js (NEW FILE)
Complete service with functions:
- `uploadHomework(file, studentId, studentName, courseId, sessionNumber)` - Upload to storage + save metadata
- `getStudentHomework(studentId, courseId, sessionNumber)` - Get student's submission
- `getCourseHomework(courseId)` - Get all submissions for a course
- `getSessionHomework(courseId, sessionNumber)` - Get submissions for a session
- `updateHomeworkStatus(submissionId, status, feedback, reviewerName)` - For creator review
- `replaceHomework(...)` - Delete old + upload new
- `deleteHomework(submissionId, filePath)` - Remove submission
- `formatFileSize(bytes)` - Utility function

Uses Supabase storage bucket: `homework-files`
Uses Supabase database table: `homework_submissions`

---

## Files Changed

### my-project/code/src/components/CourseDetailView.js

**Added import:**
```javascript
import { uploadHomework, getStudentHomework, replaceHomework, formatFileSize as formatHomeworkSize } from '../services/homeworkFiles';
```

**Added state (around line 30):**
```javascript
const [homeworkSubmissions, setHomeworkSubmissions] = useState({});
const [isUploadingHomework, setIsUploadingHomework] = useState(false);
const homeworkInputRef = useRef(null);
```

**Added useEffect to load homework (after line 72):**
```javascript
useEffect(() => {
  const loadHomework = async () => {
    if (!course?.id || !currentUser?.id || !isEnrolled || isCreator) return;
    const sessionsWithHomework = course.sessions?.filter(s => s.allowHomework) || [];
    const submissions = {};
    for (const session of sessionsWithHomework) {
      const { data, error } = await getStudentHomework(currentUser.id, course.id, session.number);
      if (!error && data) submissions[session.number] = data;
    }
    setHomeworkSubmissions(submissions);
  };
  loadHomework();
}, [course?.id, currentUser?.id, isEnrolled, isCreator, course?.sessions]);
```

**Added handleHomeworkUpload function:**
```javascript
const handleHomeworkUpload = async (sessionNumber, file) => {
  if (!file || !currentUser?.id) return;
  setIsUploadingHomework(true);
  // ... upload logic with replace support
  setIsUploadingHomework(false);
};
```

**Replaced homework section UI (around line 910):**
- Hidden file input with onChange handler
- Two states: "Not submitted" (dashed border, blue upload button) and "Submitted" (green border, file info, Replace button)
- Shows filename, size, submission date when submitted
- Loading spinner during upload

---

## Supabase Configuration Done

### Storage Bucket: homework-files
Created with RLS policies:
- `homework-files-read` (SELECT) - public
- `homework-files-upload` (INSERT) - public
- `homework-files-delete` (DELETE) - public

### Database Table: homework_submissions
SQL provided but NOT YET RUN:
```sql
CREATE TABLE homework_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_id TEXT NOT NULL,
  session_number INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT DEFAULT 'document',
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'submitted',
  feedback TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_homework_student_course ON homework_submissions(student_id, course_id);
CREATE INDEX idx_homework_course_session ON homework_submissions(course_id, session_number);

ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read homework" ON homework_submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can submit homework" ON homework_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update homework" ON homework_submissions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete homework" ON homework_submissions FOR DELETE USING (true);
```

---

## Still To Do

1. **Run the SQL** - User needs to paste SQL into Supabase SQL Editor and run it
2. **Test the upload flow** - Log in as Sarah, go to AI Tools Overview, Session 1, click Upload Homework
3. **Workspace views** - Where creators/student-teachers see submitted homework (deferred to later)

---

## Previous Session Context

From checkpoint `2026-02-01-checkpoint-homework-feature.md`:
- Added `allowHomework` toggle to CourseBuilder.js
- Added `allowHomework` field to session data structure
- Updated database.js to save `allowHomework` in sessions list
- Added homework section UI in CourseDetailView (visible when enabled + enrolled + not creator)

---

## App Status

- Dev server running at http://localhost:3000/Peerloop-v2
- App compiling successfully
- Supabase browser tab open at SQL Editor
