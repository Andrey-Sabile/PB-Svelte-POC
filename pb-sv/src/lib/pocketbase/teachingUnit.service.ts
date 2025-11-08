import { pb } from '$lib';
import {
    Collections,
    TeachingUnitsStatusOptions,
    type ClassroomsResponse,
    type IsoDateString,
    type RecordIdString,
    type TeachingUnitsResponse
} from '$lib/types/pocketbase-types';

export type TeachingUnitExpand = {
    classId?: ClassroomsResponse;
} & Record<string, unknown>;

export type TeachingUnitWithExpand = TeachingUnitsResponse<string[], TeachingUnitExpand>;

export type TeachingUnitCreateInput = {
    title: string;
    classId: RecordIdString;
    userid: RecordIdString;
    status?: TeachingUnitsStatusOptions;
    description?: string;
    subject?: string;
    gradeLevel?: string;
    startDate?: IsoDateString | null;
    endDate?: IsoDateString | null;
    learningObjectives?: RecordIdString[];
    lessons?: RecordIdString[];
    resources?: RecordIdString[];
    assignments?: RecordIdString[];
    assessments?: RecordIdString[];
    tags?: string[] | null;
};

export type TeachingUnitUpdateInput = Partial<TeachingUnitCreateInput>;

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
