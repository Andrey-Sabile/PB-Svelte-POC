import type { PageLoad } from './$types';
import pb from '$lib/pocketbase';

export const load = (async () => {
    const todoList = await pb.collection('TodoList').getList(1, 50, {
    });

    return { todoList };
}) satisfies PageLoad;
