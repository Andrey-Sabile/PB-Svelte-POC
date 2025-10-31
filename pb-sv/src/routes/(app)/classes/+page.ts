import type { PageLoad } from './$types';
import { getClassrooms } from './classroomsApi';

export const load: PageLoad = (async () => {
    const classrooms = await getClassrooms();
    return { classrooms };
})