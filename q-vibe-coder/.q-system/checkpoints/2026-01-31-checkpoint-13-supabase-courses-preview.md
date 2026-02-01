# Checkpoint: Supabase Courses & Preview Modal Enhancement

**Date:** 2026-01-31
**Session:** Course Database Migration & Preview UI Improvements

---

## Summary

Implemented Supabase database storage for courses (replacing localStorage) and enhanced the course Preview modal to show both Discover Card view and Course Detail view with curriculum.

---

## Key Accomplishments

### 1. Supabase Database for Courses

**Created `courses` table in Supabase:**
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  level TEXT,
  rating NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  students INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  price TEXT,
  badge TEXT,
  thumbnail TEXT,
  thumbnail_gradient TEXT,
  instructor_id INTEGER,
  category TEXT,
  tags JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  peerloop_features JSONB DEFAULT '{}',
  sessions JSONB DEFAULT '{}',
  learning_objectives JSONB DEFAULT '[]',
  curriculum JSONB DEFAULT '[]',
  includes JSONB DEFAULT '[]',
  session_files JSONB DEFAULT '[]',
  is_creator_course BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Added Supabase CRUD functions to database.js:**
- `toSupabaseFormat()` - Convert JS camelCase to snake_case
- `fromSupabaseFormat()` - Convert Supabase snake_case to JS camelCase
- `loadCoursesFromSupabase(instructorId)` - Load courses for instructor
- `addCourseToSupabase(builderData, instructorId)` - Create new course
- `updateCourseInSupabase(courseId, builderData, instructorId)` - Update course
- `deleteCourseFromSupabase(courseId)` - Delete course
- `updateCourseSessionFilesSupabase(courseId, sessionFiles)` - Update files

### 2. Updated API Key

Old key was expired. Updated to new anon key in both files:
- `database.js` line ~15
- `CreatorDashboard.js` line ~28

New key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubGVvbnlmZ3drZnB2cHJwYnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDM2OTIsImV4cCI6MjA4MDYxOTY5Mn0.aunUqqZJTYGBIXjPT2_V_CtaBpmF61-IkEhkPvJdEu8`

### 3. Migrated 5 Courses to Supabase

All courses now stored permanently in Supabase (IDs 1-5):
1. AI Tools Overview - $149
2. AI Tools Overview - $249
3. Intro to Claude Code - $249
4. Intro to n8n - $249
5. Vibe Coding 101 - $249

### 4. Updated CreatorDashboard.js

- Added `courses` and `isLoadingCourses` state
- Changed useEffect to load courses from Supabase on mount
- Updated `onSave` to use async `addCourseToSupabase`/`updateCourseInSupabase`
- Updated file operations to use `updateCourseSessionFilesSupabase`
- Changed course list rendering to use `courses` state instead of `getCoursesByInstructorId()`

### 5. Enhanced Preview Modal

Added `previewTab` state ('card' or 'detail') and two view tabs:

**Card View:**
- Shows Discover listing format
- Community header with avatar, name, @handle, Following
- Course title with Enroll button
- Description and meta line (rating, level, sessions, duration, price)

**Detail View:**
- Large title with price and Enroll Now button
- Stats row (rating, level, duration, lessons count)
- Tabs (Curriculum, Reviews, About) - visual only
- "What You'll Learn" section with learning objectives grid
- Full curriculum with numbered lessons and durations
- Topics/tags section

---

## Files Changed

**database.js:**
- Added Supabase import and client initialization (lines 13-17)
- Added `toSupabaseFormat()` function
- Added `fromSupabaseFormat()` function
- Added 5 async Supabase CRUD functions
- Updated API key

**CreatorDashboard.js:**
- Added imports for new Supabase functions
- Added `courses`, `isLoadingCourses`, `previewTab` state
- Updated useEffect to load from Supabase
- Updated onSave callback to use async Supabase functions
- Updated file upload/delete to use Supabase
- Replaced entire preview modal (~240 lines) with tabbed Card/Detail views
- Updated API key

---

## Current State

**Courses in Supabase (5 total):**
| ID | Title | Price | Status |
|----|-------|-------|--------|
| 1 | AI Tools Overview | $149 | Published |
| 2 | AI Tools Overview | $249 | Published |
| 3 | Intro to Claude Code | $249 | Published |
| 4 | Intro to n8n | $249 | Published |
| 5 | Vibe Coding 101 | $249 | Published |

**Preview Modal Features:**
- Toggle between "Discover Card" and "Course Detail" views
- Card view shows exact Discover listing format
- Detail view shows full course page with curriculum

---

## Data Storage

**Before:** localStorage (`peerloop_creator_courses`)
**After:** Supabase `courses` table

Courses are now persistent - clearing browser data won't delete them.

---

## Supabase Credentials

- **URL:** `https://vnleonyfgwkfpvprpbqa.supabase.co`
- **Anon Key:** (updated in code)
- **Table:** `courses`

---

## Access Path

Workspace → Content → MY COURSES section
- Click Preview → Opens modal with Card/Detail tabs
- Click Edit → Opens CourseBuilder

---

## Dev Server

Running in background (task be19638)
URL: http://localhost:3000/Peerloop-v2
Status: Compiled successfully

---

## Next Steps (Potential)

1. Add fake video URL field to courses for video preview formatting
2. Implement Delete course button (Supabase function ready)
3. Add loading spinners during Supabase operations
4. Clean up duplicate "AI Tools Overview" course if desired

---

## Next Session Prompt

```
Continue from checkpoint-13. Courses are now stored in Supabase database.
Preview modal has Card/Detail views working. The app is running at localhost:3000/Peerloop-v2.
```
