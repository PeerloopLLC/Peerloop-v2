# PeerLoop User Stories - Merged Document

**Version:** 1.1  
**Date:** 2025-12-07  
**Sources:** 
- Fraser's USER-STORIES.md (CD-001 through CD-020)
- Brian's block-1-actor-stories.md (Dec 6-7, 2025 decisions)
- Brian's update (Dec 7): Build social/messaging features per Fraser's spec

**Purpose:** Unified user stories - aligned on building full platform features

---

## How to Read This Document

- Stories use Fraser's format: `US-[Role][NNN]`
- Priorities: **P0** (MVP critical), **P1** (high), **P2** (medium), **P3** (nice to have)
- **⚠️ CONFLICT** = Fraser and Brian docs disagree - needs resolution
- **📝 BRIAN'S DECISION** = Brian made specific decision in Actor Stories
- **🆕 GAP** = Not in Fraser's original doc but in Brian's decisions

---

## User Roles

| Role | Code | Description |
|------|------|-------------|
| **Visitor/Guest** | G | Non-logged in user browsing public site |
| **Student** | S | Learner progressing through courses |
| **Student-Teacher** | T | Graduate who teaches peers (earns 70%) |
| **Creator** | C | Course creator who manages their course |
| **Admin (Brian)** | A | Platform operations and oversight |
| **Employer/Funder** | E | Third party paying for student enrollment |
| **Community Moderator** | M | Course community support staff |
| **System** | V, P | Automated platform functionality |

---

# VISITOR/GUEST STORIES

*Note: These cover pre-registration experience. Brian's Actor Stories starts after login.*

## Homepage & Promotional Content

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-G001 | As a Visitor, I need to view the homepage so that I can understand what PeerLoop offers | P0 | Fraser | |
| US-G002 | As a Visitor, I need to see promotional content (how it works, benefits, pricing info) so that I can decide if PeerLoop is right for me | P0 | Fraser | |
| US-G003 | As a Visitor, I need to see success stories or testimonials so that I can trust the platform | P1 | Fraser | |
| US-G004 | As a Visitor, I need to see the value proposition (Learn, Teach, Earn) so that I understand the unique model | P0 | Fraser | |

## Course Discovery

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-G005 | As a Visitor, I need to browse available courses so that I can see what I could learn | P0 | Fraser | |
| US-G006 | As a Visitor, I need to view course details (description, curriculum outline, price) so that I can evaluate courses | P0 | Fraser | ✅ Matches Actor Stories |
| US-G007 | As a Visitor, I need to see course pricing without logging in so that I can assess affordability | P0 | Fraser | ✅ Matches Actor Stories |

## Creator/Teacher Discovery

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-G008 | As a Visitor, I need to view creator profiles (public info) so that I can evaluate their expertise | P0 | Fraser | |
| US-G009 | As a Visitor, I need to see Student-Teacher profiles (public info) so that I can see who might teach me | P1 | Fraser | |
| US-G010 | As a Visitor, I need to see creator credentials and course stats so that I can trust the instructors | P1 | Fraser | |

## Authentication Actions

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-G011 | As a Visitor, I need to sign up for an account so that I can enroll in courses | P0 | Fraser | ✅ Matches Actor Stories |
| US-G012 | As a Visitor, I need to log in to my existing account so that I can access my enrolled courses | P0 | Fraser | ✅ Matches Actor Stories |
| US-G013 | As a Visitor, I need to reset my password if forgotten so that I can recover my account | P0 | Fraser | ✅ Matches Actor Stories |

## Access Restrictions

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-G014 | As a Visitor, I need to see a prompt to sign up when I try to enroll so that I understand registration is required | P0 | Fraser | |
| US-G015 | As a Visitor, I need to see gated content indicators (e.g., "Sign in to view community") so that I know what requires login | P1 | Fraser | |

---

# ADMIN (BRIAN) STORIES

## Enrollment & Account Management

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-A001 | As an Admin, I need to enroll teachers (Creators) so that they can offer courses on the platform | P0 | Fraser | ✅ Matches Actor Stories (Brian onboards Creators manually) |
| US-A002 | As an Admin, I need to cancel a teacher (with reason) so that I can remove problematic instructors | P1 | Fraser | |
| US-A003 | As an Admin, I need to cancel a student (with reason) so that I can enforce community standards | P1 | Fraser | |
| US-A004 | As an Admin, I need to vet teacher certificates so that only qualified instructors teach | P0 | Fraser | |

## Financial Operations

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-A005 | As an Admin, I need to pay teachers from student enrollments so that the 15/15/70 revenue split is distributed | P0 | Fraser | **⚠️ CONFLICT:** Fraser says Admin pays. **📝 BRIAN'S DECISION:** Creator approves payout → Stripe auto-processes |
| US-A006 | As an Admin, I need to refund students if they cancel so that we maintain customer satisfaction | P0 | Fraser | ✅ Matches Actor Stories (Brian handles refunds) |
| US-A007 | As an Admin, I need to chargeback teachers for cancellations so that creators bear responsibility for their commitments | P1 | Fraser | |
| US-A008 | As an Admin, I need to allow third party organizations to pay for students so that employers can sponsor learning | P1 | Fraser | Not in Actor Stories |
| US-A009 | As an Admin, I need to send success/failure assessments to funders so that sponsors can track ROI | P1 | Fraser | Not in Actor Stories |

