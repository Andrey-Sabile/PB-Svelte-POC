# Teaching Units System - Complete Guide

## 🎯 Overview

The **Teaching Units** system is an integrated approach to curriculum planning that replaces three separate features (Lesson Planner, Assignment Creator, Exam Builder) with one unified workflow that mirrors how teachers actually work.

---

## 🔗 Why Integration Matters

### The Problem with Silos
Previously, these features existed independently:
- **Lesson Planner** - Plan what to teach
- **Assignment Planner** - Create homework
- **Exam Builder** - Build assessments

This created:
- ❌ Disconnected content
- ❌ Duplicate work
- ❌ No relationship tracking
- ❌ Harder to align curriculum

### The Unified Solution
Teaching Units provide:
- ✅ **One container** for all related content
- ✅ **Automatic cross-linking** between lessons, assignments, and assessments
- ✅ **Shared resources** across all components
- ✅ **Learning objectives** that tie everything together
- ✅ **Natural workflow** that matches teaching practice

---

## 🏗️ Architecture

### Hierarchy
```
Teaching Unit (Unit 5: Fractions)
├── Learning Objectives (What students will learn)
│   ├── Understand fractions as parts of a whole
│   └── Compare fractions with same denominator
│
├── Lessons (How you teach)
│   ├── Lesson 1: Introduction to Fractions
│   │   ├── Content (Markdown)
│   │   ├── Resources (Videos, PDFs, links)
│   │   └── Duration (45 min)
│   │
│   └── Lesson 2: Adding Fractions
│       └── ...
│
├── Assignments (Practice)
│   ├── Assignment 1: Fraction Worksheets
│   │   ├── Instructions (Markdown)
│   │   ├── Practice Questions
│   │   ├── Resources
│   │   └── Due Date
│   │
│   └── Assignment 2: Real-world Fractions
│       └── ...
│
└── Assessments (Evaluate)
    ├── Quiz 1: Fraction Basics
    │   ├── Questions (MCQ, Essay, etc.)
    │   ├── Duration (30 min)
    │   ├── Settings (Attempts, shuffle, etc.)
    │   └── Objectives Covered
    │
    └── Test: Unit 5 Final
        └── ...
```

### Cross-Linking
Every component knows about related content:
```typescript
Lesson {
  unitId: "unit_5"  // Part of Unit 5
  relatedAssignments: ["assign_45"]  // Links to homework
  relatedAssessments: ["quiz_12"]    // Links to quiz
}

Assignment {
  unitId: "unit_5"
  lessonId: "lesson_23"  // Based on Lesson 23
  objectives: ["obj_1", "obj_2"]  // Covers these objectives
}

Assessment {
  unitId: "unit_5"
  lessonIds: ["lesson_23", "lesson_24"]  // Covers these lessons
  objectives: ["obj_1", "obj_2"]  // Assesses these objectives
}
```

---

## 🛠️ Shared Components

All three content types use these shared components:

### 1. ContentEditor (`/components/shared/ContentEditor.tsx`)
- Rich markdown editor
- Preview mode
- Formatting toolbar (bold, italic, lists, links, code)
- Used for: Lesson content, assignment instructions

### 2. ResourceManager (`/components/shared/ResourceManager.tsx`)
- Add links, videos, documents, files
- Organize resources by type
- Color-coded icons
- Used for: All content types

### 3. LearningObjectives (`/components/shared/LearningObjectives.tsx`)
- Define what students will learn
- Link to standards (e.g., CCSS.MATH.3.NF.A.1)
- Track completion
- Progress visualization

### 4. QuestionBank (`/components/shared/QuestionBank.tsx`)
- Create reusable questions
- Multiple types: MCQ, True/False, Short Answer, Essay
- Difficulty levels
- Tags and search
- Two modes: Builder (create) and Selector (choose existing)

---

## 📚 Component Details

