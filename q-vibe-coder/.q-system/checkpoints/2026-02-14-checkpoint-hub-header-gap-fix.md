# Checkpoint: Hub Header Gap Fix
**Date:** 2026-02-14 14:50
**Participant:** Guy

---

## What We Did

Fixed the white gap between the blue gradient header and the tab menu (Feeds/Courses/Content/Calendar) in the CommunityHub component.

### The Problem
A visible white line/bar appeared between the blue gradient header (creator profile info) and the blue tab bar below it. They looked like two separate blocks instead of one unified section.

### Root Cause
The header (`.community-hub-header`) and sticky menus (`.community-hub-sticky-menus`) were separate sibling divs. The page's white background showed through any sub-pixel gap between them, even though both had the same blue gradient.

### Solution Applied
**Overlap technique** - Extended the header's bottom padding by 40px extra (`padding: 20px 20px 54px` instead of `20px 20px 14px`) and pulled the sticky menus up with `margin-top: -40px`. This creates a generous overlap zone where the header's blue gradient sits behind the sticky menus' blue gradient, ensuring no white can peek through.

### Files Changed

**`src/components/CommunityHub.js`**
- Return structure: header → sentinel → sticky-menus → content (kept as separate siblings for sticky to work)
- Sub-pills background changed from `#fff` to `#f0f4ff` (light blue tint)

**`src/components/CommunityHub.css`**
- `.community-hub-header`: padding changed to `20px 20px 54px` (extra 40px bottom)
- `.community-hub-sticky-menus`: added `margin-top: -40px` for overlap

**`src/components/Community.js`**
- Tightened padding on The Commons pills container from `12px` top to `4px` top

### Also Changed (earlier in session, for The Commons card)
- Community.js: Reduced top padding on commons pills from 12px to 4px

---

## Current Status
- Header and tabs look seamless - no white gap
- Sticky collapse behavior works (tabs stick at top when scrolling past header)
- Tabs stick at `top: 45px` relative to `.community-center-column` scroll container

## In-Progress / User's Last Request
User asked to make the sticky tabs butt up against the very top (the breadcrumb bar) when collapsed, removing any gap between breadcrumbs and sticky tabs. This was NOT yet implemented - interrupted by /q-compact.

## Verified Working
- No white gap between header and tabs
- Sticky behavior preserved (scrolling away header, tabs stick)
- Scroll container is `.community-center-column` (overflow: auto)
