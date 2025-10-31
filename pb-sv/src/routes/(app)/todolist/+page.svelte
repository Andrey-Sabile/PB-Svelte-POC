<script lang="ts">
	import type { TodoListWithItemsResponse } from './todoApi';
	import type { PageProps } from './$types';
	import { Plus } from '@lucide/svelte';
	import { untrack } from 'svelte';

	let { data }: PageProps = $props();
	let todoList: TodoListWithItemsResponse[] = $state(
		(data.todoList ?? []) as TodoListWithItemsResponse[]
	);
	let selectedId = $state<string | null>(null);

	$effect(() => {
		const lists = (data.todoList ?? []) as TodoListWithItemsResponse[];
		const currentSelectedId = untrack(() => selectedId);

		todoList = lists;

		if (!currentSelectedId || !lists.some((list) => list.id === currentSelectedId)) {
			selectedId = lists[0]?.id ?? null;
		}
	});
	const selectedTodoList = $derived.by(() => {
		if (!selectedId) return null;

		return todoList.find((entry) => entry.id === selectedId) ?? null;
	});
</script>

<div class="grid h-full grid-cols-[1fr_2fr] items-start gap-6">
	<div class="card bg-base-100 shadow md:grid-cols-2">
		<ul class="card-body list gap-6">
			{#each todoList as list (list.id)}
				<button
					class="list-row hover:bg-base-200 aria-pressed:bg-base-200 hover:cursor-pointer"
					aria-pressed={selectedId === list.id}
					onclick={() => (selectedId = list.id)}
				>
					{list.Title}
				</button>
			{/each}
		</ul>
	</div>

	<div class="card bg-base-100 h-full overflow-y-auto shadow">
		<ul class="card-body list gap-6">
			<div class="card-title flex-row">
				<p>{selectedTodoList?.Title ?? ''}</p>
				<button class="btn btn-ghost btn-circle">
					<Plus fill="none" stroke-width="2" class="size-5" />
				</button>
			</div>

			{#each selectedTodoList?.expand?.TodoItem ?? [] as item (item.id)}
				{#if item.done != true}
					<li class="list-row hover:bg-base-200">
						<input type="checkbox" class="checkbox" onclick={() => (item.done = true)} />
						<p>{item.Note}</p>
					</li>
				{/if}
			{/each}

			<div class="card-title flex-row">
				<p>Completed Task</p>
			</div>

			{#each selectedTodoList?.expand?.TodoItem ?? [] as item (item.id)}
				{#if item.done == true}
					<li class="list-row hover:bg-base-200">
						<input type="checkbox" checked class="checkbox" onclick={() => (item.done = false)} />
						<p>{item.Note}</p>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>
