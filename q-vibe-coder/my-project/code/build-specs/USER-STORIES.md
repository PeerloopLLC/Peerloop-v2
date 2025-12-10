# Alpha Peer - User Stories

**Version:** v1
**Last Updated:** 2025-12-04
**Sources:** CD-001 (Business Plan), CD-002 (Feature Summary), CD-003 (User Stories), CD-004 (Impact Filter), Gap Analysis (Phase 2.5), CD-012 (MVP Review), CD-013 (Community Feed), CD-014 (Video Conferencing), CD-015 (Calendar/Scheduling)

> **Version History:** Increment version when substantive changes occur (new stories, priority changes, removed stories). Minor edits (typos, formatting) don't require version bump.

---

## Story Format

Stories follow the format: **As a [role], I need to [action] so that [benefit].**

**Story ID Format:** `US-[Role][NNN]` where:
- `US` = User Story prefix
- `[Role]` = Single letter for role (G=Guest/Visitor, A=Admin, C=Creator, S=Student, T=Student-Teacher, E=Employer, V=Video/Session, P=Platform, M=Moderator)
- `[NNN]` = Zero-padded 3-digit number (001-999)

**Priority levels:**
- **P0:** MVP critical - required for Genesis Cohort launch
- **P1:** High priority - needed for full flywheel validation
- **P2:** Medium priority - enhances experience
- **P3:** Nice to have - future consideration

---

## User Roles

| Role | Description |
|------|-------------|
| **Visitor/Guest** | Non-logged in user browsing public site |
| **Student** | Learner progressing through courses |
| **Student-Teacher** | Graduate who teaches peers (earns 70%) |
| **Creator-Instructor** | Course creator who may also teach directly |
| **Employer/Funder** | Third party paying for student enrollment |
| **Admin (AP Rep)** | Platform operations and oversight |
| **System** | Automated platform functionality |
| **Community Moderator** | Course community support staff (appointed by Creator) |

---

## Visitor/Guest Stories

*Note: These stories cover the pre-registration experience for non-logged in users visiting the public site.*

### Homepage & Promotional Content

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-G001 | As a Visitor, I need to view the homepage so that I can understand what PeerLoop offers | P0 | Gap Analysis |
| US-G002 | As a Visitor, I need to see promotional content (how it works, benefits, pricing info) so that I can decide if PeerLoop is right for me | P0 | Gap Analysis |
| US-G003 | As a Visitor, I need to see success stories or testimonials so that I can trust the platform | P1 | Gap Analysis |
| US-G004 | As a Visitor, I need to see the value proposition (Learn, Teach, Earn) so that I understand the unique model | P0 | Gap Analysis |

### Course Discovery

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-G005 | As a Visitor, I need to browse available courses so that I can see what I could learn | P0 | Gap Analysis |
| US-G006 | As a Visitor, I need to view course details (description, curriculum outline, price) so that I can evaluate courses | P0 | Gap Analysis |
| US-G007 | As a Visitor, I need to see course pricing without logging in so that I can assess affordability | P0 | Gap Analysis |

### Creator/Teacher Discovery

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-G008 | As a Visitor, I need to view creator profiles (public info) so that I can evaluate their expertise | P0 | Gap Analysis |
| US-G009 | As a Visitor, I need to see Student-Teacher profiles (public info) so that I can see who might teach me | P1 | Gap Analysis |
| US-G010 | As a Visitor, I need to see creator credentials and course stats so that I can trust the instructors | P1 | Gap Analysis |

### Authentication Actions

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-G011 | As a Visitor, I need to sign up for an account so that I can enroll in courses | P0 | Gap Analysis |
| US-G012 | As a Visitor, I need to log in to my existing account so that I can access my enrolled courses | P0 | Gap Analysis |
| US-G013 | As a Visitor, I need to reset my password if forgotten so that I can recover my account | P0 | Gap Analysis |

### Access Restrictions

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-G014 | As a Visitor, I need to see a prompt to sign up when I try to enroll so that I understand registration is required | P0 | Gap Analysis |
| US-G015 | As a Visitor, I need to see gated content indicators (e.g., "Sign in to view community") so that I know what requires login | P1 | Gap Analysis |

---

## Admin (AP Rep) Stories

### Enrollment & Account Management

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-A001 | As an Admin, I need to enroll teachers (Creators) so that they can offer courses on the platform | P0 | CD-003 |
| US-A002 | As an Admin, I need to cancel a teacher (with reason) so that I can remove problematic instructors | P1 | CD-003 |
| US-A003 | As an Admin, I need to cancel a student (with reason) so that I can enforce community standards | P1 | CD-003 |
| US-A004 | As an Admin, I need to vet teacher certificates so that only qualified instructors teach | P0 | CD-003 |

### Financial Operations

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-A005 | As an Admin, I need to pay teachers from student enrollments so that the 15/15/70 revenue split is distributed | P0 | CD-003 |
| US-A006 | As an Admin, I need to refund students if they cancel so that we maintain customer satisfaction | P0 | CD-003 |
| US-A007 | As an Admin, I need to chargeback teachers for cancellations so that creators bear responsibility for their commitments | P1 | CD-003 |
| US-A008 | As an Admin, I need to allow third party organizations to pay for students so that employers can sponsor learning | P1 | CD-003 |
| US-A009 | As an Admin, I need to send success/failure assessments to funders so that sponsors can track ROI | P1 | CD-003 |

