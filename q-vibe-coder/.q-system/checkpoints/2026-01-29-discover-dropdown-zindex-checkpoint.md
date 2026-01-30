# Checkpoint: 2026-01-29 - Discover Dropdown Z-Index Fix (In Progress)

## Session Summary
Attempting to fix the Follow/Following dropdown on the Discover page that is being cut off by course cards below it. The dropdown appears but gets clipped/hidden behind sibling elements.

---

## Problem Description
- On Discover page, the "Following▼" dropdown for communities (e.g., Prompt Masters) opens but is cut off
- The dropdown goes BEHIND the course cards displayed below it
- Users cannot see the full dropdown menu (AI Tools Overview, Unfollow all are hidden)

---

## What We Tried

### 1. Added z-index to dropdown wrapper (line ~1322)
```javascript
style={{ position: 'relative', display: 'inline-block', zIndex: 9999 }}
```
**Result:** Did not fix the issue

### 2. Removed overflow: hidden from community block container (line ~1211)
Changed from:
```javascript
borderRadius: 16,
overflow: 'hidden',
boxShadow: ...
```
To:
```javascript
borderRadius: 16,
boxShadow: ...
```
**Result:** Did not fix the issue

---

## Root Cause Analysis
The dropdown has `position: absolute` and `zIndex: 1000`, but:
- There are multiple nested containers with overflow settings
- The pills scroll container has `overflowX: 'auto'`, `overflowY: 'hidden'` (lines 1000-1001)
- There's likely a parent scrolling container clipping the dropdown

### Overflow settings found in DiscoverView.js:
- Line 520: `overflow: 'hidden'`
- Line 598: `overflow: 'hidden'`
- Line 627: `overflowY: 'auto'`
- Line 735: `overflow: 'hidden'`
- Line 740: `overflowY: 'auto'`
- Line 1000-1001: `overflowX: 'auto'`, `overflowY: 'hidden'`
- Line 1114: `overflow: 'hidden'` (video thumbnail - not relevant)
- Line 1211: `overflow: 'hidden'` (REMOVED)

---

## Potential Solutions (Not Yet Tried)

### Option A: Use position: fixed
Change dropdown from `position: absolute` to `position: fixed` and calculate position based on click location. This takes it completely out of the normal flow.

### Option B: React Portal
Render the dropdown using a React portal to place it outside the normal DOM hierarchy at the document body level.

### Option C: Find and fix the actual overflow culprit
One of the parent containers (possibly lines 627 or 740 with `overflowY: 'auto'`) is likely creating a new stacking context or clipping the content.

---

## Files Changed

**Modified:**
- `my-project/code/src/components/DiscoverView.js`
  - Line ~1211: Removed `overflow: 'hidden'` from community block
  - Line ~1322: Added `zIndex: 9999` to dropdown wrapper

---

## Current State
- Dev server running on localhost:3000
- Logged in as Alex Sanders
- Dropdown opens but still clipped by course cards below
- Need to investigate other overflow settings or switch to fixed positioning

---

## Test Steps
1. Log in as Alex Sanders
2. Click Discover in nav
3. Scroll to Prompt Masters community
4. Click "Following▼" next to community name
5. Verify dropdown shows ALL items:
   - COMMUNITY: ✓ Prompt Masters
   - COURSES: ✓ AI Prompting Mastery, ✓ AI Tools Overview
   - Unfollow all

---

## Next Steps
1. Check lines 627 and 740 for the scrolling container overflow settings
2. Consider using `position: fixed` for the dropdown
3. Or implement a React portal solution
