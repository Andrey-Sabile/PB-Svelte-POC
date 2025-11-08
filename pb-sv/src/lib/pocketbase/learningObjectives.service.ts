import { pb } from '$lib';
import {
    Collections,
    type LearningObjectivesRecord,
    type LearningObjectivesResponse,
    type RecordIdString
} from '$lib/types/pocketbase-types';

export type LearningObjectiveRecordBase = LearningObjectivesRecord;
export type LearningObjectiveResponse = LearningObjectivesResponse<unknown>;

export type LearningObjectiveCreateInput = Omit<LearningObjectiveRecordBase, 'id' | 'created' | 'updated'> &
    Required<Pick<LearningObjectiveRecordBase, 'unitId'>>;
export type LearningObjectiveUpdateInput = Partial<
    Omit<LearningObjectiveRecordBase, 'id' | 'created' | 'updated'>
>;

const escapeFilterValue = (value: string) => value.replace(/"/g, '\\"');

export const learningObjectivesService = {
    listByUnit: async (unitId: RecordIdString) => {
        const filterUnitId = escapeFilterValue(unitId);
        return pb.collection(Collections.LearningObjectives).getFullList<LearningObjectiveResponse>({
            filter: `unitId="${filterUnitId}"`
        });
    },
    get: async (id: RecordIdString) => {
        return pb.collection(Collections.LearningObjectives).getOne<LearningObjectiveResponse>(id);
    },
    create: async (data: LearningObjectiveCreateInput) => {
        return pb.collection(Collections.LearningObjectives).create<LearningObjectiveResponse>(data);
    },
    update: async (id: RecordIdString, data: LearningObjectiveUpdateInput) => {
        return pb.collection(Collections.LearningObjectives).update<LearningObjectiveResponse>(id, data);
    },
    remove: async (id: RecordIdString) => {
        await pb.collection(Collections.LearningObjectives).delete(id);
    }
};
