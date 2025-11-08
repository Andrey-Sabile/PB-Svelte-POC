**Layering Overview**

- **PocketBase service modules** (`src/lib/pocketbase/*.service.ts`): one per entity (teaching units, assessments, assignments, classes, lessons, learning objectives, resources). Each exports the record/input/update types plus plain async functions (`list`, `get`, `create`, `update`, `remove`, etc.) that do nothing but call `pb.collection(Collections.X)` with the right expand/filter options. They’re framework-agnostic and can be imported anywhere—server code, runes, or future background tasks.

- **Store modules** (`src/lib/stores/*Store.svelte.ts`): each store imports its service, wraps the raw I/O with `$state`-backed caches and helpers (`upsert`, `hydrate`, `refresh`, `link`/`unlink`). They also house the `createContext` plumbing plus lazy singletons, so layout components can call `set…Context()` once and descendants can safely call `get…Context()`.

- **Component layer**: layouts register the stores (`(app)/+layout.svelte` calls every `set…Context`). Pages and components consume the stores via `get…Context()`, using derived arrays/states and store methods for UI logic. Components never talk to PocketBase directly—they only see the store API (e.g., `teachingUnitStore.createTeachingUnit`, `lessonsStore.getLessons(unitId)`), while the store in turn delegates to its service.

This yields three clear tiers: UI components → cache-aware stores → stateless PocketBase services.