### TeachingUnit Type
```typescript
interface TeachingUnit {
  id: string;
  title: string;  // "Unit 5: Fractions"
  description: string;
  classId: string;  // Which class
  subject: string;  // "Mathematics"
  gradeLevel: string;  // "Grade 3"
  teacherId: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
  
  // Core content
  learningObjectives: LearningObjective[];
  lessons: Lesson[];
  assignments: Assignment[];
  assessments: Assessment[];
  resources: Resource[];
  
  // Metadata
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Enhanced Lesson Type
```typescript
interface Lesson {
  id: string;
  unitId?: string;  // NEW: Links to parent unit
  title: string;
  subject: string;
  gradeLevel: string;
  objectives: string[];  // Can reference LearningObjective IDs
  content: string;  // Markdown content
  resources: Resource[];  // NEW: Structured resources
  duration: number;
  teacherId: string;
  classId?: string;
  scheduledDate?: string;
  isShared: boolean;
  tags: string[];
  
  // NEW: Cross-linking
  relatedAssignments?: string[];
  relatedAssessments?: string[];
}
```

### Enhanced Assignment Type
```typescript
interface Assignment {
  id: string;
  unitId?: string;  // NEW: Links to parent unit
  lessonId?: string;  // NEW: Links to related lesson
  title: string;
  description: string;
  instructions: string;  // NEW: Detailed markdown instructions
  classId: string;
  dueDate: string;
  totalPoints: number;
  type: 'homework' | 'practice' | 'project';
  status: 'draft' | 'published';
  
  // NEW: Enhanced content
  attachments?: string[];
  resources?: Resource[];
  questions?: Question[];  // For practice problems
  objectives?: string[];  // Learning objective IDs
  rubric?: string;  // Grading rubric
}
```

### Assessment Type (replaces Exam)
```typescript
interface Assessment {
  id: string;
  unitId?: string;  // Links to parent unit
  lessonIds?: string[];  // Covers these lessons
  title: string;
  description: string;
  classId: string;
  type: 'quiz' | 'test' | 'exam' | 'midterm' | 'final';
  
  // Questions
  questions: Question[];
  totalPoints: number;  // Auto-calculated
  
  // Timing
  duration: number;
  availableFrom: string;
  availableTo: string;
  
  // Settings
  status: 'draft' | 'published' | 'completed';
  objectives?: string[];
  allowedAttempts: number;
  showCorrectAnswers: boolean;
  shuffleQuestions: boolean;
}
```

---

## 👩‍🏫 Teacher Workflows

### Workflow 1: Create a New Unit
```
1. Click "Create Unit"
2. Fill in basic info (title, class, dates)
3. Add learning objectives
4. Add unit-level resources
5. Save as draft

→ Now unit is created and you can add content
```

### Workflow 2: Add a Lesson
```
1. Open unit
2. Go to "Lessons" tab
3. Click "Add Lesson"
4. Fill in:
   - Title
   - Content (markdown editor)
   - Resources (videos, PDFs, links)
   - Duration and date
5. Save

→ Lesson is now part of the unit
```

### Workflow 3: Create Assignment from Lesson
```
1. Open unit
2. Go to "Assignments" tab
3. Click "Add Assignment"
4. Fill in:
   - Title (auto-suggests based on lessons)
   - Instructions (markdown)
   - Practice questions (optional)
   - Resources
   - Due date
5. Assignment automatically linked to unit

→ Students see assignment in their dashboard
```

### Workflow 4: Build Assessment
```
1. Open unit
2. Go to "Assessments" tab
3. Click "Add Assessment"
4. Fill in:
   - Title and type (quiz/test/exam)
   - Add questions (MCQ, essay, etc.)
   - Set duration and availability
   - Configure settings (attempts, shuffle, etc.)
5. Total points auto-calculated
6. Linked to learning objectives

→ Assessment covers all unit content
```

### Workflow 5: Track Progress
```
1. Open unit
2. View "Overview" tab
3. See:
   - Completed objectives
   - Number of lessons taught
   - Assignments given
   - Assessments completed
   - Progress bar

