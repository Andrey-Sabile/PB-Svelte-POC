import { pb } from "$lib";
import {
    Collections,
    TodoItemsPriorityLevelOptions,
    TodoListColourOptions,
    type RecordIdString,
    type TodoItemsRecord,
    type TodoItemsResponse,
    type TodoListRecord,
    type TodoListResponse
} from "$lib/types/pocketbase-types";
import { createContext } from "svelte";

type TodoListExpand = {
    TodoItems_via_TodoList?: TodoItemsResponse[];
    todo_items_via_todo_list?: TodoItemsResponse[];
};

type TodoListLike = TodoListResponse<TodoListExpand> | TodoListWithItemsResponse;

export type TodoListWithItemsResponse = TodoListResponse<{
    TodoItems_via_TodoList: TodoItemsResponse[];
}>;

const TODO_ITEMS_EXPAND_KEY = "todo_items_via_todo_list" as const;

export type TodoListCreateInput = {
    Title: string;
    user: RecordIdString;
    Colour?: TodoListColourOptions | null;
};

export type TodoListUpdateInput = Partial<Pick<TodoListRecord, "Title" | "Colour">>;

export type TodoItemCreateInput = {
    Title: string;
    user: RecordIdString;
    todo_list?: RecordIdString | null;
    TodoList?: RecordIdString | null;
    Note?: string;
    done?: boolean;
    PriorityLevel?: TodoItemsPriorityLevelOptions;
};

export type TodoItemUpdateInput = Partial<
    Pick<TodoItemsRecord, "Title" | "Note" | "PriorityLevel" | "todo_list" | "done">
>;

export class TodoList {
    todoList = $state<TodoListWithItemsResponse[]>([]);

    constructor() {
        $effect(() => {
            void this.refresh();
        });
    }

    private ensureItems = (
        expand?: unknown
    ): TodoListWithItemsResponse["expand"] => {
        const expandRaw = (expand ?? {}) as TodoListExpand;
        const items =
            expandRaw.TodoItems_via_TodoList ?? expandRaw.todo_items_via_todo_list ?? [];

        return {
            ...(expandRaw as Partial<TodoListWithItemsResponse["expand"]>),
            TodoItems_via_TodoList: items
        } satisfies TodoListWithItemsResponse["expand"];
    };

    private normaliseList = (list: TodoListLike): TodoListWithItemsResponse => {
        const expand = this.ensureItems(list.expand);

        return {
            ...list,
            expand
        } as TodoListWithItemsResponse;
    };

    private mutateList(
        listId: RecordIdString,
        mutator: (list: TodoListWithItemsResponse) => TodoListLike
    ) {
        this.todoList = this.todoList.map((list) => {
            if (list.id !== listId) return list;

            const next = mutator(list);
            return this.normaliseList(next);
        });
    }

    private mutateListItems(
        listId: RecordIdString,
        mutator: (items: TodoItemsResponse[]) => TodoItemsResponse[]
    ) {
        this.mutateList(listId, (list) => {
            const currentExpand = this.ensureItems(list.expand);
            const items = currentExpand.TodoItems_via_TodoList ?? [];

            return {
                ...list,
                expand: {
                    ...currentExpand,
                    TodoItems_via_TodoList: mutator(items)
                }
            } satisfies TodoListLike;
        });
    }

    private normaliseTodoItemInput = <T extends { TodoList?: RecordIdString | null; todo_list?: RecordIdString | null }>(
        data: T
    ) => {
        const { TodoList: legacyListId, todo_list: providedListId, ...rest } = data;
        const listId = providedListId ?? legacyListId ?? null;
        const payload = {
            ...rest,
            ...(listId ? { todo_list: listId } : {})
        } as Omit<T, "TodoList">;

        return { listId, payload } as const;
    };

    private findItemLocation = (itemId: string) => {
        for (const list of this.todoList) {
            const items = list.expand?.TodoItems_via_TodoList ?? [];
            const index = items.findIndex((item) => item.id === itemId);
            if (index !== -1) {
                return { listId: list.id, index } as const;
            }
        }

        return null;
    };

