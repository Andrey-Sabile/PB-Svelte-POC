<script lang="ts">
	import { authState } from '$lib/stores/auth';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let user = $state($authState.user);
</script>

<h1>Hello {user}</h1>