## Communication

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-A010 | As an Admin, I need to message teachers so that I can communicate platform updates and issues | P0 | Fraser | ✅ Will build messaging system |
| US-A011 | As an Admin, I need to message students so that I can provide support and announcements | P0 | Fraser | ✅ Will build messaging system |
| US-A012 | As an Admin, I need to contact potential students by email re: courses and teachers referred by users so that referrals convert to enrollments | P1 | Fraser | |

## Session Facilitation

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-A013 | As an Admin, I need to facilitate tutor sessions for any teacher-student combination so that peer learning can happen | P0 | Fraser | ✅ System handles via BBB |
| US-A014 | As an Admin, I need video calls with recording potential so that sessions can be reviewed | P0 | Fraser | **⚠️ CONFLICT:** Fraser P0. **📝 BRIAN'S DECISION:** Recording is Block 2 |
| US-A015 | As an Admin, I need AI-powered session summaries & transcripts so that learning is documented | P1 | Fraser | |
| US-A016 | As an Admin, I need monitored session time so that billing is accurate | P0 | Fraser | |
| US-A017 | As an Admin, I need screen sharing in sessions so that teachers can demonstrate concepts | P0 | Fraser | ✅ Matches Actor Stories |
| US-A018 | As an Admin, I need to store tutor sessions with date/time/people parameters so that session history is maintained | P0 | Fraser | ✅ System stores session records |

## Analytics & Monitoring

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-A019 | As an Admin, I need to monitor user time on site and retention so that I can measure engagement | P1 | Fraser | |
| US-A020 | As an Admin, I need to monitor courses taken by user, teacher, creator stats so that I can track platform health | P1 | Fraser | |
| US-A021 | As an Admin, I need to monitor fees paid, distributed, income per creator so that I can ensure financial accuracy | P0 | Fraser | ✅ Brian can access Stripe dashboard |
| US-A022 | As an Admin, I need to monitor session status (cancel, complete) so that I can track service delivery | P1 | Fraser | |
| US-A023 | As an Admin, I need to monitor student to teacher conversion so that I can validate the flywheel | P0 | Fraser | ✅ Key hypothesis validation |
| US-A024 | As an Admin, I need to monitor percentage grade averages so that I can track learning quality | P1 | Fraser | |
| US-A025 | As an Admin, I need to determine where new users originate from so that I can optimize acquisition | P2 | Fraser | |

## Admin Payout Dashboard (from CD-020)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-A026 | As an Admin (Brian), I need a payout dashboard showing all pending payouts by recipient so that I can see who needs to be paid | P0 | Fraser | **⚠️ CONFLICT:** **📝 BRIAN'S DECISION:** Creator sees/approves payouts, not Admin dashboard |
| US-A027 | As an Admin (Brian), I need a "Process Payout" button per recipient so that I can trigger individual payouts | P0 | Fraser | **⚠️ CONFLICT:** Creator clicks Approve Payout, not Admin |
| US-A028 | As an Admin (Brian), I need a batch payout option ("Pay All") so that I can process all pending payouts at once | P1 | Fraser | |
| US-A029 | As an Admin (Brian), I need payout history and audit trail so that I can track what was paid and when | P0 | Fraser | |
| US-A030 | As an Admin (Brian), I need monthly summary reports so that I can review platform financial activity | P1 | Fraser | |

---

# CREATOR STORIES

## Course Management

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-C001 | As a Creator, I need to enter courses, training syllabi, quizzes, reference materials so that students have structured learning paths | P0 | Fraser | **⚠️ CONFLICT:** Fraser says Creator enters content. **📝 BRIAN'S DECISION:** Brian enters content in database, Creator provides links |
| US-C002 | As a Creator, I need to define criteria for successful completion so that certification is meaningful | P0 | Fraser | ✅ Creator approves certifications |
| US-C003 | As a Creator, I need to set training progression and criteria to level up so that students advance appropriately | P0 | Fraser | |
| US-C004 | As a Creator, I need to retire a course so that outdated content is removed | P2 | Fraser | |
| US-C005 | As a Creator, I need flexible assessments so that I can test understanding in various ways | P1 | Fraser | Not in Block 1 |

## Scheduling & Availability

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-C006 | As a Creator, I need to offer times for tutoring via a calendar of availability so that students can book sessions | P0 | Fraser | **Note:** This is for Creator-as-Instructor. S-T availability covered separately |
| US-C007 | As a Creator, I need to cancel a particular scheduled session with a student so that I can handle conflicts | P1 | Fraser | |

## Profile & Presence

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-C008 | As a Creator, I need to enter a profile with pictures, videos, PDFs so that students can evaluate my expertise | P0 | Fraser | **⚠️ CONFLICT:** Fraser P0 for uploads. **📝 BRIAN'S DECISION:** Brian enters content, no upload feature in Block 1 |
| US-C009 | As a Creator, I need a profile card with stats (Active Student-Teachers, Avg Taught per Teacher, badges) so that my success is visible | P1 | Fraser | |
| US-C010 | As a Creator, I need a "Creator Studio" button to access course management so that I can easily edit content | P1 | Fraser | |

## Student-Teacher Management

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-C011 | As a Creator, I need to vet student-turned-teachers so that teaching quality is maintained | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** Creator approves S-T applications |
| US-C012 | As a Creator, I need to monitor/assess student-turned-teachers so that I can ensure ongoing quality | P1 | Fraser | ✅ Creator sees S-T list with stats |
| US-C013 | As a Creator, I need to cancel a student for cause so that I can remove problematic learners | P1 | Fraser | |

