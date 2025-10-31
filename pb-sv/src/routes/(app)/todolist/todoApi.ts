import pb from '$lib/pocketbase';
import { Collections } from '$lib/types/pocketbase-types';
import type { TodoListResponse, TodoItemResponse, TodoListRecord } from '$lib/types/pocketbase-types';

type RecordIdString = string;
type TodoListColourOptions = 'Red' | 'Blue' | 'Green' | 'Yellow';
type TodoItemPriorityLevelOptions = '1' | '2' | '3';

export type TodoListWithItemsResponse = TodoListResponse<{
    TodoItem_via_TodoList: TodoItemResponse[];
}>;

export type TodoItemCreateInput = {
    Title: string;
    TodoList: RecordIdString;
    Note?: string;
    PriorityLevel?: TodoItemPriorityLevelOptions;
    user?: RecordIdString;
};

export type TodoListUpdateInput = {
    Title?: string;
    Colour?: TodoListColourOptions | null;
};

export type TodoItemUpdateInput = {
    Title?: string;
    Note?: string | null;
    PriorityLevel?: TodoItemPriorityLevelOptions | null;
    TodoList?: RecordIdString;
};

//CREATE
export const createTodoList = async (data: TodoListRecord) => {
    return pb.collection(Collections.TodoList).create(data);
};

export const createTodoItem = async (data: TodoItemCreateInput) => {
    return pb.collection(Collections.TodoItem).create(data);
};

// READ
export const getTodoListWithItems = async () => {
    return pb
        .collection(Collections.TodoList)
        .getFullList<TodoListWithItemsResponse>({ expand: 'TodoItem_via_TodoList' });
};


//UPDATE
export const updateTodoList = async (id: RecordIdString, data: TodoListUpdateInput) => {
    return pb.collection(Collections.TodoList).update(id, data);
};

export const updateTodoItem = async (id: RecordIdString, data: TodoItemUpdateInput) => {
    return pb.collection(Collections.TodoItem).update(id, data);
};


// DELETE
export const deleteTodoList = async (id: RecordIdString) => {
    return pb.collection(Collections.TodoList).delete(id);
};

export const deleteTodoItem = async (id: RecordIdString) => {
    return pb.collection(Collections.TodoItem).delete(id);
};
