# LMS - UX Structure & High-Level Architecture

## Executive Summary

This Learning Management System (LMS) is designed specifically for preschool and primary schools, serving three distinct user roles: **Teachers**, **Students**, and **Parents**. The system balances feature-rich functionality with intuitive, natural user interactions through careful role-based design, progressive disclosure, and consistent interaction patterns.

---

## 1. System Architecture

### Design Philosophy
- **Feature-Rich yet Intuitive**: Powerful tools that don't overwhelm users
- **Role-Based Experiences**: Each user type gets relevant features and appropriate permissions
- **Design Coherence**: Consistent patterns across all three roles
- **Progressive Disclosure**: Complex features revealed contextually
- **Desktop-First**: Optimized for always-connected desktop use

### Technical Foundation
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4.0
- **Components**: Shadcn/ui component library
- **Content**: Markdown support for lesson planning
- **Integration**: SIS integration ready

---

## 2. User Roles & Information Architecture

### 2.1 TEACHER ROLE

**Mental Model**: "I need efficient tools to manage my classroom, create content, and track student progress"

**Primary Navigation**:
```
Dashboard (Home)
├── Classes (Classroom Management)
├── Lesson Planner (Content Creation)
├── Exam Builder (Assessment Creation)
├── Gradebook (Grade Management)
├── Calendar (Schedule & Events)
├── Student Directory
├── Announcements
└── Messages
```

