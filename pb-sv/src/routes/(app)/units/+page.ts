import pb from '$lib/pocketbase';
import { Collections, type TeachingUnitsResponse } from '$lib/types/pocketbase-types';
import type { PageLoad } from './$types';

const getTeachingUnits = async (): Promise<TeachingUnitsResponse[]> => {
	return pb.collection(Collections.TeachingUnits).getFullList<TeachingUnitsResponse>();
};

export const load = (async () => {
	const teachingUnits = await getTeachingUnits();

	return { teachingUnits };
}) satisfies PageLoad;
