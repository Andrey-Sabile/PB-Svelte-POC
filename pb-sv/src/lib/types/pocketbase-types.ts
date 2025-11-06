/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Announcements = "announcements",
	Assessments = "assessments",
	Assignments = "assignments",
	CalendarEvents = "calendar_events",
	Classrooms = "classrooms",
	Exams = "exams",
	Grades = "grades",
	Guardians = "guardians",
	LearningObjectives = "learning_objectives",
	Lessons = "lessons",
	Messages = "messages",
	Notifications = "notifications",
	QuestionBanks = "question_banks",
	Questions = "questions",
	Resources = "resources",
	Schools = "schools",
	Students = "students",
	Subjects = "subjects",
	Teachers = "teachers",
	TeachingUnits = "teaching_units",
	TodoItems = "todo_items",
	TodoList = "todo_list",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
	? { expand?: unknown }
	: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type AnnouncementsRecord = {
	attachments?: string[]
	authorId: RecordIdString
	classId?: RecordIdString
	content: string
	created?: IsoDateString
	id: string
	isPinned?: boolean
	title: string
	updated?: IsoDateString
}

export enum AssessmentsTypeOptions {
	"quiz" = "quiz",
	"test" = "test",
	"exam" = "exam",
	"midterm" = "midterm",
	"final" = "final",
}

export enum AssessmentsStatusOptions {
	"draft" = "draft",
	"published" = "published",
	"completed" = "completed",
}
export type AssessmentsRecord = {
	allowedAttempts: number
	availableFrom?: IsoDateString
	availableTo?: IsoDateString
	classId: RecordIdString
	created?: IsoDateString
	description?: string
	duration: number
	id: string
	lessonIds?: RecordIdString[]
	objectives?: RecordIdString[]
	questions: RecordIdString[]
	showCorrectAnswers: boolean
	shuffleQuestions: boolean
	status: AssessmentsStatusOptions
	title: string
	totalPoints: number
	type: AssessmentsTypeOptions
	unitId?: RecordIdString
	updated?: IsoDateString
}

export enum AssignmentsTypeOptions {
	"homework" = "homework",
	"practice" = "practice",
	"project" = "project",
}

export enum AssignmentsStatusOptions {
	"draft" = "draft",
	"published" = "published",
}
export type AssignmentsRecord = {
	attachments?: string[]
	classId: RecordIdString
	created?: IsoDateString
	description?: string
	dueDate?: IsoDateString
	id: string
	instructions?: string
	lessonId?: RecordIdString
	objectives?: RecordIdString[]
	questions?: RecordIdString[]
	resources?: RecordIdString[]
	rubric?: string
	status: AssignmentsStatusOptions
	title: string
	totalPoints: number
	type: AssignmentsTypeOptions
	unitId?: RecordIdString
	updated?: IsoDateString
}

export type CalendarEventsRecord = {
	created?: IsoDateString
	description?: string
	endTime?: IsoDateString
	id: string
	startTime?: IsoDateString
	title: string
	updated?: IsoDateString
}

export type ClassroomsRecord = {
	Description?: string
	Title?: string
	created?: IsoDateString
	id: string
	students?: RecordIdString[]
	subject?: RecordIdString
	teachers?: RecordIdString[]
	updated?: IsoDateString
}

export type ExamsRecord = {
	availableFrom?: IsoDateString
	availableTo?: IsoDateString
	classId: RecordIdString
	created?: IsoDateString
	duration: number
	id: string
	questions: RecordIdString[]
	title: string
	totalPoints: number
	updated?: IsoDateString
}

export type GradesRecord = {
	assignmentId: RecordIdString
	created?: IsoDateString
	feedback?: string
	gradedAt?: IsoDateString
	id: string
	score: number
	studentId: RecordIdString
	submittedAt?: IsoDateString
	updated?: IsoDateString
}

export type GuardiansRecord = {
	children?: RecordIdString[]
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	user_id: RecordIdString
}

export type LearningObjectivesRecord = {
	completed?: boolean
	created?: IsoDateString
	description: string
	id: string
	standard?: string
	unitId?: RecordIdString
	updated?: IsoDateString
}

