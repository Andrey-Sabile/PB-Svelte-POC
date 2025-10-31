import type { UsersResponse } from "$lib/types/pocketbase-types";
import pb from '$lib/pocketbase';
import { writable } from "svelte/store";

type AuthState = {
    isValid: boolean;
    user: UsersResponse | null;
};

const initial: AuthState = {
    isValid: pb.authStore.isValid,
    user: (pb.authStore.record as UsersResponse) ?? null
};

export const authState = writable<AuthState>(initial);

pb.authStore.onChange(() => {
    authState.set({
        isValid: pb.authStore.isValid,
        user: (pb.authStore.record as UsersResponse) ?? null
    });
});

export async function loginUser(email: string, password: string) {
    await pb.collection("users").authWithPassword(email, password);
}