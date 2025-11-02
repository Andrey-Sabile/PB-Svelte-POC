# Getting Started with LeoLMS

## Welcome!

This is a comprehensive Learning Management System prototype designed for preschool and primary schools. The system demonstrates role-based UX design with three distinct user experiences: Teacher, Student, and Parent.

## How to Use This Prototype

### 1. Select Your Role

When you first launch the application, you'll see a role selection screen with three options:

- **Teacher** - Access full classroom management, content creation, and grading tools
- **Student** - View assignments, take quizzes, and check grades
- **Parent** - Monitor child's progress and communicate with teachers

Click on any user name to log in as that role. You can switch roles at any time by signing out.

### 2. Explore Role-Specific Features

#### As a Teacher:
- **Dashboard**: Overview of your classes, upcoming events, and recent assignments
- **Lesson Planner**: Create reusable lesson plans with markdown support
- **Exam Builder**: Build exams using shared question banks
- **Gradebook**: Quick grade entry with automatic calculations
- Navigate using the left sidebar

#### As a Student:
- **Dashboard**: See upcoming assignments and recent grades at a glance
- **Assignments**: Take the demo quiz to see the quiz-taking interface
- **My Classes**: View all your enrolled classes
- Clear due dates and progress tracking

#### As a Parent:
- **Dashboard**: Quick overview of your child's academic status
- **Performance Metrics**: Average grade, completed work, items needing attention
- **Recent Grades**: See feedback from teachers
- **Upcoming Work**: Monitor what's due soon

### 3. Key Features to Try

1. **Teacher - Create an Exam**
   - Go to "Exam Builder"
   - Fill in exam details
   - Click "Question Bank" to browse existing questions
   - Add questions or create new ones
   - Review the exam summary

2. **Student - Take a Quiz**
   - Go to "Assignments" from the student view
   - Experience the quiz-taking interface
   - Use the question navigator
   - Flag questions for review
   - Submit and see immediate results

3. **Teacher - Enter Grades**
   - Go to "Gradebook"
   - Select a class
   - Click on any grade cell
   - Enter a score and feedback
   - See automatic average calculations

4. **Parent - Monitor Progress**
   - View the dashboard for at-a-glance status
   - Check recent grades with teacher feedback
   - Identify urgent items needing attention

## Understanding the UX Design

### Design Principles
- **Intuitive Navigation**: Each role has a tailored sidebar menu
- **Progressive Disclosure**: Complex features revealed contextually
- **Consistent Patterns**: Similar actions work the same way across modules
- **Visual Hierarchy**: Important information stands out

### Color Coding
- **Blue**: Classes (each class has a unique color)
- **Green**: Success, high grades, completed work
- **Yellow**: Medium grades, warnings
- **Red**: Urgent items, low grades, approaching deadlines
- **Purple**: Parent-specific features

### Interaction Patterns
- **Hover Effects**: Buttons and cards show hover states
- **Click-to-Edit**: Gradebook cells open edit dialogs
- **Real-time Updates**: Calculations update automatically
- **Visual Feedback**: Loading states, success messages

## Mock Data

The prototype includes realistic mock data:
- 3 Teachers
- 5 Students  
- 5 Parents
- 3 Classes
- Multiple assignments, grades, lessons, and question banks

Feel free to explore all features - changes are temporary and won't affect the demo data.

## Technical Details

### Built With
- React + TypeScript
- Tailwind CSS v4.0
- Shadcn/ui component library
- date-fns for date formatting

### File Structure
```
/components
  /dashboards       - Role-specific dashboards
  /features         - Main feature modules
  /ui               - Reusable UI components
/lib
  mockData.ts       - Demo data
  authContext.tsx   - Authentication
/types
  index.ts          - TypeScript definitions
```

## For Comprehensive UX Documentation

See `UX_STRUCTURE.md` for:
- Detailed feature specifications
- User journey maps
- Design system documentation
- Interaction patterns
- Architecture decisions

## Next Steps

This prototype demonstrates the core UX structure and interactions. In a production implementation, you would add:

1. **Backend Integration**
   - Real database (with SIS integration as requested)
   - Authentication system
   - API endpoints

2. **Real-time Features**
   - WebSocket for live notifications
   - Email/SMS integration (as specified)

3. **Additional Features**
   - Calendar with external sync (Google, Outlook)
   - File upload and storage
   - Messaging system
   - More question types
   - Advanced reporting

4. **Mobile Responsiveness**
   - Optimize for tablet and mobile
   - Parent quick-check mobile experience

## Questions or Feedback?

This prototype is designed to demonstrate the UX structure and high-level architecture. Each component is fully interactive and showcases the intended user experience for the final system.

Happy exploring! 🎓