→ Know exactly where you are in the unit
```

---

## 🎨 UI Features

### Unit List View
- Grid of all units
- Status badges (draft, active, completed)
- Quick stats (# lessons, assignments, assessments)
- Progress bar for objectives
- Search and filter

### Unit Detail View
- Tabbed interface:
  - **Overview**: Objectives, resources, progress
  - **Lessons**: All lessons in order
  - **Assignments**: All assignments with due dates
  - **Assessments**: All quizzes/tests
- Quick action buttons
- Edit/delete capability

### Content Creation Forms
- Step-by-step wizards
- Real-time preview
- Autosave indicators
- Validation feedback
- Cancel with confirmation

---

## 🔧 Technical Implementation

### File Structure
```
components/
├── features/
│   └── TeachingUnits.tsx         (Main component - 1200+ lines)
│
└── shared/
    ├── ContentEditor.tsx          (Markdown editor)
    ├── ResourceManager.tsx        (Resource library)
    ├── LearningObjectives.tsx     (Objectives tracker)
    └── QuestionBank.tsx           (Question builder/selector)
```

### State Management
```typescript
// Main state
const [units, setUnits] = useState<TeachingUnit[]>([]);
const [selectedUnit, setSelectedUnit] = useState<TeachingUnit | null>(null);
const [viewMode, setViewMode] = useState<ViewMode>('list');

// Form states
const [unitForm, setUnitForm] = useState<Partial<TeachingUnit>>({});
const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({});
const [assignmentForm, setAssignmentForm] = useState<Partial<Assignment>>({});
const [assessmentForm, setAssessmentForm] = useState<Partial<Assessment>>({});
```

### View Modes
1. `list` - Browse all units
2. `unit-detail` - View one unit with tabs
3. `create-unit` - Create new unit wizard
4. `add-lesson` - Add lesson form
5. `add-assignment` - Add assignment form
6. `add-assessment` - Add assessment form

---

## 📊 Data Flow

### Creating Content
```
User fills form
    ↓
Form state updated (React state)
    ↓
Validation checks
    ↓
Create new object with ID
    ↓
Add to parent unit
    ↓
Update units array
    ↓
Toast notification
    ↓
Navigate back to unit detail
```

### Cross-Linking
```
When creating assignment:
1. assignmentForm includes unitId
2. On save, assignment.unitId = selectedUnit.id
3. Assignment added to unit.assignments[]
4. Unit.updatedAt = now()
5. Units array updated