### Communication

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-A010 | As an Admin, I need to message teachers so that I can communicate platform updates and issues | P0 | CD-003 |
| US-A011 | As an Admin, I need to message students so that I can provide support and announcements | P0 | CD-003 |
| US-A012 | As an Admin, I need to contact potential students by email re: courses and teachers referred by users so that referrals convert to enrollments | P1 | CD-003 |

### Session Facilitation

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-A013 | As an Admin, I need to facilitate tutor sessions for any teacher-student combination so that peer learning can happen | P0 | CD-003 |
| US-A014 | As an Admin, I need video calls with recording potential so that sessions can be reviewed | P0 | CD-003 |
| US-A015 | As an Admin, I need AI-powered session summaries & transcripts so that learning is documented | P1 | CD-003 |
| US-A016 | As an Admin, I need monitored session time so that billing is accurate | P0 | CD-003 |
| US-A017 | As an Admin, I need screen sharing in sessions so that teachers can demonstrate concepts | P0 | CD-003 |
| US-A018 | As an Admin, I need to store tutor sessions with date/time/people parameters so that session history is maintained | P0 | CD-003 |

### Analytics & Monitoring

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-A019 | As an Admin, I need to monitor user time on site and retention so that I can measure engagement | P1 | CD-003 |
| US-A020 | As an Admin, I need to monitor courses taken by user, teacher, creator stats so that I can track platform health | P1 | CD-003 |
| US-A021 | As an Admin, I need to monitor fees paid, distributed, income per creator so that I can ensure financial accuracy | P0 | CD-003 |
| US-A022 | As an Admin, I need to monitor session status (cancel, complete) so that I can track service delivery | P1 | CD-003 |
| US-A023 | As an Admin, I need to monitor student to teacher conversion so that I can validate the flywheel | P0 | CD-003, CD-004 |
| US-A024 | As an Admin, I need to monitor percentage grade averages so that I can track learning quality | P1 | CD-003 |
| US-A025 | As an Admin, I need to determine where new users originate from so that I can optimize acquisition | P2 | CD-003 |

---

## Creator-Instructor Stories

### Course Management

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C001 | As a Creator, I need to enter courses, training syllabi, quizzes, reference materials so that students have structured learning paths | P0 | CD-003 |
| US-C002 | As a Creator, I need to define criteria for successful completion so that certification is meaningful | P0 | CD-003 |
| US-C003 | As a Creator, I need to set training progression and criteria to level up so that students advance appropriately | P0 | CD-003 |
| US-C004 | As a Creator, I need to retire a course so that outdated content is removed | P2 | CD-003 |
| US-C005 | As a Creator, I need flexible assessments so that I can test understanding in various ways | P1 | CD-002 |

### Scheduling & Availability

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C006 | As a Creator, I need to offer times for tutoring via a calendar of availability so that students can book sessions | P0 | CD-003 |
| US-C007 | As a Creator, I need to cancel a particular scheduled session with a student so that I can handle conflicts | P1 | CD-003 |

### Profile & Presence

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C008 | As a Creator, I need to enter a profile with pictures, videos, PDFs so that students can evaluate my expertise | P0 | CD-003 |
| US-C009 | As a Creator, I need a profile card with stats (Active Student-Teachers, Avg Taught per Teacher, badges) so that my success is visible | P1 | CD-002 |
| US-C010 | As a Creator, I need a "Creator Studio" button to access course management so that I can easily edit content | P1 | CD-002 |

### Student-Teacher Management

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C011 | As a Creator, I need to vet student-turned-teachers so that teaching quality is maintained | P0 | CD-003 |
| US-C012 | As a Creator, I need to monitor/assess student-turned-teachers so that I can ensure ongoing quality | P1 | CD-003 |
| US-C013 | As a Creator, I need to cancel a student for cause so that I can remove problematic learners | P1 | CD-003 |

### Certification & Assessment

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C014 | As a Creator, I need to grant certificates to students of successful completion so that achievement is recognized | P0 | CD-003 |
| US-C015 | As a Creator, I need to capture and send assessments of students on progress/completion so that progress is documented | P1 | CD-003 |
| US-C016 | As a Creator, I need to earn a teaching certificate for each course taught (displayed on profile) so that my expertise is credentialed | P1 | CD-003 |

### Communication & Support

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C017 | As a Creator, I need to message students so that I can provide guidance and support | P0 | CD-003 |
| US-C018 | As a Creator, I need to message AP so that I can get platform support | P0 | CD-003 |
| US-C019 | As a Creator, I need to refer potential students to AP re: my courses so that I can grow my audience | P2 | CD-003 |
| US-C020 | As a Creator, I need to ask AI for assistance when both teacher and student are stumped so that learning continues | P1 | CD-003 |

