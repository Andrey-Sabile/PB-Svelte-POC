Implementation Plan

PocketBase Rules

In the Admin UI, set TodoList and TodoItem collection rules so only authenticated users can read/write (e.g. @request.auth?.id != ''). Use list/view rules to scope data per owner via field filters once ownership fields exist.
Auth Fields & Relations

Add a required user relation field on both TodoList and TodoItem pointing to users to enforce ownership. Configure create/update rules so user = @request.auth.id.
JS SDK Wrapper

Create pb-sv/src/lib/pocketbase.ts exporting a singleton PocketBase client typed with TypedPocketBase from pocketbase.d.ts, plus helpers to reset the auth store.
Login Route (CSR)

Scaffold pb-sv/src/routes/login/+page.svelte using Svelte 5 runes (let form = $state({ email: '', password: '' })). On submit call pb.collection('users').authWithPassword(email, password); on success goto('/app').
Add pb-sv/src/routes/login/+page.ts with export const prerender = true so the login screen is statically generated.
Logout Handler

Add pb-sv/src/routes/logout/+page.ts with a load that clears pb.authStore and redirects to /login.
Protected App Shell

Under pb-sv/src/routes/(app)/+layout.ts export ssr = false, csr = true, and a load that checks pb.authStore.isValid. Redirect to /login if invalid; otherwise return { user: pb.authStore.model }.
Create the paired pb-sv/src/routes/(app)/+layout.svelte that reads { user } and renders a navigation shell.
Global Unauthorized Handler

Implement a small utility (e.g. src/lib/utils/auth.ts) wrapping PocketBase requests: if a call throws 401/403, clear the store and goto('/login').
TodoList Page

Add pb-sv/src/routes/(app)/todolists/+page.ts with a load that calls ensureAuth(pb.collection('TodoList').getFullList({ filter: 'user = @request.auth.id' })).
In +page.svelte, initialize state with $state(data.lists) and use Svelte 5 syntax for interactions. Provide forms to create/update using the SDK, calling ensureAuth.
TodoItem Nested Route

Under todolists/[id]/+page.ts, fetch the specific list and its items via expand (e.g. getOne(id, { expand: 'TodoItem' })). Guard with ensureAuth.
Render in +page.svelte, allow adding items via pb.collection('TodoItem').create({ ...list relation..., user: currentUser }).
Hydration of Auth Store

On app initialization (e.g. src/lib/pocketbase.ts), load any stored auth data (pb.authStore.loadFromCookie(...) if using cookies) or rely on the SDK’s default localStorage persistence.
Optional Enhancements

Add a tiny hooks.server.ts later only if you introduce server endpoints that need the session (deserialize cookie, inject into locals).
Write vitest tests for the util wrapper to ensure redirects occur on unauthorized errors.
