<script lang="ts">
	import pb, { clearPocketBaseAuth } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authState } from '$lib/stores/auth';
	import type { LayoutProps } from './$types';

	let unsub: () => void;

	onMount(() => {
		const check = ({ isValid }: { isValid: boolean }) => {
			if (!isValid) {
				goto(resolve('/login'));
			}
		};

		unsub = authState.subscribe(check);

		return () => {
			unsub?.();
		};
	});

	const logout = async () => {
		clearPocketBaseAuth();
		await goto(resolve('/login'));
	};

	let { data, children }: LayoutProps = $props();
</script>

<button onclick={logout}>Logout</button>

{@render children()}