### Community Management

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C021 | As a Creator, I need community hubs with forums so that students can interact | P1 | CD-001, CD-002 |
| US-C022 | As a Creator, I need to assign Community Roles (paid assistants with revenue sharing) so that I can scale my community | P2 | CD-002 |
| US-C023 | As a Creator, I need control over community organization and content delivery so that I can customize the experience | P2 | CD-002 |
| US-C024 | As a Creator, I need to host AMA sessions so that I can build excitement and answer student questions | P2 | CD-010 |
| US-C025 | As a Creator, I need to share student success stories so that I can attract new students | P2 | CD-010 |
| US-C026 | As a Creator, I need to publish newsletters (potentially with subscription payments) so that I can engage my audience | P3 | CD-010 |
| US-C027 | As a Creator, I need to appoint Community Moderators so that I can scale community support | P1 | CD-010 |
| US-C028 | As a Creator, I need extended course analytics so that I can monitor student activity on my courses | P1 | CD-011 |
| US-C029 | As a Creator, I need to access student feedback on each Teacher Student so that I can monitor teaching quality | P1 | CD-011 |
| US-C030 | As a Creator, I need to build a loyal community with high switching cost so that my audience stays engaged | P2 | CD-011 |

---

## Student Stories

### Discovery & Enrollment

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S001 | As a Student, I need to see what tutor courses are available so that I can choose what to learn | P0 | CD-003 |
| US-S002 | As a Student, I need to pay for tutors so that I can access learning | P0 | CD-003 |
| US-S003 | As a Student, I need to search for courses so that I can find relevant content | P0 | CD-002 |
| US-S004 | As a Student, I need to search for Creators/Instructors with detailed profiles so that I can evaluate teachers | P0 | CD-002 |
| US-S005 | As a Student, I need to view course detail pages with curriculum outline and time estimates so that I understand the commitment | P0 | CD-002 |
| US-S006 | As a Student, I need action buttons (Enroll, Explore Teaching, Follow Course, Join Community) so that I can take next steps | P0 | CD-002 |
| US-S007 | As a Student, I need related courses suggestions so that I can continue learning | P2 | CD-002 |

### Profile & Account

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S008 | As a Student, I need to enter a profile with picture (public and private sections) so that I control my visibility | P0 | CD-003 |
| US-S009 | As a Student, I need a unified dashboard for student/teacher activity tracking so that I see my progress | P0 | CD-002 |
| US-S010 | As a Student, I need a calendar view so that I can manage my schedule | P1 | CD-002 |
| US-S011 | As a Student, I need quick action buttons so that common tasks are accessible | P1 | CD-002 |
| US-S012 | As a Student, I need earnings tracking so that I can see my teaching income | P0 | CD-002 |

### Session Management

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S013 | As a Student, I need to reschedule a session with teacher so that I can handle conflicts | P1 | CD-003 |
| US-S014 | As a Student, I need to cancel a session so that I can handle emergencies | P1 | CD-003 |
| US-S015 | As a Student, I need to cancel a course (with reason) so that I can exit if needed | P1 | CD-003 |

### Communication

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S016 | As a Student, I need to message teachers so that I can ask questions | P0 | CD-003 |
| US-S017 | As a Student, I need to message other students so that I can collaborate (noted as tricky) | P2 | CD-003 |
| US-S018 | As a Student, I need to message AP so that I can get support | P0 | CD-003 |
| US-S019 | As a Student, I need a private messaging system so that I can have 1-on-1 conversations | P0 | CD-002 |

### Progression & Certification

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S020 | As a Student, I need to apply for teacher status so that I can transition to earning | P0 | CD-003 |
| US-S021 | As a Student, I need to earn a Learning Certificate upon completion so that my achievement is recognized | P0 | CD-002 |
| US-S022 | As a Student, I need to earn a Teaching Certificate when I become a teacher so that my teaching ability is credentialed | P0 | CD-002 |
| US-S023 | As a Student, I need my Teaching Certificate to dynamically update with student count so that my experience is visible | P1 | CD-002 |
| US-S024 | As a Student, I need access to gated communities based on credentials so that I can join advanced groups | P1 | CD-002 |

### Community & Discovery

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S025 | As a Student, I need an X.com-style algorithmic feed of followed content so that I discover relevant posts | P1 | CD-002 |
| US-S026 | As a Student, I need to refer potential students to AP re: courses and teachers so that I can help others | P2 | CD-003 |
| US-S027 | As a Student, I need to ask AI for assistance when both teacher and student are stumped so that learning continues | P1 | CD-003 |
| US-S028 | As a Student, I need to follow creators so that their content appears in my feed before I enroll | P0 | CD-008 |
| US-S029 | As a Student, I need to select a Teacher Student (with random as default) so that I can choose my mentor | P1 | CD-010 |
| US-S030 | As a Student, I need to earn goodwill points through participation so that my engagement is recognized | P2 | CD-010 |
| US-S031 | As a Student, I need to see my power user level/tier so that I can track my community standing | P2 | CD-010 |
| US-S032 | As a Student, I need to earn a Certificate of Mastery (separate from completion) so that I can prove deeper understanding | P1 | CD-011 |
| US-S033 | As a Student, I need to request content that doesn't exist so that gaps in course offerings are filled | P2 | CD-011 |
| US-S034 | As a Student, I need to opt out of a Teacher Student relationship at any point so that I can find a better match | P1 | CD-011 |
| US-S035 | As a Student, I need to select a Teacher Student by schedule availability so that I can book convenient times | P1 | CD-011 |

---

## Student-Teacher Stories

### Scheduling & Availability

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T001 | As a Student-Teacher, I need to offer times for tutoring via a calendar of availability so that students can book me | P0 | CD-003 |
| US-T002 | As a Student-Teacher, I need to cancel a particular scheduled session with a student so that I can handle conflicts | P1 | CD-003 |

