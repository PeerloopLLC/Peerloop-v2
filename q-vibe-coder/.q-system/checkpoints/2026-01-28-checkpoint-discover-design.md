# Checkpoint: 2026-01-28 - Discover Tab Redesign

**Session started:** Earlier today
**Checkpoint time:** 2026-01-28
**Participant:** Guy

---

## Accomplishments So Far

- Reviewed current Discover tab design (teal gradient banner headers)
- User feedback: hard to distinguish community headers from course cards
- Created multiple wireframe iterations exploring different approaches:
  - `wireframe-grey-headers.html` - Grey header options (A-D)
  - `wireframe-community-separation.html` - Separation options (1-5)
  - `wireframe-courses-nested.html` - Courses as subset options (1-5)
  - `wireframe-xcom-style.html` - X.com inspired design
  - `wireframe-mycourses-style.html` - Using My Courses exact colors
  - `wireframe-discover-final.html` - Final design with exact colors
  - `wireframe-discover-lines.html` - **FINAL APPROVED** - With connector lines

- User provided reference image: `C:\Users\bjleb\OneDrive\Temp\communitycourse.jpg` (X.com inspired)
- Extracted exact colors from MyCoursesView.js
- User approved: Variation B style + connector lines linking community to courses

---

## Final Approved Design

**Reference wireframe:** `my-project/code/public/wireframe-discover-lines.html`

**Colors (from My Courses):**
- Community header: `linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%)`
- Community avatar: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` - 56px circle with 👥
- Course card background: `#f7f9f9`
- Course card hover: `#eff3f4`
- Course badge: `linear-gradient(135deg, #22c55e, #16a34a)` - 56px green square
- Course title: `#1d9bf0` - blue
- Connector lines: `#d0e8f0` - 2px
- Connector dots: `#4facfe` - 8px circles

**Structure:**
1. Community header card (light cyan gradient, rounded 16px)
   - Avatar + name + @handle + creator + followers + bio
   - "Following Community" button
2. Courses section with connector lines:
   - Vertical line on left
   - Horizontal line + dot for each course
   - Courses slightly indented but centered

**Key CSS for connectors:**
```css
.courses-section::before {
  position: absolute; left: 28px; top: 0; bottom: 24px;
  width: 2px; background: #d0e8f0;
}
.course-card::before {
  position: absolute; left: -12px; top: 50%;
  width: 10px; height: 2px; background: #d0e8f0;
}
.course-card::after {
  position: absolute; left: -16px; top: 50%; transform: translateY(-50%);
  width: 8px; height: 8px; border-radius: 50%;
  background: #4facfe; border: 2px solid #fff; box-shadow: 0 0 0 2px #d0e8f0;
}
```

---

## Files Created

- `my-project/code/public/wireframe-grey-headers.html`
- `my-project/code/public/wireframe-community-separation.html`
- `my-project/code/public/wireframe-courses-nested.html`
- `my-project/code/public/wireframe-xcom-style.html`
- `my-project/code/public/wireframe-mycourses-style.html`
- `my-project/code/public/wireframe-discover-final.html`
- `my-project/code/public/wireframe-discover-lines.html` ← **FINAL APPROVED**

---

## Next Steps

- [ ] Implement approved design in `DiscoverView.js`
- [ ] Apply connector line CSS
- [ ] Match exact My Courses colors
- [ ] Test in browser (light mode)
- [ ] Verify dark mode compatibility

---

## Implementation Prompt (for after compact)

**Implement the new Discover Tab design with connector lines**

**Reference wireframe:** `my-project/code/public/wireframe-discover-lines.html`

**Design concept:** Communities display as cards with their courses nested below, connected by visual lines showing the parent-child relationship.

**Colors (from My Courses - must match exactly):**
- Community header: `linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%)` - light cyan gradient
- Community avatar: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` - teal/cyan circle, 56px, with 👥 emoji
- Course card background: `#f7f9f9` - light grey
- Course card hover: `#eff3f4`
- Course badge: `linear-gradient(135deg, #22c55e, #16a34a)` - green square, 56px with letters
- Course title: `#1d9bf0` - blue
- Connector lines: `#d0e8f0` - 2px width
- Connector dots: `#4facfe` - 8px circles at each connection point

**Structure for each community:**
1. Community header card (light cyan gradient, rounded 16px)
   - Circle avatar + name + @handle + "Created by [creator]" + follower count + title
   - "Following Community" button (white bg, grey border)
   - Bio text below (indented under avatar)

2. Courses section below with connector lines:
   - Vertical line on left (from community down to last course)
   - Each course has horizontal line + dot connecting to vertical line
   - Course cards: grey background, green square badge, blue title, description, stats, enroll/follow buttons
   - Courses slightly indented (~20px left margin) but still centered

**Key CSS for connector lines:**
```css
.courses-section::before {
  /* Vertical line */
  position: absolute;
  left: 28px;
  top: 0;
  bottom: 24px;
  width: 2px;
  background: #d0e8f0;
}

.course-card::before {
  /* Horizontal connector */
  position: absolute;
  left: -12px;
  top: 50%;
  width: 10px;
  height: 2px;
  background: #d0e8f0;
}

.course-card::after {
  /* Dot at connection */
  position: absolute;
  left: -16px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4facfe;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #d0e8f0;
}
```

**File to modify:** `my-project/code/src/components/DiscoverView.js`

**Important:** Keep existing functionality (search, filters, click handlers). Only change the visual layout of the community/course cards in the main content area.
