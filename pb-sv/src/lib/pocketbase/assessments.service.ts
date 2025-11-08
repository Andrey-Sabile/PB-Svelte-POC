import { pb } from '$lib';
import {
    Collections,
    type AssessmentsRecord,
    type AssessmentsResponse,
    type RecordIdString
} from '$lib/types/pocketbase-types';

export type AssessmentRecordBase = AssessmentsRecord;
export type AssessmentResponse = AssessmentsResponse<unknown>;

export type AssessmentCreateInput = Omit<AssessmentRecordBase, 'id' | 'created' | 'updated'> &
    Required<Pick<AssessmentRecordBase, 'unitId'>>;
export type AssessmentUpdateInput = Partial<Omit<AssessmentRecordBase, 'id' | 'created' | 'updated'>>;

const escapeFilterValue = (value: string) => value.replace(/"/g, '\\"');

export const assessmentsService = {
    listByUnit: async (unitId: RecordIdString) => {
        const filterUnitId = escapeFilterValue(unitId);
        return pb.collection(Collections.Assessments).getFullList<AssessmentResponse>({
            filter: `unitId="${filterUnitId}"`
        });
    },
    get: async (id: RecordIdString) => {
        return pb.collection(Collections.Assessments).getOne<AssessmentResponse>(id);
    },
    create: async (data: AssessmentCreateInput) => {
        return pb.collection(Collections.Assessments).create<AssessmentResponse>(data);
    },
    update: async (id: RecordIdString, data: AssessmentUpdateInput) => {
        return pb.collection(Collections.Assessments).update<AssessmentResponse>(id, data);
    },
    remove: async (id: RecordIdString) => {
        await pb.collection(Collections.Assessments).delete(id);
    }
};
