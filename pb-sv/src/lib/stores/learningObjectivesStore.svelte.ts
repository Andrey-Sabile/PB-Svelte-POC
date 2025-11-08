import { createContext } from 'svelte';
import {
    learningObjectivesService,
    type LearningObjectiveCreateInput,
    type LearningObjectiveResponse,
    type LearningObjectiveUpdateInput
} from '$lib/pocketbase/learningObjectives.service';
import type { RecordIdString } from '$lib/types/pocketbase-types';

export class LearningObjectivesStore {
    objectivesByUnit = $state<Record<RecordIdString, LearningObjectiveResponse[]>>({});

    private setObjectives(unitId: RecordIdString, objectives: LearningObjectiveResponse[]) {
        this.objectivesByUnit = {
            ...this.objectivesByUnit,
            [unitId]: objectives
        };
    }

    private upsertObjective(unitId: RecordIdString, objective: LearningObjectiveResponse) {
        const existing = this.objectivesByUnit[unitId] ?? [];
        const index = existing.findIndex((entry) => entry.id === objective.id);
        const next =
            index === -1
                ? [...existing, objective]
                : existing.map((entry, idx) => (idx === index ? objective : entry));

        this.setObjectives(unitId, next);
    }

    private removeObjective(unitId: RecordIdString, objectiveId: RecordIdString) {
        const existing = this.objectivesByUnit[unitId];
        if (!existing) return;

        const next = existing.filter((entry) => entry.id !== objectiveId);
        this.setObjectives(unitId, next);
    }

    private findObjectiveLocation(objectiveId: RecordIdString) {
        for (const [unitId, objectives] of Object.entries(this.objectivesByUnit)) {
            const index = objectives.findIndex((entry) => entry.id === objectiveId);
            if (index !== -1) {
                return { unitId: unitId as RecordIdString, index };
            }
        }

        return null;
    }

    getObjectives(unitId: RecordIdString) {
        return this.objectivesByUnit[unitId] ?? [];
    }

    hydrate(unitId: RecordIdString, objectives: LearningObjectiveResponse[] = []) {
        this.setObjectives(unitId, [...objectives]);
        return this.getObjectives(unitId);
    }

    async refresh(unitId: RecordIdString) {
        const records = await learningObjectivesService.listByUnit(unitId);
        this.setObjectives(unitId, records);
        return records;
    }

    async fetch(objectiveId: RecordIdString) {
        const record = await learningObjectivesService.get(objectiveId);
        const unitId = record.unitId;

        if (unitId) {
            this.upsertObjective(unitId, record);
        }

        return record;
    }

    async createObjective(data: LearningObjectiveCreateInput) {
        const created = await learningObjectivesService.create(data);
        const unitId = created.unitId ?? data.unitId;

        if (unitId) {
            this.upsertObjective(unitId, created);
        }

        return created;
    }

    async updateObjective(id: RecordIdString, data: LearningObjectiveUpdateInput) {
        const updated = await learningObjectivesService.update(id, data);
        const nextUnitId = updated.unitId ?? data.unitId ?? null;
        const originalLocation = this.findObjectiveLocation(id);

        if (originalLocation) {
            this.removeObjective(originalLocation.unitId, id);
        }

        if (nextUnitId) {
            this.upsertObjective(nextUnitId, updated);
        }

        return updated;
    }

    async deleteObjective(id: RecordIdString) {
        await learningObjectivesService.remove(id);
        const location = this.findObjectiveLocation(id);

        if (location) {
            this.removeObjective(location.unitId, id);
        }
    }
}

const [getLearningObjectivesContextInternal, setLearningObjectivesContextInternal] =
    createContext<LearningObjectivesStore>();

let learningObjectivesStoreSingleton: LearningObjectivesStore | null = null;
let learningObjectivesContextRegistered = false;

const getOrCreateLearningObjectivesStore = () => {
    if (!learningObjectivesStoreSingleton) {
        learningObjectivesStoreSingleton = new LearningObjectivesStore();
    }

    return learningObjectivesStoreSingleton;
};

export const setLearningObjectivesContext = () => {
    const store = getOrCreateLearningObjectivesStore();
    learningObjectivesContextRegistered = true;
    setLearningObjectivesContextInternal(store);
    return store;
};

export const getLearningObjectivesContext = () => {
    if (!learningObjectivesContextRegistered) {
        return getOrCreateLearningObjectivesStore();
    }

    return getLearningObjectivesContextInternal();
};

export type {
    LearningObjectiveCreateInput,
    LearningObjectiveUpdateInput,
    LearningObjectiveResponse
} from '$lib/pocketbase/learningObjectives.service';
