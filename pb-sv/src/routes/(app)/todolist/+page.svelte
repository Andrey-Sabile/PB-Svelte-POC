<script lang="ts">
	import type { TodoItemResponse, TodoListResponse } from '$lib/types/pocketbase';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	type TodoListWithItems = TodoListResponse<{ TodoItem?: TodoItemResponse[] }>;
	const todos = $derived(data.todoList?.items ?? []) as TodoListWithItems[];
</script>

{#if todos.length}
	<ul>
		{#each todos as todo (todo.id)}
			{@const todoItems = todo.expand?.TodoItem ?? []}
			<li>
				<h3>{todo.Title}</h3>

				{#if todoItems.length}
					<ul>
						{#each todoItems as item (item.id)}
							<li>{item.Title}</li>
						{/each}
					</ul>
				{:else}
					<p>No todo items yet.</p>
				{/if}
			</li>
		{/each}
	</ul>
{:else}
	<p>No todos yet.</p>
{/if}
