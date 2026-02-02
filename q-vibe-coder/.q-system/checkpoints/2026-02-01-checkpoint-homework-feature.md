# Checkpoint: Homework Submission Feature Implementation

**Date:** 2026-02-01
**Participant:** Guy

---

## Summary

Implemented the homework submission feature allowing creators to enable file uploads per session, and students to see/use the upload section when enrolled.

---

## Key Accomplishments

1. **Course Builder Toggle** - Added "Allow Homework Submissions" toggle in Session Details panel
2. **Data Structure** - Added `allowHomework` field to session objects throughout the app
3. **Database Persistence** - Updated `convertBuilderToDbFormat` to save `allowHomework` in sessions list
4. **Student View** - Added homework submission UI in CourseDetailView that appears only when:
   - Session has `allowHomework: true`
   - User is enrolled
   - User is not the creator

---

## Files Changed

### my-project/code/src/components/CourseBuilder.js
- Added `allowHomework: false` to default session data (lines 26, 46, 86, 203)
- Added `updateSessionAllowHomework()` function (line 225)
- Added `getSelectedSession()` helper function (line 228)
- Added toggle switch UI in Session Details section with green/gray styling

### my-project/code/src/data/database.js
- Added `allowHomework: session.allowHomework || false` to sessionsList in `convertBuilderToDbFormat()` (line 1493)

### my-project/code/src/components/CourseDetailView.js
- Added homework submission section inside session curriculum view (after line 832)
- Shows upload icon, "Homework Submission" label, "No file submitted yet" text, and "+ Upload Homework" button
- Only visible when `session.allowHomework && isEnrolled && !isCreator`

---

## Testing Performed

1. **As Creator (Guy):**
   - Opened Workspace → Content → Edit "AI Tools Overview"
   - Went to Curriculum tab, clicked Session 1
   - Saw "Allow Homework Submissions" toggle in Session Details
   - Enabled toggle (turned green)
   - Saved as Draft - saved to Supabase successfully

2. **As Student (Sarah):**
   - Went to My Courses → AI Tools Overview
   - Session 1 shows "Homework Submission" section with "+ Upload Homework" button
   - Session 2 does NOT show homework section (toggle not enabled)

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Per-session toggle | Creators control which sessions need homework |
| Only enrolled students see upload | Homework is for enrolled learners, not visitors |
| Creators don't see upload UI | They upload course materials, not homework |
| Default allowHomework: false | Backwards compatible with existing courses |

---

## Wireframes Created

- `wireframes/student-view.html` - HTML wireframe showing student course view with homework submission states

---

## Still To Do (Next Steps)

1. **Homework Storage** - Create separate table/storage for student homework submissions (not course_files)
2. **Creator Workspace View** - Where creators see submitted homework
3. **Student-Teacher Workspace View** - Where student-teachers see submissions from their students
4. **Submission Tracking** - Student name, course, session, submission date, review status
5. **Replace functionality** - Allow students to replace submitted files

---

## Code Snippets

### Toggle UI in CourseBuilder (Session Details)
```jsx
{/* Allow Homework Submissions Toggle */}
<div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: bgInput, borderRadius: 10, border: `1px solid ${border}` }}>
  <div>
    <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary, marginBottom: 4 }}>Allow Homework Submissions</div>
    <div style={{ fontSize: 12, color: textSecondary }}>Students can upload files for this session</div>
  </div>
  <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer' }}>
    <input
      type="checkbox"
      checked={getSelectedSession()?.allowHomework || false}
      onChange={(e) => updateSessionAllowHomework(selectedSession, e.target.checked)}
      style={{ opacity: 0, width: 0, height: 0 }}
    />
    {/* Toggle switch styling */}
  </label>
</div>
```

### Homework Section in CourseDetailView
```jsx
{/* Homework Submission Section - Only shown to enrolled students when creator enabled it */}
{session.allowHomework && isEnrolled && !isCreator && (
  <div style={{ padding: 16, borderTop: '1px solid #e5e7eb', background: '#fff' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#1d9bf0', marginBottom: 12 }}>
      <FaUpload /> Homework Submission
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px dashed #cfd9de' }}>
      <span>No file submitted yet</span>
      <button onClick={(e) => handleAddFile(encodeModuleIndex(session.number, 999), e)}>+ Upload Homework</button>
    </div>
  </div>
)}
```
