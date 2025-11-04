import pb from '$lib/pocketbase';
import {
    Collections,
    type RecordIdString,
    TodoItemsPriorityLevelOptions,
    TodoListColourOptions,
    type TodoItemsRecord,
    type TodoItemsResponse,
    type TodoListRecord,
    type TodoListResponse
} from '$lib/types/pocketbase-types';

export type { TodoItemsResponse } from '$lib/types/pocketbase-types';

export type TodoListWithItemsResponse = TodoListResponse<{
    TodoItems_via_TodoList: TodoItemsResponse[];
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
    PriorityLevel?: TodoItemsPriorityLevelOptions;
};

export type TodoItemUpdateInput = Partial<
    Pick<TodoItemsRecord, 'Title' | 'Note' | 'PriorityLevel' | 'todo_list' | 'done'>
>;

export const getTodoListWithItems = async (): Promise<TodoListWithItemsResponse[]> => {
    return pb
        .collection(Collections.TodoList)
        .getFullList<TodoListWithItemsResponse>({ expand: 'todo_items_via_todo_list' });
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
    return pb.collection(Collections.TodoItems).create<TodoItemsResponse>(data);
};

export const updateTodoItem = async (id: RecordIdString, data: TodoItemUpdateInput) => {
    return pb.collection(Collections.TodoItems).update<TodoItemsResponse>(id, data);
};

export const deleteTodoItem = async (id: RecordIdString) => {
    return pb.collection(Collections.TodoItems).delete(id);
};
