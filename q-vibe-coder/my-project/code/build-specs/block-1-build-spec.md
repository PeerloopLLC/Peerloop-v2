# Block 1 Build Specification: Creator-Ready MVP

**Project:** PeerLoop  
**Version:** 1.0  
**Date:** December 6, 2025  
**Duration Target:** 3-4 weeks  
**Goal:** End-to-end learning flow with role-based dashboards

---

## Executive Summary

Build a functional peer-learning platform where:
- **Students** can enroll, pay, schedule sessions, and learn
- **Student-Teachers** can manage their availability and teach students
- **Creators** can monitor their course, students, and revenue

**The PeerLoop Model:**
- Student completes course → Becomes Student-Teacher → Teaches others → Earns 70%
- Revenue split: 70% Student-Teacher / 15% Creator / 15% Platform

---

## Tech Stack (Recommended)

| Layer | Technology |
|-------|------------|
| Frontend | React / Next.js |
| Backend | Node.js / Next.js API routes |
| Database | PostgreSQL |
| Auth | NextAuth.js or similar |
| Payments | Stripe Checkout |
| Video | BigBlueButton (hosted provider) |
| Email | SendGrid / Resend |
| Hosting | Vercel / Railway |

---

## Database Schema (Core Tables)

```sql
-- Users (all roles)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student', 'student_teacher', 'creator', 'admin') DEFAULT 'student',
  profile_photo_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL, -- e.g., 45000 = $450
  outcomes TEXT[], -- array of outcome strings
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Course Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Module Items (videos, documents)
CREATE TABLE module_items (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES modules(id),
  title VARCHAR(255) NOT NULL,
  type ENUM('video', 'document', 'link') NOT NULL,
  external_url VARCHAR(500) NOT NULL, -- YouTube, Google Drive, etc.
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  student_teacher_id UUID REFERENCES users(id), -- assigned S-T
  stripe_payment_id VARCHAR(255),
  amount_cents INTEGER NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  enrolled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Student Progress
CREATE TABLE student_progress (
  id UUID PRIMARY KEY,
  enrollment_id UUID REFERENCES enrollments(id),
  module_item_id UUID REFERENCES module_items(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  UNIQUE(enrollment_id, module_item_id)
);

-- Student-Teacher Assignments (which S-T's can teach which courses)
CREATE TABLE student_teacher_courses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Student-Teacher Availability
CREATE TABLE availability (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id), -- student-teacher
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'America/Chicago',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions (booked appointments)
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  enrollment_id UUID REFERENCES enrollments(id),
  student_teacher_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  bbb_room_id VARCHAR(255),
  bbb_join_url_student VARCHAR(500),
  bbb_join_url_teacher VARCHAR(500),
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Component 1: User Authentication

### Requirements

| Requirement | Details |
|-------------|---------|
| Signup | Email + password, name required |
| Login | Email + password |
| Password Reset | Email-based reset flow |
| Roles | student, student_teacher, creator, admin |
| Session | JWT or session-based auth |

### API Endpoints

```
POST /api/auth/signup
  Body: { email, password, name }
  Response: { user, token }

POST /api/auth/login
  Body: { email, password }
  Response: { user, token }

POST /api/auth/forgot-password
  Body: { email }
  Response: { message: "Reset email sent" }

POST /api/auth/reset-password
  Body: { token, newPassword }
  Response: { message: "Password reset successful" }

GET /api/auth/me
  Headers: Authorization: Bearer <token>
  Response: { user }
