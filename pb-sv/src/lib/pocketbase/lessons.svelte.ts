import { pb } from "$lib";
import {
    Collections,
    type LessonsRecord,
    type LessonsResponse,
    type RecordIdString
} from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

type LessonRecordBase = LessonsRecord<unknown>;
type LessonResponse = LessonsResponse<unknown, unknown>;

const escapeFilterValue = (value: string) => value.replace(/"/g, '\\"');

export type LessonCreateInput = Omit<LessonRecordBase, "id" | "created" | "updated"> &
    Required<Pick<LessonRecordBase, "unitId">>;
export type LessonUpdateInput = Partial<Omit<LessonRecordBase, "id" | "created" | "updated">>;

export class LessonsStore {
    lessonsByUnit = $state<Record<RecordIdString, LessonResponse[]>>({});

    private setLessons(unitId: RecordIdString, lessons: LessonResponse[]) {
        this.lessonsByUnit = {
            ...this.lessonsByUnit,
            [unitId]: lessons
        };
    }

    private upsertLesson(unitId: RecordIdString, lesson: LessonResponse) {
        const existing = this.lessonsByUnit[unitId] ?? [];
        const index = existing.findIndex((entry) => entry.id === lesson.id);
        const next =
            index === -1
                ? [...existing, lesson]
                : existing.map((entry, idx) => (idx === index ? lesson : entry));

        this.setLessons(unitId, next);
    }

    private removeLesson(unitId: RecordIdString, lessonId: RecordIdString) {
        const existing = this.lessonsByUnit[unitId];
        if (!existing) return;

        const next = existing.filter((entry) => entry.id !== lessonId);
        this.setLessons(unitId, next);
    }

    private findLessonLocation(lessonId: RecordIdString) {
        for (const [unitId, lessons] of Object.entries(this.lessonsByUnit)) {
            const index = lessons.findIndex((entry) => entry.id === lessonId);
            if (index !== -1) {
                return { unitId: unitId as RecordIdString, index };
            }
        }

        return null;
    }

    getLessons(unitId: RecordIdString) {
        return this.lessonsByUnit[unitId] ?? [];
    }

    hydrate(unitId: RecordIdString, lessons: LessonResponse[] = []) {
        this.setLessons(unitId, [...lessons]);
        return this.getLessons(unitId);
    }

    async refresh(unitId: RecordIdString) {
        const filterUnitId = escapeFilterValue(unitId);
        const records = await pb.collection(Collections.Lessons).getFullList<LessonResponse>({
            filter: `unitId="${filterUnitId}"`
        });

        this.setLessons(unitId, records);
        return records;
    }

    async fetch(lessonId: RecordIdString) {
        const record = await pb.collection(Collections.Lessons).getOne<LessonResponse>(lessonId);
        const unitId = record.unitId;

        if (unitId) {
            this.upsertLesson(unitId, record);
        }

        return record;
    }

    async createLesson(data: LessonCreateInput) {
        const created = await pb.collection(Collections.Lessons).create<LessonResponse>(data);
        const unitId = created.unitId ?? data.unitId;

        if (unitId) {
            this.upsertLesson(unitId, created);
        }

        return created;
    }

    async updateLesson(id: RecordIdString, data: LessonUpdateInput) {
        const updated = await pb.collection(Collections.Lessons).update<LessonResponse>(id, data);
        const nextUnitId = updated.unitId ?? data.unitId ?? null;
        const originalLocation = this.findLessonLocation(id);

        if (originalLocation) {
            this.removeLesson(originalLocation.unitId, id);
        }

        if (nextUnitId) {
            this.upsertLesson(nextUnitId, updated);
        }

        return updated;
    }

    async deleteLesson(id: RecordIdString) {
        await pb.collection(Collections.Lessons).delete(id);
        const location = this.findLessonLocation(id);

        if (location) {
            this.removeLesson(location.unitId, id);
        }
    }
}

const [getLessonsContextInternal, setLessonsContextInternal] = createContext<LessonsStore>();

export const setLessonsContext = () => {
    const store = new LessonsStore();
    setLessonsContextInternal(store);
    return store;
};

export const getLessonsContext = () => {
    return getLessonsContextInternal();
};
