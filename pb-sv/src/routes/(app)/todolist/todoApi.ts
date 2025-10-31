import pb from '$lib/pocketbase';
import {
    Collections,
    type RecordIdString,
    TodoItemPriorityLevelOptions,
    TodoListColourOptions,
    type TodoItemRecord,
    type TodoItemResponse,
    type TodoListRecord,
    type TodoListResponse
} from '$lib/types/pocketbase-types';

export type { TodoItemResponse } from '$lib/types/pocketbase-types';

export type TodoListWithItemsResponse = TodoListResponse<{
    TodoItem_via_TodoList: TodoItemResponse[];
}>;

export type TodoListCreateInput = {
    Title: string;
    user: RecordIdString;
    Colour?: TodoListColourOptions | null;
};

export type TodoListUpdateInput = Partial<Pick<TodoListRecord, 'Title' | 'Colour'>>;

export type TodoItemCreateInput = {
    Title: string;
    TodoList: RecordIdString;
    user: RecordIdString;
    Note?: string;
    done?: boolean;
    PriorityLevel?: TodoItemPriorityLevelOptions;
};

export type TodoItemUpdateInput = Partial<
    Pick<TodoItemRecord, 'Title' | 'Note' | 'PriorityLevel' | 'TodoList' | 'done'>
>;

export const getTodoListWithItems = async (): Promise<TodoListWithItemsResponse[]> => {
    return pb
        .collection(Collections.TodoList)
        .getFullList<TodoListWithItemsResponse>({ expand: 'TodoItem_via_TodoList' });
};

export const createTodoList = async (data: TodoListCreateInput) => {
    return pb.collection(Collections.TodoList).create<TodoListResponse>(data);
};

export const updateTodoList = async (id: RecordIdString, data: TodoListUpdateInput) => {
    return pb.collection(Collections.TodoList).update<TodoListResponse>(id, data);
};

export const deleteTodoList = async (id: RecordIdString) => {
    return pb.collection(Collections.TodoList).delete(id);
};

export const createTodoItem = async (data: TodoItemCreateInput) => {
    return pb.collection(Collections.TodoItem).create<TodoItemResponse>(data);
};

export const updateTodoItem = async (id: RecordIdString, data: TodoItemUpdateInput) => {
    return pb.collection(Collections.TodoItem).update<TodoItemResponse>(id, data);
};

export const deleteTodoItem = async (id: RecordIdString) => {
    return pb.collection(Collections.TodoItem).delete(id);
};
