# PeerLoop Data Structures

This document describes the data structures for Instructors/Creators and Courses in PeerLoop.

**Live Prototype:** https://brianpeerloop.github.io/Peerloop-v2/  
**Source Code:** `src/data/database.js`

---

## Instructor/Creator Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique identifier | `1` |
| `name` | string | Full name | `"Jane Doe"` |
| `title` | string | Professional title/role | `"Leading AI Strategist at TechCorp"` |
| `avatar` | string | Profile image URL | `"https://..."` |
| `bio` | string | Bio paragraph (1-3 sentences) | `"Leading AI strategist with 10+ years..."` |
| `website` | string | Personal/company website | `"https://techcorp.com"` |
| `qualifications` | array | Array of credentials (see below) | |
| `expertise` | array | Array of skill tags | `["AI", "Machine Learning"]` |
| `stats` | object | Statistics (see below) | |
| `courses` | array | Array of course IDs they created | `[1, 4, 5]` |

### Qualifications Array

```json
[
  { "id": 1, "sentence": "MBA from Stanford Graduate School of Business (2015)" },
  { "id": 2, "sentence": "Former Product Manager at Google AI for 4 years" },
  { "id": 3, "sentence": "Published Author: 'AI Strategy' (2023)" }
]
```

### Stats Object

| Field | Type | Description |
|-------|------|-------------|
| `studentsTaught` | number | Total students across all courses |
| `coursesCreated` | number | Number of courses created |
| `averageRating` | number | Average rating (1.0 - 5.0) |
| `totalReviews` | number | Total review count |

---

## Course Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique identifier | `1` |
| `title` | string | Course title | `"AI for Product Managers"` |
| `description` | string | Full description | `"Master the skills to..."` |
| `duration` | string | Course duration | `"6 weeks"` |
| `level` | string | Difficulty level | `"Beginner"` / `"Intermediate"` / `"Advanced"` |
| `rating` | number | Average rating (1.0 - 5.0) | `4.8` |
| `ratingCount` | number | Number of reviews for this course | `1892` |
| `students` | number | Enrolled student count | `15678` |
| `price` | string | Price as string | `"$399"` |
| `badge` | string/null | Optional badge | `"Popular"` / `"New"` / `"Bestseller"` / `"Featured"` / `null` |
| `thumbnail` | string | Course image URL | `"https://..."` |
| `instructorId` | number | Links to instructor by ID | `2` |
| `category` | string | Category name | `"AI & Product Management"` |
| `tags` | array | Searchable tags | `["AI", "Product Management"]` |
| `learningObjectives` | array | What students will learn | |
| `curriculum` | array | Course modules (see below) | |

### Learning Objectives Array

```json
[
  "Evaluate AI technologies for product development",
  "Build comprehensive AI roadmaps",
  "Make data-driven product decisions"
]
```

### Curriculum Array

```json
[
  {
    "title": "Introduction to AI for PMs",
    "duration": "45 min",
    "description": "Overview and course structure"
  },
  {
    "title": "Machine Learning Fundamentals",
    "duration": "1h 15min",
    "description": "Core ML concepts and applications"
  }
]
```

### Optional PeerLoop-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| `peerloopFeatures` | object | Platform features (1-on-1, certification, etc.) |
| `studentTeachers` | array | Certified peer tutors for this course |
| `includes` | array | What's included with enrollment |

---

## Sample Instructor (Complete)

```json
{
  "id": 8,
  "name": "Guy Rymberg",
  "title": "AI Prompting Specialist & Business AI Expert",
  "avatar": "https://via.placeholder.com/120x120/1d9bf0/ffffff?text=GR",
  "bio": "AI teaching specialist with 15 years experience in AI and machine learning. Expert in helping professionals leverage AI prompting for competitive advantage. Has taught over 500 students the art of prompt engineering.",
  "website": "https://guyrymberg.ai",
  "qualifications": [
    { "id": 1, "sentence": "Ph.D. in Computer Science from MIT (2012)" },
    { "id": 2, "sentence": "Former AI Lead at Google for 6 years" },
    { "id": 3, "sentence": "Published Author: 'AI Prompting for Business' (2023)" },
    { "id": 4, "sentence": "Keynote Speaker at AI Summit, TechCrunch Disrupt" }
  ],
  "expertise": [
    "AI Prompt Engineering",
    "Large Language Models",
    "Business AI Strategy",
    "AI Communication",
    "Prompt Library Design",
    "AI-Powered Workflows"
  ],
  "stats": {
    "studentsTaught": 527,
    "coursesCreated": 1,
    "averageRating": 4.9,
    "totalReviews": 127
  },
  "courses": [15]
}
```

