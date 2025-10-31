<script lang="ts">
	import type { TodoListWithItemsResponse } from './todoApi';
	import type { PageProps } from './$types';
	import { Plus } from '@lucide/svelte';
	import {
		Collections,
		TodoItemPriorityLevelOptions,
		type TodoItemRecord,
		type TodoItemResponse,
		type TodoListRecord
	} from '$lib/types/pocketbase-types';
	import pb from '$lib/pocketbase';

	let { data }: PageProps = $props();
	let todoList: TodoListWithItemsResponse[] = $state(data.todoList ?? []);
	let showModal = $state(false);
	let newTodoListTitle = $state('');

	let selectedId = $state<string | null>(data.todoList?.[0]?.id ?? null);

	const selectedTodoList = $derived.by(() => {
		if (!selectedId) return null;

		return todoList.find((entry) => entry.id === selectedId) ?? null;
	});

	const addTodoListItem = async () => {
		if (!selectedId) return;
		if (!selectedTodoList) return;

		const sample = selectedTodoList.expand?.TodoItem_via_TodoList?.[0];
		const newTodoItem: TodoItemRecord = {
			id: '',
			Title: 'New task',
			Note: '',
			PriorityLevel: sample?.PriorityLevel ?? TodoItemPriorityLevelOptions.E1,
			TodoList: selectedTodoList.id,
			done: false,
			user: sample?.user ?? ''
		};

		const created = (await pb
			.collection(Collections.TodoItem)
			.create(newTodoItem)) as TodoItemResponse;
		const createdItem: TodoItemResponse = { ...created, expand: created.expand ?? {} };

		if (!selectedTodoList.expand) {
			selectedTodoList.expand = { TodoItem_via_TodoList: [createdItem] };
			return;
		}

		if (!selectedTodoList.expand.TodoItem_via_TodoList) {
			selectedTodoList.expand.TodoItem_via_TodoList = [createdItem];
			return;
		}

		selectedTodoList.expand.TodoItem_via_TodoList.unshift(createdItem);
	};

	const editItemToDone = async (item: TodoItemRecord) => {
		if (!selectedId) return;
		if (!selectedTodoList) return;

		item.done = true;

		const created = (await pb
			.collection(Collections.TodoItem)
			.update(item.id, item)) as TodoItemResponse;
	};

	const editItemNote = async (item: TodoItemRecord) => {
		if (!selectedId) return;
		if (!selectedTodoList) return;

		const created = (await pb
			.collection(Collections.TodoItem)
			.update(item.id, item)) as TodoItemResponse;
	};

	const createTodoList = async (name: string) => {
		if (!selectedTodoList) return;
		const trimmedName = name.trim();
		if (!trimmedName) return;
		const sample = selectedTodoList;

		const newTodoList: TodoListRecord = {
			id: '',
			user: sample?.user ?? '',
			Title: trimmedName
		};
		const created = (await pb
			.collection(Collections.TodoList)
			.create(newTodoList)) as TodoListWithItemsResponse;
		todoList = [...todoList, { ...created, expand: created.expand ?? {} }];
		selectedId = created.id;
		newTodoListTitle = '';
		showModal = false;
	};
</script>

<div class="grid h-[90vh] grid-cols-[1fr_2fr] gap-6 p-6">
	<div class="card bg-base-100 shadow md:grid-cols-2">
		<ul class="card-body list gap-6">
			<div class="card-title group min-h-12">
				<p>Todo Lists</p>
				<button
					class="btn btn-ghost btn-circle hidden group-hover:flex"
					onclick={() => (showModal = true)}
				>
					<Plus fill="none" stroke-width="2" class="size-5" />
				</button>
			</div>
			{#each todoList as list (list.id)}
				<button
					class="list-row hover:bg-base-200 aria-pressed:bg-base-200 h-12 overflow-auto"
					aria-pressed={selectedId === list.id}
					onclick={() => (selectedId = list.id)}
				>
					{list.Title}
				</button>
			{/each}
		</ul>
	</div>

	<div class="card bg-base-100 overflow-y-auto shadow">
		<ul class="card-body list gap-6">
			<div class="card-title group flex min-h-12">
				<p>{selectedTodoList?.Title ?? ''}</p>
				<button class="btn btn-ghost btn-circle hidden group-hover:flex" onclick={addTodoListItem}>
					<Plus fill="none" stroke-width="2" class="size-5" />
				</button>
			</div>

			{#each selectedTodoList?.expand?.TodoItem_via_TodoList ?? [] as item (item.id)}
				{#if item.done != true}
					<li class="list-row hover:bg-base-200 flex items-center">
						<input type="checkbox" class="checkbox" onclick={() => editItemToDone(item)} />
						<input
							type="text"
							class="input input-ghost w-full"
							bind:value={item.Note}
							onchange={() => editItemNote(item)}
						/>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>

<dialog class="modal" open={showModal}>
	<div class="modal-box">
		<form method="dialog">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => (showModal = false)}>✕</button
			>
		</form>

		<h3 class="text-lg font-semibold">Add List</h3>
		<div class="fieldset py-4">
			<input type="text" placeholder="Title" class="input w-full" bind:value={newTodoListTitle} />
			<button
				type="button"
				class="btn btn-neutral mt-4"
				onclick={() => createTodoList(newTodoListTitle)}
			>
				Add
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (showModal = false)}>close</button>
	</form>
</dialog>