## Certification & Assessment

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-C014 | As a Creator, I need to grant certificates to students of successful completion so that achievement is recognized | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** S-T recommends → Creator approves → Certificate issued |
| US-C015 | As a Creator, I need to capture and send assessments of students on progress/completion so that progress is documented | P1 | Fraser | |
| US-C016 | As a Creator, I need to earn a teaching certificate for each course taught (displayed on profile) so that my expertise is credentialed | P1 | Fraser | |

## Communication & Support

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-C017 | As a Creator, I need to message students so that I can provide guidance and support | P0 | Fraser | ✅ Will build messaging system |
| US-C018 | As a Creator, I need to message AP so that I can get platform support | P0 | Fraser | ✅ Will build messaging system |
| US-C019 | As a Creator, I need to refer potential students to AP re: my courses so that I can grow my audience | P2 | Fraser | |
| US-C020 | As a Creator, I need to ask AI for assistance when both teacher and student are stumped so that learning continues | P1 | Fraser | |

## Community Management

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-C021 | As a Creator, I need community hubs with forums so that students can interact | P1 | Fraser | ✅ Will build community features |
| US-C022 | As a Creator, I need to assign Community Roles (paid assistants with revenue sharing) so that I can scale my community | P2 | Fraser | |
| US-C023 | As a Creator, I need control over community organization and content delivery so that I can customize the experience | P2 | Fraser | |
| US-C024 | As a Creator, I need to host AMA sessions so that I can build excitement and answer student questions | P2 | Fraser | |
| US-C025 | As a Creator, I need to share student success stories so that I can attract new students | P2 | Fraser | |
| US-C026 | As a Creator, I need to publish newsletters (potentially with subscription payments) so that I can engage my audience | P3 | Fraser | |
| US-C027 | As a Creator, I need to appoint Community Moderators so that I can scale community support | P1 | Fraser | |
| US-C028 | As a Creator, I need extended course analytics so that I can monitor student activity on my courses | P1 | Fraser | ✅ Basic stats in Creator Dashboard |
| US-C029 | As a Creator, I need to access student feedback on each Teacher Student so that I can monitor teaching quality | P1 | Fraser | |
| US-C030 | As a Creator, I need to build a loyal community with high switching cost so that my audience stays engaged | P2 | Fraser | |

## Creator Dashboard Functions (from Brian's Actor Stories)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| 🆕 US-C036 | As a Creator, I need to see enrolled students list with progress so that I can monitor my course | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-C037 | As a Creator, I need to see upcoming sessions for my course so that I can monitor activity | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-C038 | As a Creator, I need to see my Student-Teachers list with stats so that I can manage my teaching team | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-C039 | As a Creator, I need to approve payouts (70/15/15 split) so that S-Ts and I get paid | P0 | Brian | ✅ **📝 BRIAN'S DECISION:** Creator approves → Stripe auto-processes |

---

# STUDENT STORIES

## Discovery & Enrollment

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S001 | As a Student, I need to see what tutor courses are available so that I can choose what to learn | P0 | Fraser | ✅ Matches Actor Stories |
| US-S002 | As a Student, I need to pay for tutors so that I can access learning | P0 | Fraser | ✅ Matches Actor Stories (Stripe Checkout) |
| US-S003 | As a Student, I need to search for courses so that I can find relevant content | P0 | Fraser | Not explicitly in Actor Stories |
| US-S004 | As a Student, I need to search for Creators/Instructors with detailed profiles so that I can evaluate teachers | P0 | Fraser | Not explicitly in Actor Stories |
| US-S005 | As a Student, I need to view course detail pages with curriculum outline and time estimates so that I understand the commitment | P0 | Fraser | ✅ Matches Actor Stories |
| US-S006 | As a Student, I need action buttons (Enroll, Explore Teaching, Follow Course, Join Community) so that I can take next steps | P0 | Fraser | ⚠️ Partial - Enroll yes, others not in Block 1 |
| US-S007 | As a Student, I need related courses suggestions so that I can continue learning | P2 | Fraser | |

## Profile & Account

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S008 | As a Student, I need to enter a profile with picture (public and private sections) so that I control my visibility | P0 | Fraser | **⚠️ CONFLICT:** Fraser P0. **📝 BRIAN'S DECISION:** Basic info only in Block 1, full profiles Block 2 |
| US-S009 | As a Student, I need a unified dashboard for student/teacher activity tracking so that I see my progress | P0 | Fraser | ✅ Matches Actor Stories |
| US-S010 | As a Student, I need a calendar view so that I can manage my schedule | P1 | Fraser | |
| US-S011 | As a Student, I need quick action buttons so that common tasks are accessible | P1 | Fraser | |
| US-S012 | As a Student, I need earnings tracking so that I can see my teaching income | P0 | Fraser | **Note:** This is for when Student becomes S-T |

## Session Management

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S013 | As a Student, I need to reschedule a session with teacher so that I can handle conflicts | P1 | Fraser | **📝 BRIAN'S DECISION:** Not in Block 1, contact S-T directly |
| US-S014 | As a Student, I need to cancel a session so that I can handle emergencies | P1 | Fraser | **📝 BRIAN'S DECISION:** Not in Block 1, contact S-T directly |
| US-S015 | As a Student, I need to cancel a course (with reason) so that I can exit if needed | P1 | Fraser | **📝 BRIAN'S DECISION:** Contact Brian for refunds |

