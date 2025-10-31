import pb from "$lib/pocketbase";
import { Collections, type ClassroomsResponse } from "$lib/types/pocketbase-types";

export const getClassrooms = async ():
    Promise<ClassroomsResponse[]> => {
    return pb
        .collection(Collections.Classrooms)
        .getFullList<ClassroomsResponse>();
}