### Profile & Presence

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T003 | As a Student-Teacher, I need to enter a profile with pictures, videos, PDFs so that students can evaluate me | P0 | CD-003 |
| US-T004 | As a Student-Teacher, I need a public profile showing my credentials so that students trust my expertise | P0 | CD-002 |
| US-T005 | As a Student-Teacher, I need a "Switch User" button to toggle between student and teacher modes so that I can use both functions | P0 | CD-002 |

### Teaching & Certification

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T006 | As a Student-Teacher, I need to grant certificates to students of successful completion so that I can certify learners | P0 | CD-003 |
| US-T007 | As a Student-Teacher, I need to conduct video sessions with screen sharing so that I can teach effectively | P0 | CD-002 |

### Communication & Support

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T008 | As a Student-Teacher, I need to message students so that I can provide support | P0 | CD-003 |
| US-T009 | As a Student-Teacher, I need to message AP so that I can get platform support | P0 | CD-003 |
| US-T010 | As a Student-Teacher, I need to refer potential students to AP re: my courses so that I can grow my student base | P2 | CD-003 |
| US-T011 | As a Student-Teacher, I need to ask AI for assistance when both I and student are stumped so that learning continues | P1 | CD-003 |

### Earnings

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T012 | As a Student-Teacher, I need to receive 70% of session fees so that I earn from teaching | P0 | CD-001 |
| US-T013 | As a Student-Teacher, I need an earnings dashboard so that I can track my income | P0 | CD-002 |
| US-T014 | As a Student-Teacher, I need to opt out of a student relationship at any point so that I can manage difficult situations | P1 | CD-011 |
| US-T015 | As a Student-Teacher, I need to earn points for teaching activity so that my engagement is recognized | P2 | CD-011 |
| US-T016 | As a Student-Teacher, I need verifiable mastery credentials for career advancement so that teaching experience has professional value | P1 | CD-011 |

---

## Employer/Funder Stories

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-E001 | As an Employer, I need to pay for a student to take a course so that I can sponsor employee learning | P1 | CD-003 |
| US-E002 | As an Employer, I need to receive a copy of student progress and completion status so that I can track sponsored learners | P1 | CD-003 |
| US-E003 | As an Employer, I need to receive a copy of certification so that I have proof of completion | P1 | CD-003 |
| US-E004 | As an Employer, I need to enter a profile (possibly all private) so that I can manage my account | P1 | CD-003 |
| US-E005 | As an Employer, I need to message AP so that I can get support | P1 | CD-003 |
| US-E006 | As an Employer, I need to message my funded students for their funded courses so that I can check on progress | P2 | CD-003 |

---

## Tutor Session Stories (System)

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-V001 | As a System, I need to handle the video chat experience so that tutoring can happen | P0 | CD-003 |
| US-V002 | As a System, I need to possibly limit the number of participants so that sessions stay focused | P1 | CD-003 |
| US-V003 | As a System, I need to allow messages and files to pass between participants so that resources can be shared | P0 | CD-003 |
| US-V004 | As a System, I need to monitor time so that sessions are tracked for billing | P0 | CD-003 |
| US-V005 | As a System, I need to record conversations so that sessions can be reviewed | P1 | CD-003 |
| US-V006 | As a System, I need to enable assessment by each participant at end of session so that quality is tracked | P0 | CD-003 |
| US-V007 | As a System, I need AI-powered session summaries and transcripts so that learning is captured | P1 | CD-003 |

---

## Platform/Navigation Stories (Implied from Mockups)

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P001 | As a User, I need a Browse Menu for course and creator search so that I can discover content | P0 | CD-002 |
| US-P002 | As a User, I need a "My Community" feed (X.com-style) so that I see followed content | P1 | CD-002 |
| US-P003 | As a User, I need a Dashboard view so that I see my activity at a glance | P0 | CD-002 |
| US-P004 | As a User, I need a Messages section so that I can access conversations | P0 | CD-002 |
| US-P005 | As a User, I need a Profile section so that I can manage my account | P0 | CD-002 |
| US-P006 | As a User, I need session booking/purchasing integrated with teacher discovery so that I can easily book | P0 | CD-002 |

---

## Infrastructure Stories (Gap Analysis - 2025-11-30)

*These stories were identified during Phase 2.5 technology research as gaps not covered by existing user stories.*

### Authentication & Identity

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P007 | As a User, I need to create an account with email/password so that I can access the platform | P0 | Gap Analysis |
| US-P008 | As a User, I need to log in securely so that I can access my account | P0 | Gap Analysis |
| US-P009 | As a User, I need to reset my password via email so that I can recover my account | P0 | Gap Analysis |
| US-P010 | As a User, I need to log out so that I can secure my session | P0 | Gap Analysis |
| US-P011 | As a User, I need social login options (Google, etc.) so that I can sign up quickly | P2 | Gap Analysis |
| US-P012 | As a System, I need to manage user sessions securely so that accounts are protected | P0 | Gap Analysis |
| US-P013 | As a System, I need to verify email addresses so that accounts are legitimate | P0 | Gap Analysis |