```

### User Stories

- [ ] As a visitor, I can create an account with email and password
- [ ] As a user, I can log in with my credentials
- [ ] As a user, I can reset my password via email
- [ ] As a user, I am redirected to my role-appropriate dashboard after login

---

## Component 2: Course Page (Public)

### Requirements

| Element | Details |
|---------|---------|
| URL | `/courses/[slug]` or `/courses/[id]` |
| Public | Viewable without login |
| Content | Title, description, outcomes, price, creator info, modules |
| CTA | "Enroll Now - $450" button |

### UI Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  [PeerLoop Logo]                    [Login] [Sign Up]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI Prompting Mastery                                          │
│  ════════════════════                                          │
│                                                                 │
│  ┌──────────────┐                                              │
│  │  [Creator    │  Created by Guy                              │
│  │   Photo]     │  AI Integration Specialist                   │
│  └──────────────┘                                              │
│                                                                 │
│  Learn to master AI prompting through 1-on-1 peer teaching.    │
│  Our unique model pairs you with a certified Student-Teacher   │
│  who recently mastered the same material.                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  💰 $450                                                 │   │
│  │  📚 5 Modules                                           │   │
│  │  👥 Learn 1-on-1 with a certified peer teacher          │   │
│  │                                                         │   │
│  │  [     Enroll Now - $450     ]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  WHAT YOU'LL LEARN                                             │
│  ─────────────────                                             │
│  ✓ Craft effective prompts for any AI model                   │
│  ✓ Understand prompt engineering fundamentals                  │
│  ✓ Build complex multi-step prompts                           │
│  ✓ Apply prompting to real-world scenarios                    │
│                                                                 │
│  COURSE MODULES                                                │
│  ──────────────                                                │
│  Module 1: Foundations                                         │
│  Module 2: Intermediate Techniques                             │
│  Module 3: Advanced Patterns                                   │
│  Module 4: Specialization                                      │
│  Module 5: Certification Prep                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

```
GET /api/courses
  Response: [{ id, title, description, price_cents, creator, module_count }]

GET /api/courses/[id]
  Response: { id, title, description, price_cents, outcomes, creator, modules }
```

### User Stories

- [ ] As a visitor, I can view a course page with all details
- [ ] As a visitor, I can see the course price and what's included
- [ ] As a visitor, I can click "Enroll Now" to begin checkout

---

## Component 3: Payment (Stripe Checkout)

### Requirements

| Requirement | Details |
|-------------|---------|
| Processor | Stripe Checkout (hosted) |
| Flow | Click Enroll → Stripe Checkout → Success redirect |
| On Success | Create enrollment, redirect to scheduling |
| Webhook | Handle `checkout.session.completed` |

### Flow Diagram

```
[Enroll Button] 
      ↓
[POST /api/checkout/create-session]
      ↓
[Redirect to Stripe Checkout]
      ↓
[Customer pays]
      ↓
[Stripe webhook: checkout.session.completed]
      ↓
[Create enrollment record]
      ↓
[Redirect to /schedule?enrollment_id=xxx]
```

### API Endpoints

```
POST /api/checkout/create-session
  Headers: Authorization: Bearer <token>
  Body: { courseId }
  Response: { checkoutUrl }

POST /api/webhooks/stripe
  Body: Stripe webhook payload
  Action: Create enrollment on successful payment
```

### User Stories

- [ ] As a student, I can click "Enroll Now" and be redirected to Stripe Checkout
- [ ] As a student, after successful payment I am automatically enrolled
- [ ] As a student, after payment I am redirected to schedule my first session

---

## Component 4: Course Content (Student View)

### Requirements

| Requirement | Details |
|-------------|---------|
| URL | `/learn/[courseId]` (requires auth + enrollment) |
| Content | Module list, items with external links |
| Progress | Checkboxes to mark items complete |
| Access | Only enrolled students can view |

### UI Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  My Course  Schedule  Profile              [Sarah ▾]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI Prompting Mastery                                          │
│  by Guy                                                        │
│  Your Student-Teacher: Marcus Chen                             │
│                                                                 │
│  Overall Progress: ████░░░░░░ 40%                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  MODULE 1: Foundations ✓                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☑️ Video: What is AI Prompting (15 min)    [Watch →]   │   │
│  │  ☑️ Video: Your First Prompt (12 min)       [Watch →]   │   │
│  │  ☑️ Video: Common Mistakes (10 min)         [Watch →]   │   │
│  │  ☑️ PDF: Prompt Framework Guide             [Download]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  MODULE 2: Intermediate Techniques (In Progress)               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☑️ Video: Chain-of-Thought Prompting       [Watch →]   │   │
│  │  ☐ Video: Few-Shot Learning                 [Watch →]   │   │
│  │  ☐ Video: Role-Based Prompting              [Watch →]   │   │
│  │  ☐ PDF: Advanced Techniques Guide           [Download]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  MODULE 3: Advanced Patterns (Locked)                          │
│  MODULE 4: Specialization (Locked)                             │
│  MODULE 5: Certification Prep (Locked)                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [     Schedule Next Session with Marcus     ]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

```
GET /api/enrollments/[id]/content
  Headers: Authorization: Bearer <token>
  Response: { course, modules: [{ items, progress }], studentTeacher }