## Communication

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S016 | As a Student, I need to message teachers so that I can ask questions | P0 | Fraser | ✅ Will build messaging system |
| US-S017 | As a Student, I need to message other students so that I can collaborate (noted as tricky) | P2 | Fraser | |
| US-S018 | As a Student, I need to message AP so that I can get support | P0 | Fraser | ✅ Will build messaging system |
| US-S019 | As a Student, I need a private messaging system so that I can have 1-on-1 conversations | P0 | Fraser | ✅ Will build messaging system |

## Progression & Certification

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S020 | As a Student, I need to apply for teacher status so that I can transition to earning | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** Student clicks Apply → Creator approves |
| US-S021 | As a Student, I need to earn a Learning Certificate upon completion so that my achievement is recognized | P0 | Fraser | ✅ Creator approves → Certificate issued |
| US-S022 | As a Student, I need to earn a Teaching Certificate when I become a teacher so that my teaching ability is credentialed | P0 | Fraser | |
| US-S023 | As a Student, I need my Teaching Certificate to dynamically update with student count so that my experience is visible | P1 | Fraser | |
| US-S024 | As a Student, I need access to gated communities based on credentials so that I can join advanced groups | P1 | Fraser | |

## Community & Discovery

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S025 | As a Student, I need an X.com-style algorithmic feed of followed content so that I discover relevant posts | P1 | Fraser | ✅ Will build community feed |
| US-S026 | As a Student, I need to refer potential students to AP re: courses and teachers so that I can help others | P2 | Fraser | |
| US-S027 | As a Student, I need to ask AI for assistance when both teacher and student are stumped so that learning continues | P1 | Fraser | |
| US-S028 | As a Student, I need to follow creators so that their content appears in my feed before I enroll | P0 | Fraser | **⚠️ CONFLICT:** Fraser P0. Not in Actor Stories Block 1 |
| US-S029 | As a Student, I need to select a Teacher Student (with random as default) so that I can choose my mentor | P1 | Fraser | ✅ Student selects S-T when booking |
| US-S030 | As a Student, I need to earn goodwill points through participation so that my engagement is recognized | P2 | Fraser | |
| US-S031 | As a Student, I need to see my power user level/tier so that I can track my community standing | P2 | Fraser | |
| US-S032 | As a Student, I need to earn a Certificate of Mastery (separate from completion) so that I can prove deeper understanding | P1 | Fraser | |
| US-S033 | As a Student, I need to request content that doesn't exist so that gaps in course offerings are filled | P2 | Fraser | |
| US-S034 | As a Student, I need to opt out of a Teacher Student relationship at any point so that I can find a better match | P1 | Fraser | |
| US-S035 | As a Student, I need to select a Teacher Student by schedule availability so that I can book convenient times | P1 | Fraser | ✅ In Actor Stories |

## Student Dashboard Functions (from Brian's Actor Stories)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| 🆕 US-S057 | As a Student, I need to see my enrolled course with progress bar so that I know where I am | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-S058 | As a Student, I need to see my upcoming session with Join button so that I can attend | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-S059 | As a Student, I need to access course content with module list and external links so that I can learn | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-S060 | As a Student, I need to mark modules complete (checkboxes) so that I can track my progress | P0 | Brian | ✅ In Actor Stories |

---

# STUDENT-TEACHER STORIES

## Scheduling & Availability

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-T001 | As a Student-Teacher, I need to offer times for tutoring via a calendar of availability so that students can book me | P0 | Fraser | ✅ Matches Actor Stories |
| US-T002 | As a Student-Teacher, I need to cancel a particular scheduled session with a student so that I can handle conflicts | P1 | Fraser | **📝 BRIAN'S DECISION:** Not in Block 1, coordinate manually |

## Profile & Presence

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-T003 | As a Student-Teacher, I need to enter a profile with pictures, videos, PDFs so that students can evaluate me | P0 | Fraser | **⚠️ CONFLICT:** Fraser P0 for uploads. **📝 BRIAN'S DECISION:** Basic info only, no uploads in Block 1 |
| US-T004 | As a Student-Teacher, I need a public profile showing my credentials so that students trust my expertise | P0 | Fraser | ✅ Name, students taught shown |
| US-T005 | As a Student-Teacher, I need a "Switch User" button to toggle between student and teacher modes so that I can use both functions | P0 | Fraser | |

## Teaching & Certification

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-T006 | As a Student-Teacher, I need to grant certificates to students of successful completion so that I can certify learners | P0 | Fraser | **⚠️ CONFLICT:** Fraser says S-T grants. **📝 BRIAN'S DECISION:** S-T recommends → Creator approves |
| US-T007 | As a Student-Teacher, I need to conduct video sessions with screen sharing so that I can teach effectively | P0 | Fraser | ✅ Matches Actor Stories (BBB) |

## Communication & Support

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-T008 | As a Student-Teacher, I need to message students so that I can provide support | P0 | Fraser | ✅ Will build messaging system |
| US-T009 | As a Student-Teacher, I need to message AP so that I can get platform support | P0 | Fraser | ✅ Will build messaging system |
| US-T010 | As a Student-Teacher, I need to refer potential students to AP re: my courses so that I can grow my student base | P2 | Fraser | |
| US-T011 | As a Student-Teacher, I need to ask AI for assistance when both I and student are stumped so that learning continues | P1 | Fraser | |

