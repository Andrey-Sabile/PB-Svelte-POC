# LeoLMS System Architecture

## 📐 Visual Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LeoLMS Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Teacher  │  │ Student  │  │ Parent   │  │  Admin   │   │
│  │Dashboard │  │Dashboard │  │Dashboard │  │Dashboard │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
├───────┴─────────────┴─────────────┴─────────────┴───────────┤
│                                                               │
│                    Core Features Layer                        │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │          Teaching Units (Integrated Hub)            │     │
│  │  ┌─────────────┬──────────────┬──────────────┐    │     │
│  │  │   Lessons   │ Assignments  │ Assessments  │    │     │
│  │  └─────────────┴──────────────┴──────────────┘    │     │
│  │        │              │               │            │     │
│  │        └──────────────┴───────────────┘            │     │
│  │                Learning Objectives                  │     │
│  │                Resource Library                     │     │
│  │                Question Bank                        │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Classes  │  │ Calendar │  │Announcem.│  │ Notific. │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Gradebook │  │ Student  │  │ Messages │                  │
│  │          │  │Directory │  │          │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                  Shared Components Layer                      │
│                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Content   │ │  Resource   │ │  Learning   │           │
│  │   Editor    │ │  Manager    │ │ Objectives  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Question   │ │  ShadCN UI  │ │   Toasts    │           │
│  │    Bank     │ │ Components  │ │             │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                    Data Layer (Mock)                          │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Classes  │  │  Events  │  │ Announc. │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Teaching │  │ Lessons  │  │Assignmt. │  │Assessmt. │   │
│  │  Units   │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘

         Future: Backend API + Database Layer
```

---

## 🔗 Teaching Units Integration

### The Integrated System

```
┌──────────────────────────────────────────────────────────────┐
│                    TEACHING UNIT                              │
│                                                               │
│  Title: "Introduction to Fractions"                          │
│  Class: Math 3A                                              │
│  Duration: Jan 6 - Jan 31                                    │
│  Status: Active                                              │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  📋 LEARNING OBJECTIVES (Standards-Aligned)                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │ ✅ Understand fractions as parts of a whole        │     │
│  │    Standard: CCSS.MATH.3.NF.A.1                   │     │
│  │                                                     │     │
│  │ ⏳ Compare fractions with same denominator         │     │
│  │    Standard: CCSS.MATH.3.NF.A.3                   │     │
│  │                                                     │     │
│  │ ⏳ Add/subtract fractions with common denominators │     │
│  │    Standard: CCSS.MATH.3.NF.A.2                   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Progress: ████████░░░░░░░░░░ 33% (1 of 3 complete)         │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  📚 LESSONS (What you teach)                                 │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Lesson 1: What is a Fraction? (Jan 6, 45 min) ✅  │     │
│  │  - Content: Introduction with visual models        │     │
│  │  - Resources: Video, Interactive demo, Worksheet   │     │
│  │  - Objectives: #1                                  │     │
│  │  - Linked to: Assignment 1, Quiz 1                │     │
│  │                                                     │     │
│  │ Lesson 2: Numerators and Denominators (Jan 8) ⏳  │     │
│  │  - Content: Formal definitions and practice        │     │
│  │  - Resources: Slides, Practice problems            │     │
│  │  - Objectives: #1, #2                              │     │
│  │  - Linked to: Assignment 1, Quiz 1                │     │
│  │                                                     │     │
│  │ Lesson 3: Comparing Fractions (Jan 10) ⏳         │     │
│  │  - Content: Greater than, less than, equal         │     │
│  │  - Resources: Manipulatives guide                  │     │
│  │  - Objectives: #2                                  │     │
│  │  - Linked to: Assignment 2, Quiz 2                │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ✏️ ASSIGNMENTS (Practice)                                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Assignment 1: Fraction Basics (Due: Jan 11)       │     │
│  │  - Type: Homework                                  │     │
│  │  - Points: 20                                      │     │
│  │  - Instructions: Complete worksheet 1-10           │     │
│  │  - Questions: 10 practice problems                 │     │
│  │  - Resources: Worksheet PDF                        │     │
│  │  - Based on: Lesson 1, Lesson 2                   │     │
│  │  - Objectives: #1                                  │     │
│  │                                                     │     │
│  │ Assignment 2: Comparing Fractions (Due: Jan 18)   │     │
│  │  - Type: Practice                                  │     │
│  │  - Points: 30                                      │     │
│  │  - Instructions: Use manipulatives to compare      │     │
│  │  - Questions: 15 comparison problems               │     │
│  │  - Based on: Lesson 3                              │     │
│  │  - Objectives: #2                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  📝 ASSESSMENTS (Evaluation)                                 │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Quiz 1: Fraction Fundamentals (Jan 15, 30 min)    │     │
│  │  - Type: Quiz                                      │     │
│  │  - Questions: 15 MCQ + 3 short answer             │     │
│  │  - Total Points: 50 (auto-calculated)             │     │
│  │  - Covers: Lesson 1, Lesson 2                     │     │
│  │  - Objectives: #1                                  │     │
│  │  - Settings: 1 attempt, show answers after        │     │
│  │                                                     │     │
│  │ Test: Unit Final (Jan 29, 60 min)                │     │
│  │  - Type: Test                                      │     │
│  │  - Questions: 30 mixed                             │     │
│  │  - Total Points: 100                               │     │
│  │  - Covers: All 3 lessons                           │     │
│  │  - Objectives: #1, #2, #3                         │     │
│  │  - Settings: 1 attempt, no answers shown          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  📦 SHARED RESOURCES                                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 🎥 Khan Academy: Fractions Series (Video)         │     │
│  │ 📄 Fraction Manipulatives Guide (PDF)             │     │
│  │ 🔗 Online Fraction Calculator (Link)              │     │
│  │ 📄 Parent Guide: Helping with Fractions (PDF)     │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘

