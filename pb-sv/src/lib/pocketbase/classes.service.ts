import { pb } from '$lib';
import {
    Collections,
    type ClassroomsRecord,
    type ClassroomsResponse,
    type RecordIdString
} from '$lib/types/pocketbase-types';

export type ClassroomRecordBase = ClassroomsRecord;
export type ClassroomResponse = ClassroomsResponse<unknown>;

export type ClassroomCreateInput = Omit<ClassroomRecordBase, 'id' | 'created' | 'updated'>;
export type ClassroomUpdateInput = Partial<Omit<ClassroomRecordBase, 'id' | 'created' | 'updated'>>;

export const classesService = {
    list: async () => {
        return pb.collection(Collections.Classrooms).getFullList<ClassroomResponse>();
    },
    get: async (id: RecordIdString) => {
        return pb.collection(Collections.Classrooms).getOne<ClassroomResponse>(id);
    },
    create: async (data: ClassroomCreateInput) => {
        return pb.collection(Collections.Classrooms).create<ClassroomResponse>(data);
    },
    update: async (id: RecordIdString, data: ClassroomUpdateInput) => {
        return pb.collection(Collections.Classrooms).update<ClassroomResponse>(id, data);
    },
    remove: async (id: RecordIdString) => {
        await pb.collection(Collections.Classrooms).delete(id);
    }
};
