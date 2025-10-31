# PocketBase TypeScript Expansions — Step‑by‑Step Guide

This guide shows how to compose **PocketBase-generated types** to model responses that include **expanded relations** (e.g., a `TodoList` with its `TodoItem[]`). It reuses your existing generated types and keeps everything type‑safe.

---

## 0) Starting point (your generated types)

```ts
export type TodoListResponse<Texpand = unknown> =
  Required<TodoListRecord> & BaseSystemFields<Texpand>;

export type TodoListRecord = {
  Colour?: TodoListColourOptions;
  Title?: string;
  TodoItem?: RecordIdString[];
  created?: IsoDateString;
  id: string;
  updated?: IsoDateString;
  user?: RecordIdString;
};

export type BaseSystemFields<T = unknown> = {
  id: RecordIdString;
  collectionId: string;
  collectionName: Collections;
} & ExpandType<T>;

type ExpandType<T> =
  unknown extends T
    ? (T extends unknown ? { expand?: unknown } : { expand: T })
    : { expand: T };

export type TodoItemResponse<Texpand = unknown> =
  Required<TodoItemRecord> & BaseSystemFields<Texpand>;

export type TodoItemRecord = {
  Note?: string;
  PriorityLevel?: TodoItemPriorityLevelOptions;
  Title?: string;
  TodoList?: RecordIdString;
  created?: IsoDateString;
  id: string;
  updated?: IsoDateString;
  user?: RecordIdString;
};
```

> **Why this matters:** `TodoListResponse<Texpand>` and `BaseSystemFields<T>` are already set up to accept a type for `expand`. We’ll plug a concrete shape into that generic.

---

## 1) Describe the expand shape for `TodoList`

When you call PocketBase with `expand=TodoItem`, the response includes the expanded records under `expand.TodoItem`. We capture that with a dedicated type:

```ts
type TodoListExpand = {
  TodoItem: TodoItemResponse[];
};
```

---

## 2) Compose the final response type for “TodoList with items”

Plug the expand shape into your existing generated response type:

```ts
export type TodoListWithItemsResponse = TodoListResponse<TodoListExpand>;
```

This says: “A `TodoList` response whose `expand` contains an array of `TodoItemResponse` under `TodoItem`.”

---

## 3) Use it in your PocketBase calls

```ts
async function fetchTodoLists(pb: any) {
  const lists = await pb
    .collection('todoList')
    .getFullList<TodoListWithItemsResponse>({
      expand: 'TodoItem',
    });

  // ✨ Fully typed access
  for (const list of lists) {
    console.log(list.Title);
    const items = list.expand?.TodoItem ?? [];
    for (const item of items) {
      console.log(' -', item.Title);
    }
  }
}
```

> **Tip:** Using the generic argument on `getFullList<T>()` gives you strong types throughout your codebase.

---

## 4) Optional: Nested expansions (e.g., item.user)

If you also expand nested relations (e.g., `expand=TodoItem,user` or `expand=TodoItem.user` depending on schema), you can express that by making the item’s own `expand` typed:

```ts
// Example: TodoItem expands its user relation
type TodoItemExpand = {
  user: UserResponse; // replace with your actual generated type for users
};

type TodoListExpand = {
  TodoItem: TodoItemResponse<TodoItemExpand>[];
};

export type TodoListWithItemsResponse = TodoListResponse<TodoListExpand>;
```

Now you can safely access `item.expand?.user`.

---

## 5) Optional: Reusable helper for any collection

If you find yourself repeating this pattern, create a generic helper:

```ts
type WithExpand<TRecordResponse, TExpand> = TRecordResponse & {
  expand?: TExpand;
};
```

Example usage:

```ts
type TodoListWithItems = WithExpand<
  TodoListResponse,
  { TodoItem: TodoItemResponse[] }
>;
```

> This helper is handy when writing quick one‑offs or prototyping. For production, prefer the explicit `TodoListExpand` approach for clarity.

---

## 6) Troubleshooting & tips

- **`expand` may be absent** if you forget the `expand:` option in your query or if a relation is empty. That’s why `expand` is optional in `BaseSystemFields<T>` when `T` is `unknown`. Use **optional chaining**: `list.expand?.TodoItem ?? []`.
- **Field names** in `expand` must match your PocketBase schema relation names exactly (case‑sensitive).
- **Use `Required<T>` intentionally.** Your generated responses use `Required<...>` to ensure you get all properties on read. Keep writes/creates separate (they usually use optional fields).
- **Nesting:** For multiple relations, just add more keys to your expand type (e.g., `{ TodoItem: TodoItemResponse[]; user: UserResponse }`). For nested expansion of children, give `TodoItemResponse` its own `Texpand`.
- **Discriminated unions:** If you later have variants (e.g., different item types), model them with unions and discriminants (e.g., `kind: 'task' | 'note'`).

---

## 7) Copy‑paste summary

```ts
// 1) Describe the expand shape
type TodoListExpand = {
  TodoItem: TodoItemResponse[];
};

// 2) Compose the final response
export type TodoListWithItemsResponse = TodoListResponse<TodoListExpand>;

// 3) Use it in your call
const lists = await pb
  .collection('todoList')
  .getFullList<TodoListWithItemsResponse>({ expand: 'TodoItem' });

// 4) (Optional) Nested expansions
type TodoItemExpand = { user: UserResponse };
type TodoListExpandNested = {
  TodoItem: TodoItemResponse<TodoItemExpand>[];
};
export type TodoListWithItemsAndUsersResponse = TodoListResponse<TodoListExpandNested>;
```

---

**That’s it!** You’ve composed a precise, reusable type for a **TodoList with expanded TodoItems**, and you can extend it cleanly for deeper expansions as your schema grows.
