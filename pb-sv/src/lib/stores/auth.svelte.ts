import { pb } from "$lib";
import type { UsersResponse } from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

class AuthStore {
    user = $state<UsersResponse | null>(null);
    isSynced = $state(false);

    constructor() {
        this.user = pb.authStore.record as UsersResponse | null;
        this.isSynced = true;

        pb.authStore.onChange((token, model) => {
            this.user = model as UsersResponse | null;
        });
    }

    async loginWithPassword(email: string, password: string) {
        await pb.collection('users').authWithPassword(email, password);
        // The onChange handler will update the state
    }

    logout() {
        pb.authStore.clear();
        // The onChange handler will update the state
    }

    async update(data: Partial<UsersResponse>) {
        if (!this.user?.id) return;
        await pb.collection('users').update(this.user.id, data);
        // The onChange handler will update the state if the record is updated
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
