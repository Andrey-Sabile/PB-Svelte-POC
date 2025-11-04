<script lang="ts">
	import type { PageProps } from './$types';
	import { Plus } from '@lucide/svelte';
	import pb from '$lib/pocketbase';
	import { TodoItemsPriorityLevelOptions } from '$lib/types/pocketbase-types';
	import {
		createTodoItem,
		createTodoList,
		updateTodoItem,
		type TodoItemsResponse,
		type TodoListWithItemsResponse
	} from './todoApi';

	let { data }: PageProps = $props();
	let todoList = $state<TodoListWithItemsResponse[]>(data.todoList ?? []);
	let showModal = $state(false);
	let newTodoListTitle = $state('');

	let selectedId = $state<string | null>(todoList[0]?.id ?? null);

	const selectedTodoList = $derived.by(() => {
		if (!selectedId) return null;
		return todoList.find((entry) => entry.id === selectedId) ?? null;
	});

	const ensureUser = () => {
		const userId = pb.authStore.record?.id ?? null;
		if (!userId) {
			console.error('Cannot perform todo action without an authenticated user.');
			return null;
		}
		return userId;
	};

	const prependItemToList = (listId: string, item: TodoItemsResponse) => {
		todoList = todoList.map((entry) => {
			if (entry.id !== listId) return entry;

			const items = entry.expand?.TodoItems_via_TodoList ?? ([] as TodoItemsResponse[]);
			return {
				...entry,
				expand: {
					...entry.expand,
					TodoItem_via_TodoList: [item, ...items]
				}
			};
		});
	};

	const updateItemInList = (
		listId: string,
		itemId: string,
		updater: (item: TodoItemsResponse) => TodoItemsResponse
	) => {
		todoList = todoList.map((entry) => {
			if (entry.id !== listId) return entry;

			const items = entry.expand?.TodoItems_via_TodoList ?? ([] as TodoItemsResponse[]);
			return {
				...entry,
				expand: {
					...entry.expand,
					TodoItem_via_TodoList: items.map((item) => (item.id === itemId ? updater(item) : item))
				}
			};
		});
	};

	const addTodoListItem = async () => {
		const list = selectedTodoList;
		if (!list) return;
		const userId = ensureUser();
		if (!userId) return;

		const defaultPriority =
			list.expand?.TodoItems_via_TodoList?.[0]?.PriorityLevel ?? TodoItemsPriorityLevelOptions.E1;

		try {
			const created = await createTodoItem({
				Title: 'New task',
				Note: '',
				TodoList: list.id,
				user: userId,
				done: false,
				PriorityLevel: defaultPriority
			});
			const createdItem: TodoItemsResponse = { ...created, expand: created.expand ?? {} };
			prependItemToList(list.id, createdItem);
		} catch (error) {
			console.error('Failed to add todo item', error);
		}
	};

	const markItemDone = async (itemId: string) => {
		const list = selectedTodoList;
		if (!list) return;

		try {
			await updateTodoItem(itemId, { done: true });
			updateItemInList(list.id, itemId, (item) => ({ ...item, done: true }));
		} catch (error) {
			console.error('Failed to mark todo item as complete', error);
		}
	};

	const editItemNote = async (itemId: string, note: string) => {
		const list = selectedTodoList;
		if (!list) return;

		try {
			await updateTodoItem(itemId, { Note: note });
			updateItemInList(list.id, itemId, (item) => ({ ...item, Note: note }));
		} catch (error) {
			console.error('Failed to update todo note', error);
		}
	};

	const createList = async (name: string) => {
		const userId = ensureUser();
		if (!userId) return;

		const trimmedName = name.trim();
		if (!trimmedName) return;

		try {
			const created = await createTodoList({
				Title: trimmedName,
				user: userId
			});

			const withExpand: TodoListWithItemsResponse = {
				...created,
				expand: { TodoItems_via_TodoList: [] as TodoItemsResponse[] }
			};

			todoList = [...todoList, withExpand];
			selectedId = withExpand.id;
			newTodoListTitle = '';
			showModal = false;
		} catch (error) {
			console.error('Failed to create todo list', error);
		}
	};
</script>

<div class="grid h-[90vh] grid-cols-[1fr_2fr] gap-6 p-6">
	<div class="card bg-base-100 card-border border-neutral-200 md:grid-cols-2">
		<ul class="card-body list gap-6">
			<div class="card-title group min-h-12">
				<p>Todo Lists</p>
				<button
					class="btn btn-ghost btn-circle hidden group-hover:flex"
					on:click={() => (showModal = true)}
				>
					<Plus fill="none" stroke-width="2" class="size-5" />
				</button>
			</div>
			{#each todoList as list (list.id)}
				<button
					class="list-row hover:bg-base-200 aria-pressed:bg-base-200 h-12 overflow-auto"
					aria-pressed={selectedId === list.id}
					on:click={() => (selectedId = list.id)}
				>
					{list.Title}
				</button>
			{/each}
		</ul>
	</div>

	<div class="card bg-base-100 card-border overflow-y-auto border-neutral-200">
		<ul class="card-body list gap-6">
			<div class="card-title group flex min-h-12">
				<p>{selectedTodoList?.Title ?? ''}</p>
				<button class="btn btn-ghost btn-circle hidden group-hover:flex" on:click={addTodoListItem}>
					<Plus fill="none" stroke-width="2" class="size-5" />
				</button>
			</div>

			{#each selectedTodoList?.expand?.TodoItems_via_TodoList ?? [] as item (item.id)}
				{#if !item.done}
					<li class="list-row hover:bg-base-200 flex items-center">
						<input type="checkbox" class="checkbox" on:change={() => markItemDone(item.id)} />
						<input
							type="text"
							class="input input-ghost w-full"
							value={item.Note ?? ''}
							on:change={(event) => editItemNote(item.id, event.currentTarget.value)}
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
				on:click={() => (showModal = false)}>✕</button
			>
		</form>

		<h3 class="text-lg font-semibold">Add List</h3>
		<div class="fieldset py-4">
			<input type="text" placeholder="Title" class="input w-full" bind:value={newTodoListTitle} />
			<button
				type="button"
				class="btn btn-neutral mt-4"
				on:click={() => createList(newTodoListTitle)}
			>
				Add
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button on:click={() => (showModal = false)}>close</button>
	</form>
</dialog>
