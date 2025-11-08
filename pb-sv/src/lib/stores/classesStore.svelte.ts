import { createContext } from 'svelte';
import {
    classesService,
    type ClassroomCreateInput,
    type ClassroomResponse,
    type ClassroomUpdateInput
} from '$lib/pocketbase/classes.service';
import type { RecordIdString } from '$lib/types/pocketbase-types';

export class ClassesStore {
    classes = $state<ClassroomResponse[]>([]);

    private upsertClassroom(classroom: ClassroomResponse) {
        const existingIndex = this.classes.findIndex((entry) => entry.id === classroom.id);
        if (existingIndex === -1) {
            this.classes = [...this.classes, classroom];
            return;
        }

        this.classes = this.classes.map((entry, index) => (index === existingIndex ? classroom : entry));
    }

    private removeClassroom(id: RecordIdString) {
        this.classes = this.classes.filter((entry) => entry.id !== id);
    }

    hydrate(classrooms: ClassroomResponse[] = []) {
        this.classes = [...classrooms];
        return this.classes;
    }

    getClassrooms() {
        return this.classes;
    }

    getClassroom(id: RecordIdString) {
        return this.classes.find((entry) => entry.id === id) ?? null;
    }

    async refresh() {
        const records = await classesService.list();
        this.classes = records;
        return this.classes;
    }

    async fetch(id: RecordIdString) {
        const record = await classesService.get(id);
        this.upsertClassroom(record);
        return record;
    }

    async createClassroom(data: ClassroomCreateInput) {
        const created = await classesService.create(data);
        this.upsertClassroom(created);
        return created;
    }

    async updateClassroom(id: RecordIdString, data: ClassroomUpdateInput) {
        const updated = await classesService.update(id, data);
        this.upsertClassroom(updated);
        return updated;
    }

    async deleteClassroom(id: RecordIdString) {
        await classesService.remove(id);
        this.removeClassroom(id);
    }
}

const [getClassesContextInternal, setClassesContextInternal] = createContext<ClassesStore>();

let classesStoreSingleton: ClassesStore | null = null;
let classesContextRegistered = false;

const getOrCreateClassesStore = () => {
    if (!classesStoreSingleton) {
        classesStoreSingleton = new ClassesStore();
    }

    return classesStoreSingleton;
};

export const setClassesContext = () => {
    const store = getOrCreateClassesStore();
    classesContextRegistered = true;
    setClassesContextInternal(store);
    return store;
};

export const getClassesContext = () => {
    if (!classesContextRegistered) {
        return getOrCreateClassesStore();
    }

    return getClassesContextInternal();
};

export type {
    ClassroomCreateInput,
    ClassroomUpdateInput,
    ClassroomResponse
} from '$lib/pocketbase/classes.service';