### Email & Notifications

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P014 | As a System, I need to send transactional emails (welcome, receipts, confirmations) so that users are informed | P0 | Gap Analysis |
| US-P015 | As a System, I need to send session reminder emails so that users don't miss appointments | P0 | Gap Analysis |
| US-P016 | As a System, I need to send payment confirmation emails so that financial transactions are documented | P0 | Gap Analysis |
| US-P017 | As a User, I need in-app notifications for messages, sessions, and updates so that I stay informed | P0 | Gap Analysis |
| US-P018 | As a User, I need to manage my notification preferences so that I control what alerts I receive | P1 | Gap Analysis |
| US-P019 | As a System, I need to send certificate notification emails so that achievements are celebrated | P1 | Gap Analysis |

### Calendar & Scheduling Infrastructure

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P020 | As a System, I need to display available time slots from teacher calendars so that students can book | P0 | Gap Analysis |
| US-P021 | As a System, I need to prevent double-booking of sessions so that schedules don't conflict | P0 | Gap Analysis |
| US-P022 | As a System, I need to handle timezone conversions so that global users see correct times | P0 | Gap Analysis |
| US-P023 | As a System, I need to send calendar invites (ICS) for booked sessions so that users can add to their calendars | P1 | Gap Analysis |
| US-P024 | As a Student, I need to select from available time slots when booking so that I can choose convenient times | P0 | Gap Analysis |
| US-P025 | As a Teacher, I need to sync my availability with external calendars so that my schedule stays current | P2 | Gap Analysis |

### Payment Infrastructure

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P026 | As a System, I need to process credit card payments securely so that students can pay for courses | P0 | Gap Analysis |
| US-P027 | As a System, I need to split payments automatically (15% AP, 15% Creator, 70% Teacher) so that revenue is distributed correctly | P0 | Gap Analysis |
| US-P028 | As a System, I need to hold funds until session completion so that refunds can be processed if needed | P0 | Gap Analysis |
| US-P029 | As a System, I need to process payouts to Teachers/Creators so that they receive their earnings | P0 | Gap Analysis |
| US-P030 | As a System, I need to handle refund requests so that cancellations are processed financially | P0 | Gap Analysis |
| US-P031 | As a Teacher, I need to connect my bank account/payment method so that I can receive payouts | P0 | Gap Analysis |
| US-P032 | As a System, I need to generate tax documents (1099s) for teachers/creators so that tax obligations are met | P1 | Gap Analysis |
| US-P033 | As an Employer, I need to pay via invoice/PO so that corporate purchasing is supported | P2 | Gap Analysis |

### AI Transcription (Video Session Support)

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-V008 | As a System, I need to transcribe recorded sessions to text so that content is searchable | P1 | Gap Analysis |
| US-V009 | As a System, I need to generate session summaries from transcripts so that key points are captured | P1 | Gap Analysis |
| US-V010 | As a Student, I need to access transcripts of my sessions so that I can review what was discussed | P1 | Gap Analysis |
| US-V011 | As a Student, I need to search within session transcripts so that I can find specific topics | P2 | Gap Analysis |

### Database Infrastructure

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P034 | As a System, I need a relational database to store user accounts, courses, sessions, and transactions so that data is persisted reliably | P0 | Gap Analysis |
| US-P035 | As a System, I need database backups and point-in-time recovery so that data loss is prevented | P0 | Gap Analysis |
| US-P036 | As a System, I need database connection pooling so that the application scales under load | P1 | Gap Analysis |
| US-P037 | As a System, I need to encrypt sensitive data at rest so that user information is protected | P0 | Gap Analysis |

### File & Object Storage

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P038 | As a System, I need object storage for large files (videos, PDFs, recordings) so that media is stored cost-effectively | P0 | Gap Analysis |
| US-P039 | As a System, I need secure file upload endpoints so that users can upload profile media and course materials | P0 | Gap Analysis |
| US-P040 | As a System, I need file type validation and virus scanning so that malicious uploads are blocked | P0 | Gap Analysis |
| US-P041 | As a System, I need signed URLs for private file access so that only authorized users can download files | P0 | Gap Analysis |
| US-P042 | As a System, I need to store BBB session recordings so that recorded sessions are accessible after the session ends | P0 | Gap Analysis |
| US-P043 | As a System, I need file size limits and quota management so that storage costs are controlled | P1 | Gap Analysis |
| US-P044 | As a Creator, I need to upload course materials (PDFs, videos) so that students can access learning resources | P0 | Gap Analysis |
| US-P045 | As a User, I need to upload profile pictures and videos so that my profile is personalized | P0 | Gap Analysis |

### Image Optimization

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P046 | As a System, I need automatic image resizing and thumbnail generation so that images load quickly | P0 | Gap Analysis |
| US-P047 | As a System, I need image format conversion (WebP, AVIF) so that modern browsers get optimized formats | P1 | Gap Analysis |
| US-P048 | As a System, I need responsive image variants (srcset) so that appropriate sizes are served per device | P1 | Gap Analysis |
| US-P049 | As a System, I need image CDN delivery so that images load fast globally | P0 | Gap Analysis |
| US-P050 | As a System, I need lazy loading for images so that page load performance is optimized | P1 | Gap Analysis |

### Gamification System (from CD-010)

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P051 | As a System, I need to track goodwill points for user actions so that engagement is gamified | P2 | CD-010 |
| US-P052 | As a System, I need to calculate power user tiers based on points so that progression is visible | P2 | CD-010 |
| US-P053 | As a System, I need to display leaderboards/rankings so that community standing is transparent | P3 | CD-010 |

