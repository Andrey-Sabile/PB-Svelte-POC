<script lang="ts">
	import pb, { clearPocketBaseAuth } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authState } from '$lib/stores/auth';
	import type { LayoutProps } from './$types';

	let unsub: () => void;

	onMount(() => {
		const check = ({ isValid }: { isValid: boolean }) => {
			if (!isValid) {
				goto('/login');
			}
		};

		unsub = authState.subscribe(check);

		return () => {
			unsub?.();
		};
	});

	const logout = async () => {
		clearPocketBaseAuth();
		await goto('/login');
	};

	let { data, children }: LayoutProps = $props();
</script>

<button onclick={logout}>Logout</button>

{@render children()}