## Earnings

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-T012 | As a Student-Teacher, I need to receive 70% of session fees so that I earn from teaching | P0 | Fraser | ✅ Matches Actor Stories |
| US-T013 | As a Student-Teacher, I need an earnings dashboard so that I can track my income | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** S-T sees earnings after Creator approves payout |
| US-T014 | As a Student-Teacher, I need to opt out of a student relationship at any point so that I can manage difficult situations | P1 | Fraser | |
| US-T015 | As a Student-Teacher, I need to earn points for teaching activity so that my engagement is recognized | P2 | Fraser | |
| US-T016 | As a Student-Teacher, I need verifiable mastery credentials for career advancement so that teaching experience has professional value | P1 | Fraser | |

## Student-Teacher Dashboard Functions (from Brian's Actor Stories)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| 🆕 US-T024 | As a Student-Teacher, I need to see my assigned students with their progress so that I know where each student is | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-T025 | As a Student-Teacher, I need to see my upcoming sessions with Join buttons so that I can teach | P0 | Brian | ✅ In Actor Stories |
| 🆕 US-T026 | As a Student-Teacher, I need to click "Recommend for Certification" when student completes so that Creator can approve | P0 | Brian | ✅ **📝 BRIAN'S DECISION:** S-T recommends, Creator approves |
| 🆕 US-T027 | As a Student-Teacher, I need to receive booking notifications via email with BBB link so that I know when students book | P0 | Brian | ✅ In Actor Stories |

---

# EMPLOYER/FUNDER STORIES

*Note: Not covered in Brian's Actor Stories - potential Block 2+ feature*

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-E001 | As an Employer, I need to pay for a student to take a course so that I can sponsor employee learning | P1 | Fraser | Not in Actor Stories |
| US-E002 | As an Employer, I need to receive a copy of student progress and completion status so that I can track sponsored learners | P1 | Fraser | |
| US-E003 | As an Employer, I need to receive a copy of certification so that I have proof of completion | P1 | Fraser | |
| US-E004 | As an Employer, I need to enter a profile (possibly all private) so that I can manage my account | P1 | Fraser | |
| US-E005 | As an Employer, I need to message AP so that I can get support | P1 | Fraser | |
| US-E006 | As an Employer, I need to message my funded students for their funded courses so that I can check on progress | P2 | Fraser | |

---

# TUTOR SESSION STORIES (SYSTEM)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-V001 | As a System, I need to handle the video chat experience so that tutoring can happen | P0 | Fraser | ✅ BBB integration |
| US-V002 | As a System, I need to possibly limit the number of participants so that sessions stay focused | P1 | Fraser | 1-on-1 sessions |
| US-V003 | As a System, I need to allow messages and files to pass between participants so that resources can be shared | P0 | Fraser | BBB has chat |
| US-V004 | As a System, I need to monitor time so that sessions are tracked for billing | P0 | Fraser | |
| US-V005 | As a System, I need to record conversations so that sessions can be reviewed | P1 | Fraser | **📝 BRIAN'S DECISION:** Recording is Block 2 |
| US-V006 | As a System, I need to enable assessment by each participant at end of session so that quality is tracked | P0 | Fraser | Not in Actor Stories |
| US-V007 | As a System, I need AI-powered session summaries and transcripts so that learning is captured | P1 | Fraser | |

---

# PLATFORM/NAVIGATION STORIES

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P001 | As a User, I need a Browse Menu for course and creator search so that I can discover content | P0 | Fraser | |
| US-P002 | As a User, I need a "My Community" feed (X.com-style) so that I see followed content | P1 | Fraser | ✅ Will build community feed |
| US-P003 | As a User, I need a Dashboard view so that I see my activity at a glance | P0 | Fraser | ✅ Role-based dashboards |
| US-P004 | As a User, I need a Messages section so that I can access conversations | P0 | Fraser | ✅ Will build messaging system |
| US-P005 | As a User, I need a Profile section so that I can manage my account | P0 | Fraser | Basic profile in Block 1 |
| US-P006 | As a User, I need session booking/purchasing integrated with teacher discovery so that I can easily book | P0 | Fraser | ✅ Matches Actor Stories |

---

# INFRASTRUCTURE STORIES

## Authentication & Identity

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P007 | As a User, I need to create an account with email/password so that I can access the platform | P0 | Fraser | ✅ |
| US-P008 | As a User, I need to log in securely so that I can access my account | P0 | Fraser | ✅ |
| US-P009 | As a User, I need to reset my password via email so that I can recover my account | P0 | Fraser | ✅ |
| US-P010 | As a User, I need to log out so that I can secure my session | P0 | Fraser | ✅ |
| US-P011 | As a User, I need social login options (Google, etc.) so that I can sign up quickly | P2 | Fraser | Block 2 |
| US-P012 | As a System, I need to manage user sessions securely so that accounts are protected | P0 | Fraser | ✅ |
| US-P013 | As a System, I need to verify email addresses so that accounts are legitimate | P0 | Fraser | ✅ |