### Teacher Matchmaking (from CD-010)

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P054 | As a System, I need to provide Teacher Student matchmaking with random default so that students can find teachers | P1 | CD-010 |
| US-P055 | As a System, I need to show Teacher Student profiles for selection so that students can choose deliberately | P1 | CD-010 |

### Credentialing & Content Requests (from CD-011)

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P056 | As a System, I need to issue Certificates of Mastery (separate from completion) so that deeper understanding is credentialed | P1 | CD-011 |
| US-P057 | As a System, I need to process content requests from students so that gaps in offerings are tracked | P2 | CD-011 |
| US-P058 | As a System, I need to track Teacher Student points for activity so that gamification motivates teachers | P2 | CD-011 |
| US-P059 | As a System, I need to handle bidirectional opt-out for Student-Teacher relationships so that both parties can exit gracefully | P1 | CD-011 |

### MVP Gap Stories (from CD-012)

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P060 | As a Student, I need a home/landing page showing enrolled courses, next session, and progress at a glance so that I can quickly see my status | P0 | CD-012 |
| US-P061 | As a Student-Teacher, I need to recommend a student for certification so that the Creator can approve completion | P0 | CD-012 |
| US-P062 | As a Creator, I need to see certification requests in my dashboard so that I can approve student completions | P0 | CD-012 |
| US-P063 | As a Creator, I need to see Student-Teacher applications in my dashboard so that I can approve new teachers for my course | P0 | CD-012 |
| US-P064 | As a Creator, I need to approve payout requests in my dashboard so that Student-Teachers receive their earnings | P0 | CD-012 |

---

## Community Moderator Stories

*Note: Community Moderator is a NEW role identified in CD-010 (Miro Board). Distinct from Creator - handles day-to-day community support. Role code: M*

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-M001 | As a Community Moderator, I need to answer questions in community chats so that students get timely support | P1 | CD-010 |
| US-M002 | As a Community Moderator, I need to troubleshoot common issues so that students aren't blocked | P1 | CD-010 |
| US-M003 | As a Community Moderator, I need to moderate course-related chats so that community standards are maintained | P1 | CD-010 |
| US-M004 | As a Community Moderator, I need to add users to closed/private chats so that access is managed | P2 | CD-010 |
| US-M005 | As a Community Moderator, I need a support dashboard so that I can see pending questions and issues | P1 | CD-010 |
| US-M006 | As a Community Moderator, I need to delete inappropriate posts in the community feed so that community standards are maintained | P0 | CD-013 |
| US-M007 | As a Community Moderator, I need to ban users from posting (temp or permanent) so that repeat offenders are handled | P1 | CD-013 |
| US-M008 | As a Community Moderator, I need to pin important posts so that key announcements are visible | P1 | CD-013 |
| US-M009 | As a Community Moderator, I need to see a queue of flagged content so that I can review and act on reports | P0 | CD-013 |

---

## Community Feed Stories (from CD-013)

*Note: These stories detail specific community feed functionality beyond basic feed viewing (US-S025, US-P002)*

### Student Feed Interactions

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S036 | As a Student, I need to create text posts in the community feed so that I can share questions and updates | P0 | CD-013 |
| US-S037 | As a Student, I need to like posts so that I can show appreciation | P0 | CD-013 |
| US-S038 | As a Student, I need to bookmark posts so that I can save content for later | P1 | CD-013 |
| US-S039 | As a Student, I need to reply to posts so that I can engage in discussions | P0 | CD-013 |
| US-S040 | As a Student, I need to repost content so that I can share valuable posts with my followers | P1 | CD-013 |
| US-S041 | As a Student, I need to flag inappropriate content so that moderators can review it | P1 | CD-013 |

### Student-Teacher Feed Interactions

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T017 | As a Student-Teacher, I need to post my availability to the community feed so that potential students can find me | P0 | CD-013 |
| US-T018 | As a Student-Teacher, I need to share teaching tips in the feed so that I can build my reputation | P1 | CD-013 |

### Creator Feed Interactions

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C031 | As a Creator, I need to post course announcements to the feed so that students are informed | P0 | CD-013 |
| US-C032 | As a Creator, I need to pin posts to my course's feed section so that important content is visible | P1 | CD-013 |

---

## Video Session Stories (from CD-014)

*Note: These stories detail specific video conferencing functionality beyond basic session stories (US-V001-V007)*

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T019 | As a Student-Teacher, I need to access recordings of my teaching sessions so that I can review and improve | P1 | CD-014 |
| US-S042 | As a Student, I need to join video sessions directly from my dashboard so that I don't need external links | P0 | CD-014 |
| US-S043 | As a Student, I need to join video sessions from email notification links so that I can connect quickly | P0 | CD-014 |

---

## Calendar/Scheduling Stories (from CD-015)

*Note: These stories detail specific booking flow functionality beyond basic calendar stories (US-P020-P025)*

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S044 | As a Student, I need to click "Schedule Session" from a course listing so that I can book a tutoring session | P0 | CD-015 |
| US-S045 | As a Student, I need to see a list of available Student-Teacher time slots for a selected day so that I can choose a convenient time | P0 | CD-015 |
| US-S046 | As a Student, I need to receive both email and in-app notifications when I book a session so that I have confirmation | P0 | CD-015 |
| US-P065 | As a System, I need to generate and deliver BBB links when sessions are booked so that participants can join | P0 | CD-015 |

---

## Student Profile Stories (from CD-018)

