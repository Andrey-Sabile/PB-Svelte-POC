import { pb } from "$lib";
import {
    Collections,
    type ClassroomsRecord,
    type ClassroomsResponse,
    type RecordIdString
} from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

type ClassroomRecordBase = ClassroomsRecord;
type ClassroomResponse = ClassroomsResponse<unknown>;

export type ClassroomCreateInput = Omit<ClassroomRecordBase, "id" | "created" | "updated">;
export type ClassroomUpdateInput = Partial<Omit<ClassroomRecordBase, "id" | "created" | "updated">>;

export class ClassesStore {
    classes = $state<ClassroomResponse[]>([]);

    private upsertClassroom(classroom: ClassroomResponse) {
        const existingIndex = this.classes.findIndex((entry) => entry.id === classroom.id);
        if (existingIndex === -1) {
            this.classes = [...this.classes, classroom];
            return;
        }

        this.classes = this.classes.map((entry, index) =>
            index === existingIndex ? classroom : entry
        );
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
        const records = await pb.collection(Collections.Classrooms).getFullList<ClassroomResponse>();
        this.classes = records;
        return this.classes;
    }

    async fetch(id: RecordIdString) {
        const record = await pb.collection(Collections.Classrooms).getOne<ClassroomResponse>(id);
        this.upsertClassroom(record);
        return record;
    }

    async createClassroom(data: ClassroomCreateInput) {
        const created = await pb.collection(Collections.Classrooms).create<ClassroomResponse>(data);
        this.upsertClassroom(created);
        return created;
    }

    async updateClassroom(id: RecordIdString, data: ClassroomUpdateInput) {
        const updated = await pb.collection(Collections.Classrooms).update<ClassroomResponse>(id, data);
        this.upsertClassroom(updated);
        return updated;
    }

    async deleteClassroom(id: RecordIdString) {
        await pb.collection(Collections.Classrooms).delete(id);
        this.removeClassroom(id);
    }
}

const [getClassesContextInternal, setClassesContextInternal] = createContext<ClassesStore>();

export const setClassesContext = () => {
    const store = new ClassesStore();
    setClassesContextInternal(store);
    return store;
};

export const getClassesContext = () => {
    return getClassesContextInternal();
};