**Key Workflows**:
1. **Reusable Content Creation** (Priority #1)
   - Lesson Planner with markdown support
   - Shareable lessons across teachers
   - Question bank for exam building
   - Template system for common tasks

2. **Quick Grade Entry** (Priority #2)
   - Spreadsheet-style gradebook
   - Click-to-edit cells
   - Bulk operations
   - Automatic calculations

3. **Classroom Overview**
   - At-a-glance stats for all classes
   - Recent activity feed
   - Pending tasks highlighted

---

### 2.2 STUDENT ROLE

**Mental Model**: "I need to know what's due, take my tests, and see my grades"

**Primary Navigation**:
```
Dashboard (Home)
├── My Classes
├── Assignments (with due dates)
├── Grades (performance tracking)
├── Calendar (personal + class events)
└── Messages
```

**Key Workflows**:
1. **Clear Assignment Visibility** (Priority #1)
   - Dashboard shows upcoming work
   - Due date prominently displayed
   - Color-coded by class
   - "Due soon" alerts

2. **Easy Quiz/Exam Taking** (Priority #2)
   - Intuitive question navigator
   - Flag-for-review functionality
   - Timer with visual countdown
   - Progress tracking
   - Immediate auto-graded results

3. **Grade Monitoring**
   - Recent grades with feedback
   - Class-by-class averages
   - Visual progress indicators

---

### 2.3 PARENT ROLE

**Mental Model**: "I want a quick check of my child's progress and to catch any issues early"

**Primary Navigation**:
```
Dashboard (Home)
├── My Children (if multiple)
├── Grades (view-only)
├── Assignments (view-only)
├── Calendar (child's events)
└── Messages (teacher communication)
```

**Key Workflows**:
1. **Quick Status Check**
   - Dashboard designed for < 2 minute check-in
   - 4 key metrics visible immediately:
     * Current average grade
     * Completed work ratio
     * Items due soon
     * Items needing attention (urgent)

2. **View-Only Access to Grades**
   - See all grades with teacher feedback
   - Performance by class breakdown
   - Visual progress indicators

3. **Direct Teacher Communication**
   - Message teachers about concerns
   - View announcements and updates

**Special Consideration**: Parents have limited time and check in less frequently than daily users, so the interface emphasizes:
- Information density over navigation depth
- Urgent items highlighted prominently
- Teacher feedback surfaced clearly

---

## 3. Feature Module Details

### 3.1 Exam Builder with Question Bank

**Scope**: Teacher-only

**UX Goals**:
- Make exam creation fast through reusability
- Encourage collaboration through shared question banks
- Support both auto-graded and manual grading

**Interaction Flow**:
```
1. Create New Exam
   ├── Enter basic info (title, class, duration)
   ├── Add questions
   │   ├── Browse Question Bank
   │   │   ├── Search by subject/tag
   │   │   ├── Preview questions
   │   │   └── Add to exam with one click
   │   └── Create new questions
   │       ├── Multiple choice (auto-graded)
   │       └── Essay (manually graded)
   ├── Review summary (points, question types)
   ├── Set availability window
   └── Publish or Save as Draft
```

**Key Features**:
- Question banks shareable across classes/departments
- Two question types: Multiple choice (auto-graded), Essay (manual)
- Real-time exam summary showing points and question count
- Settings: time limit, shuffle questions, show results timing

**Design Patterns**:
- Master-detail pattern for question bank browsing
- Inline question editing
- Drag-to-reorder questions
- Visual distinction between auto-graded and manual questions

---

### 3.2 Content & Lesson Planner

**Scope**: Teacher-only

**UX Goals**:
- Encourage lesson sharing to reduce duplicate work
- Support structured lesson planning
- Enable rich content with markdown

**Interaction Flow**:
```
1. Create/Library Tab Structure
2. Create New Lesson
   ├── Basic info (title, subject, grade, duration)
   ├── Learning objectives (multi-item list)
   ├── Lesson content (markdown editor)
   ├── Resources (file attachments)
   └── Share toggle
3. Browse Lesson Library
   ├── Search and filter
   ├── Preview lessons
   ├── Copy/Edit existing lessons
   └── View shared lessons from other teachers
```

**Key Features**:
- Markdown-based content creation with preview
- Learning objectives as structured list
- File storage for resources
- Lesson library with search/filter
- Sharing mechanism between teachers

**Design Patterns**:
- Dual-tab interface (Create vs. Library)
- Card-based lesson library
- Markdown editor with formatting hints
- Copy-to-edit workflow for reusing lessons

---

### 3.3 Quiz Taker

**Scope**: Student-only

**UX Goals**:
- Reduce test anxiety through clear UI
- Enable efficient navigation between questions
- Provide clear time awareness

**Interaction Flow**:
```
1. Start Quiz from Dashboard
2. Main Interface
   ├── Timer (always visible)
   ├── Progress bar
   ├── Current question
   │   ├── Multiple choice → Radio buttons
   │   └── Essay → Textarea
   ├── Flag for review button
   ├── Previous/Next navigation
   └── Question navigator sidebar
3. Submit
4. View results (auto-graded portion)
```

**Key Features**:
- Question navigator shows answered/unanswered/flagged
- Flag questions for later review
- Timer with countdown
- Auto-save responses
- Immediate results for auto-graded questions
- Clear indication that essays are manually graded

**Design Patterns**:
- Split layout (question + navigator)
- Visual states: answered (green), unanswered (gray), flagged (orange), current (blue ring)
- Confirmation before submit
- Success state with score breakdown

---

### 3.4 Gradebook

**Scope**: Teacher-only

**UX Goals**:
- Enable rapid grade entry
- Show performance patterns at a glance
- Support feedback alongside grades

**Interaction Flow**:
```
1. Select class
2. View grade grid
   ├── Rows = Students
   ├── Columns = Assignments
   ├── Click cell to edit
   └── Automatic averages (per student, per assignment)
3. Edit Grade Dialog
   ├── Enter score
   ├── Add feedback (optional)
   └── Save (triggers notification)
```

**Key Features**:
- Spreadsheet-style layout
- Click-to-edit cells
- Per-assignment feedback
- Automatic average calculation (student and assignment)
- Visual indicators (green/yellow/red for grade ranges)
- Import/export functionality
- Trend indicators (trending up/down/stable)

**Design Patterns**:
- Table with hover highlighting
- Dialog for detailed grade entry
- Color coding for grade ranges
- Real-time calculation updates

---

### 3.5 Calendar & Events

**Scope**: All roles (different permissions)

**UX Goals**:
- Unified view of school and class events
- Clear scoping (global vs. class-specific)
- External calendar integration

**Event Scoping**:
- **Global events**: School-wide (holidays, parent-teacher conferences)
- **Class events**: Specific to one class (tests, field trips)

**Permissions**:
- **Teachers & Admins**: Can create both global and class events
- **Students**: View class + global events relevant to them
- **Parents**: View child's class + global events

**Key Features**:
- Week/month view toggle
- Event types: class, exam, holiday, meeting, other
- Color coding by event type
- Sync with Google Calendar, Outlook
- Quick event creation
- Recurring events support

**Design Patterns**:
- Calendar grid with time slots
- Color-coded events
- Click to view details
- Drag-to-reschedule (teacher only)

---

### 3.6 Notifications & Announcements

**Notifications**:
- **Real-time**: In-app notifications
- **Email/SMS**: Integration for important events
- **Preference**: Simple on/off toggle
- **Types**: Assignment posted, grade posted, announcement, message received, event reminder

**Announcements**:
- **School-wide**: Visible to all users
- **Class-specific**: Visible to class members + parents
- **Pin important**: Pinned announcements at top
- **Attachments**: Support for files

**Design Patterns**:
- Notification bell with unread count
- Toast notifications for real-time events
- Announcement feed with pinned items at top
- Read/unread states

---

## 4. Design System Foundations

### Color Strategy
- **Functional Colors**: Class colors for quick identification
- **Semantic Colors**: 
  - Blue: Primary actions, links
  - Green: Success, completed, high grades
  - Yellow: Warning, medium grades
  - Red: Urgent, low grades, due soon
  - Purple: Parent-specific features

### Typography Hierarchy
Using default typography from globals.css (no custom font classes unless user requests)
- Clear hierarchy for readability
- Appropriate for young students (readable font sizes)

### Component Patterns

**Cards**: Primary content containers
- Consistent padding and spacing
- Header with title and description
- Content area
- Optional footer for actions

**Tables**: Data display (gradebook, student lists)
- Hover highlighting
- Sortable columns
- Inline editing capability

**Dialogs**: Quick edits and confirmations
- Modal overlay
- Clear title and description
- Action buttons (primary + cancel)

**Badges**: Status and category indicators
- Color-coded by type
- Small and unobtrusive
- Consistent sizing

**Progress Bars**: Visual indicators
- Grade percentages
- Quiz completion
- Class averages

### Interaction Patterns

1. **Click-to-Edit**: Gradebook, inline edits
2. **Master-Detail**: Question bank, student directory
3. **Progressive Disclosure**: Expand for more options
4. **Contextual Actions**: Hover reveals actions
5. **Color Coding**: Classes, events, grade ranges
6. **Visual Feedback**: Loading, success, error states

---

## 5. Critical User Journeys

### Teacher Journey: Creating Reusable Assessment
```
1. Open Exam Builder
2. Enter exam details (title, class, 45 minutes)
3. Click "Question Bank" button
4. Search "Grade 3 Math Addition"
5. Preview questions, add 5 questions with one click each
6. Create 2 new custom questions inline
7. Review summary: 7 questions, 25 points
8. Set available window: Tomorrow 9 AM - 11 AM
9. Click "Publish Exam"
10. Notification sent to students automatically

Time: ~5 minutes (vs. 30+ minutes creating from scratch)
```

### Student Journey: Taking a Quiz
```
1. Login → See "Math Quiz due today at 11 AM" on dashboard
2. Click "Start"
3. Read question 1, select answer
4. Click "Next" (auto-saves)
5. Question 5 seems hard → Click flag button
6. Continue through questions
7. Use question navigator to jump back to flagged question
8. Review answer, update if needed
9. Click "Submit Quiz"
10. See results immediately: 8/10 correct

Time: 15 minutes quiz + instant feedback
```

### Parent Journey: Quick Check-In
```
1. Login → Dashboard
2. See 4 stats immediately:
   - Average: 87% (good!)
   - Completed: 8/10 assignments
   - Due soon: 2 this week
   - Needs attention: 1 urgent (due tomorrow, not started)
3. Click on urgent item → Reading assignment
4. See description and due date
5. Note to discuss with child
6. Check recent grades → See teacher feedback on math test
7. Logout

Time: < 2 minutes for full status check
```

### Teacher Journey: Quick Grade Entry
```
1. Open Gradebook
2. Select "Math 3A" class
3. See grid with 25 students × 5 assignments
4. Click empty cell for Emma's quiz
5. Dialog opens
6. Enter score: 18
7. Enter feedback: "Great work on multiplication!"
8. Click Save
9. See cell update, Emma's average recalculates
10. Notification auto-sent to Emma and her parent

Time: ~30 seconds per grade
```

---

## 6. UX Decisions & Rationale

### Why Desktop-First?
- Teachers primarily work at desks during planning periods
- Gradebook needs spreadsheet-like functionality
- Exam/lesson creation requires sustained focus
- Students take tests on school computers
- Mobile can be phase 2 for parent quick-checks

### Why Separate Dashboards per Role?
- Different goals and mental models
- Avoids overwhelming each user type
- Enables optimization per role
- Maintains simple navigation

### Why Shared Question Banks?
- Reduces teacher workload significantly
- Encourages best-practice sharing
- Enables department-wide standardization
- Builds institutional knowledge

### Why Simple Notification Preferences?
- Target users (preschool/primary) don't need granular control
- On/off is easier to understand
- Reduces decision fatigue
- Can be enhanced later if needed

### Why Markdown for Lessons?
- Requested by user (in-app markdown library)
- Enables rich formatting without complex WYSIWYG
- Portable and future-proof
- Easy to learn basics

### Why Progressive Disclosure?
- Feature-rich system can overwhelm
- New users see basics first
- Power users discover advanced features naturally
- Reduces cognitive load

---

## 7. Accessibility Considerations

- Keyboard navigation throughout
- ARIA labels on all interactive elements
- Color contrast meeting WCAG AA standards
- Focus indicators on all focusable elements
- Screen reader friendly structure
- Appropriate heading hierarchy
- Alternative text for images
- Clear error messages
- Sufficient click/tap target sizes

---

## 8. Future Enhancements

**Phase 2 Considerations**:
1. Mobile responsive design (especially for parent quick-checks)
2. Offline mode for quiz-taking
3. Advanced analytics and insights
4. Gamification for student engagement
5. Peer collaboration features
6. Video conferencing integration
7. Advanced reporting (custom reports, charts)
8. Attendance tracking
9. Behavior management
10. Parent-teacher conference scheduling

---

## 9. Implementation Notes

### Component Structure
```
/components
  /dashboards          → Role-specific dashboards
  /features            → Feature modules (Exam Builder, etc.)
  /ui                  → Shadcn/ui components
  /figma               → System components

/lib
  mockData.ts          → Demo data
  authContext.tsx      → Authentication/role management

/types
  index.ts             → TypeScript definitions
```

### State Management
- React Context for auth and user role
- Component-level state for features
- Mock data simulates backend API

### Routing
- Single-page app with conditional rendering
- Sidebar navigation controls active page
- Role-based page rendering

---

## 10. Success Metrics

**Teacher Efficiency**:
- Time to create exam: < 5 minutes (with question bank)
- Time to enter grade: < 30 seconds
- Lesson reuse rate: > 50%

**Student Experience**:
- Quiz completion rate: > 90%
- Time to find assignment: < 30 seconds
- Immediate feedback satisfaction

**Parent Engagement**:
- Weekly login rate: > 60%
- Time for status check: < 2 minutes
- Teacher communication response time

**System Goals**:
- Reduce teacher administrative time by 30%
- Increase parent engagement by 50%
- Improve student grade awareness

---

## Conclusion

This LMS design prioritizes **natural, intuitive interactions** while maintaining **feature richness** through:
1. Role-based experiences tailored to each user's goals
2. Reusable content reducing duplicate work
3. Progressive disclosure preventing overwhelm
4. Consistent patterns ensuring predictability
5. Quick access to frequent tasks

The system grows with users: beginners see simple interfaces, power users discover advanced features, and all users benefit from time-saving automation and clear information hierarchy.
