# Data Flow Overview: Pocketbase to Svelte

This document outlines the data flow architecture in the `pb-sv` project, detailing how data travels from the Pocketbase backend to the Svelte frontend components.

## High-Level Architecture

The application follows a layered architecture for data handling:

1.  **Pocketbase Backend**: The source of truth (Database + API).
2.  **Pocketbase Client**: Initialized SDK instance.
3.  **Service Layer**: Typed wrappers around Pocketbase SDK methods.
4.  **Store Layer**: Svelte 5 reactive stores managing application state.
5.  **Component Layer**: UI components consuming data via stores.

## 1. Pocketbase Client Initialization

The Pocketbase client is initialized in `src/lib/index.ts`. It creates a single instance pointing to the local Pocketbase server.

```typescript
// src/lib/index.ts
export const pb = new Pocketbase('http://127.0.0.1:8090') as TypedPocketBase;
```

## 2. Service Layer (`src/lib/pocketbase/`)

Services are stateless modules that handle direct communication with the Pocketbase API. They wrap the generic `pb` client methods with typed interfaces.

**Pattern:**
-   Import the global `pb` instance.
-   Define types for Create/Update inputs.
-   Export an object (e.g., `assessmentsService`) with async methods (`listByUnit`, `get`, `create`, `update`, `remove`).
-   Use `pocketbase-types` for strict typing of responses.

**Example:** `src/lib/pocketbase/assessments.service.ts`
```typescript
export const assessmentsService = {
    listByUnit: async (unitId: RecordIdString) => {
        return pb.collection(Collections.Assessments).getFullList<AssessmentResponse>({
            filter: `unitId="${unitId}"`
        });
    },
    // ... other CRUD methods
};
```

## 3. Store Layer (`src/lib/stores/`)

Stores manage the application state using Svelte 5's reactive runes (`$state`). They act as the bridge between services and components.

**Pattern:**
-   **State**: Uses `$state` to hold data (e.g., `assessmentsByUnit`).
-   **Actions**: Methods like `refresh`, `createAssessment` call the underlying service and then update the local state.
-   **Context**: Uses Svelte's `createContext` to provide the store instance to the component tree, ensuring a singleton-like behavior within the app context.

**Example:** `src/lib/stores/assessmentsStore.svelte.ts`
```typescript
export class AssessmentsStore {
    assessmentsByUnit = $state<Record<RecordIdString, AssessmentResponse[]>>({});

    async refresh(unitId: RecordIdString) {
        const records = await assessmentsService.listByUnit(unitId);
        this.setAssessments(unitId, records); // Updates local state
        return records;
    }
}
```

## 4. Component Layer (`src/routes/`)

Components consume data reactively from the stores and trigger data fetching.

**Pattern:**
-   **Access**: Retrieve the store using context getters (e.g., `getAssessmentsContext()`).
-   **Reactivity**: Use `$derived` to create reactive variables based on store state.
-   **Fetching**: Use `$effect` to trigger `store.refresh()` or `store.fetch()` when dependencies (like `unitId`) change.

**Example:** `src/routes/(app)/units/[unitId]/+page.svelte`
```svelte
<script>
    const assessmentsStore = getAssessmentsContext();
    const unitId = $derived(page.params.unitId);
    
    // Reactive data access
    const assessments = $derived(unitId ? assessmentsStore.getAssessments(unitId) : []);

    // Data fetching trigger
    $effect(() => {
        if (unitId) {
            assessmentsStore.refresh(unitId);
        }
    });
</script>
```

## Summary

The data flow is **unidirectional** in terms of updates:
1.  Component triggers action (e.g., `refresh`).
2.  Store calls Service.
3.  Service calls Pocketbase API.
4.  Pocketbase returns data.
5.  Store updates its `$state`.
6.  Component automatically re-renders due to fine-grained reactivity.
