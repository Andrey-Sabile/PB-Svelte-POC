import { createContext } from 'svelte';
import {
    lessonsService,
    type LessonCreateInput,
    type LessonResponse,
    type LessonUpdateInput
} from '$lib/pocketbase/lessons.service';
import type { RecordIdString } from '$lib/types/pocketbase-types';

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
        const records = await lessonsService.listByUnit(unitId);
        this.setLessons(unitId, records);
        return records;
    }

    async fetch(lessonId: RecordIdString) {
        const record = await lessonsService.get(lessonId);
        const unitId = record.unitId;

        if (unitId) {
            this.upsertLesson(unitId, record);
        }

        return record;
    }

    async createLesson(data: LessonCreateInput) {
        const created = await lessonsService.create(data);
        const unitId = created.unitId ?? data.unitId;

        if (unitId) {
            this.upsertLesson(unitId, created);
        }

        return created;
    }

    async updateLesson(id: RecordIdString, data: LessonUpdateInput) {
        const updated = await lessonsService.update(id, data);
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
        await lessonsService.remove(id);
        const location = this.findLessonLocation(id);

        if (location) {
            this.removeLesson(location.unitId, id);
        }
    }
}

const [getLessonsContextInternal, setLessonsContextInternal] = createContext<LessonsStore>();

let lessonsStoreSingleton: LessonsStore | null = null;
let lessonsContextRegistered = false;

const getOrCreateLessonsStore = () => {
    if (!lessonsStoreSingleton) {
        lessonsStoreSingleton = new LessonsStore();
    }

    return lessonsStoreSingleton;
};

export const setLessonsContext = () => {
    const store = getOrCreateLessonsStore();
    lessonsContextRegistered = true;
    setLessonsContextInternal(store);
    return store;
};

export const getLessonsContext = () => {
    if (!lessonsContextRegistered) {
        return getOrCreateLessonsStore();
    }

    return getLessonsContextInternal();
};

export type {
    LessonCreateInput,
    LessonUpdateInput,
    LessonResponse
} from '$lib/pocketbase/lessons.service';
