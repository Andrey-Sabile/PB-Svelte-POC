import { createContext } from 'svelte';
import {
    assessmentsService,
    type AssessmentCreateInput,
    type AssessmentResponse,
    type AssessmentUpdateInput
} from '$lib/pocketbase/assessments.service';
import { Collections, type RecordIdString } from '$lib/types/pocketbase-types';
import { pb } from '$lib';

export class AssessmentsStore {
    assessmentsByUnit = $state<Record<RecordIdString, AssessmentResponse[]>>({});
    private subscriptions: Record<string, () => void> = {};

    private setAssessments(unitId: RecordIdString, assessments: AssessmentResponse[]) {
        this.assessmentsByUnit = {
            ...this.assessmentsByUnit,
            [unitId]: assessments
        };
    }

    private upsertAssessment(unitId: RecordIdString, assessment: AssessmentResponse) {
        const existing = this.assessmentsByUnit[unitId] ?? [];
        const index = existing.findIndex((entry) => entry.id === assessment.id);
        const next =
            index === -1
                ? [...existing, assessment]
                : existing.map((entry, idx) => (idx === index ? assessment : entry));

        this.setAssessments(unitId, next);
    }

    private removeAssessment(unitId: RecordIdString, assessmentId: RecordIdString) {
        const existing = this.assessmentsByUnit[unitId];
        if (!existing) return;

        const next = existing.filter((entry) => entry.id !== assessmentId);
        this.setAssessments(unitId, next);
    }

    private findAssessmentLocation(assessmentId: RecordIdString) {
        for (const [unitId, assessments] of Object.entries(this.assessmentsByUnit)) {
            const index = assessments.findIndex((entry) => entry.id === assessmentId);
            if (index !== -1) {
                return { unitId: unitId as RecordIdString, index };
            }
        }

        return null;
    }

    getAssessments(unitId: RecordIdString) {
        return this.assessmentsByUnit[unitId] ?? [];
    }

    hydrate(unitId: RecordIdString, assessments: AssessmentResponse[] = []) {
        this.setAssessments(unitId, [...assessments]);
        return this.getAssessments(unitId);
    }

    async refresh(unitId: RecordIdString) {
        const records = await assessmentsService.listByUnit(unitId);
        this.setAssessments(unitId, records);
        return records;
    }

    async subscribe(unitId: RecordIdString) {
        if (this.subscriptions[unitId]) return;

        const unsubscribe = await pb.collection(Collections.Assessments).subscribe<AssessmentResponse>('*', (e) => {
            if (e.record.unitId !== unitId) return;

            if (e.action === 'create') {
                this.upsertAssessment(unitId, e.record);
            } else if (e.action === 'update') {
                this.upsertAssessment(unitId, e.record);
            } else if (e.action === 'delete') {
                this.removeAssessment(unitId, e.record.id);
            }
        }, { filter: `unitId="${unitId}"` });

        this.subscriptions[unitId] = unsubscribe;
    }

    unsubscribe(unitId: RecordIdString) {
        if (this.subscriptions[unitId]) {
            this.subscriptions[unitId]();
            delete this.subscriptions[unitId];
        }
    }

    async fetch(assessmentId: RecordIdString) {
        const record = await assessmentsService.get(assessmentId);
        const unitId = record.unitId;

        if (unitId) {
            this.upsertAssessment(unitId, record);
        }

        return record;
    }

    async createAssessment(data: AssessmentCreateInput) {
        const created = await assessmentsService.create(data);
        const unitId = created.unitId ?? data.unitId;

        if (unitId) {
            this.upsertAssessment(unitId, created);
        }

        return created;
    }

    async updateAssessment(id: RecordIdString, data: AssessmentUpdateInput) {
        const updated = await assessmentsService.update(id, data);
        const nextUnitId = updated.unitId ?? data.unitId ?? null;
        const originalLocation = this.findAssessmentLocation(id);

        if (originalLocation) {
            this.removeAssessment(originalLocation.unitId, id);
        }

        if (nextUnitId) {
            this.upsertAssessment(nextUnitId, updated);
        }

        return updated;
    }

    async deleteAssessment(id: RecordIdString) {
        await assessmentsService.remove(id);
        const location = this.findAssessmentLocation(id);

        if (location) {
            this.removeAssessment(location.unitId, id);
        }
    }
}

const [getAssessmentsContextInternal, setAssessmentsContextInternal] =
    createContext<AssessmentsStore>();

let assessmentsStoreSingleton: AssessmentsStore | null = null;
let assessmentsContextRegistered = false;

const getOrCreateAssessmentsStore = () => {
    if (!assessmentsStoreSingleton) {
        assessmentsStoreSingleton = new AssessmentsStore();
    }

    return assessmentsStoreSingleton;
};

export const setAssessmentsContext = () => {
    const store = getOrCreateAssessmentsStore();
    assessmentsContextRegistered = true;
    setAssessmentsContextInternal(store);
    return store;
};

export const getAssessmentsContext = () => {
    if (!assessmentsContextRegistered) {
        return getOrCreateAssessmentsStore();
    }

    return getAssessmentsContextInternal();
};

export type {
    AssessmentCreateInput,
    AssessmentUpdateInput,
    AssessmentResponse
} from '$lib/pocketbase/assessments.service';
