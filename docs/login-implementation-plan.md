# SPA Login Implementation Plan

Follow the steps in order. Each one sets up the next so the entire flow stays purely client-side.

---

## 1. Centralize the PocketBase client
- **Files to edit:** `pb-sv/src/lib/pocketbase.ts`
- Export a single PocketBase instance (the SDK already keeps auth in `localStorage` for SPAs). Expose a helper to reset/clear when needed.

```ts
// pb-sv/src/lib/pocketbase.ts
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './types/pocketbase';

const baseUrl = 'http://127.0.0.1:8090';
const pb = new PocketBase(baseUrl) as TypedPocketBase;

export const clearPocketBaseAuth = () => {
	pb.authStore.clear();
};

export default pb;
```

---

## 2. Track auth state with Svelte stores
- **Files to create:** `pb-sv/src/lib/stores/auth.ts`
- Mirror `pb.authStore` inside a writable store so pages/components can reactively respond to login changes. Listen for PocketBase auth events to keep everything in sync.

```ts
// pb-sv/src/lib/stores/auth.ts
import { writable } from 'svelte/store';
import pb from '$lib/pocketbase';
import type { UsersResponse } from '$lib/types/pocketbase';

type AuthState = {
	isValid: boolean;
	user: UsersResponse | null;
};

const initial: AuthState = {
	isValid: pb.authStore.isValid,
	user: (pb.authStore.model as UsersResponse) ?? null
};

export const authState = writable<AuthState>(initial);

pb.authStore.onChange(() => {
	authState.set({
		isValid: pb.authStore.isValid,
		user: (pb.authStore.model as UsersResponse) ?? null
	});
});
```

---

## 3. Build the login page UI and logic
- **Files to edit:** `pb-sv/src/routes/(landing)/login/+page.svelte`
- Render a form, call `authWithPassword` on submit, store errors locally, and redirect using `goto` from `$app/navigation`.

```svelte
<!-- pb-sv/src/routes/(landing)/login/+page.svelte -->
<script lang="ts">
	import pb from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let form = $state({ email: '', password: '', error: '' });
	let loading = $state(false);

	const login = async () => {
		form.error = '';
		loading = true;
		try {
			await pb.collection('users').authWithPassword(form.email, form.password);
			await goto('/todolist');
		} catch (error) {
			form.error = 'Invalid email or password.';
		} finally {
			loading = false;
		}
	};
</script>

<form class="card gap-4 p-6 bg-base-100 shadow" on:submit|preventDefault={login}>
	<label class="form-control">
		<span class="label-text">Email</span>
		<input type="email" bind:value={form.email} required />
	</label>

	<label class="form-control">
		<span class="label-text">Password</span>
		<input type="password" bind:value={form.password} required />
	</label>

	{#if form.error}
		<p class="text-error">{form.error}</p>
	{/if}

	<button class="btn btn-primary" type="submit" disabled={loading}>
		{loading ? 'Logging in…' : 'Log in'}
	</button>
</form>
```

---

## 4. Guard (app) routes on the client
- **Files to edit:** `pb-sv/src/routes/(app)/+layout.svelte`, `pb-sv/src/routes/(app)/todolist/+page.svelte`
- Use `onMount` to check auth. If not valid, redirect to `/login`. Keep SSR disabled so these checks run only in the browser.

```svelte
<!-- pb-sv/src/routes/(app)/+layout.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authState } from '$lib/stores/auth';

	let unsub: () => void;

	onMount(() => {
		const check = ({ isValid }: { isValid: boolean }) => {
			if (!isValid) {
				goto('/login');
			}
		};

		unsub = authState.subscribe(check);
		check($state.snapshot(authState)); // immediately redirect if already invalid

		return () => {
			unsub?.();
		};
	});
</script>

<slot />
```

```svelte
<!-- pb-sv/src/routes/(app)/todolist/+page.svelte -->
<script lang="ts">
	import { authState } from '$lib/stores/auth';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	$: user = $authState.user;
</script>

<section>
	<h1>Welcome back {user?.name ?? 'friend'}!</h1>
	<!-- Todo list UI here -->
</section>
```

---

## 5. Provide a logout control
- **Files to edit:** `pb-sv/src/routes/(app)/+layout.svelte` (or any shared header)
- Clear the PocketBase auth store, broadcast the change, and route the user to `/login`.

```svelte
<!-- Add to whichever component renders the nav -->
<script lang="ts">
	import pb, { clearPocketBaseAuth } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	const logout = async () => {
		clearPocketBaseAuth();
		await goto('/login');
	};
</script>

<button class="btn btn-outline" on:click={logout}>Log out</button>
```

---

## 6. Test the flow manually
- Invalid credentials should show the inline error.
- Successful login should redirect to `/todolist` and keep you in even after page reload (PocketBase restores auth from `localStorage`).
- Visiting `/todolist` when logged out should bounce back to `/login`.
***
