# Checkpoint: 2026-01-28 - My Courses Connector Lines

**Session started:** Earlier today
**Checkpoint time:** 2026-01-28
**Participant:** Guy

---

## Accomplishments This Session

### Updated My Courses Layout to Match Discover

**File modified:** `my-project/code/src/components/MyCoursesView.js`

**Problem:** My Courses had courses embedded inside the community card container with thin grey tree lines. Discover had courses as separate cards with teal connector lines showing parent-child relationship.

**Solution:** Updated MyCoursesView.js to match Discover's connector line format.

**Changes made:**

1. **Main courses section (renderInstructorGroup function ~line 740):**
   - Changed from embedded tree-style layout to separate cards with connector lines
   - Added vertical connector line (2px, `#d0e8f0` light / `#2f3336` dark)
   - Added horizontal connector lines for each course
   - Added teal connector dots (`#4facfe`) with white border and box-shadow

2. **Scheduled sessions section (~line 1454):**
   - Same connector line treatment applied
   - Consistent visual hierarchy across all course displays

**Key CSS for connector lines:**
```javascript
{/* Vertical Connector Line */}
<div style={{
  position: 'absolute',
  left: 28,
  top: 0,
  bottom: 24,
  width: 2,
  background: isDarkMode ? '#2f3336' : '#d0e8f0'
}} />

{/* Horizontal Connector Line */}
<div style={{
  position: 'absolute',
  left: -12,
  top: '50%',
  width: 10,
  height: 2,
  background: isDarkMode ? '#2f3336' : '#d0e8f0'
}} />

{/* Connector Dot */}
<div style={{
  position: 'absolute',
  left: -16,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#4facfe',
  border: '2px solid #fff',
  boxShadow: isDarkMode ? '0 0 0 2px #2f3336' : '0 0 0 2px #d0e8f0',
  zIndex: 1
}} />
```

---

## Key Colors Used (consistent with Discover)

| Element | Color |
|---------|-------|
| Vertical/horizontal lines | `#d0e8f0` (light), `#2f3336` (dark) |
| Connector dots | `#4facfe` |
| Course card background | `#f7f9f9` |
| Course card hover | `#eff3f4` |

---

## Files Changed

1. `my-project/code/src/components/MyCoursesView.js` - Connector lines implementation

---

## Current State

- ✅ My Courses now matches Discover's connector line format
- ✅ Community header cards are separate from course cards
- ✅ Teal connector dots link community to courses
- ✅ Vertical connector line shows parent-child relationship
- ✅ Both main courses and scheduled sessions sections updated
- ✅ Dark mode compatible

---

## Visual Result

Both Discover and My Courses now show:
- Community header as separate card (light cyan gradient)
- Courses as separate cards below with grey background
- Teal connector dots linking community to courses
- Consistent visual hierarchy across the app

---

## Next Steps (if continuing)

- Test with more courses per community to see full vertical line
- Commit changes when ready
