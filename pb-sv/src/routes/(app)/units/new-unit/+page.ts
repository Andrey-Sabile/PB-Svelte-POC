import type {
	IsoDateString,
	RecordIdString
} from '$lib/types/pocketbase-types';
import { TeachingUnitsStatusOptions } from '$lib/types/pocketbase-types';
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
	teacherId: RecordIdString | null;
	learningObjectives: RecordIdString[];
	lessons: RecordIdString[];
	resources: RecordIdString[];
	assignments: RecordIdString[];
	assessments: RecordIdString[];
	tags: string[];
};

export const load = (async () => {
	return {};
}) satisfies PageLoad;
