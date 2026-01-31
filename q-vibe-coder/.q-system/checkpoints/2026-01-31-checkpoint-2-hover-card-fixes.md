# Checkpoint: Hover Card Positioning & Underline Fixes

**Date:** 2026-01-31
**Participant:** Guy

---

## Summary

Fixed community hover card popup positioning and removed underlines from community/course titles on Discover page.

---

## Key Accomplishments

1. **Removed Underlines from Titles** - Discovered underlines were `border-bottom` not `text-decoration`
   - Removed `borderBottom` from standard format community title (line ~2473)
   - Removed `borderBottom` from standard format course title (line ~2881)
   - Previously removed `textDecoration: 'underline'` from compact format titles

2. **Fixed CommunityHoverCard Positioning** - Card was appearing off-screen
   - Updated positioning logic to properly calculate space above/below
   - Added React Portal (`ReactDOM.createPortal`) to render card at document.body level
   - Increased z-index to 99999 for proper stacking
   - Card now appears correctly positioned near the trigger element

3. **Improved Positioning Algorithm**
   - Checks `spaceBelow` and `spaceAbove` before positioning
   - Falls back to top of viewport if neither has enough space
   - Uses cardHeight estimate of 250px for safety margin

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/DiscoverView.js` | Removed `borderBottom` from community title (~line 2473) and course title (~line 2881) in standard format |
| `src/components/CommunityHoverCard.js` | Added ReactDOM import, wrapped popup in createPortal, improved positioning logic, increased z-index |

---

## Technical Notes

### CommunityHoverCard Positioning Logic
```javascript
// Vertical positioning: prefer below, but go above if not enough space
let top;
const spaceBelow = window.innerHeight - rect.bottom - 10;
const spaceAbove = rect.top - 10;

if (spaceBelow >= cardHeight) {
  top = rect.bottom + 8;
} else if (spaceAbove >= cardHeight) {
  top = rect.top - cardHeight - 8;
} else {
  top = 10; // Fallback to top of viewport
}
```

### React Portal for Z-Index Fix
```javascript
{isVisible && ReactDOM.createPortal(
  <div className="user-hover-card" style={{ position: 'fixed', zIndex: 99999, ... }}>
    {/* Card content */}
  </div>,
  document.body
)}
```

---

## Current State

- Community hover card popup is working correctly
- Popup appears on hover over community titles on Discover page
- Shows: community icon, name, handle, creator, followers, bio, Follow Community button
- Card positions correctly within viewport

---

## Next Actions (User Requested)

- [ ] Make hover effect more noticeable on community titles (greater contrast)
- [ ] Current hover just changes text color to blue - user wants it more visible

---

## Hover Effect Enhancement (In Progress)

User requested making the community title hover reaction more noticeable. Current implementation:
- Only changes text color from dark (#0f1419) to blue (#1d9bf0)
- User says this is "too subtle"

Planned enhancements:
- Add background highlight on hover
- Use brighter/more contrasting colors
- Possibly add subtle glow or scale effect

Locations to update:
- Line 628: Compact format community title
- Line 1841: Thirdtry format community title
- Line 2475: Standard format community title