*Note: These stories detail the student profile system for hypothesis validation (H4, H6)*

### Student Profile Features

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S047 | As a Student, I need a privacy toggle (public/private) on my profile so that I control my visibility | P0 | CD-018 |
| US-S048 | As a Student, I need to follow other users (students, Student-Teachers) so that I can build connections | P0 | CD-018 |
| US-S049 | As a Student, I need to view my followers and following lists so that I can see my network | P1 | CD-018 |
| US-S050 | As a Student, I need to browse a Student-Teacher directory so that I can discover who can teach me | P0 | CD-018 |
| US-S051 | As a Student, I need to search for Student-Teachers by name or interests so that I can find a good match | P1 | CD-018 |

### Student-Teacher Signaling

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T020 | As a Student-Teacher, I need an "Available as Student-Teacher" toggle so that I appear in the ST directory | P0 | CD-018 |
| US-T021 | As a Student-Teacher, I need a "Teaching" badge displayed on my profile so that my role is visible | P0 | CD-018 |
| US-T022 | As a Student-Teacher, I need to display my list of courses certified to teach so that students know my qualifications | P0 | CD-018 |

### Profile System Infrastructure

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P066 | As a System, I need a Student-Teacher directory showing all users with ST toggle ON so that discovery is enabled | P0 | CD-018 |
| US-P067 | As a System, I need to track follow relationships (social graph) so that network effects can be measured | P0 | CD-018 |
| US-P068 | As a System, I need to display follower/following counts on profiles so that social proof is visible | P0 | CD-018 |
| US-P069 | As a System, I need to display reputation (average star rating, rating count) on profiles (read-only in MVP) so that quality is visible | P1 | CD-018 |
| US-P070 | As a System, I need a profile strength/completion indicator so that users are encouraged to complete profiles | P2 | CD-018 |

---

## Course Content Delivery Stories (from CD-019)

*Note: These stories detail the minimal course content delivery system for MVP*

### Student Course Access

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-S052 | As a Student, I need a course page with organized module structure so that I can see the full learning path | P0 | CD-019 |
| US-S053 | As a Student, I need to access video content via external links (YouTube/Vimeo) so that I can watch lessons | P0 | CD-019 |
| US-S054 | As a Student, I need to access document links (Google Drive/Notion) so that I can read course materials | P0 | CD-019 |
| US-S055 | As a Student, I need to self-mark module progress (checkboxes) so that I can track my completion | P0 | CD-019 |
| US-S056 | As a Student, I need to schedule my next session from the course page so that I can continue my learning rhythm | P0 | CD-019 |

### Creator Course Monitoring

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-C033 | As a Creator, I need to monitor student completion progress so that I can see how students are advancing | P0 | CD-019 |
| US-C034 | As a Creator, I need to organize course content into modules so that learning is structured | P0 | CD-019 |

### Course Content Infrastructure

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P071 | As a System, I need to display module-based course pages with video and document links so that content is accessible | P0 | CD-019 |
| US-P072 | As a System, I need to track student progress checkboxes per module so that completion can be monitored | P0 | CD-019 |
| US-P073 | As a System, I need to show Creator a dashboard of student progress across their courses so that they can monitor completion | P0 | CD-019 |

---

## Payment & Escrow Stories (from CD-020)

*Note: These stories detail the semi-automated payment system. Extends US-P026-P033 with specific admin dashboard functionality.*

### Admin Payout Dashboard

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-A026 | As an Admin (Brian), I need a payout dashboard showing all pending payouts by recipient so that I can see who needs to be paid | P0 | CD-020 |
| US-A027 | As an Admin (Brian), I need a "Process Payout" button per recipient so that I can trigger individual payouts | P0 | CD-020 |
| US-A028 | As an Admin (Brian), I need a batch payout option ("Pay All") so that I can process all pending payouts at once | P1 | CD-020 |
| US-A029 | As an Admin (Brian), I need payout history and audit trail so that I can track what was paid and when | P0 | CD-020 |
| US-A030 | As an Admin (Brian), I need monthly summary reports so that I can review platform financial activity | P1 | CD-020 |

### Escrow & Release

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-P074 | As a System, I need to hold funds in escrow until milestone completion so that payouts are tied to course completion | P0 | CD-020 |
| US-P075 | As a System, I need clear release criteria for escrowed funds so that payout triggers are defined | P0 | CD-020 |
| US-P076 | As an Admin (Brian), I need to approve fund releases from escrow so that payouts require manual verification | P0 | CD-020 |

### Earnings Visibility

| ID | Story | Priority | Source |
|----|-------|----------|--------|
| US-T023 | As a Student-Teacher, I need to see my running balance (pending earnings) so that I know what I will be paid | P0 | CD-020 |
| US-C035 | As a Creator, I need to see my running balance (pending earnings) so that I know what I will be paid | P0 | CD-020 |

---

## Story Statistics

| Category | P0 | P1 | P2 | P3 | Total |
|----------|----|----|----|----|-------|
| Visitor/Guest | 11 | 4 | 0 | 0 | 15 |
| Admin | 16 | 12 | 1 | 0 | 29 |
| Creator | 12 | 15 | 8 | 1 | 36 |
| Student | 29 | 19 | 8 | 0 | 56 |
| Student-Teacher | 12 | 8 | 3 | 0 | 23 |
| Employer/Funder | 0 | 5 | 1 | 0 | 6 |
| Session (System) | 4 | 6 | 1 | 0 | 11 |
| Platform/Infrastructure | 49 | 14 | 9 | 1 | 73 |
| Community Moderator | 2 | 6 | 1 | 0 | 9 |
| **Total** | **135** | **89** | **32** | **2** | **258** |

