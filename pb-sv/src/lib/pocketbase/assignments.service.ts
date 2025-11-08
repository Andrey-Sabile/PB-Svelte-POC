import { pb } from '$lib';
import {
    Collections,
    type AssignmentsRecord,
    type AssignmentsResponse,
    type RecordIdString
} from '$lib/types/pocketbase-types';

export type AssignmentRecordBase = AssignmentsRecord;
export type AssignmentResponse = AssignmentsResponse<unknown>;

export type AssignmentCreateInput = Omit<AssignmentRecordBase, 'id' | 'created' | 'updated'> &
    Required<Pick<AssignmentRecordBase, 'unitId'>>;
export type AssignmentUpdateInput = Partial<Omit<AssignmentRecordBase, 'id' | 'created' | 'updated'>>;

const escapeFilterValue = (value: string) => value.replace(/"/g, '\\"');

export const assignmentsService = {
    listByUnit: async (unitId: RecordIdString) => {
        const filterUnitId = escapeFilterValue(unitId);
        return pb.collection(Collections.Assignments).getFullList<AssignmentResponse>({
            filter: `unitId="${filterUnitId}"`
        });
    },
    get: async (id: RecordIdString) => {
        return pb.collection(Collections.Assignments).getOne<AssignmentResponse>(id);
    },
    create: async (data: AssignmentCreateInput) => {
        return pb.collection(Collections.Assignments).create<AssignmentResponse>(data);
    },
    update: async (id: RecordIdString, data: AssignmentUpdateInput) => {
        return pb.collection(Collections.Assignments).update<AssignmentResponse>(id, data);
    },
    remove: async (id: RecordIdString) => {
        await pb.collection(Collections.Assignments).delete(id);
    }
};