Summary Stats:
• 3 lessons (1 taught, 2 upcoming)
• 2 assignments (1 published, 1 draft)
• 2 assessments (1 upcoming, 1 scheduled)
• 1 of 3 objectives complete (33%)
• 4 shared resources
```

---

## 🔄 Cross-Linking System

### How Content Links Together

```
                    Learning Objective #1
                    "Understand fractions"
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
         Lesson 1       Lesson 2       Quiz 1
     "What is a       "Numerators"   "Fundamentals"
      Fraction?"
              │             │             │
              └──────┬──────┴──────┬──────┘
                     │             │
                     ▼             ▼
               Assignment 1    Assignment 2
              "Fraction         "Practice"
               Basics"

Relationships:
- Objective → taught in Lessons 1 & 2
- Objective → practiced in Assignment 1
- Objective → assessed in Quiz 1
- Lesson 1 → generates Assignment 1
- Lessons 1 & 2 → covered by Quiz 1
```

### Bidirectional Linking

```
Teaching Unit ←→ Lesson
    ↕                ↕
Learning        Assignment
Objectives          ↕
    ↕           Assessment
Resources      (Question Bank)

Every relationship works both ways:
• Lesson knows its Unit
• Unit knows its Lessons
• Assignment knows its Lesson
• Lesson knows its Assignments
• etc.
```

---

## 🛠️ Component Architecture

### Shared Components

```
┌──────────────────────────────────────────────────────┐
│              ContentEditor Component                  │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ Toolbar: B I ⊕ ≡ # 🔗 < >                  │    │
│  ├─────────────────────────────────────────────┤    │
│  │                                              │    │
│  │  # My Lesson                                │    │
│  │                                              │    │
│  │  Today we'll learn about **fractions**!    │    │
│  │                                              │    │
│  │  ## Key Points                              │    │
│  │  - Fractions represent parts of a whole    │    │
│  │  - The numerator is the top number         │    │
│  │                                              │    │
│  │  [Learn more](https://example.com)         │    │
│  │                                              │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  [Edit] [Preview]                                    │
│                                                       │
│  Used in: Lessons, Assignments, Assessments          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│            ResourceManager Component                  │
│                                                       │
│  Current Resources:                                   │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🎥 Khan Academy Video          [🗑️]        │    │
│  │ 📄 Fraction Worksheet PDF      [🗑️]        │    │
│  │ 🔗 Interactive Demo            [🗑️]        │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  [+ Add Resource]                                    │
│                                                       │
│  Used in: Units, Lessons, Assignments                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│         LearningObjectives Component                  │
│                                                       │
│  ☑ Objective 1: Understand fractions [✓]            │
│     Standard: CCSS.MATH.3.NF.A.1                     │
│                                                       │
│  ☐ Objective 2: Compare fractions                   │
│     Standard: CCSS.MATH.3.NF.A.3                     │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ New objective...                            │    │
│  │ Standard (optional)...                      │    │
│  │ [+ Add]                                     │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  Progress: ████░░░░ 50% (1 of 2 complete)           │
│                                                       │
│  Used in: Units (create & track)                     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│            QuestionBank Component                     │
│                                                       │
│  [Search...] [All Types ▼] [+ Add Question]         │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ Q1 [MCQ] [Medium] 2 pts                     │    │
│  │ What does the numerator represent?          │    │
│  │ A. Bottom number                            │    │
│  │ B. Top number ✓                             │    │
│  │ C. Whole number                             │    │
│  │ D. Fraction bar                             │    │
│  │ [✏️] [📋] [🗑️]                               │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  Modes: Builder (create) | Selector (choose)         │
│  Used in: Assignments, Assessments                   │
└──────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### Creating a Teaching Unit

```
User Action: "Create Unit"
        ↓
Show Create Unit Form
        ↓
User fills: Title, Class, Dates, Objectives
        ↓
User clicks "Create Unit"
        ↓
Validate Form Data
        ↓
    [Valid?] ──No──→ Show Error Toast
        │
       Yes
        ↓
Generate Unit ID
        ↓
Create TeachingUnit Object
        ↓
Add to units[] Array
        ↓
Update State
        ↓
Show Success Toast
        ↓
Navigate to Unit Detail
        ↓
Display Unit with Empty Tabs
```

### Adding Content to Unit

```
User in Unit Detail
        ↓
Clicks "Add Lesson" / "Add Assignment" / "Add Assessment"
        ↓
Show Appropriate Form
        ↓
User fills form + uses shared components
        ↓
User clicks "Add"
        ↓
Validate Form
        ↓
    [Valid?] ──No──→ Show Error
        │
       Yes
        ↓
Create Content Object
        │
        ├──→ lesson.unitId = unit.id
        ├──→ assignment.unitId = unit.id
        └──→ assessment.unitId = unit.id
        ↓
Add to unit.lessons[] / assignments[] / assessments[]
        ↓
Update unit.updatedAt
        ↓
Update units[] Array
        ↓
Update selectedUnit State
        ↓
Show Success Toast
        ↓
Navigate back to Unit Detail (show new content)
```

---

## 🎨 UI Flow

### Teacher Journey: Creating a Unit

```
[Sidebar] → Teaching Units
      ↓
[List View] Shows all units, search, filters
      ↓
Click "Create Unit"
      ↓
[Create Form] Multi-section form
│   ├─ Basic Info (title, class, dates)
│   ├─ Learning Objectives (add/remove)
│   └─ Resources (add resources)
      ↓
Click "Create Unit"
      ↓
[Unit Detail View] Tabbed interface
│   ├─ Overview Tab (objectives, resources, stats)
│   ├─ Lessons Tab (empty, "Add Lesson" button)
│   ├─ Assignments Tab (empty, "Add Assignment" button)
│   └─ Assessments Tab (empty, "Add Assessment" button)
      ↓
Click "Add Lesson" in Lessons Tab
      ↓
[Add Lesson Form]
│   ├─ Lesson Info (title, duration, date)
│   ├─ ContentEditor (markdown)
│   └─ ResourceManager
      ↓
Click "Add Lesson"
      ↓
[Back to Unit Detail] Lesson now appears in Lessons tab
      ↓
Click "Add Assignment" in Assignments Tab
      ↓
[Add Assignment Form]
│   ├─ Assignment Info (title, type, due date, points)
│   ├─ ContentEditor (instructions)
│   ├─ QuestionBank (optional practice problems)
│   └─ ResourceManager
      ↓
Click "Add Assignment"
      ↓
[Back to Unit Detail] Assignment now appears
      ↓
Click "Add Assessment" in Assessments Tab
      ↓
[Add Assessment Form]
│   ├─ Assessment Info (title, type, duration, settings)
│   └─ QuestionBank (add/create questions)
      ↓
Click "Add Assessment"
      ↓
[Back to Unit Detail] Assessment now appears
      ↓
[Overview Tab] Shows:
│   ├─ 1 lesson created
│   ├─ 1 assignment created
│   ├─ 1 assessment created
│   └─ Progress: Unit is ready!
```

---

## 🔐 Data Structure

### Type Hierarchy

```
TeachingUnit
├── id: string
├── title: string
├── description: string
├── classId: string → References Class
├── teacherId: string → References User
├── status: 'draft' | 'active' | 'completed'
├── dates: { startDate, endDate }
│
├── learningObjectives: LearningObjective[]
│   └── LearningObjective
│       ├── id: string
│       ├── description: string
│       ├── standard?: string (CCSS, etc.)
│       └── completed: boolean
│
├── resources: Resource[]
│   └── Resource
│       ├── id: string
│       ├── type: 'link' | 'video' | 'document' | 'file'
│       ├── title: string
│       ├── url: string
│       └── description?: string
│
├── lessons: Lesson[]
│   └── Lesson
│       ├── id: string
│       ├── unitId: string ← Back-reference
│       ├── title: string
│       ├── content: string (markdown)
│       ├── resources: Resource[]
│       ├── duration: number
│       ├── scheduledDate?: string
│       ├── relatedAssignments?: string[] ← Links
│       └── relatedAssessments?: string[] ← Links
│
├── assignments: Assignment[]
│   └── Assignment
│       ├── id: string
│       ├── unitId: string ← Back-reference
│       ├── lessonId?: string ← Links to lesson
│       ├── title: string
│       ├── instructions: string (markdown)
│       ├── dueDate: string
│       ├── totalPoints: number
│       ├── questions?: Question[]
│       ├── resources?: Resource[]
│       └── objectives?: string[] ← Links to objectives
│
└── assessments: Assessment[]
    └── Assessment
        ├── id: string
        ├── unitId: string ← Back-reference
        ├── lessonIds?: string[] ← Covers these lessons
        ├── title: string
        ├── type: 'quiz' | 'test' | 'exam' | 'midterm' | 'final'
        ├── questions: Question[]
        ├── totalPoints: number (auto-calculated)
        ├── duration: number
        ├── settings: { attempts, shuffle, showAnswers }
        └── objectives?: string[] ← Links to objectives
```

---

## 🔄 State Management

### React State Structure

```typescript
// Main component state
const [units, setUnits] = useState<TeachingUnit[]>([]);
const [selectedUnit, setSelectedUnit] = useState<TeachingUnit | null>(null);
const [viewMode, setViewMode] = useState<ViewMode>('list');

// Form states (temporary, cleared after submission)
const [unitForm, setUnitForm] = useState<Partial<TeachingUnit>>({});
const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({});
const [assignmentForm, setAssignmentForm] = useState<Partial<Assignment>>({});
const [assessmentForm, setAssessmentForm] = useState<Partial<Assessment>>({});

// UI state
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | TeachingUnit['status']>('all');
```

### State Updates

```
User edits form input
        ↓
onChange handler fires
        ↓
setState with spread operator
        ↓
React re-renders form with new value
        ↓
User submits
        ↓
Create new object from form state
        ↓
Add to parent collection
        ↓
Update main units array
        ↓
Clear form state
        ↓
Navigate to detail view
```

---

## 🚀 Performance Considerations

### Optimization Strategies

```
1. useMemo for filtered lists
   └─ Only recalculate when dependencies change

2. Component lazy loading
   └─ Load heavy editors only when needed

3. Virtualization (future)
   └─ For long question lists

4. Debounced search
   └─ Wait for user to stop typing

5. Optimistic updates
   └─ Show changes immediately, sync later
```

---

## 📱 Responsive Design

### Breakpoints

```
Desktop (1920px+)
├─ Full grid layout
├─ Sidebar + content
└─ Multi-column forms

Laptop (1366px+)
├─ Compact grid
├─ Sidebar + content
└─ Two-column forms

Tablet (768px+)
├─ Single column grid
├─ Collapsible sidebar
└─ Single-column forms

Mobile (375px+)
├─ Single column
├─ Bottom navigation
└─ Simplified forms
```

---

## 🔜 Future Architecture

### Backend Integration

```
Frontend (React)
      ↓
   REST API
      ↓
Express/Node.js
      ↓
PostgreSQL/MongoDB
      ↓
File Storage (S3)

New Services:
├─ Auth Service (JWT)
├─ Content Service (CRUD)
├─ Grading Service (auto-grade)
├─ Notification Service (real-time)
└─ Analytics Service (insights)
```

---

This architecture provides a **scalable, maintainable foundation** for the LeoLMS Teaching Units system, with clear separation of concerns and room for future growth.

_Architecture documented: November 2, 2025_