### Gap Analysis Stories Added (2025-11-30)

| Category | P0 | P1 | P2 | Stories Added |
|----------|----|----|----|----|
| Authentication & Identity | 6 | 0 | 1 | US-P007 to US-P013 |
| Email & Notifications | 4 | 2 | 0 | US-P014 to US-P019 |
| Calendar & Scheduling | 4 | 1 | 1 | US-P020 to US-P025 |
| Payment Infrastructure | 6 | 1 | 1 | US-P026 to US-P033 |
| AI Transcription | 0 | 3 | 1 | US-V008 to US-V011 |
| Database Infrastructure | 3 | 1 | 0 | US-P034 to US-P037 |
| File & Object Storage | 7 | 1 | 0 | US-P038 to US-P045 |
| Image Optimization | 2 | 3 | 0 | US-P046 to US-P050 |
| **Gap Total** | **32** | **12** | **4** | **48 new stories** |

---

## Story Index by Source Document

| ID | Document | Stories Referenced |
|----|----------|-------------------|
| CD-001 | Business Plan | US-C021, US-T012 |
| CD-002 | Feature Summary | US-C005, US-C009–C010, US-C021–C023, US-S003–S007, US-S009–S012, US-S019, US-S021–S025, US-T004–T005, US-T007, US-T013, US-V007, US-P001–P006 |
| CD-003 | User Stories | US-A001–A025, US-C001–C020, US-S001–S002, US-S008, US-S013–S018, US-S020, US-S026–S027, US-T001–T011, US-E001–E006, US-V001–V006 |
| CD-004 | Impact Filter | US-A023 |
| CD-005 | Slack - GetStream | US-S025, US-P002 (reinforces feed requirement) |
| CD-006 | Slack - Calendar/BBB | US-C006, US-T001, US-P020–P025 (reinforces calendar/scheduling) |
| CD-007 | Slack - P2P Video | US-V001, US-V002, US-T007, US-A014 (P2P video for 1:1) |
| CD-008 | Meeting - Budget/Feed | US-S028, US-S025, US-S006 (follow creators, feed as funnel) |
| CD-009 | Slack - Blindside/Cloudflare | US-V001–V007, US-A013–A018 (BBB provider confirms video stories) |
| Gap Analysis | Tech Research Phase 2.5 | US-P007–P050, US-V008–V011 |
| CD-010 | Miro - Main Activities by Role | US-S029–S031, US-C024–C027, US-P051–P055, US-M001–M005 |
| CD-011 | Miro - Drivers & Action Items | US-S032–S035, US-T014–T016, US-C028–C030, US-P056–P059 |
| CD-012 | Meeting Prep - MVP Review | US-P060–P064 (MVP gap workflows: student home, certification, ST application, payout approval) |
| CD-013 | MVP Decision - Community Feed | US-S036–S041, US-T017–T018, US-C031–C032, US-M006–M009 (feed interactions, moderation) |
| CD-014 | MVP Decision - Video Conferencing | US-T019, US-S042–S043 (session recordings, join from dashboard/email) |
| CD-015 | Decision - Calendar/Scheduling | US-S044–S046, US-P065 (booking flow, ST slot visibility, BBB link generation) |
| CD-016 | Decision - Rebrand to PeerLoop | (None - branding only, no user story impact) |
| CD-017 | MVP Decision - Creator Profiles | (references existing US-C008–C010, US-S004; unified profile system) |
| CD-018 | MVP Decision - Student Profile System | US-S047–S051, US-T020–T022, US-P066–P070 (profile features, ST signaling, social graph) |
| CD-019 | Decision - Course Content Delivery | US-S052–S056, US-C033–C034, US-P071–P073 (course page, progress tracking, creator monitoring) |
| CD-020 | MVP Decision - Payment & Escrow | US-A026–A030, US-P074–P076, US-T023, US-C035 (admin payout dashboard, escrow, earnings visibility) |
| Gap Analysis | Visitor Stories | US-G001–G015 (pre-registration experience, homepage, course/creator discovery, authentication) |

---

## Current State

| Role | Prefix | Next Number |
|------|--------|-------------|
| Visitor/Guest | US-G | US-G016 |
| Admin | US-A | US-A031 |
| Creator | US-C | US-C036 |
| Student | US-S | US-S057 |
| Student-Teacher | US-T | US-T024 |
| Employer/Funder | US-E | US-E007 |
| Session (System) | US-V | US-V012 |
| Platform/Infrastructure | US-P | US-P077 |
| Community Moderator | US-M | US-M010 |

---

## Notes for Implementation

1. **P0 stories (135 total)** are required for Genesis Cohort launch with 4-5 founding creators
2. **Student-to-student messaging (US-S017)** flagged as "tricky" - needs careful design to prevent abuse
3. **Role switching (US-T005)** is critical UX - single account with multiple role views
4. **Post-session assessment (US-V006)** enables quality tracking for flywheel validation
5. **Earnings dashboard (US-T013, US-S012)** essential for demonstrating value to Student-Teachers