POST /api/progress
  Headers: Authorization: Bearer <token>
  Body: { enrollmentId, moduleItemId, completed: true }
  Response: { success: true }

GET /api/enrollments/[id]/progress
  Headers: Authorization: Bearer <token>
  Response: { completedItems: [], totalItems: 20, percentComplete: 40 }
```

### User Stories

- [ ] As a student, I can see all course modules and items
- [ ] As a student, I can click external links to watch videos / download documents
- [ ] As a student, I can mark items as complete with a checkbox
- [ ] As a student, I can see my overall progress percentage
- [ ] As a student, I can click to schedule my next session

---

## Component 5: Calendar/Scheduling

### Requirements

| Requirement | Details |
|-------------|---------|
| URL | `/schedule?enrollment_id=xxx` |
| S-T Selection | Student sees ALL available S-T's for the course and chooses |
| Availability | S-T's set recurring weekly availability |
| Booking | One-click booking creates session |
| Notifications | Email to Student + S-T with BBB link |

### UI Specification - Student Booking

```
┌─────────────────────────────────────────────────────────────────┐
│  Schedule Your Next Session                                    │
│  AI Prompting Mastery                                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SELECT A DATE                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │        December 2025                                    │   │
│  │  Su   Mo   Tu   We   Th   Fr   Sa                      │   │
│  │       1    2    3    4    5    6                       │   │
│  │  7    8    9   [10]  11   12   13                      │   │
│  │  14   15   16   17   18   19   20                      │   │
│  │  21   22   23   24   25   26   27                      │   │
│  │  28   29   30   31                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  AVAILABLE STUDENT-TEACHERS - December 10                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  👤 Marcus Chen                                         │   │
│  │     "Full-stack developer, love teaching!"             │   │
│  │                                                         │   │
│  │     Available times:                                   │   │
│  │     [10:00 AM]  [2:00 PM]  [7:00 PM]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  👤 Jessica Torres                                      │   │
│  │     "AI enthusiast and patient teacher"                │   │
│  │                                                         │   │
│  │     Available times:                                   │   │
│  │     [11:00 AM]  [3:00 PM]                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### UI Specification - S-T Availability Management

```
┌─────────────────────────────────────────────────────────────────┐
│  My Availability                                               │
│  Set your weekly teaching schedule                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Timezone: America/Chicago (CST) [Change]                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MONDAY                                                 │   │
│  │  [+ Add time slot]                                     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  TUESDAY                                                │   │
│  │  10:00 AM - 12:00 PM  [Remove]                         │   │
│  │  2:00 PM - 5:00 PM    [Remove]                         │   │
│  │  [+ Add time slot]                                     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  WEDNESDAY                                              │   │
│  │  7:00 PM - 9:00 PM    [Remove]                         │   │
│  │  [+ Add time slot]                                     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  THURSDAY                                               │   │
│  │  [+ Add time slot]                                     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  FRIDAY                                                 │   │
│  │  10:00 AM - 12:00 PM  [Remove]                         │   │
│  │  [+ Add time slot]                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [     Save Availability     ]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

```
GET /api/courses/[courseId]/student-teachers
  Response: [{ id, name, photo, bio }]

GET /api/student-teachers/[id]/availability?date=2025-12-10
  Response: { slots: ["10:00", "14:00", "19:00"] }

POST /api/sessions
  Headers: Authorization: Bearer <token>
  Body: { enrollmentId, studentTeacherId, scheduledAt }
  Response: { session, bbbJoinUrl }

GET /api/availability (for S-T to view their own)
  Headers: Authorization: Bearer <token>
  Response: [{ dayOfWeek, startTime, endTime }]

PUT /api/availability
  Headers: Authorization: Bearer <token>
  Body: [{ dayOfWeek, startTime, endTime }]
  Response: { success: true }
