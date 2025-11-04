// Core Types for LMS

export type UserRole = 'teacher' | 'student' | 'parent';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface Student extends User {
    role: 'student';
    gradeLevel: string;
    parentIds: string[];
    classIds: string[];
}

export interface Teacher extends User {
    role: 'teacher';
    department: string;
    classIds: string[];
}

export interface Parent extends User {
    role: 'parent';
    childrenIds: string[];
}

export interface Class {
    id: string;
    name: string;
    subject: string;
    gradeLevel: string;
    teacherIds: string[];
    studentIds: string[];
    color: string;
}

export interface Assignment {
    id: string;
    unitId?: string; // Links to parent unit
    lessonId?: string; // Links to related lesson
    title: string;
    description: string;
    instructions: string; // Detailed markdown instructions
    classId: string;
    dueDate: string;
    totalPoints: number;
    type: 'homework' | 'practice' | 'project';
    status: 'draft' | 'published';
    attachments?: string[];
    resources?: Resource[];
    questions?: Question[]; // For practice problems
    objectives?: string[]; // Learning objective IDs
    rubric?: string; // Grading rubric
}

// Assessment (replaces Exam, more comprehensive)
export interface Assessment {
    id: string;
    unitId?: string; // Links to parent unit
    lessonIds?: string[]; // Covers these lessons
    title: string;
    description: string;
    classId: string;
    type: 'quiz' | 'test' | 'exam' | 'midterm' | 'final';
    questions: Question[];
    totalPoints: number;
    duration: number; // minutes
    availableFrom: string;
    availableTo: string;
    status: 'draft' | 'published' | 'completed';
    objectives?: string[]; // Learning objective IDs
    allowedAttempts: number;
    showCorrectAnswers: boolean;
    shuffleQuestions: boolean;
}

export interface Grade {
    id: string;
    studentId: string;
    assignmentId: string;
    score: number;
    feedback?: string;
    submittedAt?: string;
    gradedAt?: string;
}

export interface Question {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'fill-blank';
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer?: string | number | boolean;
    points: number;
    explanation?: string;
    hint?: string;
    tags: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
    objectiveId?: string; // Links to learning objective
    // For question bank
    isReusable?: boolean;
    timesUsed?: number;
    averageScore?: number;
}

export interface QuestionBank {
    id: string;
    name: string;
    description: string;
    teacherId: string;
    questions: Question[];
    isShared: boolean;
    subjectArea: string;
}

export interface Exam {
    id: string;
    title: string;
    classId: string;
    questions: Question[];
    totalPoints: number;
    duration: number; // minutes
    availableFrom: string;
    availableTo: string;
}

// Teaching Unit - Top-level container for lessons, assignments, and assessments
export interface TeachingUnit {
    id: string;
    title: string;
    description: string;
    classId: string;
    subject: string;
    gradeLevel: string;
    teacherId: string;
    startDate: string;
    endDate: string;
    status: 'draft' | 'active' | 'completed';
    learningObjectives: LearningObjective[];
    lessons: Lesson[];
    assignments: Assignment[];
    assessments: Assessment[];
    resources: Resource[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface LearningObjective {
    id: string;
    description: string;
    standard?: string; // e.g., "CCSS.MATH.3.NF.A.1"
    completed: boolean;
}

export interface Resource {
    id: string;
    type: 'file' | 'link' | 'video' | 'document';
    title: string;
    url: string;
    description?: string;
}

export interface Lesson {
    id: string;
    unitId?: string; // Links to parent unit
    title: string;
    subject: string;
    gradeLevel: string;
    objectives: string[]; // Can reference LearningObjective IDs
    content: string; // markdown
    resources: Resource[];
    duration: number; // minutes
    teacherId: string;
    classId?: string;
    scheduledDate?: string;
    isShared: boolean;
    tags: string[];
    // Links to related content
    relatedAssignments?: string[]; // Assignment IDs
    relatedAssessments?: string[]; // Assessment IDs
}

export interface Event {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    scope: 'global' | 'class';
    classId?: string;
    createdBy: string;
    type: 'class' | 'exam' | 'holiday' | 'meeting' | 'other';
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    authorId: string;
    classId?: string; // undefined means school-wide
    createdAt: string;
    isPinned: boolean;
    attachments?: string[];
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'assignment' | 'grade' | 'announcement' | 'message' | 'event';
    read: boolean;
    createdAt: string;
    actionUrl?: string;
}

export interface Message {
    id: string;
    fromId: string;
    toId: string;
    subject: string;
    content: string;
    sentAt: string;
    read: boolean;
    threadId?: string;
}
