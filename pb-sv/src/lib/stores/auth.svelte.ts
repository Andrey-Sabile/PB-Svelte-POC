import { pb } from '$lib'
import type { UsersResponse } from '$lib/types/pocketbase-types';
import { getContext, setContext } from 'svelte';

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

const AUTH_STORE_KEY = 'auth store';

export const setAuthContext = () => {
    const nAuthStore = new AuthStore();
    return setContext<AuthStore>(AUTH_STORE_KEY, nAuthStore);
};

export const getAuthContext = () => {
    return getContext<AuthStore>(AUTH_STORE_KEY);
};
