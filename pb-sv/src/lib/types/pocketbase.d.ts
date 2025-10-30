/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	CalendarEvents = "CalendarEvents",
	Classrooms = "Classrooms",
	Subjects = "Subjects",
	TodoItem = "TodoItem",
	TodoList = "TodoList",
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
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

export type SubjectsRecord = {
	code?: string
	created?: IsoDateString
	description?: string
	id: string
	name?: string
	updated?: IsoDateString
}

export enum TodoItemPriorityLevelOptions {
	"E1" = "1",
	"E2" = "2",
	"E3" = "3",
}
export type TodoItemRecord = {
	Note?: string
	PriorityLevel?: TodoItemPriorityLevelOptions
	Title?: string
	TodoList?: RecordIdString
	created?: IsoDateString
	id: string
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
	TodoItem?: RecordIdString[]
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	user?: RecordIdString
}

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

export enum UsersUserTypeOptions {
	"student" = "student",
	"teacher" = "teacher",
	"guardian" = "guardian",
	"admin" = "admin",
}
export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	firstName: string
	id: string
	lastName: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	userType: UsersUserTypeOptions
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type CalendarEventsResponse<Texpand = unknown> = Required<CalendarEventsRecord> & BaseSystemFields<Texpand>
export type ClassroomsResponse<Texpand = unknown> = Required<ClassroomsRecord> & BaseSystemFields<Texpand>
export type SubjectsResponse<Texpand = unknown> = Required<SubjectsRecord> & BaseSystemFields<Texpand>
export type TodoItemResponse<Texpand = unknown> = Required<TodoItemRecord> & BaseSystemFields<Texpand>
export type TodoListResponse<Texpand = unknown> = Required<TodoListRecord> & BaseSystemFields<Texpand>
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	CalendarEvents: CalendarEventsRecord
	Classrooms: ClassroomsRecord
	Subjects: SubjectsRecord
	TodoItem: TodoItemRecord
	TodoList: TodoListRecord
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	CalendarEvents: CalendarEventsResponse
	Classrooms: ClassroomsResponse
	Subjects: SubjectsResponse
	TodoItem: TodoItemResponse
	TodoList: TodoListResponse
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'CalendarEvents'): RecordService<CalendarEventsResponse>
	collection(idOrName: 'Classrooms'): RecordService<ClassroomsResponse>
	collection(idOrName: 'Subjects'): RecordService<SubjectsResponse>
	collection(idOrName: 'TodoItem'): RecordService<TodoItemResponse>
	collection(idOrName: 'TodoList'): RecordService<TodoListResponse>
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