export type LessonsRecord<Ttags = unknown> = {
	classId?: RecordIdString
	content?: string
	created?: IsoDateString
	duration?: number
	gradeLevel?: string
	id: string
	isShared?: boolean
	objectives?: RecordIdString[]
	relatedAssessments?: RecordIdString[]
	relatedAssignments?: RecordIdString[]
	resources?: RecordIdString[]
	scheduledDate?: IsoDateString
	subject?: string
	tags?: null | Ttags
	teacherId: RecordIdString
	title: string
	unitId?: RecordIdString
	updated?: IsoDateString
}

export type MessagesRecord = {
	content: string
	created?: IsoDateString
	fromId: RecordIdString
	id: string
	read?: boolean
	sentAt: IsoDateString
	subject?: string
	threadId?: RecordIdString
	toId: RecordIdString
	updated?: IsoDateString
}

export enum NotificationsTypeOptions {
	"assignment" = "assignment",
	"grade" = "grade",
	"announcement" = "announcement",
	"message" = "message",
	"event" = "event",
}
export type NotificationsRecord = {
	actionUrl?: string
	created?: IsoDateString
	createdAt: IsoDateString
	id: string
	message: string
	read: boolean
	title: string
	type: NotificationsTypeOptions
	updated?: IsoDateString
	userId: RecordIdString
}

export type QuestionBanksRecord = {
	created?: IsoDateString
	description?: string
	id: string
	isShared?: boolean
	name: string
	questions?: RecordIdString[]
	subjectArea?: string
	teacherId: RecordIdString
	updated?: IsoDateString
}

export enum QuestionsTypeOptions {
	"multiple-choice" = "multiple-choice",
	"true-false" = "true-false",
	"short-answer" = "short-answer",
	"essay" = "essay",
	"fill-blank" = "fill-blank",
}

export enum QuestionsDifficultyOptions {
	"easy" = "easy",
	"medium" = "medium",
	"hard" = "hard",
}
export type QuestionsRecord<TcorrectAnswer = unknown, Toptions = unknown, Ttags = unknown> = {
	averageScore?: number
	correctAnswer?: null | TcorrectAnswer
	created?: IsoDateString
	difficulty?: QuestionsDifficultyOptions
	explanation?: string
	hint?: string
	id: string
	isReusable?: boolean
	objectiveId?: RecordIdString
	options?: null | Toptions
	points: number
	question: string
	tags?: null | Ttags
	timesUsed?: number
	type: QuestionsTypeOptions
	updated?: IsoDateString
}

export enum ResourcesTypeOptions {
	"file" = "file",
	"link" = "link",
	"video" = "video",
	"document" = "document",
}
export type ResourcesRecord = {
	created?: IsoDateString
	description?: string
	file?: string
	id: string
	title: string
	type: ResourcesTypeOptions
	updated?: IsoDateString
	url?: string
}

export type SchoolsRecord = {
	address?: string
	created?: IsoDateString
	id: string
	name?: string
	updated?: IsoDateString
}

export enum StudentsGradeLevelOptions {
	"E1" = "1",
	"E2" = "2",
	"E3" = "3",
	"E4" = "4",
	"E5" = "5",
	"E6" = "6",
	"E7" = "7",
	"E8" = "8",
	"E9" = "9",
	"E10" = "10",
	"E11" = "11",
	"E12" = "12",
	"pp" = "pp",
}
export type StudentsRecord = {
	created?: IsoDateString
	date_of_birth?: IsoDateString
	grade_level?: StudentsGradeLevelOptions
	id: string
	preferred_name?: string
	updated?: IsoDateString
	user_id: RecordIdString
}

export type SubjectsRecord = {
	code?: string
	created?: IsoDateString
	description?: string
	id: string
	name?: string
	updated?: IsoDateString
}

export type TeachersRecord = {
	created?: IsoDateString
	display_name?: string
	id: string
	updated?: IsoDateString
	user_id: RecordIdString
}

