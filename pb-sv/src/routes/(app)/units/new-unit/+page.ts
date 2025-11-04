import pb from '$lib/pocketbase';
import type {
	IsoDateString,
	RecordIdString,
	ClassroomsResponse,
	SubjectsResponse
} from '$lib/types/pocketbase-types';
import { Collections, TeachingUnitsStatusOptions } from '$lib/types/pocketbase-types';
import type { PageLoad } from './$types';

export type TeachingUnitModel = {
	title: string;
	description?: string;
	classId: RecordIdString | null;
	subject?: string;
	gradeLevel?: string;
	startDate?: IsoDateString | null;
	endDate?: IsoDateString | null;
	status: TeachingUnitsStatusOptions;
	userid: RecordIdString | null;
	learningObjectives: RecordIdString[];
	lessons: RecordIdString[];
	resources: RecordIdString[];
	assignments: RecordIdString[];
	assessments: RecordIdString[];
	tags: string[];
};

const getClasses = async (): Promise<ClassroomsResponse[]> => {
	return pb.collection(Collections.Classrooms).getFullList<ClassroomsResponse>();
};

const getSubjects = async (): Promise<SubjectsResponse[]> => {
	return pb.collection(Collections.Subjects).getFullList<SubjectsResponse>();
};

export const load = (async () => {
	const classes = await getClasses();

	return { classes };
}) satisfies PageLoad;
