import { pb } from '$lib'

export const clearPocketBaseAuth = () => {
    pb.authStore.clear();
}

export default pb;
