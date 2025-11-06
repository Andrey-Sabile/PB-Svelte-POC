import { pb } from "$lib";
import type { UsersResponse } from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

class AuthStore {
    user = $state<UsersResponse | null>(null);
    isSynced = $state(false);

    constructor() {
        $effect(() => {
            if (pb.authStore.isValid) {
                this.user = pb.authStore.record as UsersResponse
            }
            this.isSynced = true;
        })
    }

    async loginWithPassword(email: string, password: string) {
        const authData = await pb.collection('users').authWithPassword(email, password);
        this.user = authData.record as UsersResponse;
    }

    logout() {
        pb.authStore.clear();
        this.user = null;
    }
}

const [getAuthContextInternal, setAuthContextInternal] = createContext<AuthStore>();

export const setAuthContext = () => {
    const newAuthStore = new AuthStore();
    setAuthContextInternal(newAuthStore);
    return newAuthStore;
};

export const getAuthContext = () => {
    return getAuthContextInternal();
};
