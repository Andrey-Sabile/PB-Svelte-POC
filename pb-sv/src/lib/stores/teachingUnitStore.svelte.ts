import { createContext } from 'svelte';
import {
    teachingUnitService,
    type TeachingUnitCreateInput,
    type TeachingUnitUpdateInput,
    type TeachingUnitWithExpand,
    type TeachingUnitExpand
} from '$lib/pocketbase/teachingUnit.service';
import {
    TeachingUnitsStatusOptions,
    type RecordIdString
} from '$lib/types/pocketbase-types';

export class TeachingUnitStore {
    teachingUnits = $state<TeachingUnitWithExpand[]>([]);

    private ensureExpand(expand?: TeachingUnitExpand | null): TeachingUnitExpand {
        return {
            ...(expand ?? {}),
            classId: expand?.classId
        };
    }

    private normaliseUnit(unit: TeachingUnitWithExpand): TeachingUnitWithExpand {
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
        const result = await teachingUnitService.list();
        this.teachingUnits = result.map((unit) => this.normaliseUnit(unit));
        return this.teachingUnits;
    }

    async fetchTeachingUnit(id: RecordIdString) {
        const result = await teachingUnitService.get(id);
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

        const created = await teachingUnitService.create(payload);
        const normalised = this.normaliseUnit(created);
        this.upsertLocal(normalised);
        return normalised;
    }

    async updateTeachingUnit(id: RecordIdString, data: TeachingUnitUpdateInput) {
        const updated = await teachingUnitService.update(id, data);
        const normalised = this.normaliseUnit(updated);
        this.upsertLocal(normalised);
        return normalised;
    }

    async deleteTeachingUnit(id: RecordIdString) {
        await teachingUnitService.remove(id);
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

export type {
    TeachingUnitCreateInput,
    TeachingUnitUpdateInput,
    TeachingUnitWithExpand
} from '$lib/pocketbase/teachingUnit.service';