```

### User Stories

- [ ] As a student, I can see a calendar to select a date
- [ ] As a student, I can see all available Student-Teachers for my course
- [ ] As a student, I can see each S-T's available time slots for the selected date
- [ ] As a student, I can click a time slot to book a session
- [ ] As a student, I receive a confirmation email with BBB link
- [ ] As a Student-Teacher, I can set my weekly availability
- [ ] As a Student-Teacher, I receive an email when a student books with me

---

## Component 6: Video Conferencing (BBB)

### Requirements

| Requirement | Details |
|-------------|---------|
| Provider | BigBlueButton hosted (e.g., blindsidenetworks.com) |
| Room Creation | Create unique room per session |
| Join Links | Separate links for Student and S-T (S-T is moderator) |
| Features | Video, audio, screen share, chat |

### Integration

```javascript
// Example BBB API calls (pseudocode)

// Create meeting room
const createMeeting = async (sessionId, meetingName) => {
  const response = await bbbApi.create({
    meetingID: sessionId,
    name: meetingName,
    moderatorPW: generatePassword(),
    attendeePW: generatePassword(),
    welcome: "Welcome to your PeerLoop session!"
  });
  return response;
};

// Generate join URL for Student-Teacher (moderator)
const getTeacherJoinUrl = (sessionId, teacherName) => {
  return bbbApi.getJoinUrl({
    meetingID: sessionId,
    fullName: teacherName,
    password: moderatorPassword
  });
};

// Generate join URL for Student (attendee)
const getStudentJoinUrl = (sessionId, studentName) => {
  return bbbApi.getJoinUrl({
    meetingID: sessionId,
    fullName: studentName,
    password: attendeePassword
  });
};
```

### API Endpoints

```
POST /api/sessions/[id]/create-room
  Headers: Authorization: Bearer <token>
  Response: { bbbMeetingId, teacherJoinUrl, studentJoinUrl }

GET /api/sessions/[id]/join
  Headers: Authorization: Bearer <token>
  Response: { joinUrl } // returns appropriate URL based on user role
```

### User Stories

- [ ] As a student, I can click "Join Session" and enter a BBB video room
- [ ] As a Student-Teacher, I can click "Join Session" and enter as moderator
- [ ] As a participant, I can use video, audio, and screen sharing

---

## Component 7: Creator Dashboard

### Requirements

| Requirement | Details |
|-------------|---------|
| URL | `/creator/dashboard` |
| Access | Only users with role='creator' |
| Content | Enrolled students, progress, sessions, revenue, S-T's |

### UI Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Course Settings               [Guy ▾]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👋 Welcome, Guy                                               │
│  AI Prompting Mastery                                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📊 QUICK STATS                                                │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │     3     │  │     5     │  │  $1,350   │  │     2     │   │
│  │  Students │  │ Sessions  │  │  Revenue  │  │ S-Teachers│   │
│  │  Enrolled │  │ This Week │  │  (Total)  │  │  Active   │   │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📋 ENROLLED STUDENTS                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Name           │ Enrolled   │ Progress  │ S-Teacher   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Sarah Johnson  │ Dec 5      │ ██░░░ 40% │ Marcus      │   │
│  │  Mike Chen      │ Dec 4      │ ███░░ 60% │ Marcus      │   │
│  │  Alex Torres    │ Dec 3      │ █████100% │ Jessica     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📅 UPCOMING SESSIONS                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Dec 10, 7:00 PM  │  Sarah Johnson  │  Marcus Chen     │   │
│  │  Dec 11, 2:00 PM  │  Mike Chen      │  Marcus Chen     │   │
│  │  Dec 12, 10:00 AM │  Alex Torres    │  Jessica Torres  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  👥 STUDENT-TEACHERS                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Marcus Chen     │  2 students assigned  │  Active     │   │
│  │  Jessica Torres  │  1 student assigned   │  Active     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

```
GET /api/creator/dashboard
  Headers: Authorization: Bearer <token>
  Response: {
    course: { id, title },
    stats: { studentsEnrolled, sessionsThisWeek, totalRevenue, activeStudentTeachers },
    students: [{ id, name, enrolledAt, progress, studentTeacher }],
    upcomingSessions: [{ date, student, studentTeacher }],
    studentTeachers: [{ id, name, studentsAssigned, isActive }]
  }
