# Refactoring Plan: Reduce Code Duplication

## Problem
When you change one header, you have to change identical code in multiple places. The codebase has significant duplication that makes maintenance difficult.

---

## How This Will Proceed

### Decision Points (I'll Ask You First)
Before making these choices, I'll show you the options and ask which to use:

1. **Color values** - Which specific hex colors become the "official" theme colors?
2. **Hover card dimensions** - UserHoverCard uses 280x200, CourseHoverCard uses 320x260 - which size becomes default?
3. **Transition speeds** - Some use 0.2s, some 0.3s - which timing feels right?
4. **Modal max-widths** - Different modals use 400px, 500px, 600px - standardize or keep varied?

### Archive Strategy (Safety Net)
Before modifying any component, I'll save the original version to:
```
src/archive/
  UserHoverCard.original.js
  CourseHoverCard.original.js
  CommunityHoverCard.original.js
  [etc.]
```

This way you can:
- Compare new vs old implementations
- Restore any component if you prefer the original
- Reference specific styling from discarded versions

---

## Key Findings
- **995+ hardcoded color values** scattered across files
- **3 nearly identical hover card components** (85-95% same code)
- **Same banner colors** defined in 4 different files
- **Same calendar logic** in 3 different files
- **Same course abbreviation function** in 5 files

---

## Phase 1: Theme Colors Hook (START HERE)
**Impact:** ~500 lines across 28 files | **Risk:** LOW

Create `src/hooks/useThemeColors.js` - a single place for all dark/light mode colors.

**Before (repeated in 28 files):**
```javascript
const bgPrimary = isDarkMode ? '#000' : '#fff';
const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
```

**After:**
```javascript
const { bgPrimary, textPrimary } = useThemeColors(isDarkMode);
```

**Files to create:**
- `src/hooks/useThemeColors.js`

**Files to update:** EnrollmentFlow.js, RescheduleModal.js, PurchaseModal.js, BrowseView.js, DiscoverView.js, MyCoursesView.js, Community.js, and 21 others

---

## Phase 2: Unified Hover Card
**Impact:** ~400 lines (3 files → 1 system) | **Risk:** MEDIUM

Extract shared positioning/timeout logic from:
- UserHoverCard.js (185 lines)
- CourseHoverCard.js (208 lines)
- CommunityHoverCard.js (183 lines)

**Files to create:**
- `src/components/HoverCard/HoverCard.js` (base component)
- `src/components/HoverCard/useHoverCardPosition.js` (shared hook)

---

## Phase 3: Shared Constants
**Impact:** ~200 lines across 9 files | **Risk:** VERY LOW

Move repeated values to one place.

**Files to create:**
- `src/constants/index.js`

**Contains:**
- `BANNER_COLOR_OPTIONS` (currently in 4 files)
- `MONTH_NAMES`, `DAY_NAMES` (currently in 3 files)
- `COURSE_ABBREVIATION_MAPPINGS` (currently in 5 files)

---

## Phase 4: Utility Functions
**Impact:** ~300 lines across 8 files | **Risk:** LOW

Extract repeated functions.

**Files to create:**
- `src/utils/courseUtils.js` - getCourseAbbreviation()
- `src/utils/calendarUtils.js` - getDaysInMonth(), getFirstDayOfMonth(), formatDateShort()

---

## Phase 5: Modal Component
**Impact:** ~150 lines across 6 files | **Risk:** MEDIUM

Create reusable modal wrapper to replace repeated overlay code.

**Files to create:**
- `src/components/Modal/Modal.js`

---

## Phase 6: CSS Design Tokens (Long-term)
**Impact:** Maintenance improvement | **Risk:** LOW

Extend `App.css` with more CSS variables for borderRadius, transitions, shadows.

---

## Summary

| Phase | What | Lines Saved | Risk |
|-------|------|-------------|------|
| 1 | Theme Colors Hook | ~500 | LOW |
| 2 | Hover Card System | ~400 | MEDIUM |
| 3 | Shared Constants | ~200 | VERY LOW |
| 4 | Utility Functions | ~300 | LOW |
| 5 | Modal Component | ~150 | MEDIUM |
| 6 | CSS Tokens | Maintenance | LOW |

**Total: ~1,550 lines reduced**

---

## Verification

After each phase:
1. Run `npm start` - no console errors
2. Toggle dark mode in Settings - colors should work
3. Test the specific components modified
4. Commit changes

---

## Critical Files

| File | Purpose |
|------|---------|
| `src/hooks/useThemeColors.js` | NEW - Theme colors hook |
| `src/constants/index.js` | NEW - Shared constants |
| `src/utils/courseUtils.js` | NEW - Course utilities |
| `src/utils/calendarUtils.js` | NEW - Calendar utilities |
| `src/components/HoverCard/` | NEW - Unified hover card system |
| `src/components/EnrollmentFlow.js` | First file to refactor (has all patterns) |
