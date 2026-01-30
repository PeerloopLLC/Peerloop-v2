# Checkpoint: My Courses Dropdown Fix + Apply to Teach Button

**Date:** 2026-01-29
**Session Focus:** Fix dropdown closing issue, change View Certificate to Apply to Teach

---

## Completed Work

### 1. Dropdown Fix (DONE)
Fixed the issue where the My Courses page dropdown was closing immediately when clicking items.

**Root Cause:** The click-outside handler checked for `.community-follow-dropdown-wrapper` class, but the dropdown menu was rendered via `ReactDOM.createPortal` to `document.body` - so it wasn't inside that wrapper. When clicking dropdown items, the mousedown event fired first and closed the dropdown.

**Fix Applied:**
- Added `className="community-follow-dropdown-menu"` to both portal dropdown divs
- Updated the useEffect click-outside handler to also check for `.community-follow-dropdown-menu`

**File:** `my-project/code/src/components/MyCoursesView.js`

**Changes:**

1. **Lines 354-362** - Updated useEffect:
```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (openCommunityFollowDropdown &&
        !event.target.closest('.community-follow-dropdown-wrapper') &&
        !event.target.closest('.community-follow-dropdown-menu')) {
      setOpenCommunityFollowDropdown(null);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [openCommunityFollowDropdown]);
```

2. **Line 746** - Added className to first dropdown portal:
```javascript
<div className="community-follow-dropdown-menu" style={{...
```

3. **Line 1561** - Added className to second dropdown portal:
```javascript
<div className="community-follow-dropdown-menu" style={{...
```

### 2. Apply to Teach Button (DONE)
Changed "View Certificate" button to "Apply to Teach" on completed courses.

**File:** `my-project/code/src/components/MyCoursesView.js`

**Changes at lines 1169-1206:**
- Changed button text from `'View Certificate'` to `'Apply to Teach'`
- Changed click action from `onViewCourse(course.id)` to `alert()` placeholder
- Kept same green color (#10b981)

```javascript
onClick={(e) => {
  e.stopPropagation();
  if (isCompletedSection) {
    // Apply to Teach action
    alert(`Apply to Teach feature coming soon! You will be able to teach: ${course.title}`);
  } else {
    handleFollowCourse && handleFollowCourse(course.id);
  }
}}
```

### 3. Apply to Teach Mockups (DONE)
Created mockups for Option C (Profile-Based) approach.

**File:** `my-project/code/public/mockup-apply-to-teach.html`

**Mockups include:**
1. Confirmation Modal with profile preview
2. Simpler Quick Confirmation with checklist
3. Success State after applying
4. Button state change (before/after)

---

## Pill Tabs (from previous session)
The pill tabs for Active Courses / Completed Courses were already implemented matching Community.js styling:
- Active: Light blue background (#e8f5fd), blue text (#1d9bf0), blue border
- Inactive: Gray background (#f7f9f9), dark text, gray border

---

## Current State

- App is at login screen
- User asked for mockups of "Apply to Teach" feature (Option C: Profile-Based)
- Mockups created and shown
- User said "open app" - app is now at login screen

---

## Files Modified This Session

1. `my-project/code/src/components/MyCoursesView.js`
   - Dropdown fix (useEffect + className additions)
   - Apply to Teach button change

2. `my-project/code/public/mockup-apply-to-teach.html` (NEW)
   - Apply to Teach mockups

---

## To Resume

```
Continue implementing the Apply to Teach feature:

1. Mockups created at: my-project/code/public/mockup-apply-to-teach.html
   - Option C: Profile-Based (no application form)
   - User hasn't picked between detailed (#1) or simple (#2) modal style yet

2. Current button shows alert() placeholder - needs real modal implementation

3. Also completed this session:
   - Fixed dropdown closing issue in MyCoursesView.js
   - Changed "View Certificate" to "Apply to Teach" button
```