```

### User Stories

- [ ] As a Creator, I can see how many students are enrolled
- [ ] As a Creator, I can see each student's progress
- [ ] As a Creator, I can see upcoming sessions
- [ ] As a Creator, I can see total revenue
- [ ] As a Creator, I can see my active Student-Teachers

---

## Component 8: Student Dashboard

### Requirements

| Requirement | Details |
|-------------|---------|
| URL | `/dashboard` (for students) |
| Access | Only authenticated students |
| Content | Enrolled course, progress, upcoming session |

### UI Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  My Course  Schedule  Profile              [Sarah ▾]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👋 Welcome back, Sarah                                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📚 MY COURSE                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  AI Prompting Mastery                                  │   │
│  │  by Guy                                                │   │
│  │                                                         │   │
│  │  Progress: ████░░░░░░ 40%                              │   │
│  │                                                         │   │
│  │  Your Student-Teacher: Marcus Chen                     │   │
│  │                                                         │   │
│  │  [     Continue Learning →     ]                       │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📅 UPCOMING SESSION                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Tuesday, December 10 at 7:00 PM                       │   │
│  │  with Marcus Chen                                      │   │
│  │                                                         │   │
│  │  ⏱️ Starts in 2 days, 4 hours                          │   │
│  │                                                         │   │
│  │  [Join Session] ← (visible 5 min before start)        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  No upcoming session?                                          │
│  [     Schedule a Session →     ]                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

```
GET /api/student/dashboard
  Headers: Authorization: Bearer <token>
  Response: {
    enrollment: { course, progress, studentTeacher },
    upcomingSession: { date, studentTeacher, joinUrl }
  }
```

### User Stories

- [ ] As a student, I can see my enrolled course and progress
- [ ] As a student, I can see my upcoming session
- [ ] As a student, I can click to continue learning
- [ ] As a student, I can click to schedule a session
- [ ] As a student, I can join my session when it's time

---

## Component 9: Student-Teacher Dashboard

### Requirements

| Requirement | Details |
|-------------|---------|
| URL | `/student-teacher/dashboard` |
| Access | Only users with role='student_teacher' |
| Content | Assigned students, their progress, upcoming sessions, availability |

### UI Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Availability  Profile         [Marcus ▾]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👋 Welcome, Marcus                                            │
│  Student-Teacher: AI Prompting Mastery                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📊 QUICK STATS                                                │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                  │
│  │     2     │  │     3     │  │     8     │                  │
│  │  Students │  │ Sessions  │  │ Sessions  │                  │
│  │ Assigned  │  │ This Week │  │  Total    │                  │
│  └───────────┘  └───────────┘  └───────────┘                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  👥 MY STUDENTS                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Name           │ Progress     │ Next Session          │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Sarah Johnson  │ ██░░░ 40%    │ Dec 10, 7:00 PM       │   │
│  │  Mike Chen      │ ███░░ 60%    │ Dec 11, 2:00 PM       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📅 UPCOMING SESSIONS                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Dec 10, 7:00 PM - Sarah Johnson                       │   │
│  │  [Join Session]                                        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Dec 11, 2:00 PM - Mike Chen                           │   │
│  │  [Join Session] ← (visible 5 min before)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ⚙️ MY AVAILABILITY                                            │
│  [     Edit Availability →     ]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

```
GET /api/student-teacher/dashboard
  Headers: Authorization: Bearer <token>
  Response: {
    course: { id, title },
    stats: { studentsAssigned, sessionsThisWeek, totalSessions },
    students: [{ id, name, progress, nextSession }],
    upcomingSessions: [{ date, student, joinUrl }]
  }
```

### User Stories

- [ ] As a Student-Teacher, I can see my assigned students
- [ ] As a Student-Teacher, I can see each student's progress
- [ ] As a Student-Teacher, I can see my upcoming sessions
- [ ] As a Student-Teacher, I can join my sessions
- [ ] As a Student-Teacher, I can edit my availability

---

## Component 10: Email Notifications

### Requirements

| Trigger | Recipients | Content |
|---------|------------|---------|
| Enrollment | Student, Creator | Welcome + next steps |
| Session Booked | Student, S-T, Creator | Confirmation + BBB link |
| Password Reset | User | Reset link |

### Email Templates

**1. Enrollment Confirmation (to Student)**
```
Subject: Welcome to AI Prompting Mastery! 🎉

Hi Sarah,

You're enrolled in AI Prompting Mastery by Guy!

