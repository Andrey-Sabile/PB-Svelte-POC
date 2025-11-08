import { pb } from "$lib";
import {
    Collections,
    TeachingUnitsStatusOptions,
    type ClassroomsResponse,
    type IsoDateString,
    type RecordIdString,
    type TeachingUnitsResponse
} from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

type TeachingUnitExpand = {
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

const TEACHING_UNIT_EXPAND_KEY = "classId" as const;

export class TeachingUnitStore {
    teachingUnits = $state<TeachingUnitWithExpand[]>([]);

    constructor() {
        $effect(() => {
            void this.refresh();
        });
    }

    private ensureExpand(expand?: TeachingUnitExpand | null): TeachingUnitExpand {
        return {
            ...(expand ?? {}),
            classId: expand?.classId
        };
    }

    private normaliseUnit(unit: TeachingUnitsResponse<string[], TeachingUnitExpand>): TeachingUnitWithExpand {
        return {
            ...unit,
            expand: this.ensureExpand(unit.expand)
        };
    }

    private upsertLocal(unit: TeachingUnitWithExpand) {
        const existingIndex = this.teachingUnits.findIndex((entry) => entry.id === unit.id);
        if (existingIndex === -1) {
            this.teachingUnits = [...this.teachingUnits, unit];
            return;
        }

        const next = [...this.teachingUnits];
        next[existingIndex] = unit;
        this.teachingUnits = next;
    }

    getTeachingUnit(id: RecordIdString) {
        return this.teachingUnits.find((unit) => unit.id === id) ?? null;
    }

    async refresh() {
        const result = await pb
            .collection(Collections.TeachingUnits)
            .getFullList<TeachingUnitWithExpand>({ expand: TEACHING_UNIT_EXPAND_KEY });

        this.teachingUnits = result.map((unit) => this.normaliseUnit(unit));
        return this.teachingUnits;
    }

    async fetchTeachingUnit(id: RecordIdString) {
        const result = await pb
            .collection(Collections.TeachingUnits)
            .getOne<TeachingUnitWithExpand>(id, { expand: TEACHING_UNIT_EXPAND_KEY });

        const normalised = this.normaliseUnit(result);
        this.upsertLocal(normalised);
        return normalised;
    }

    async createTeachingUnit(data: TeachingUnitCreateInput) {
        const payload: TeachingUnitCreateInput = {
            ...data,
            status: data.status ?? TeachingUnitsStatusOptions.draft,
            learningObjectives: data.learningObjectives ?? [],
            lessons: data.lessons ?? [],
            resources: data.resources ?? [],
            assignments: data.assignments ?? [],
            assessments: data.assessments ?? [],
            tags: data.tags ?? []
        };

        const created = await pb
            .collection(Collections.TeachingUnits)
            .create<TeachingUnitWithExpand>(payload, { expand: TEACHING_UNIT_EXPAND_KEY });

        const normalised = this.normaliseUnit(created);
        this.upsertLocal(normalised);
        return normalised;
    }

    async updateTeachingUnit(id: RecordIdString, data: TeachingUnitUpdateInput) {
        const updated = await pb
            .collection(Collections.TeachingUnits)
            .update<TeachingUnitWithExpand>(id, data, { expand: TEACHING_UNIT_EXPAND_KEY });

        const normalised = this.normaliseUnit(updated);

        this.upsertLocal(normalised);
        return normalised;
    }

    async deleteTeachingUnit(id: RecordIdString) {
        await pb.collection(Collections.TeachingUnits).delete(id);
        this.teachingUnits = this.teachingUnits.filter((unit) => unit.id !== id);
    }
}

const [getTeachingUnitContextInternal, setTeachingUnitContextInternal] =
    createContext<TeachingUnitStore>();

let teachingUnitStoreSingleton: TeachingUnitStore | null = null;
let teachingUnitContextRegistered = false;

const getOrCreateTeachingUnitStore = () => {
    if (!teachingUnitStoreSingleton) {
        teachingUnitStoreSingleton = new TeachingUnitStore();
    }

    return teachingUnitStoreSingleton;
};

export const setTeachingUnitContext = () => {
    const store = getOrCreateTeachingUnitStore();
    teachingUnitContextRegistered = true;
    setTeachingUnitContextInternal(store);
    return store;
};

export const getTeachingUnitContext = () => {
    if (!teachingUnitContextRegistered) {
        return getOrCreateTeachingUnitStore();
    }

    return getTeachingUnitContextInternal();
};
