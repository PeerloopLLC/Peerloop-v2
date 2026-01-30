# Checkpoint: Dropdown Deselect Fix

**Date:** 2026-01-29
**Session Focus:** Fix Following dropdown deselect not working in DiscoverView

---

## What Was Accomplished

### Bug Identified and Fixed

**Problem:** Clicking on items in the Following dropdown to deselect (unfollow) them didn't work - the dropdown would close without toggling the follow state.

**Root Cause:**
- The dropdown is rendered via `ReactDOM.createPortal()` to `document.body` to escape overflow contexts
- The click-outside handler checked only for `.community-follow-dropdown-wrapper`
- Portal content is NOT inside that wrapper, so clicks inside the portal were treated as "outside" clicks
- The `mousedown` event closed the dropdown before the `onClick` event could fire

**Solution:** Two changes in DiscoverView.js:

1. **Updated click-outside handler** (lines 268-279):
```javascript
// Click-away handler for community follow dropdown
useEffect(() => {
  const handleClickOutside = (event) => {
    // Check both the wrapper AND the portal content (portal is rendered outside wrapper)
    if (openCommunityFollowDropdown &&
        !event.target.closest('.community-follow-dropdown-wrapper') &&
        !event.target.closest('.community-follow-dropdown-portal')) {
      setOpenCommunityFollowDropdown(null);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [openCommunityFollowDropdown]);
```

2. **Added className to portal div** (around line 1378):
```javascript
{openCommunityFollowDropdown === `discover-${instructor.id}` && ReactDOM.createPortal(
  <div
    className="community-follow-dropdown-portal"
    style={{...}}
  >
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/DiscoverView.js` | Updated click-outside handler to check for both `.community-follow-dropdown-wrapper` AND `.community-follow-dropdown-portal` |
| `src/components/DiscoverView.js` | Added `className="community-follow-dropdown-portal"` to the portal div |

---

## Testing Results

### Verified Working ✅

1. Open Following dropdown for Prompt Masters
2. Click on "AI Tools Overview" to deselect
3. **Result:**
   - Checkmark removed from "AI Tools Overview" in dropdown
   - Course card shows "Follow" instead of "Following"
   - Dropdown stays open (doesn't close prematurely)
   - Can continue clicking other items to toggle

---

## Technical Notes

- React portals render content outside the component tree but still inside React's event system
- However, DOM-level event listeners (like the click-outside handler) only see the DOM structure
- The portal content appears at `document.body` level, not inside the wrapper div
- The fix ensures both the wrapper AND portal content are checked as "inside" clicks

---

## Previous Context (from earlier checkpoint)

The unified `useUserStatus` hook was created and integrated:
- Hook at `src/hooks/useUserStatus.js`
- Single `userStatus_${userId}` localStorage key
- All components updated to receive `userStatus` prop
- Migration from legacy localStorage keys working

---

## Build Status

- Dev server running at localhost:3000
- Fix tested and verified working via Playwright