    async refresh() {
        const result = await pb
            .collection(Collections.TodoList)
            .getFullList<TodoListWithItemsResponse>({ expand: TODO_ITEMS_EXPAND_KEY });

        this.todoList = result.map((item) => this.normaliseList(item));
        return this.todoList;
    }

    async createTodoList(data: TodoListCreateInput) {
        const created = await pb.collection(Collections.TodoList).create<TodoListResponse>(data);
        const withExpand = this.normaliseList({
            ...created,
            expand: this.ensureItems(created.expand)
        });

        this.todoList = [...this.todoList, withExpand];
        return withExpand;
    }

    async updateTodoList(id: RecordIdString, data: TodoListUpdateInput) {
        const updated = await pb.collection(Collections.TodoList).update<TodoListResponse>(id, data);
        let result: TodoListWithItemsResponse | null = null;

        this.mutateList(id, (list) => {
            const currentExpand = this.ensureItems(list.expand);
            const updatedExpand = this.ensureItems(updated.expand);
            const merged = {
                ...list,
                ...updated,
                expand: {
                    ...currentExpand,
                    ...updatedExpand,
                    TodoItems_via_TodoList: currentExpand.TodoItems_via_TodoList
                }
            } satisfies TodoListLike;

            result = this.normaliseList(merged);
            return merged;
        });

        return result;
    }

    async deleteTodoList(id: RecordIdString) {
        await pb.collection(Collections.TodoList).delete(id);
        this.todoList = this.todoList.filter((list) => list.id !== id);
    }

    async createTodoItem(data: TodoItemCreateInput) {
        const { listId: resolvedListId, payload } = this.normaliseTodoItemInput(data);

        const created = await pb
            .collection(Collections.TodoItems)
            .create<TodoItemsResponse>(payload);
        const createdItem: TodoItemsResponse = { ...created, expand: created.expand ?? {} };
        const targetListId = created.todo_list ?? resolvedListId ?? undefined;

        if (targetListId) {
            this.mutateListItems(targetListId, (items) => [createdItem, ...items]);
        }

        return createdItem;
    }

    async updateTodoItem(id: RecordIdString, data: TodoItemUpdateInput) {
        const { listId: resolvedListId, payload } = this.normaliseTodoItemInput(data);
        const updated = await pb
            .collection(Collections.TodoItems)
            .update<TodoItemsResponse>(id, payload);
        const updatedItem: TodoItemsResponse = { ...updated, expand: updated.expand ?? {} };
        const originalLocation = this.findItemLocation(id);
        const targetListId = updated.todo_list ?? resolvedListId ?? originalLocation?.listId ?? null;

        if (originalLocation && originalLocation.listId === targetListId && targetListId) {
            this.mutateListItems(targetListId, (items) =>
                items.map((item) => (item.id === id ? updatedItem : item))
            );
        } else {
            if (originalLocation) {
                this.mutateListItems(originalLocation.listId, (items) =>
                    items.filter((item) => item.id !== id)
                );
            }

            if (targetListId) {
                this.mutateListItems(targetListId, (items) => {
                    const filtered = items.filter((item) => item.id !== id);
                    return [updatedItem, ...filtered];
                });
            }
        }

        return updatedItem;
    }

    async deleteTodoItem(id: RecordIdString) {
        await pb.collection(Collections.TodoItems).delete(id);

        this.todoList = this.todoList.map((list) => {
            const expand = this.ensureItems(list.expand);
            const items = expand.TodoItems_via_TodoList ?? [];
            if (!items.some((item) => item.id === id)) return list;

            return this.normaliseList({
                ...list,
                expand: {
                    ...expand,
                    TodoItems_via_TodoList: items.filter((item) => item.id !== id)
                }
            });
        });
    }
}

const [getTodoListContextInternal, setTodoListContextInternal] = createContext<TodoList>();

export const setTodoListContext = () => {
    const newTodoList = new TodoList();
    setTodoListContextInternal(newTodoList);
    return newTodoList;
};

export const getTodoListContext = () => {
    return getTodoListContextInternal();
};