## Email & Notifications

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P014 | As a System, I need to send transactional emails (welcome, receipts, confirmations) so that users are informed | P0 | Fraser | ✅ Matches Actor Stories |
| US-P015 | As a System, I need to send session reminder emails so that users don't miss appointments | P0 | Fraser | **📝 BRIAN'S DECISION:** Reminders are Block 2 |
| US-P016 | As a System, I need to send payment confirmation emails so that financial transactions are documented | P0 | Fraser | ✅ |
| US-P017 | As a User, I need in-app notifications for messages, sessions, and updates so that I stay informed | P0 | Fraser | |
| US-P018 | As a User, I need to manage my notification preferences so that I control what alerts I receive | P1 | Fraser | |
| US-P019 | As a System, I need to send certificate notification emails so that achievements are celebrated | P1 | Fraser | ✅ After Creator approves |

## Calendar & Scheduling Infrastructure

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P020 | As a System, I need to display available time slots from teacher calendars so that students can book | P0 | Fraser | ✅ |
| US-P021 | As a System, I need to prevent double-booking of sessions so that schedules don't conflict | P0 | Fraser | ✅ |
| US-P022 | As a System, I need to handle timezone conversions so that global users see correct times | P0 | Fraser | |
| US-P023 | As a System, I need to send calendar invites (ICS) for booked sessions so that users can add to their calendars | P1 | Fraser | ✅ In Actor Stories |
| US-P024 | As a Student, I need to select from available time slots when booking so that I can choose convenient times | P0 | Fraser | ✅ |
| US-P025 | As a Teacher, I need to sync my availability with external calendars so that my schedule stays current | P2 | Fraser | Block 3 |

## Payment Infrastructure

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P026 | As a System, I need to process credit card payments securely so that students can pay for courses | P0 | Fraser | ✅ Stripe Checkout |
| US-P027 | As a System, I need to split payments automatically (15% AP, 15% Creator, 70% Teacher) so that revenue is distributed correctly | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** Creator approves → Stripe processes |
| US-P028 | As a System, I need to hold funds until milestone completion so that refunds can be processed if needed | P0 | Fraser | ✅ Escrow |
| US-P029 | As a System, I need to process payouts to Teachers/Creators so that they receive their earnings | P0 | Fraser | ✅ Stripe automated |
| US-P030 | As a System, I need to handle refund requests so that cancellations are processed financially | P0 | Fraser | Brian handles manually |
| US-P031 | As a Teacher, I need to connect my bank account/payment method so that I can receive payouts | P0 | Fraser | Stripe Connect or manual setup |
| US-P032 | As a System, I need to generate tax documents (1099s) for teachers/creators so that tax obligations are met | P1 | Fraser | Block 3 |
| US-P033 | As an Employer, I need to pay via invoice/PO so that corporate purchasing is supported | P2 | Fraser | |

## Database Infrastructure

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P034 | As a System, I need a relational database to store user accounts, courses, sessions, and transactions so that data is persisted reliably | P0 | Fraser | ✅ PostgreSQL |
| US-P035 | As a System, I need database backups and point-in-time recovery so that data loss is prevented | P0 | Fraser | ✅ |
| US-P036 | As a System, I need database connection pooling so that the application scales under load | P1 | Fraser | |
| US-P037 | As a System, I need to encrypt sensitive data at rest so that user information is protected | P0 | Fraser | ✅ |

## File & Object Storage

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P038 | As a System, I need object storage for large files (videos, PDFs, recordings) so that media is stored cost-effectively | P0 | Fraser | **📝 BRIAN'S DECISION:** External links (YouTube, Google Drive) in Block 1 |
| US-P039 | As a System, I need secure file upload endpoints so that users can upload profile media and course materials | P0 | Fraser | **⚠️ CONFLICT:** **📝 BRIAN'S DECISION:** No uploads in Block 1, Brian enters links |
| US-P040 | As a System, I need file type validation and virus scanning so that malicious uploads are blocked | P0 | Fraser | N/A if no uploads |
| US-P041 | As a System, I need signed URLs for private file access so that only authorized users can download files | P0 | Fraser | |
| US-P042 | As a System, I need to store BBB session recordings so that recorded sessions are accessible after the session ends | P0 | Fraser | **📝 BRIAN'S DECISION:** Recording is Block 2 |
| US-P043 | As a System, I need file size limits and quota management so that storage costs are controlled | P1 | Fraser | |
| US-P044 | As a Creator, I need to upload course materials (PDFs, videos) so that students can access learning resources | P0 | Fraser | **⚠️ CONFLICT:** External links in Block 1 |
| US-P045 | As a User, I need to upload profile pictures and videos so that my profile is personalized | P0 | Fraser | **⚠️ CONFLICT:** Basic profile in Block 1 |

## Image Optimization

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P046 | As a System, I need automatic image resizing and thumbnail generation so that images load quickly | P0 | Fraser | |
| US-P047 | As a System, I need image format conversion (WebP, AVIF) so that modern browsers get optimized formats | P1 | Fraser | |
| US-P048 | As a System, I need responsive image variants (srcset) so that appropriate sizes are served per device | P1 | Fraser | |
| US-P049 | As a System, I need image CDN delivery so that images load fast globally | P0 | Fraser | |
| US-P050 | As a System, I need lazy loading for images so that page load performance is optimized | P1 | Fraser | |