Later:
- Can query "all assignments for unit X"
- Can query "which unit is this assignment from"
- Can show related lessons in assignment view
```

---

## 🚀 Future Enhancements

### Phase 1: Smart Suggestions
- [ ] "Create assignment from this lesson?" prompt
- [ ] Auto-generate quiz from lesson content
- [ ] Suggest related resources based on topic

### Phase 2: Templates
- [ ] Unit templates by subject/grade
- [ ] Lesson templates (e.g., "Lab Activity", "Lecture")
- [ ] Assessment templates (e.g., "Chapter Quiz")

### Phase 3: Analytics
- [ ] Time spent on lessons vs. assessment scores
- [ ] Which objectives are struggling
- [ ] Assignment completion rates
- [ ] Most/least effective resources

### Phase 4: Collaboration
- [ ] Share units with other teachers
- [ ] Co-create units
- [ ] School-wide unit library
- [ ] Rating and reviews

### Phase 5: AI Integration
- [ ] Generate lesson content from objectives
- [ ] Suggest questions based on difficulty
- [ ] Auto-create rubrics
- [ ] Differentiated content generation

---

## 💡 Benefits Over Separate Features

| Aspect | Separate Features | Teaching Units |
|--------|-------------------|----------------|
| **Creation** | Create 3 times in 3 places | Create once, organized |
| **Resources** | Upload separately each time | Shared resource library |
| **Objectives** | Manual tracking | Auto-linked to all content |
| **Alignment** | Manual cross-reference | Automatic relationships |
| **Overview** | Jump between 3 features | One dashboard |
| **Duplication** | Copy content manually | Reuse automatically |
| **Coverage** | "Did I assess this?" | Visual progress tracking |
| **Workflow** | Fragmented | Natural and sequential |

---

## 📖 Example: Complete Unit

### Unit: Introduction to Fractions (Grade 3, 3 weeks)

**Learning Objectives:**
1. ✅ Understand fractions represent parts of a whole (CCSS.MATH.3.NF.A.1)
2. ⏳ Compare fractions with same denominator (CCSS.MATH.3.NF.A.3)
3. ⏳ Add fractions with common denominators

**Week 1: Lessons**
- Lesson 1: What is a Fraction? (Mon, 45 min)
  - Content: Visual introduction with pizza slices
  - Resources: Video, Interactive demo, Worksheet
  
- Lesson 2: Numerators and Denominators (Wed, 45 min)
  - Content: Formal definition and practice
  - Resources: Slides, Practice problems

- Lesson 3: Fractions in Real Life (Fri, 45 min)
  - Content: Application examples
  - Resources: Real-world photos, Activity guide

**Week 2: Practice**
- Assignment 1: Fraction Identification (Due Mon)
  - 10 problems identifying numerators/denominators
  - Linked to: Lesson 1, Lesson 2
  - Objectives: #1
  - Points: 20

- Assignment 2: Draw Fractions (Due Fri)
  - Creative drawing activity
  - Linked to: Lesson 3
  - Objectives: #1
  - Points: 30

**Week 3: Assessment**
- Quiz: Fraction Basics (Wed, 30 min)
  - 15 questions (MCQ and short answer)
  - Covers: All 3 lessons
  - Objectives: #1, #2
  - Total: 50 points
  - Settings: 1 attempt, show answers after submission

**Resources (Unit-Level):**
- Khan Academy: Fractions (video series)
- Fraction manipulatives guide (PDF)
- Online fraction calculator
- Parent guide for helping with fractions

**Progress:** 1/3 objectives complete, 3 lessons taught, 2 assignments graded, 1 assessment upcoming

---

## 🎓 Best Practices

### 1. Start with Objectives
Always define learning objectives first. Everything else flows from these.

### 2. Build Incrementally
You don't need to create everything at once. Add content as you go:
- Create unit with objectives
- Add first lesson
- Teach it
- Then add assignment
- Later add assessment

### 3. Reuse Resources
Upload resources at the unit level if they're used across lessons/assignments.

### 4. Link Explicitly
Use the objective IDs to link content. This enables:
- "Show me all content for objective #2"
- "Which objectives haven't been assessed yet?"

### 5. Track Progress
Mark objectives as completed as you finish teaching them.

### 6. Keep Units Focused
A unit should be 2-4 weeks of content. If it's longer, split it into multiple units.

### 7. Use Drafts
Create everything in draft status. Publish when ready. This allows:
- Iterative improvement
- Team review
- Scheduled release

---

## 🔑 Key Takeaways

1. **Teaching Units integrate** lessons, assignments, and assessments into one workflow
2. **Shared components** (ContentEditor, ResourceManager, etc.) ensure consistency
3. **Cross-linking** creates relationships between content automatically
4. **Learning objectives** tie everything together
5. **Natural workflow** matches how teachers actually plan and teach
6. **One source of truth** for all related content
7. **Better tracking** of coverage and progress

---

## 📞 Navigation

- **Access**: Sidebar → Teaching Units
- **Role**: Teachers only
- **Status**: Ready for use with mock data
- **Backend**: Ready for API integration

---

_Last updated: November 2, 2025_  
_Version: 1.0_  
_Part of: Epic 4.0 - Learning Content & Assignment Management_
