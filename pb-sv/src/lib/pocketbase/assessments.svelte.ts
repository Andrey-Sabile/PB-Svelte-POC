import { pb } from "$lib";
import {
    Collections,
    type AssessmentsRecord,
    type AssessmentsResponse,
    type RecordIdString
} from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

type AssessmentRecordBase = AssessmentsRecord;
type AssessmentResponse = AssessmentsResponse<unknown>;

const escapeFilterValue = (value: string) => value.replace(/"/g, '\\"');

export type AssessmentCreateInput = Omit<AssessmentRecordBase, "id" | "created" | "updated"> &
    Required<Pick<AssessmentRecordBase, "unitId">>;
export type AssessmentUpdateInput = Partial<Omit<AssessmentRecordBase, "id" | "created" | "updated">>;

export class AssessmentsStore {
    assessmentsByUnit = $state<Record<RecordIdString, AssessmentResponse[]>>({});

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
        const filterUnitId = escapeFilterValue(unitId);
        const records = await pb.collection(Collections.Assessments).getFullList<AssessmentResponse>({
            filter: `unitId="${filterUnitId}"`
        });

        this.setAssessments(unitId, records);
        return records;
    }

    async fetch(assessmentId: RecordIdString) {
        const record = await pb
            .collection(Collections.Assessments)
            .getOne<AssessmentResponse>(assessmentId);
        const unitId = record.unitId;

        if (unitId) {
            this.upsertAssessment(unitId, record);
        }

        return record;
    }

    async createAssessment(data: AssessmentCreateInput) {
        const created = await pb
            .collection(Collections.Assessments)
            .create<AssessmentResponse>(data);
        const unitId = created.unitId ?? data.unitId;

        if (unitId) {
            this.upsertAssessment(unitId, created);
        }

        return created;
    }

    async updateAssessment(id: RecordIdString, data: AssessmentUpdateInput) {
        const updated = await pb
            .collection(Collections.Assessments)
            .update<AssessmentResponse>(id, data);
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
        await pb.collection(Collections.Assessments).delete(id);
        const location = this.findAssessmentLocation(id);

        if (location) {
            this.removeAssessment(location.unitId, id);
        }
    }
}

const [getAssessmentsContextInternal, setAssessmentsContextInternal] =
    createContext<AssessmentsStore>();

export const setAssessmentsContext = () => {
    const store = new AssessmentsStore();
    setAssessmentsContextInternal(store);
    return store;
};

export const getAssessmentsContext = () => {
    return getAssessmentsContextInternal();
};
