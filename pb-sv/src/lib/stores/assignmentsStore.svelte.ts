import { createContext } from 'svelte';
import {
    assignmentsService,
    type AssignmentCreateInput,
    type AssignmentResponse,
    type AssignmentUpdateInput
} from '$lib/pocketbase/assignments.service';
import type { RecordIdString } from '$lib/types/pocketbase-types';

export class AssignmentsStore {
    assignmentsByUnit = $state<Record<RecordIdString, AssignmentResponse[]>>({});

    private setAssignments(unitId: RecordIdString, assignments: AssignmentResponse[]) {
        this.assignmentsByUnit = {
            ...this.assignmentsByUnit,
            [unitId]: assignments
        };
    }

    private upsertAssignment(unitId: RecordIdString, assignment: AssignmentResponse) {
        const existing = this.assignmentsByUnit[unitId] ?? [];
        const index = existing.findIndex((entry) => entry.id === assignment.id);
        const next =
            index === -1
                ? [...existing, assignment]
                : existing.map((entry, idx) => (idx === index ? assignment : entry));

        this.setAssignments(unitId, next);
    }

    private removeAssignment(unitId: RecordIdString, assignmentId: RecordIdString) {
        const existing = this.assignmentsByUnit[unitId];
        if (!existing) return;

        const next = existing.filter((entry) => entry.id !== assignmentId);
        this.setAssignments(unitId, next);
    }

    private findAssignmentLocation(assignmentId: RecordIdString) {
        for (const [unitId, assignments] of Object.entries(this.assignmentsByUnit)) {
            const index = assignments.findIndex((entry) => entry.id === assignmentId);
            if (index !== -1) {
                return { unitId: unitId as RecordIdString, index };
            }
        }

        return null;
    }

    getAssignments(unitId: RecordIdString) {
        return this.assignmentsByUnit[unitId] ?? [];
    }

    hydrate(unitId: RecordIdString, assignments: AssignmentResponse[] = []) {
        this.setAssignments(unitId, [...assignments]);
        return this.getAssignments(unitId);
    }

    async refresh(unitId: RecordIdString) {
        const records = await assignmentsService.listByUnit(unitId);
        this.setAssignments(unitId, records);
        return records;
    }

    async fetch(assignmentId: RecordIdString) {
        const record = await assignmentsService.get(assignmentId);
        const unitId = record.unitId;

        if (unitId) {
            this.upsertAssignment(unitId, record);
        }

        return record;
    }

    async createAssignment(data: AssignmentCreateInput) {
        const created = await assignmentsService.create(data);
        const unitId = created.unitId ?? data.unitId;

        if (unitId) {
            this.upsertAssignment(unitId, created);
        }

        return created;
    }

    async updateAssignment(id: RecordIdString, data: AssignmentUpdateInput) {
        const updated = await assignmentsService.update(id, data);
        const nextUnitId = updated.unitId ?? data.unitId ?? null;
        const originalLocation = this.findAssignmentLocation(id);

        if (originalLocation) {
            this.removeAssignment(originalLocation.unitId, id);
        }

        if (nextUnitId) {
            this.upsertAssignment(nextUnitId, updated);
        }

        return updated;
    }

    async deleteAssignment(id: RecordIdString) {
        await assignmentsService.remove(id);
        const location = this.findAssignmentLocation(id);

        if (location) {
            this.removeAssignment(location.unitId, id);
        }
    }
}

const [getAssignmentsContextInternal, setAssignmentsContextInternal] =
    createContext<AssignmentsStore>();

let assignmentsStoreSingleton: AssignmentsStore | null = null;
let assignmentsContextRegistered = false;

const getOrCreateAssignmentsStore = () => {
    if (!assignmentsStoreSingleton) {
        assignmentsStoreSingleton = new AssignmentsStore();
    }

    return assignmentsStoreSingleton;
};

export const setAssignmentsContext = () => {
    const store = getOrCreateAssignmentsStore();
    assignmentsContextRegistered = true;
    setAssignmentsContextInternal(store);
    return store;
};

export const getAssignmentsContext = () => {
    if (!assignmentsContextRegistered) {
        return getOrCreateAssignmentsStore();
    }

    return getAssignmentsContextInternal();
};

export type {
    AssignmentCreateInput,
    AssignmentUpdateInput,
    AssignmentResponse
} from '$lib/pocketbase/assignments.service';