Next step: Schedule your first session with a Student-Teacher.

[Schedule Your First Session →]

What to expect:
• 1-on-1 sessions with a certified peer teacher
• 5 modules of hands-on learning
• Certification upon completion

Questions? Reply to this email.

— The PeerLoop Team
```

**2. Session Booked (to Student)**
```
Subject: Session Confirmed: Dec 10 at 7:00 PM

Hi Sarah,

Your session is booked!

📅 Tuesday, December 10 at 7:00 PM (CST)
👤 Student-Teacher: Marcus Chen
🎥 Video Link: [Join Session]

Add to your calendar: [Google] [Outlook] [iCal]

See you there!

— The PeerLoop Team
```

**3. Session Booked (to Student-Teacher)**
```
Subject: New Session: Sarah Johnson on Dec 10

Hi Marcus,

A new session has been booked!

📅 Tuesday, December 10 at 7:00 PM (CST)
👤 Student: Sarah Johnson
📚 Course: AI Prompting Mastery
🎥 Video Link: [Join Session]

Student Progress: 40% (Modules 1-2 in progress)

— The PeerLoop Team
```

### User Stories

- [ ] As a student, I receive a welcome email after enrolling
- [ ] As a student, I receive a confirmation email when I book a session
- [ ] As a Student-Teacher, I receive an email when a student books with me
- [ ] As a Creator, I receive an email when a new student enrolls

---

## Block 1 Acceptance Criteria

### End-to-End Test Scenario

**Setup:**
- Guy (Creator) has "AI Prompting Mastery" course in system
- Marcus (Student-Teacher) has availability set
- Course price: $450

**Test Flow:**

1. ✅ Sarah visits `/courses/ai-prompting-mastery`
2. ✅ Sarah clicks "Sign Up" → creates account
3. ✅ Sarah clicks "Enroll Now - $450"
4. ✅ Stripe Checkout opens → Sarah pays
5. ✅ Sarah redirected to scheduling page
6. ✅ Sarah sees Marcus's available slots
7. ✅ Sarah books Dec 10, 7pm with Marcus
8. ✅ Sarah receives confirmation email with BBB link
9. ✅ Marcus receives notification email
10. ✅ Guy's Creator Dashboard shows new enrollment
11. ✅ Sarah logs in → Student Dashboard shows course + session
12. ✅ Marcus logs in → S-T Dashboard shows Sarah + session
13. ✅ Dec 10, 7pm → Both click "Join Session" → BBB room works
14. ✅ After session → Sarah accesses course content
15. ✅ Sarah marks Module 1 items complete
16. ✅ Guy's dashboard shows Sarah's updated progress

**Success:** All 16 steps complete without errors.

---

## Definition of Done

Block 1 is complete when:

- [ ] All 10 components are implemented and functional
- [ ] End-to-end test scenario passes
- [ ] All API endpoints are working
- [ ] All UI screens match specifications (reasonable variation OK)
- [ ] Email notifications are sending
- [ ] Stripe integration is working (test mode OK)
- [ ] BBB integration is working
- [ ] Responsive design works on mobile
- [ ] No critical bugs

---

## Out of Scope (Block 2+)

| Feature | Block |
|---------|-------|
| Community Feed | Block 2 |
| Full Profile System (follows, discovery) | Block 2 |
| Certification Workflow | Block 2 |
| Payout Processing (70/15/15) | Block 2 |
| S-T Application Workflow | Block 2 |
| Admin Dashboard (Brian's view) | Block 2 |
| Creator Journey/Onboarding | Block 2 |
| Session Recordings | Block 2 |
| Ratings/Reviews | Block 2 |
| Session Reminders (24h, 1h) | Block 2 |

---

## Notes for Developer

1. **Start with Auth + Database** - Foundation for everything else
2. **Use Stripe Test Mode** - Don't need real payments for development
3. **BBB has free test accounts** - Check blindsidenetworks.com
4. **External links for content** - No video hosting needed
5. **Keep UI simple** - Functionality over polish in Block 1
6. **Progress tracking is self-reported** - Student checks boxes

---

**Document Created:** December 6, 2025  
**For:** Vibe Coding Session - PeerLoop Block 1  
**Author:** Brian + Claude (Q-Command System)

---

*End of Block 1 Build Specification*