---

## Sample Course (Complete)

```json
{
  "id": 15,
  "title": "AI Prompting Mastery",
  "description": "Learn to write effective AI prompts for business use. Master the art of communicating with AI to boost your productivity. This comprehensive course teaches you the fundamentals and advanced techniques of prompt engineering.",
  "duration": "4-6 weeks",
  "level": "Intermediate",
  "rating": 4.9,
  "ratingCount": 127,
  "students": 127,
  "price": "$450",
  "badge": "New",
  "thumbnail": "https://via.placeholder.com/300x200/1d9bf0/ffffff?text=AI+Prompting",
  "instructorId": 8,
  "category": "AI & Prompt Engineering",
  "tags": ["AI Prompting", "Prompt Engineering", "ChatGPT", "LLM", "Business AI"],
  "learningObjectives": [
    "Fundamentals of prompt engineering",
    "Advanced techniques for business applications",
    "Building your own prompt library",
    "Iteration and refinement strategies",
    "Context and constraint design",
    "Real-world AI use cases"
  ],
  "curriculum": [
    {
      "title": "Module 1: Foundations",
      "duration": "Week 1",
      "description": "What is AI prompting, your first prompts, and the prompt framework guide."
    },
    {
      "title": "Module 2: Intermediate Techniques",
      "duration": "Week 2",
      "description": "Context and constraints, iteration strategies, and 50 prompt templates."
    },
    {
      "title": "Module 3: Advanced Applications",
      "duration": "Week 3",
      "description": "Business use cases, building AI workflows, and automation patterns."
    },
    {
      "title": "Module 4: Specialization",
      "duration": "Week 4",
      "description": "Industry-specific prompting, custom GPT creation, and prompt library design."
    },
    {
      "title": "Module 5: Certification Prep",
      "duration": "Week 5-6",
      "description": "Final assessment, portfolio review, and becoming a certified Student-Teacher."
    }
  ],
  "peerloopFeatures": {
    "oneOnOneTeaching": true,
    "certifiedTeachers": true,
    "earnWhileTeaching": true,
    "teacherCommission": "70%"
  },
  "studentTeachers": [
    { "name": "Marcus Chen", "studentsTaught": 12, "certifiedDate": "December 2024" },
    { "name": "Jessica Torres", "studentsTaught": 8, "certifiedDate": "November 2024" }
  ],
  "includes": [
    "Full course access",
    "1-on-1 peer teaching sessions",
    "Certificate on completion",
    "Lifetime access to materials",
    "Access to prompt library templates",
    "Discord community access"
  ]
}
```

---

## User Types in PeerLoop

| Type | Description | Earns |
|------|-------------|-------|
| **Creator** | Creates courses, sets curriculum | 15% when Student-Teachers teach |
| **Student** | Enrolls in courses, learns | - |
| **Student-Teacher** | Completed & certified, teaches others | 70% of session fees |
| **Platform** | PeerLoop | 15% |

---

## PeerLoop Business Model

**Learn → Certify → Teach → Earn**

1. Student enrolls in a course
2. Student completes curriculum with 1-on-1 sessions
3. Student gets certified
4. Student becomes a Student-Teacher
5. Student-Teacher earns 70% teaching new students

**Revenue Split:**
- 70% → Student-Teacher
- 15% → Creator
- 15% → PeerLoop

---

## Where to Find the Code

- **Database:** `src/data/database.js`
- **Course Listing UI:** `src/components/MainContent.js`
- **Course Detail UI:** `src/components/CourseListing.js`
- **Instructor Profile UI:** `src/components/MainContent.js` (renderInstructorProfile)

---

*Generated from PeerLoop prototype - December 2025*














