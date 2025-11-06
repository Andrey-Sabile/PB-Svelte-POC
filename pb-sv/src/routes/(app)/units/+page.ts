import { pb } from '$lib';
import { Collections, type ClassroomsResponse, type TeachingUnitsResponse } from '$lib/types/pocketbase-types';
import type { PageLoad } from './$types';

type TeachingUnitWithClassroom = TeachingUnitsResponse<unknown, { classId?: ClassroomsResponse }>;

const getTeachingUnits = async (): Promise<TeachingUnitWithClassroom[]> => {
	const records = await pb.collection(Collections.TeachingUnits).getFullList<TeachingUnitWithClassroom>({
		expand: 'classId'
	});

	return records.map((unit) => ({
		...unit,
		expand: {
			...unit.expand,
			classId: unit.expand?.classId
		}
	}));
};

export const load = (async () => {
	const teachingUnits = await getTeachingUnits();

	return { teachingUnits };
}) satisfies PageLoad;
