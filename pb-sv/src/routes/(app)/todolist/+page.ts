import type { PageLoad } from './$types';
import { getTodoListWithItems, type TodoListWithItemsResponse } from './todoApi';

export const load: PageLoad = async () => {
    const todoList = await getTodoListWithItems();

    const normalised: TodoListWithItemsResponse[] = todoList.map((entry) => ({
        ...entry,
        expand: {
            TodoItem_via_TodoList: entry.expand?.TodoItem_via_TodoList ?? []
        }
    }));

    return { todoList: normalised };
};
