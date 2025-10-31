import type { PageLoad } from './$types';
import { getTodoListWithItems } from './todoApi';

export const load: PageLoad = async () => {
    const todoList = await getTodoListWithItems();

    return { todoList };
};
