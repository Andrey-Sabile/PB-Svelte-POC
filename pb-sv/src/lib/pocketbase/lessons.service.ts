import { pb } from '$lib';
import {
    Collections,
    type LessonsRecord,
    type LessonsResponse,
    type RecordIdString
} from '$lib/types/pocketbase-types';

export type LessonRecordBase = LessonsRecord<unknown>;
export type LessonResponse = LessonsResponse<unknown, unknown>;

export type LessonCreateInput = Omit<LessonRecordBase, 'id' | 'created' | 'updated'> &
    Required<Pick<LessonRecordBase, 'unitId'>>;
export type LessonUpdateInput = Partial<Omit<LessonRecordBase, 'id' | 'created' | 'updated'>>;

const escapeFilterValue = (value: string) => value.replace(/"/g, '\\"');

export const lessonsService = {
    listByUnit: async (unitId: RecordIdString) => {
        const filterUnitId = escapeFilterValue(unitId);
        return pb.collection(Collections.Lessons).getFullList<LessonResponse>({
            filter: `unitId="${filterUnitId}"`
        });
    },
    get: async (id: RecordIdString) => {
        return pb.collection(Collections.Lessons).getOne<LessonResponse>(id);
    },
    create: async (data: LessonCreateInput) => {
        return pb.collection(Collections.Lessons).create<LessonResponse>(data);
    },
    update: async (id: RecordIdString, data: LessonUpdateInput) => {
        return pb.collection(Collections.Lessons).update<LessonResponse>(id, data);
    },
    remove: async (id: RecordIdString) => {
        await pb.collection(Collections.Lessons).delete(id);
    }
};
