import { pb } from "$lib";
import {
    Collections,
    type AssignmentsRecord,
    type AssignmentsResponse,
    type RecordIdString
} from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

type AssignmentRecordBase = AssignmentsRecord;
type AssignmentResponse = AssignmentsResponse<unknown>;

const escapeFilterValue = (value: string) => value.replace(/"/g, '\\"');

export type AssignmentCreateInput = Omit<AssignmentRecordBase, "id" | "created" | "updated"> &
    Required<Pick<AssignmentRecordBase, "unitId">>;
export type AssignmentUpdateInput = Partial<Omit<AssignmentRecordBase, "id" | "created" | "updated">>;

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
        const filterUnitId = escapeFilterValue(unitId);
        const records = await pb.collection(Collections.Assignments).getFullList<AssignmentResponse>({
            filter: `unitId="${filterUnitId}"`
        });

        this.setAssignments(unitId, records);
        return records;
    }

    async fetch(assignmentId: RecordIdString) {
        const record = await pb
            .collection(Collections.Assignments)
            .getOne<AssignmentResponse>(assignmentId);
        const unitId = record.unitId;

        if (unitId) {
            this.upsertAssignment(unitId, record);
        }

        return record;
    }

    async createAssignment(data: AssignmentCreateInput) {
        const created = await pb
            .collection(Collections.Assignments)
            .create<AssignmentResponse>(data);
        const unitId = created.unitId ?? data.unitId;

        if (unitId) {
            this.upsertAssignment(unitId, created);
        }

        return created;
    }

    async updateAssignment(id: RecordIdString, data: AssignmentUpdateInput) {
        const updated = await pb
            .collection(Collections.Assignments)
            .update<AssignmentResponse>(id, data);
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
        await pb.collection(Collections.Assignments).delete(id);
        const location = this.findAssignmentLocation(id);

        if (location) {
            this.removeAssignment(location.unitId, id);
        }
    }
}

const [getAssignmentsContextInternal, setAssignmentsContextInternal] =
    createContext<AssignmentsStore>();

export const setAssignmentsContext = () => {
    const store = new AssignmentsStore();
    setAssignmentsContextInternal(store);
    return store;
};

export const getAssignmentsContext = () => {
    return getAssignmentsContextInternal();
};
