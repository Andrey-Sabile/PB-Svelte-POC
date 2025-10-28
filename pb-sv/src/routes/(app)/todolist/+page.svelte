<script lang="ts">
	import { authState } from '$lib/stores/auth';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let user = $state($authState.user);
	let todos = data.todoList?.items ?? [];
</script>

<h1>Hello {user?.name}</h1>

{#if todos.length}
	<ul>
		{#each todos as todo}
			<li>{todo.Title}</li>
		{/each}
	</ul>
{:else}
	<p>No todos yet.</p>
{/if}