export enum TeachingUnitsStatusOptions {
	"draft" = "draft",
	"active" = "active",
	"completed" = "completed",
}
export type TeachingUnitsRecord<Ttags = unknown> = {
	assessments?: RecordIdString[]
	assignments?: RecordIdString[]
	classId: RecordIdString
	created?: IsoDateString
	description?: string
	endDate?: IsoDateString
	gradeLevel?: string
	id: string
	learningObjectives?: RecordIdString[]
	lessons?: RecordIdString[]
	resources?: RecordIdString[]
	startDate?: IsoDateString
	status: TeachingUnitsStatusOptions
	subject?: string
	tags?: null | Ttags
	title: string
	updated?: IsoDateString
	userid?: RecordIdString
}

export enum TodoItemsPriorityLevelOptions {
	"E1" = "1",
	"E2" = "2",
	"E3" = "3",
}
export type TodoItemsRecord = {
	Note?: string
	PriorityLevel?: TodoItemsPriorityLevelOptions
	Title?: string
	created?: IsoDateString
	done?: boolean
	id: string
	todo_list?: RecordIdString
	updated?: IsoDateString
	user?: RecordIdString
}

export enum TodoListColourOptions {
	"Red" = "Red",
	"Blue" = "Blue",
	"Green" = "Green",
	"Yellow" = "Yellow",
}
export type TodoListRecord = {
	Colour?: TodoListColourOptions
	Title?: string
	created?: IsoDateString
	id: string
	todo_items?: RecordIdString[]
	updated?: IsoDateString
	user?: RecordIdString
}

export enum UsersRoleOptions {
	"student" = "student",
	"teacher" = "teacher",
	"guardian" = "guardian",
	"admin" = "admin",
}

