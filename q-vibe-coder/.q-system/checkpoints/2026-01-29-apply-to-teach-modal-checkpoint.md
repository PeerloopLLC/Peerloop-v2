# Checkpoint: Apply to Teach Modal Implementation

**Date:** 2026-01-29
**Session Focus:** Implement Apply to Teach modal flow in MyCoursesView.js and CourseDetailView.js

---

## Completed Work

### 1. Updated Mockups (DONE)
**File:** `my-project/code/public/mockup-apply-to-teach.html`

Changed the mockup to show:
- Step 1: "Become a Teacher" confirmation with checklist and earnings preview
- Step 2: Green "Application Submitted" box with "Go To Workspace" button
- Below button: "Look for notifications for approval"
- Button state changes: "Apply to Teach" → "Pending Approval" (yellow) → "Approved" (green outline)

### 2. MyCoursesView.js Modal Implementation (DONE)
**File:** `my-project/code/src/components/MyCoursesView.js`

**Added state variables (after line 351):**
```javascript
// Apply to Teach modal state
const [applyToTeachModal, setApplyToTeachModal] = useState(null); // course object or null
const [applyToTeachStep, setApplyToTeachStep] = useState('confirm'); // 'confirm' or 'submitted'
const [teachingApplications, setTeachingApplications] = useState(() => {
  const saved = localStorage.getItem('teachingApplications');
  return saved ? JSON.parse(saved) : {};
});

// Save teaching applications to localStorage when changed
useEffect(() => {
  localStorage.setItem('teachingApplications', JSON.stringify(teachingApplications));
}, [teachingApplications]);
```

**Added helper functions:**
- `getTeachingStatus(courseId)` - returns null, 'pending', or 'approved'
- `handleApplyToTeachClick(course, e)` - opens modal if not applied
- `handleSubmitApplication()` - saves application as 'pending'
- `closeApplyToTeachModal()` - closes modal
- `renderApplyToTeachModal()` - renders the two-step modal via ReactDOM.createPortal

**Updated Apply to Teach button (~line 1169):**
- Shows "Apply to Teach" (green) if not applied
- Shows "Pending Approval" (yellow #fef3c7) if pending
- Shows "Approved" (green outline) if approved
- Opens modal when clicked (if not already applied)

**Added modal render call at end of return statement:**
```javascript
{/* Apply to Teach Modal */}
{renderApplyToTeachModal()}
```

### 3. CourseDetailView.js Modal Implementation (DONE)
**File:** `my-project/code/src/components/CourseDetailView.js`

**Added imports:**
```javascript
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
```

**Added state variables (after line 441):**
```javascript
// Apply to Teach modal state
const [applyToTeachModal, setApplyToTeachModal] = useState(false);
const [applyToTeachStep, setApplyToTeachStep] = useState('confirm');
const [teachingApplications, setTeachingApplications] = useState(() => {
  const saved = localStorage.getItem('teachingApplications');
  return saved ? JSON.parse(saved) : {};
});

useEffect(() => {
  localStorage.setItem('teachingApplications', JSON.stringify(teachingApplications));
}, [teachingApplications]);

const getTeachingStatus = () => {
  return teachingApplications[course?.id] || null;
};
```

**Added helper functions (before line 730):**
- `handleApplyToTeachClick()` - opens modal
- `handleSubmitApplication()` - saves application
- `closeApplyToTeachModal()` - closes modal
- `getCourseAbbreviation(title)` - for course icon
- `renderApplyToTeachModal()` - renders modal

**Updated Apply to Teach button (~line 1257):**
- Same 3-state button logic as MyCoursesView.js
- Removed old alert() placeholder

**Added modal render call at end of return:**
```javascript
{/* Apply to Teach Modal */}
{renderApplyToTeachModal()}
```

---

## Button States

1. **"Apply to Teach"** (green #10b981) - Not applied yet
2. **"Pending Approval"** (yellow #fef3c7 with #92400e text) - Applied, waiting for creator
3. **"Approved"** (white with green #10b981 border and text) - Creator approved

---

## Modal Flow

**Step 1 - Confirmation:**
- Course card with "✓ Certified" badge
- Checklist: "You completed this course", "You're certified to teach", "Earn 70% per session"
- Earnings preview: "$35/session" (Based on $50 session price)
- "Yes, I Want to Teach" button
- "Not Now" button

**Step 2 - Submitted:**
- Green "Application Submitted" box with checkmark
- Course card
- "Go To Workspace" button
- "Look for notifications for approval" text

---

## Data Storage

Teaching applications stored in localStorage:
```javascript
localStorage.setItem('teachingApplications', JSON.stringify({
  "course-id-1": "pending",
  "course-id-2": "approved"
}));
```

---

## Testing Status

- ✅ Mockups updated and verified
- ✅ MyCoursesView.js implementation complete
- ✅ CourseDetailView.js implementation complete
- ✅ App loads correctly
- ✅ "Apply to Teach" buttons show on completed courses
- ⏳ Modal click test interrupted (was navigating to test)

---

## Current State

- App was at My Courses page → Completed Courses tab
- Two completed courses visible: "AI Prompting Mastery" and "AI Tools Overview"
- Both showing green "Apply to Teach" buttons
- User clicked "Apply to Teach" but navigation happened (went to Home instead of showing modal)
- Need to debug: button click might be triggering course card click instead

---

## Possible Issue to Debug

When clicking "Apply to Teach" button on a completed course card, the click might be propagating to the course card's onClick, which navigates to course detail. The `e.stopPropagation()` should prevent this, but need to verify it's being called correctly in the updated button code.

---

## Files Modified This Session

1. `my-project/code/public/mockup-apply-to-teach.html` - Updated mockup with approval flow
2. `my-project/code/src/components/MyCoursesView.js` - Full modal implementation
3. `my-project/code/src/components/CourseDetailView.js` - Full modal implementation

---

## To Resume

```
Test and debug the Apply to Teach modal:

1. The modal should appear when clicking "Apply to Teach" button
2. If it's not appearing, check e.stopPropagation() in the button onClick
3. The button code uses an IIFE: {isCompletedSection ? (() => { ... })() : (...)}
4. Need to ensure handleApplyToTeachClick is being called, not course card navigation

Files to check:
- MyCoursesView.js around line 1169 (button code)
- Make sure e.stopPropagation() is called in handleApplyToTeachClick
```
