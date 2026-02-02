# Checkpoint: My Courses Learning/Teaching Toggle

**Created:** 2026-02-01
**Context:** Mid-implementation of Learning/Teaching toggle for My Courses

## Summary

Adding a Learning/Teaching toggle to My Courses so student-teachers (like Alex) can easily find courses they're scheduled to teach, not just courses they're learning.

## Problem Solved

After Sarah schedules a session with Alex as the student-teacher, Alex had no way to find or access that course. He would have to manually search in Discover. The solution adds a "Teaching" pill to My Courses.

## Files Modified

### 1. GetStream Dashboard (External)
- **App:** Getstream Message (ID: 1457190)
- **Location:** Roles & Permissions → user role → messaging scope
- **Changes Applied:**
  - Enabled "Read Channel" permission (allows reading any messaging channel)
  - Enabled "Join Channel" (AddOwnChannelMembership) permission
  - These permissions allow any authenticated user to read/join messaging channels

### 2. CourseMessages.js
- Added user upsert logic before adding members to channel
- Builds `usersToUpsert` array with instructor and student-teacher info
- Calls `client.upsertUsers()` before channel creation
- Note: Upsert still fails (error 17) because server-side auth required

### 3. MyCoursesView.js (IN PROGRESS)
**Added state:**
```javascript
const [courseMode, setCourseMode] = useState('learning'); // 'learning' or 'teaching'
```

**Added teachingCoursesData useMemo (lines 662-712):**
- Scans all `scheduledSessions_*` in localStorage
- Finds sessions where `studentTeacherId` matches current user
- Groups courses with their teaching sessions

**Added teachingCoursesGroups useMemo (lines 714-731):**
- Groups teaching courses by instructor

**Added UI toggle (lines 1817-1887):**
- Learning/Teaching pills in header
- Shows count badge for teaching courses
- Green color for Teaching (#10b981)
- Blue color for Learning (#1d9bf0)

**STILL NEEDED:**
- Update course list rendering section (~line 2034+) to show teaching courses when `courseMode === 'teaching'`
- The conditional rendering logic needs to wrap the existing course list with `courseMode` check

## Code Snippets Added

### Teaching Courses Data Logic (MyCoursesView.js ~line 662)
```javascript
const teachingCoursesData = useMemo(() => {
  if (!currentUser?.id) return [];
  const teachingSessions = [];

  // Scan all scheduledSessions_* in localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('scheduledSessions_') && !key.endsWith(currentUser.id)) {
        const sessions = JSON.parse(localStorage.getItem(key) || '[]');
        sessions.forEach(session => {
          if (session.studentTeacherId === currentUser.id ||
              session.studentTeacherId === currentUser.name ||
              session.studentTeacherName === currentUser.name) {
            const studentId = key.replace('scheduledSessions_', '');
            teachingSessions.push({
              ...session,
              studentId,
              studentName: session.studentName || studentId
            });
          }
        });
      }
    }
  } catch (e) {
    console.error('Error scanning teaching sessions:', e);
  }

  // Group by course and get course data
  const courseMap = {};
  teachingSessions.forEach(session => {
    if (!courseMap[session.courseId]) {
      const course = indexedCourses.find(c => c.id === session.courseId);
      if (course) {
        courseMap[session.courseId] = { ...course, teachingSessions: [] };
      }
    }
    if (courseMap[session.courseId]) {
      courseMap[session.courseId].teachingSessions.push(session);
    }
  });

  return Object.values(courseMap);
}, [currentUser?.id, currentUser?.name, indexedCourses]);
```

## Next Steps

1. **Complete MyCoursesView.js** - Add conditional rendering:
   - Around line 2034, wrap course list with `courseMode` check
   - When `courseMode === 'teaching'`, show `teachingCoursesGroups` instead of `activeCoursesGroups`
   - Include student info in each teaching course card

2. **Test the flow:**
   - Log in as Sarah, purchase course, schedule with Alex
   - Log out, log in as Alex
   - Go to My Courses, click "Teaching" pill
   - Should see the course, click to open CourseDetailView
   - Messages tab should now work (with GetStream permissions fixed)

## User Messages This Session

1. Asked about GetStream messaging permission error for demo_alex
2. Confirmed code wasn't changed yet for that issue
3. Asked to update GetStream directly (I did via browser automation)
4. Noted Alex still can't access course - no UX path from Alex's perspective
5. Suggested workspace link, then agreed My Courses with Learning/Teaching toggle is better
6. Ran out of tokens twice during implementation

## Technical Notes

- localStorage key format: `scheduledSessions_${userId}`
- Each session object has: courseId, studentTeacherId, studentTeacherName, date, time, etc.
- GetStream channel ID format: `course-${courseId}` (type: messaging)
- Members should include: student + creator (instructorId → userId lookup) + studentTeacher
