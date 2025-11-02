# 🧭 LeoLMS Product Roadmap

This roadmap outlines the phased development of **LeoLMS**, a school-focused Learning Management System.  
Each **Epic (1.0, 2.0, 3.0, …)** represents a major release milestone with its own technical unlocks and user-facing features.

---

## ✅ Epic 1.0 — Platform Foundation (MVP Refinement)

**Goal:** Establish the fundamental structure of the platform with authentication, navigation, and initial interactive features.

### Core Features
- [x] Authentication & role-based access (Admin, Teacher, Student)
- [x] Core navigation & layout (AppShell, sidebar, top nav)
- [x] Calendar (basic) — create/view events (no drag-and-drop)
- [x] Student directory — flat information view
- [x] Initial database models: User, Student, Teacher, CalendarEvent

### Technical Foundations
- [x] Authentication/authorization layer
- [x] Routing and layout system
- [x] Base entities + seed data
- [x] Shared UI library setup (Tailwind + DaisyUI)

---

## 🚧 Epic 2.0 — Classrooms & Scoped Events

**Goal:** Introduce “Classrooms” as the central organizing structure and extend the calendar with scoped events.

### Core Features
- [x] Classroom creation (Admin/Teacher adds class, defines subject)
- [x] Assign students to classrooms (manual selection)
- [ ] Scoped calendar events (Global / Class / Personal)
- [ ] Calendar drag-and-drop support
- [x] Classroom dashboard view (members, upcoming events)

### Technical Dependencies
- [x] Classroom entity and relationships
- [ ] CalendarEvent ↔ Classroom foreign key
- [ ] Enhanced calendar UI/UX
---

## 🗞️ Epic 3.0 — Announcements & Communication Layer

**Goal:** Build the communication backbone of the platform for scoped announcements and notifications.

### Core Features
- [ ] Global announcements feed (school-wide)
- [ ] Classroom announcements (scoped)
- [ ] Comments & reactions
- [ ] Notification system (bell icon, event triggers)
- [ ] Unified feed view (global + class activity)

### Technical Dependencies
- [ ] Announcement entity + comments + reactions schema
- [ ] Notification subsystem (real-time or polling)
- [ ] Feed UI pattern introduction
- [ ] Integration with Calendar + Classroom models for scoping

---

## 📚 Epic 4.0 — Learning Content & Assignment Management

**Goal:** Enable teachers to deliver coursework and students to submit assignments.

### Core Features
- [ ] Content repository/library for reusable materials
- [ ] Question bank (MCQ, essay, short answer)
- [ ] Assignment & quiz creation
  - [ ] Attach to class
  - [ ] Set deadlines
  - [ ] Auto-grading for MCQs
  - [ ] Manual grading for essays/uploads
- [ ] Student submissions (file uploads or direct answers)
- [ ] Per-class content tabs (“Materials”, “Assignments”, “Quizzes”)
- [ ] Basic marks tracking for auto-graded quizzes

### Technical Dependencies
- [ ] Content entity and repository pattern
- [ ] File storage integration (S3/local)
- [ ] Submission workflow (student → teacher)
- [ ] Auto-grading logic engine

---

## 🧾 Epic 5.0 — Marks Management & Academic Records

**Goal:** Centralize grading and academic progress.

### Core Features
- [ ] Marks management system
  - [ ] Track marks per student per assignment/quiz
  - [ ] Calculate class averages
- [ ] Teacher marking interface (manual grading)
- [ ] Progress overview dashboard (teacher and student)
- [ ] Exportable gradebook (CSV/PDF)

### Technical Dependencies
- [ ] Marks and Grades domain model
- [ ] Aggregation layer for analytics
- [ ] Reporting endpoints

---

## 👨‍👩‍👧 Epic 6.0 — Parent & Engagement Experience

**Goal:** Extend visibility to parents to track student performance and engagement.

### Core Features
- [ ] Parent role and authentication
- [ ] Linked Student relationship (Parent ↔ Student)
- [ ] Parent dashboard
  - [ ] View marks, submissions, deadlines
  - [ ] View announcements & notifications
- [ ] Email/Push notifications for parents

### Technical Dependencies
- [ ] Parent entity and relationships
- [ ] Role-based UI routing
- [ ] Reuse of Marks, Assignments, Notifications modules

---

## 📈 Epic 7.0 — Analytics, Insights & Engagement (Growth Phase)

**Goal:** Deliver insights to teachers, admins, and parents for data-driven improvement.

### Core Features
- [ ] Performance analytics dashboard
- [ ] Engagement heatmaps
- [ ] Student profile page (attendance, scores, comments)
- [ ] Admin overview dashboard

### Technical Dependencies
- [ ] Aggregation pipelines and reporting endpoints
- [ ] Charting library integration
- [ ] Historical data caching

---

## 🚀 Summary: Strategic Build Order

| Phase | Theme | Technical Unlocks |
|--------|--------|------------------|
| **1.0** | Core Foundation | Auth, routing, base entities |
| **2.0** | Classroom Structure | Scoping logic, relationships |
| **3.0** | Communication Layer | Notifications, comments system |
| **4.0** | Learning & Assignments | File uploads, grading logic |
| **5.0** | Marks Management | Aggregation + gradebook |
| **6.0** | Parent Experience | Multi-role views, linked accounts |
| **7.0** | Analytics Layer | Aggregated data + visualization |

---

_Use this document as a living roadmap. Each Epic corresponds to a release milestone, and checkboxes can be updated as features are completed._