## MVP Gap Stories (from CD-012)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-P060 | As a Student, I need a home/landing page showing enrolled courses, next session, and progress at a glance so that I can quickly see my status | P0 | Fraser | ✅ Student Dashboard |
| US-P061 | As a Student-Teacher, I need to recommend a student for certification so that the Creator can approve completion | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** Confirmed |
| US-P062 | As a Creator, I need to see certification requests in my dashboard so that I can approve student completions | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** Confirmed |
| US-P063 | As a Creator, I need to see Student-Teacher applications in my dashboard so that I can approve new teachers for my course | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** Confirmed |
| US-P064 | As a Creator, I need to approve payout requests in my dashboard so that Student-Teachers receive their earnings | P0 | Fraser | ✅ **📝 BRIAN'S DECISION:** Confirmed |

---

# COMMUNITY MODERATOR STORIES

*Note: This is a NEW role. Will build community features per Fraser's spec.*

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-M001 | As a Community Moderator, I need to answer questions in community chats so that students get timely support | P1 | Fraser | ✅ Will build |
| US-M002 | As a Community Moderator, I need to troubleshoot common issues so that students aren't blocked | P1 | Fraser | |
| US-M003 | As a Community Moderator, I need to moderate course-related chats so that community standards are maintained | P1 | Fraser | |
| US-M004 | As a Community Moderator, I need to add users to closed/private chats so that access is managed | P2 | Fraser | |
| US-M005 | As a Community Moderator, I need a support dashboard so that I can see pending questions and issues | P1 | Fraser | |
| US-M006 | As a Community Moderator, I need to delete inappropriate posts in the community feed so that community standards are maintained | P0 | Fraser | |
| US-M007 | As a Community Moderator, I need to ban users from posting (temp or permanent) so that repeat offenders are handled | P1 | Fraser | |
| US-M008 | As a Community Moderator, I need to pin important posts so that key announcements are visible | P1 | Fraser | |
| US-M009 | As a Community Moderator, I need to see a queue of flagged content so that I can review and act on reports | P0 | Fraser | |

---

# COMMUNITY FEED STORIES (from CD-013)

*Note: Will build community feed per Fraser's spec.*

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S036 | As a Student, I need to create text posts in the community feed so that I can share questions and updates | P0 | Fraser | ✅ Will build |
| US-S037 | As a Student, I need to like posts so that I can show appreciation | P0 | Fraser | ✅ Will build |
| US-S038 | As a Student, I need to bookmark posts so that I can save content for later | P1 | Fraser | ✅ Will build |
| US-S039 | As a Student, I need to reply to posts so that I can engage in discussions | P0 | Fraser | ✅ Will build |
| US-S040 | As a Student, I need to repost content so that I can share valuable posts with my followers | P1 | Fraser | ✅ Will build |
| US-S041 | As a Student, I need to flag inappropriate content so that moderators can review it | P1 | Fraser | ✅ Will build |
| US-T017 | As a Student-Teacher, I need to post my availability to the community feed so that potential students can find me | P0 | Fraser | ✅ Will build |
| US-T018 | As a Student-Teacher, I need to share teaching tips in the feed so that I can build my reputation | P1 | Fraser | ✅ Will build |
| US-C031 | As a Creator, I need to post course announcements to the feed so that students are informed | P0 | Fraser | ✅ Will build |
| US-C032 | As a Creator, I need to pin posts to my course's feed section so that important content is visible | P1 | Fraser | ✅ Will build |

---

# PROFILE SYSTEM STORIES (from CD-018)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S047 | As a Student, I need a privacy toggle (public/private) on my profile so that I control my visibility | P0 | Fraser | **📝 BRIAN'S DECISION:** Basic profile only in Block 1 |
| US-S048 | As a Student, I need to follow other users (students, Student-Teachers) so that I can build connections | P0 | Fraser | **📝 BRIAN'S DECISION:** Block 2 |
| US-S049 | As a Student, I need to view my followers and following lists so that I can see my network | P1 | Fraser | |
| US-S050 | As a Student, I need to browse a Student-Teacher directory so that I can discover who can teach me | P0 | Fraser | Students see S-Ts when booking |
| US-S051 | As a Student, I need to search for Student-Teachers by name or interests so that I can find a good match | P1 | Fraser | |
| US-T020 | As a Student-Teacher, I need an "Available as Student-Teacher" toggle so that I appear in the ST directory | P0 | Fraser | Implicit when approved as S-T |
| US-T021 | As a Student-Teacher, I need a "Teaching" badge displayed on my profile so that my role is visible | P0 | Fraser | |
| US-T022 | As a Student-Teacher, I need to display my list of courses certified to teach so that students know my qualifications | P0 | Fraser | |
| US-P066 | As a System, I need a Student-Teacher directory showing all users with ST toggle ON so that discovery is enabled | P0 | Fraser | S-Ts shown in booking flow |
| US-P067 | As a System, I need to track follow relationships (social graph) so that network effects can be measured | P0 | Fraser | **📝 BRIAN'S DECISION:** Block 2 |
| US-P068 | As a System, I need to display follower/following counts on profiles so that social proof is visible | P0 | Fraser | Block 2 |
| US-P069 | As a System, I need to display reputation (average star rating, rating count) on profiles (read-only in MVP) so that quality is visible | P1 | Fraser | **📝 BRIAN'S DECISION:** No ratings in Block 1 |
| US-P070 | As a System, I need a profile strength/completion indicator so that users are encouraged to complete profiles | P2 | Fraser | |

---

