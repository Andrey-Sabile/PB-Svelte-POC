<script lang="ts">
	import { goto } from '$app/navigation';
	import { setAuthContext } from '$lib/stores/auth.svelte';
	const { children } = $props();
	const auth = setAuthContext();
</script>

{#if auth.isSynced}
	{@render children()}
{:else}
	<div>Loading</div>
{/if}
