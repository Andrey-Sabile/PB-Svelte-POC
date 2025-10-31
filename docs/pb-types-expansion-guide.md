# Pocketbase Typegen

Generate typescript definitions from your [pocketbase.io](https://pocketbase.io/) schema.

## Quickstart

`npx pocketbase-typegen --url https://myproject.pockethost.io --email admin@myproject.com --password 'secr3tp@ssword!'`

This will produce types for all your PocketBase collections to use in your frontend typescript codebase.

## Example Usage

Collections can be [automatically typed](https://github.com/pocketbase/js-sdk#specify-typescript-definitions) using the generated `TypedPocketBase` type:

```typescript
import { TypedPocketBase } from "./pocketbase-types"

const pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase

await pb.collection("tasks").getOne("RECORD_ID") // -> results in TaskResponse
await pb.collection("posts").getOne("RECORD_ID") // -> results in PostResponse
```

Alternatively, you can use generic types for each request, eg:

```typescript
import { Collections, TasksResponse } from "./pocketbase-types"

await pb.collection(Collections.Tasks).getOne<TasksResponse>("RECORD_ID") // -> results in TaskResponse
```

## Example Advanced Usage

You can provide types for JSON fields and [expanded relations](https://pocketbase.io/docs/expanding-relations/) by passing generic arguments to the Response types:

```typescript
import { Collections, CommentsResponse, UserResponse } from "./pocketbase-types"

/**
  type CommentsRecord<Tmetadata = unknown> = {
    text: string
    metadata: null | Tmetadata // This is a json field
    user: RecordIdString // This is a relation field
  }
*/
type Metadata = {
  likes: number
}
type Expand = {
  user: UsersResponse
}
const result = await pb
  .collection(Collections.Comments)
  .getOne<CommentsResponse<Metadata, Expand>>("RECORD_ID", { expand: "user" })

// Now you can access the expanded relation with type safety and hints in your IDE
result.expand.user.username
```

## Create/Update types

You can also type the create/update operations:

```typescript
import { Collections, Create, Update } from "./pocketbase-types"

// Create
const newUser: Create<Collections.Users> = {
  name: "Name",
  username: "username",
  password: "password",
  passwordConfirm: "password",
  email: "user@mail.com",
  emailVisibility: true,
  verified: false,
}
await pb.collection(Collections.Users).create(newUser)

// Update
const updatedUser: Update<Collections.Users> = {
  name: "Updated name",
  email: "user@email.com",
  verified: false,
}
await pb.collection(Collections.Users).update("RECORD_ID", updatedUser)
```

## Generating Types

```
Options:
  -V, --version              output the version number
  -u, --url <url>            URL to your hosted pocketbase instance. When using this options you must also provide email and
                             password options or auth token option.
  --email <email>            Email for a pocketbase superuser. Use this with the --url option.
  -p, --password <password>  Password for a pocketbase superuser. Use this with the --url option.
  -t, --token <token>        Auth token for a pocketbase superuser. Use this with the --url option.
  -d, --db <path>            Path to the pocketbase SQLite database.
  -j, --json <path>          Path to JSON schema exported from pocketbase admin UI.
  --env [dir]                Use environment variables for configuration. Add PB_TYPEGEN_URL, PB_TYPEGEN_EMAIL, PB_TYPEGEN_PASSWORD
                             to your .env file. Optionally provide a path to a directory containing a .env file (default: true)
  -o, --out <path>           Path to save the typescript output file. (default: "pocketbase-types.ts")
  --no-sdk                   Removes the pocketbase package dependency. A typed version of the SDK will not be generated.
  -h, --help                 display help for command
```

### URL example with email and password:

`npx pocketbase-typegen --url https://myproject.pockethost.io --email admin@myproject.com --password 'secr3tp@ssword!'`

### URL example with auth token:

You can generate such token via the above impersonate API or from the Dashboard > Collections > \_superusers > {select superuser} > "Impersonate" dropdown option.

`npx pocketbase-typegen --url https://myproject.pockethost.io --token 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'`

### ENV example:

Also supports environment specific files such as .env.local (uses [dotenv-flow](https://www.npmjs.com/package/dotenv-flow))

`npx pocketbase-typegen --env` or `npx pocketbase-typegen --env path/to/dir`

.env variables include:

```
PB_TYPEGEN_URL=https://myproject.pockethost.io
PB_TYPEGEN_EMAIL=admin@myproject.com
PB_TYPEGEN_PASSWORD=secr3tp@ssword!
PB_TYPEGEN_TOKEN=eyJhbGciOiJI...ozhyQVfYm24
```

### Database example:

`npx pocketbase-typegen --db ./pb_data/data.db`

### JSON example (export JSON schema from the pocketbase admin dashboard):

`npx pocketbase-typegen --json ./pb_schema.json`

### Automatic Type Generation

Pocketbase [hooks](https://pocketbase.io/docs/js-event-hooks/) can be used to generate new types every time a collections is created/updated/deleted. Create a file `generateHooks.pb.js` and place it in a directory called `pb_hooks` along side your pocketbase executable.

```javascript
/// <reference path="../pb_data/types.d.ts" />

const generateTypes = (e) => {
  console.log("Collection changed - Running type generation...")
  const cmd = $os.cmd(
    "npx",
    "pocketbase-typegen",
    "--db",
    "pb_data/data.db",
    "--out",
    "../client/src/pocketbase-types.ts"
  )
  const result = toString(cmd.output())
  console.log(result)

  e.next()
}

onCollectionAfterCreateSuccess(generateTypes)
onCollectionAfterUpdateSuccess(generateTypes)
onCollectionAfterDeleteSuccess(generateTypes)
```

### Shortcut

Add it to your projects `package.json`:

```
"scripts": {
  "typegen": "pocketbase-typegen --env",
},
```

## Example Output

The output is a typescript file `pocketbase-types.ts` ([example](./test/pocketbase-types-example.ts)) which will contain:

- `Collections` An enum of all collections.
- `[CollectionName]Record` One type for each collection (eg ProfilesRecord).
- `[CollectionName]Response` One response type for each collection (eg ProfilesResponse) which includes system fields. This is what is returned from the PocketBase API.
  - `[CollectionName][FieldName]Options` If the collection contains a select field with set values, an enum of the options will be generated.
- `CollectionRecords` A type mapping each collection name to the record type.
- `CollectionResponses` A type mapping each collection name to the response type.
- `TypedPocketBase` A type for usage with type asserted PocketBase instance.

## Version Support

| PocketBase | pocketbase-typegen |
| ---------- | ------------------ |
| v0.23.x    | v1.3.x             |
| v0.18.x    | v1.2.x             |
| v0.8.x     | v1.1.x             |
| v0.7.x     | v1.0.x             |

## Status

![](https://github.com/patmood/pocketbase-typegen/actions/workflows/test.yml/badge.svg?branch=main) ![](https://github.com/patmood/pocketbase-typegen/actions/workflows/integration.yml/badge.svg?branch=main)

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


