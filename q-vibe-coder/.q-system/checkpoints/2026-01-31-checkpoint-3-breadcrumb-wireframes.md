# Checkpoint: Breadcrumb Navigation Wireframes

**Date:** 2026-01-31
**Participant:** Guy

---

## Summary

Created wireframe mockups for breadcrumb navigation inspired by discoverjesus.com, plus fixed "View All Courses" button navigation.

---

## Key Accomplishments

1. **Fixed "View All Courses" Button** - Was navigating to creator profile, now goes to Community Detail page
   - Added `onViewCommunity` prop to Community component
   - Updated MainContent.js to pass the prop
   - Changed button onClick handlers in Community.js (2 locations)

2. **Created Breadcrumb Wireframes** - `my-project/code/public/mockup-breadcrumbs.html`
   - 6 screens showing breadcrumb patterns for different navigation paths
   - Inspired by discoverjesus.com/person/abner breadcrumb style

3. **Community Header Hover Effect** - Made more subtle per user feedback
   - Blue border outline on hover
   - Subtle background darkening (not too blue)
   - Updated all 3 formats: compact, thirdtry, standard

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/MainContent.js` | Added `onViewCommunity` prop to Community component (~line 2960) |
| `src/components/Community.js` | Added `onViewCommunity` to props, updated 2 "View All Courses" buttons to use it |
| `src/components/DiscoverView.js` | Made community header hover effect more subtle (3 locations) |

## Files Created

| File | Purpose |
|------|---------|
| `public/mockup-breadcrumbs.html` | Wireframes showing breadcrumb navigation for 6 screens |

---

## Breadcrumb Design Specs

### Patterns by Screen
1. **My Feeds → Community**: `🏠 PeerLoop \ My Feeds \ Prompt Masters`
2. **Discover (top-level)**: `🏠 PeerLoop \ Discover`
3. **Discover → Community Detail**: `🏠 PeerLoop \ Discover \ AI Pioneers Hub`
4. **Discover → Community → Course**: `🏠 PeerLoop \ Discover \ AI Pioneers Hub \ AI Prompting Mastery`
5. **My Courses → Course**: `🏠 PeerLoop \ My Courses \ AI Prompting Mastery`
6. **Profile**: `🏠 PeerLoop \ Profile`

### Style
- **Position**: Top of main content area
- **Background**: Light gray (#f7f9f9)
- **Border**: Bottom border (#e1e8ed)
- **Padding**: 12px 20px
- **Home icon**: 🏠 emoji
- **Links**: Blue (#1d9bf0), clickable
- **Separator**: Backslash `\` in gray (#536471)
- **Current page**: Plain text, font-weight 500, not clickable

---

## Technical Notes

### View All Courses Fix
Changed from `onViewCreatorProfile` to `onViewCommunity` in Community.js:

```javascript
// Line ~2440 and ~2978
onClick={(e) => {
  e.stopPropagation();
  if (onViewCommunity) {
    onViewCommunity(effectiveCreator);
  }
}}
```

### onViewCommunity Handler in MainContent.js
```javascript
onViewCommunity={(instructor) => {
  const instructorId = instructor.instructorId || ...;
  const fullData = getInstructorWithCourses(instructorId);
  setSelectedInstructor(fullData || instructor);
  setSelectedCourse(null);
  setActiveTopMenu('creators');
  setPreviousBrowseContext({ type: 'feeds', community: communityForBack });
  setNavigationHistory(prev => [...prev, 'My Community']);
  localStorage.removeItem('viewingCreatorProfile');
  onMenuChange('Browse_Communities');
}}
```

---

## Next Actions

- [ ] Create Breadcrumb.js component
- [ ] Integrate breadcrumb into MainContent.js
- [ ] Track navigation state for breadcrumb context
- [ ] Style to match wireframes

---

## Reference: Inspiration Site

- URL: https://discoverjesus.com/person/abner
- Breadcrumb: `🏠 Discover Jesus \ Person \ Abner`
- Style: Home icon, clickable blue links, backslash separator, plain text for current page
