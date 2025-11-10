import { pb } from '$lib';
import {
    Collections,
    type ClassroomsResponse,
    type RecordIdString,
    type TeachingUnitsRecord,
    type TeachingUnitsResponse
} from '$lib/types/pocketbase-types';

export type TeachingUnitRecordBase = TeachingUnitsRecord<string[]>;
export type TeachingUnitExpand = {
    classId?: ClassroomsResponse;
};
export type TeachingUnitResponse = TeachingUnitsResponse<string[], TeachingUnitExpand>;
export type TeachingUnitWithExpand = TeachingUnitResponse;

type WritableTeachingUnitFields = Omit<TeachingUnitRecordBase, 'id' | 'created' | 'updated'>;

export type TeachingUnitCreateInput = WritableTeachingUnitFields &
    Required<Pick<WritableTeachingUnitFields, 'userid'>>;
export type TeachingUnitUpdateInput = Partial<WritableTeachingUnitFields>;

export const TEACHING_UNIT_EXPAND_KEY = 'classId' as const;

export const teachingUnitService = {
    list: async () => {
        return pb
            .collection(Collections.TeachingUnits)
            .getFullList<TeachingUnitWithExpand>({ expand: TEACHING_UNIT_EXPAND_KEY });
    },
    get: async (id: RecordIdString) => {
        return pb
            .collection(Collections.TeachingUnits)
            .getOne<TeachingUnitWithExpand>(id, { expand: TEACHING_UNIT_EXPAND_KEY });
    },
    create: async (data: TeachingUnitCreateInput) => {
        return pb
            .collection(Collections.TeachingUnits)
            .create<TeachingUnitWithExpand>(data, { expand: TEACHING_UNIT_EXPAND_KEY });
    },
    update: async (id: RecordIdString, data: TeachingUnitUpdateInput) => {
        return pb
            .collection(Collections.TeachingUnits)
            .update<TeachingUnitWithExpand>(id, data, { expand: TEACHING_UNIT_EXPAND_KEY });
    },
    remove: async (id: RecordIdString) => {
        return pb.collection(Collections.TeachingUnits).delete(id);
    }
};