export enum UsersStatusOptions {
	"active" = "active",
	"invited" = "invited",
	"inactive" = "inactive",
}
export type UsersRecord = {
	address: string
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	first_name: string
	id: string
	last_name: string
	password: string
	phone_number?: number
	role: UsersRoleOptions
	status?: UsersStatusOptions
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AnnouncementsResponse<Texpand = unknown> = Required<AnnouncementsRecord> & BaseSystemFields<Texpand>
export type AssessmentsResponse<Texpand = unknown> = Required<AssessmentsRecord> & BaseSystemFields<Texpand>
export type AssignmentsResponse<Texpand = unknown> = Required<AssignmentsRecord> & BaseSystemFields<Texpand>
export type CalendarEventsResponse<Texpand = unknown> = Required<CalendarEventsRecord> & BaseSystemFields<Texpand>
export type ClassroomsResponse<Texpand = unknown> = Required<ClassroomsRecord> & BaseSystemFields<Texpand>
export type ExamsResponse<Texpand = unknown> = Required<ExamsRecord> & BaseSystemFields<Texpand>
export type GradesResponse<Texpand = unknown> = Required<GradesRecord> & BaseSystemFields<Texpand>
export type GuardiansResponse<Texpand = unknown> = Required<GuardiansRecord> & BaseSystemFields<Texpand>
export type LearningObjectivesResponse<Texpand = unknown> = Required<LearningObjectivesRecord> & BaseSystemFields<Texpand>
export type LessonsResponse<Ttags = unknown, Texpand = unknown> = Required<LessonsRecord<Ttags>> & BaseSystemFields<Texpand>
export type MessagesResponse<Texpand = unknown> = Required<MessagesRecord> & BaseSystemFields<Texpand>
export type NotificationsResponse<Texpand = unknown> = Required<NotificationsRecord> & BaseSystemFields<Texpand>
export type QuestionBanksResponse<Texpand = unknown> = Required<QuestionBanksRecord> & BaseSystemFields<Texpand>
export type QuestionsResponse<TcorrectAnswer = unknown, Toptions = unknown, Ttags = unknown, Texpand = unknown> = Required<QuestionsRecord<TcorrectAnswer, Toptions, Ttags>> & BaseSystemFields<Texpand>
export type ResourcesResponse<Texpand = unknown> = Required<ResourcesRecord> & BaseSystemFields<Texpand>
export type SchoolsResponse<Texpand = unknown> = Required<SchoolsRecord> & BaseSystemFields<Texpand>
export type StudentsResponse<Texpand = unknown> = Required<StudentsRecord> & BaseSystemFields<Texpand>
export type SubjectsResponse<Texpand = unknown> = Required<SubjectsRecord> & BaseSystemFields<Texpand>
export type TeachersResponse<Texpand = unknown> = Required<TeachersRecord> & BaseSystemFields<Texpand>
export type TeachingUnitsResponse<Ttags = unknown, Texpand = unknown> = Required<TeachingUnitsRecord<Ttags>> & BaseSystemFields<Texpand>
export type TodoItemsResponse<Texpand = unknown> = Required<TodoItemsRecord> & BaseSystemFields<Texpand>
export type TodoListResponse<Texpand = unknown> = Required<TodoListRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	announcements: AnnouncementsRecord
	assessments: AssessmentsRecord
	assignments: AssignmentsRecord
	calendar_events: CalendarEventsRecord
	classrooms: ClassroomsRecord
	exams: ExamsRecord
	grades: GradesRecord
	guardians: GuardiansRecord
	learning_objectives: LearningObjectivesRecord
	lessons: LessonsRecord
	messages: MessagesRecord
	notifications: NotificationsRecord
	question_banks: QuestionBanksRecord
	questions: QuestionsRecord
	resources: ResourcesRecord
	schools: SchoolsRecord
	students: StudentsRecord
	subjects: SubjectsRecord
	teachers: TeachersRecord
	teaching_units: TeachingUnitsRecord
	todo_items: TodoItemsRecord
	todo_list: TodoListRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	announcements: AnnouncementsResponse
	assessments: AssessmentsResponse
	assignments: AssignmentsResponse
	calendar_events: CalendarEventsResponse
	classrooms: ClassroomsResponse
	exams: ExamsResponse
	grades: GradesResponse
	guardians: GuardiansResponse
	learning_objectives: LearningObjectivesResponse
	lessons: LessonsResponse
	messages: MessagesResponse
	notifications: NotificationsResponse
	question_banks: QuestionBanksResponse
	questions: QuestionsResponse
	resources: ResourcesResponse
	schools: SchoolsResponse
	students: StudentsResponse
	subjects: SubjectsResponse
	teachers: TeachersResponse
	teaching_units: TeachingUnitsResponse
	todo_items: TodoItemsResponse
	todo_list: TodoListResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'announcements'): RecordService<AnnouncementsResponse>
	collection(idOrName: 'assessments'): RecordService<AssessmentsResponse>
	collection(idOrName: 'assignments'): RecordService<AssignmentsResponse>
	collection(idOrName: 'calendar_events'): RecordService<CalendarEventsResponse>
	collection(idOrName: 'classrooms'): RecordService<ClassroomsResponse>
	collection(idOrName: 'exams'): RecordService<ExamsResponse>
	collection(idOrName: 'grades'): RecordService<GradesResponse>
	collection(idOrName: 'guardians'): RecordService<GuardiansResponse>
	collection(idOrName: 'learning_objectives'): RecordService<LearningObjectivesResponse>
	collection(idOrName: 'lessons'): RecordService<LessonsResponse>
	collection(idOrName: 'messages'): RecordService<MessagesResponse>
	collection(idOrName: 'notifications'): RecordService<NotificationsResponse>
	collection(idOrName: 'question_banks'): RecordService<QuestionBanksResponse>
	collection(idOrName: 'questions'): RecordService<QuestionsResponse>
	collection(idOrName: 'resources'): RecordService<ResourcesResponse>
	collection(idOrName: 'schools'): RecordService<SchoolsResponse>
	collection(idOrName: 'students'): RecordService<StudentsResponse>
	collection(idOrName: 'subjects'): RecordService<SubjectsResponse>
	collection(idOrName: 'teachers'): RecordService<TeachersResponse>
	collection(idOrName: 'teaching_units'): RecordService<TeachingUnitsResponse>
	collection(idOrName: 'todo_items'): RecordService<TodoItemsResponse>
	collection(idOrName: 'todo_list'): RecordService<TodoListResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
