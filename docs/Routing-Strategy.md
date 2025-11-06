# Routing Strategy

## Purpose & Scope
This document defines the baseline navigation and routing patterns for the SPA client that lives in `src/routes`. It targets SvelteKit 5 with runes enabled and should guide component authors, feature squads, and reviewers when adding new routes or navigation affordances.

## Guiding Principles
- Prefer native anchors (`<a>`) with correct `href` values for all in-app navigation to preserve accessibility, middle-click, open-in-new-tab, and history semantics.
- Use SvelteKit's load functions and layout hierarchy to resolve data; avoid ad-hoc fetches in component scripts whenever route context is required.
- Programmatic navigation via `goto` supplements anchors for imperative flows (wizards, post-submit transitions) but never replaces declarative markup where a link would suffice.
- Centralize reusable navigation helpers (link components, guard utilities, scroll management) inside `src/lib` so features share a consistent behavior.
- Keep navigation client-side by default (SPA behavior) while falling back to full reloads only for hard exits (external URLs, downloads, admin consoles outside the app).

## Route Organization Pattern
1. **Layout groups:** Continue grouping related routes inside `(app)`, `(landing)`, etc. Shared shells (`+layout.svelte`) and shared data resolvers (`+layout.ts`) live alongside each group.
2. **Root layout:** Keep `src/routes/+layout.svelte` light—define top-level theming, global providers, and slot the current route. Client-only providers (e.g., stores) should live here, while server data belongs in `+layout.server.ts` if required.
3. **Data resolution:** Prefer `+layout.ts` for data shared across children and `+page.ts` for route-specific needs. Co-locate remote calls with their route to reduce prop drilling and facilitate invalidation with `goto`.

```ts
// src/routes/(app)/dashboard/+page.ts
import type { PageLoad } from './$types';
import { api } from '$lib/api';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('app:dashboard');
	const summary = await api(fetch).summary();
	return { summary };
};
```

## Navigation Surfaces
- **Primary navigation:** Build shared nav components in `src/lib/navigation/`. They should render anchors with minimal styling concerns and rely on runes for active state.
- **Buttons that navigate:** Use buttons only when triggering navigation is a side-effect of another action (e.g., completing a form). Guard them with `type="button"` and call a shared `navigate` helper that wraps `goto`.
- **Dialog & wizard flows:** Compose steps inside a single route when possible, using local state to swap snippets. Only create nested routes when the URL must reflect the step for deep-linking or shareability.

```svelte
<!-- src/lib/navigation/Link.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	export let href: string;
	export let replace = false;
	export let strict = false; // match exact path when true

	const isActive = $derived(() => {
		const current = page.url.pathname;
		return strict ? current === href : current.startsWith(href) && href !== '/';
	});

	const handleClick = async (event: MouseEvent) => {
		if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.button !== 0) return;
		event.preventDefault();
		await goto(href, { replaceState: replace });
	};
</script>

<a
	on:click={handleClick}
	href={href}
	aria-current={isActive ? 'page' : undefined}
	data-sveltekit-prefetch
>
	<slot />
</a>
```

## Programmatic Navigation with `goto`
- **Import path:** Always import from `$app/navigation`.
- **Await the promise:** `goto` returns a promise that resolves after navigation completes; `await` it when subsequent logic depends on the new route.
- **Options:**
	- `replaceState`: Use for redirects where the previous URL should not remain in history (e.g., after login).
	- `keepfocus`: Set true to retain focus when the destination manages focus manually (modals, preserved search input).
	- `noscroll`: Combine with `keepfocus` for stateful pages that should not scroll to top.
	- `invalidateAll`: Rarely needed; default is to reuse cached data. Pass true when global state was mutated and every loader must rerun.
- **Guards & Conditions:** Wrap `goto` in small utilities for guards (auth, feature flags). Keep guard logic on the client lightweight; heavier decisions should happen in load functions and return redirects.

```ts
// src/lib/navigation/navigate.ts
import { goto } from '$app/navigation';

export const navigate = async (href: string, opts?: { replaceState?: boolean; noscroll?: boolean }) => {
	return goto(href, opts);
};
```

```svelte
<script lang="ts">
	import { navigate } from '$lib/navigation/navigate';

	const finishWizard = async () => {
		await navigate('/app/dashboard', { replaceState: true });
	};
</script>
```

## Anchor `href` Usage
- **Always set `href`:** Even when using `on:click` with `goto`, ensure `href` points to the same route so assistive tech and browser affordances work.
- **Prefetch signals:** Use `data-sveltekit-prefetch` for in-viewport links and `sveltekit:prefetch` for hover-triggered prefetching when latency matters.
- **External URLs:** Add `rel="noopener" target="_blank"` and skip client interception by setting `data-sveltekit-preload-data="off"` or simply leaving the link untouched.
- **Download & mailto:** Allow the browser to handle them; do not intercept with `goto`.

## Route Resolving & Data Lifecycles
1. **Shared dependencies:** Use `depends('app:resource')` naming conventions to invalidate data consistently from mutations or server events.
2. **Remote function coordination:** When using SvelteKit remote functions, `await` them and rely on returned redirects instead of manual `goto` when possible.
3. **Error handling:** Provide `+error.svelte` per layout group for scoped failures. Use `<svelte:boundary>` in complex components that fetch additional client-only data.
4. **Optimistic updates:** For optimistic UI updates that must sync with navigation, update local state first, then `await goto` with `invalidateAll: true` if the loader should refresh.

## Scroll & Focus Management
- Prefer default behavior—SvelteKit scrolls to top and focuses the body.
- For preserved scroll (tabs within same page) wrap your content in `<svelte:window>` listeners or use the `noscroll` option and custom focus logic.
- After programmatic navigation triggered by non-link elements, manage focus explicitly to maintain accessibility.

## Testing the Strategy
- Use Playwright specs in `e2e/` that navigate via both anchors and `goto`-driven flows to ensure history, scroll, and data resolution behave as expected.
- In Vitest component tests, mock `goto` and assert it is invoked with the expected path and options for imperative flows.

## Checklist for New Routes
- Route lives under the correct layout group with matching `+layout` / `+page` files.
- Data fetching occurs in load functions with explicit `depends` keys.
- Navigation elements render anchors with correct `href` plus optional `data-sveltekit-prefetch`.
- Imperative navigation calls share `navigate()` helper and await its promise.
- Edge cases (auth guards, invalid states) redirect via loader returns instead of client-only `goto`.

Following this strategy keeps navigation consistent, accessible, and predictable across the SPA while leveraging the full capabilities of SvelteKit 5 runes.