# COURSE CONTENT DELIVERY STORIES (from CD-019)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-S052 | As a Student, I need a course page with organized module structure so that I can see the full learning path | P0 | Fraser | ✅ Matches Actor Stories |
| US-S053 | As a Student, I need to access video content via external links (YouTube/Vimeo) so that I can watch lessons | P0 | Fraser | ✅ Matches Actor Stories |
| US-S054 | As a Student, I need to access document links (Google Drive/Notion) so that I can read course materials | P0 | Fraser | ✅ Matches Actor Stories |
| US-S055 | As a Student, I need to self-mark module progress (checkboxes) so that I can track my completion | P0 | Fraser | ✅ Matches Actor Stories |
| US-S056 | As a Student, I need to schedule my next session from the course page so that I can continue my learning rhythm | P0 | Fraser | ✅ Matches Actor Stories |
| US-C033 | As a Creator, I need to monitor student completion progress so that I can see how students are advancing | P0 | Fraser | ✅ Creator Dashboard |
| US-C034 | As a Creator, I need to organize course content into modules so that learning is structured | P0 | Fraser | Brian sets up, Creator provides structure |
| US-P071 | As a System, I need to display module-based course pages with video and document links so that content is accessible | P0 | Fraser | ✅ |
| US-P072 | As a System, I need to track student progress checkboxes per module so that completion can be monitored | P0 | Fraser | ✅ |
| US-P073 | As a System, I need to show Creator a dashboard of student progress across their courses so that they can monitor completion | P0 | Fraser | ✅ |

---

# PAYMENT & ESCROW STORIES (from CD-020)

| ID | Story | Priority | Source | Notes |
|----|-------|----------|--------|-------|
| US-T023 | As a Student-Teacher, I need to see my running balance (pending earnings) so that I know what I will be paid | P0 | Fraser | ✅ S-T Dashboard |
| US-C035 | As a Creator, I need to see my running balance (pending earnings) so that I know what I will be paid | P0 | Fraser | ✅ Creator Dashboard |
| US-P074 | As a System, I need to hold funds in escrow until milestone completion so that payouts are tied to course completion | P0 | Fraser | ✅ |
| US-P075 | As a System, I need clear release criteria for escrowed funds so that payout triggers are defined | P0 | Fraser | Creator approves |
| US-P076 | As an Admin (Brian), I need to approve fund releases from escrow so that payouts require manual verification | P0 | Fraser | **⚠️ CONFLICT:** **📝 BRIAN'S DECISION:** Creator approves, not Admin |

---

# ALIGNMENT SUMMARY

## Resolved Items (Dec 7, 2025)

| # | Topic | Fraser Says | Brian's Updated Decision | Status |
|---|-------|-------------|--------------------------|--------|
| 1 | **Messaging System** | P0 - Build messaging | ✅ Will build per Fraser | **ALIGNED** |
| 2 | **Community Feed** | P0 - Build feed with posts/likes | ✅ Will build per Fraser | **ALIGNED** |
| 3 | **File Uploads** | P0 - Users upload content | Brian enters links initially, uploads later | **PARTIAL** |
| 4 | **S-T Grants Certificates** | S-T grants (US-T006) | S-T recommends → Creator approves | **📝 BRIAN'S CALL** |
| 5 | **Admin Payouts** | Admin (Brian) approves payouts | Creator approves payouts | **📝 BRIAN'S CALL** |
| 6 | **Follow System** | P0 - Users follow each other | ✅ Will build per Fraser | **ALIGNED** |
| 7 | **Session Recording** | P0 - Record sessions | P1 - Build when ready | **PRIORITIZED** |
| 8 | **Profile Uploads** | P0 - Upload profile pics/videos | ✅ Will build per Fraser | **ALIGNED** |
| 9 | **Post-Session Assessment** | P0 - Assessment after session | ✅ Will build per Fraser | **ALIGNED** |
| 10 | **Session Reminders** | P0 - Send reminders | ✅ Will build per Fraser | **ALIGNED** |

---

# STORY STATISTICS

## Fraser's Original Count

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

## Stories Now Included (Updated Dec 7)

| Feature | P0 Stories | Status |
|---------|------------|--------|
| Messaging | ~10 | ✅ Will build |
| Community Feed | ~8 | ✅ Will build |
| File Uploads | ~5 | ✅ Will build |
| Follow System | ~4 | ✅ Will build |
| Session Recording | ~3 | P1 - Prioritized |
| Reminders | ~2 | ✅ Will build |
| **Total P0** | **~135** | Full scope |

## Full P0 Count

**135 P0 stories** - building full platform per Fraser's spec

---

# NEXT STEPS

1. **Fraser reviews** - Confirm alignment on full feature build
2. **Prioritize blocks** - Which P0 stories go in Block 1 vs Block 2
3. **Timeline estimate** - Fraser provides development estimate for 135 P0 stories
4. **Begin development** - Start with Block 1 foundation

---

## Key Decisions Retained

- ✅ **Creator approves** certifications, payouts, S-T applications (not Brian)
- ✅ **S-T recommends** → Creator approves certification workflow
- ✅ **Stripe automated** payouts (after Creator approval)
- ✅ **No ratings** in Block 1 (add later)

## Key Change (Dec 7)

- ❌ ~~Use Discord for messaging/community~~ 
- ✅ **Build full messaging and community features** per Fraser's spec

---

**Document Status:** ALIGNED - Ready for Fraser Review  
**Updated:** 2025-12-07  
**Decision Maker:** Brian

---

*End of Merged Document*

