# Checkpoint: 2026-01-31 - Supabase File Upload Integration

**Session started:** Continuation from checkpoint 5
**Checkpoint time:** 2026-01-31
**Participant:** Guy

---

## Accomplishments This Session

### 1. Implemented "Add File" Feature with localStorage (Initial Version)
- Created modal UI for adding files to course modules
- Added state management for file upload modal
- Files stored in localStorage by courseId
- Modal includes: file name, type selector, URL field
- Files display with icons and delete button

### 2. Upgraded to Supabase Storage
User requested storing files in Supabase instead of localStorage.

**Created new service file:** `src/services/courseFiles.js`
- `uploadCourseFile()` - uploads actual file to Supabase Storage + saves metadata
- `addCourseFileLink()` - saves external link metadata only (no upload)
- `getCourseFiles()` - fetches all files for a course
- `getModuleFiles()` - fetches files for specific module
- `deleteCourseFile()` - deletes from storage and database
- `formatFileSize()` - utility for display

**Created migration file:** `supabase/migrations/001_create_course_files.sql`
- `course_files` table with columns: id, course_id, module_index, file_name, file_type, file_path, file_url, file_size, uploaded_by, created_at
- RLS enabled with public access policy
- Storage policy for `course-files` bucket

### 3. Updated CourseDetailView Component
- Added imports for courseFiles service and new icons (FaUpload, FaSpinner)
- Added `useRef` for file input
- Added new state: `selectedFile`, `isUploading`, `uploadMode`, `fileInputRef`
- Changed `uploadedFiles` to load from Supabase instead of localStorage
- Updated `handleSaveFile` to call Supabase service
- Updated `handleDeleteUploadedFile` to delete from Supabase
- Redesigned modal with two modes:
  - **Upload File** mode: file picker with drag-drop zone
  - **Add Link** mode: name + URL inputs for external links

### 4. Supabase Dashboard Setup
- Navigated to Supabase dashboard via browser
- Confirmed `course-files` bucket already exists (marked as Public)
- Confirmed `course_files` table already exists with RLS policy
- Added storage policy via SQL Editor

---

## Files Changed

**Created:**
- `src/services/courseFiles.js` - Supabase service for file operations
- `supabase/migrations/001_create_course_files.sql` - Database migration

**Modified:**
- `src/components/CourseDetailView.js` - Multiple changes:
  - Added imports for courseFiles service
  - Added useRef for file input
  - Added state for upload mode, selected file, loading states
  - Updated handlers to use Supabase
  - Redesigned modal with Upload/Link toggle

---

## Known Bug (NOT YET FIXED)

**File picker not opening:** When clicking the drop zone in "Upload File" mode, the native file picker doesn't appear. The `fileInputRef.current?.click()` call isn't working.

**Location:** `CourseCurriculumSection` component in CourseDetailView.js (around line 12-150)

**Likely cause:** The hidden `<input type="file" ref={fileInputRef}>` might not be mounted or the ref isn't being passed correctly.

---

## Technical Details

### courseFiles.js Service Structure
```javascript
import { supabase } from './supabase';

const BUCKET_NAME = 'course-files';

export const uploadCourseFile = async (file, courseId, moduleIndex, fileType, uploadedBy) => {
  // Upload to storage, get URL, save metadata to database
};

export const addCourseFileLink = async (fileName, fileUrl, courseId, moduleIndex, fileType, uploadedBy) => {
  // Save link metadata only (no file upload)
};

export const getCourseFiles = async (courseId) => {
  // Fetch all files for a course, grouped by module
};

export const deleteCourseFile = async (fileId, filePath) => {
  // Delete from storage (if uploaded) and database
};
```

### Modal Modes
- **uploadMode === 'upload'**: Shows file drop zone, hidden file input
- **uploadMode === 'link'**: Shows Display Name + URL fields

### Supabase Configuration
- URL: `https://vnleonyfgwkfpvprpbqa.supabase.co`
- Storage bucket: `course-files` (public)
- Database table: `course_files`

---

## Next Steps

1. [ ] **Fix file picker bug** - Debug why fileInputRef.current?.click() doesn't work
2. [ ] Test actual file upload to Supabase
3. [ ] Test file deletion
4. [ ] Verify files persist across page refreshes
5. [ ] Commit all changes

---

## Previous Checkpoint

- `2026-01-31-checkpoint-5-back-button-and-sticky-tabs.md`

---

## Uncommitted Changes From Previous Sessions

These changes were made earlier today and remain uncommitted:
- Fixed Back button navigation (goes one level back, not all the way)
- Removed redundant "Back to Community" buttons from BrowseView.js
- Fixed sticky tabs in CourseDetailView (tabs now sticky below breadcrumb)
- Made Breadcrumb component sticky
