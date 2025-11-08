# Lessons Tab Plan

## Lessons Tab Structure
- [ ] Replace the placeholder tab body in `pb-sv/src/routes/(app)/units/[unitId]/+page.svelte` (around line 63) with a dedicated `<LessonsTab {unitId} {lessons}/>` component so the page script focuses on fetching and tab orchestration.
- [ ] Inside `LessonsTab`, keep all data access routed through `lessonsStore` (`pb-sv/src/lib/stores/lessonsStore.svelte.ts`, line 5) to honor the layering contract (UI → cache-aware store → `lessons.service`).
- [ ] Pass the derived `lessons` array from `+page.svelte` (line 25) into `LessonsTab` so it can render counts, empty states, and lists without additional queries.
- [ ] Place the “Create lesson” trigger directly in the tab (button or inline card) so educators add lessons without navigating away.

## Form State & UX
- [ ] Model draft fields (`title`, `scheduledDate`, `duration`, `content`, `resources`, etc.) with `$state` so inputs remain in sync without manual setters.
- [ ] Use runic helpers like `const isValidTitle = $derived(draft.title.trim().length > 0)` to gate submission until required PocketBase fields are ready.
- [ ] Track `isSaving`, `errorMessage`, and `successMessage` with `$state` to surface spinners and inline alerts while store calls run.
- [ ] Reset the `$state` draft after a successful create (especially when the form lives in a modal/drawer) to prepare for the next entry.

## Submission & Validation
- [ ] Read `teacherId` from `getAuthContext()` (`(app)/+layout.svelte`, line 33), pair it with `unitId`, and invoke `await lessonsStore.createLesson({ unitId, teacherId, title, ... })` so the cache updates instantly.
- [ ] Add lightweight client validations (title required, positive duration) before calling the store, and surface backend validation errors via `errorMessage`.
- [ ] Optionally call `lessonsStore.refresh(unitId)` post-create when you need canonical ordering or server-defaulted fields.
- [ ] Factor out helpers like `buildLessonPayload(draft)` so future bulk-import or wizard flows reuse the same mapping logic.

## Progressive Enhancement (Optional)
- [ ] Add `pb-sv/src/routes/(app)/units/[unitId]/+page.server.ts` with a `createLesson` form action that validates `FormData`, calls `lessonsService.create`, and returns the new record (per Svelte MCP “Form actions” guidance).
- [ ] Wrap the tab form in `<form method="POST" action="?/createLesson" use:enhance={enhanceWithStoreSync}>` so JS users stay in-place while no-JS users still reach the action.
- [ ] Inside `enhanceWithStoreSync`, parse the action response, call `lessonsStore.hydrate(unitId, [...lessons, actionData.lesson])`, and propagate server validation errors into `errorMessage`.

## Next Steps
1. Scaffold the `LessonsTab` component.
2. Wire rune-based form state, validation helpers, and submission flow.
3. Decide whether to stick with direct store calls or add the progressive enhancement layer.
