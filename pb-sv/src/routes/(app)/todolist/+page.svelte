<script lang="ts">
    import { setTodoListContext, type TodoListWithItemsResponse } from "$lib/pocketbase/todo.svelte";
    import { TodoItemsPriorityLevelOptions } from "$lib/types/pocketbase-types";
    import { getAuthContext } from "$lib/stores/auth.svelte";
    import { Plus } from "@lucide/svelte";

    const todoContext = setTodoListContext();
    const auth = getAuthContext();

    let showModal = $state(false);
    let newTodoListTitle = $state("");
    let selectedId = $state<string | null>(null);

    const activeListId = $derived.by(() => {
        const lists = todoContext.todoList;
        if (!lists.length) return null;
        if (selectedId && lists.some((entry) => entry.id === selectedId)) {
            return selectedId;
        }
        return lists[0].id;
    });

    const selectedTodoList = $derived.by((): TodoListWithItemsResponse | null => {
        const lists = todoContext.todoList;
        const id = activeListId;
        if (!id) return null;

        return lists.find((entry) => entry.id === id) ?? null;
    });

    const ensureUser = () => {
        const userId = auth.user?.id ?? null;
        if (!userId) {
            console.error("Cannot perform todo action without an authenticated user.");
            return null;
        }
        return userId;
    };

    const addTodoListItem = async () => {
        const list = selectedTodoList;
        if (!list) return;

        const userId = ensureUser();
        if (!userId) return;

        const defaultPriority =
            list.expand?.TodoItems_via_TodoList?.[0]?.PriorityLevel ??
            TodoItemsPriorityLevelOptions.E1;

        try {
            await todoContext.createTodoItem({
                Title: "New task",
                Note: "",
                todo_list: list.id,
                user: userId,
                done: false,
                PriorityLevel: defaultPriority
            });
        } catch (error) {
            console.error("Failed to add todo item", error);
        }
    };

    const markItemDone = async (itemId: string) => {
        try {
            await todoContext.updateTodoItem(itemId, { done: true });
        } catch (error) {
            console.error("Failed to mark todo item as complete", error);
        }
    };

    const editItemNote = async (itemId: string, note: string) => {
        try {
            await todoContext.updateTodoItem(itemId, { Note: note });
        } catch (error) {
            console.error("Failed to update todo note", error);
        }
    };

    const createList = async (name: string) => {
        const userId = ensureUser();
        if (!userId) return;

        const trimmedName = name.trim();
        if (!trimmedName) return;

        try {
            const created = await todoContext.createTodoList({
                Title: trimmedName,
                user: userId
            });

            selectedId = created.id;
            newTodoListTitle = "";
            showModal = false;
        } catch (error) {
            console.error("Failed to create todo list", error);
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
                    onclick={() => (showModal = true)}
                >
                    <Plus fill="none" stroke-width="2" class="size-5" />
                </button>
            </div>
            {#each todoContext.todoList as list (list.id)}
                <button
                    class="list-row hover:bg-base-200 aria-pressed:bg-base-200 h-12 overflow-auto"
                    aria-pressed={activeListId === list.id}
                    onclick={() => (selectedId = list.id)}
                >
                    {list.Title}
                </button>
            {/each}
        </ul>
    </div>

    <div class="card bg-base-100 card-border overflow-y-auto border-neutral-200">
        <ul class="card-body list gap-6">
            <div class="card-title group flex min-h-12">
                <p>{selectedTodoList?.Title ?? ""}</p>
                <button class="btn btn-ghost btn-circle hidden group-hover:flex" onclick={addTodoListItem}>
                    <Plus fill="none" stroke-width="2" class="size-5" />
                </button>
            </div>

            {#each selectedTodoList?.expand?.TodoItems_via_TodoList ?? [] as item (item.id)}
                {#if !item.done}
                    <li class="list-row hover:bg-base-200 flex items-center">
                        <input type="checkbox" class="checkbox" onchange={() => markItemDone(item.id)} />
                        <input
                            type="text"
                            class="input input-ghost w-full"
                            value={item.Note ?? ""}
                            onchange={(event) => editItemNote(item.id, event.currentTarget.value)}
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
                onclick={() => (showModal = false)}
            >✕</button>
        </form>

        <h3 class="text-lg font-semibold">Add List</h3>
        <div class="fieldset py-4">
            <input type="text" placeholder="Title" class="input w-full" bind:value={newTodoListTitle} />
            <button
                type="button"
                class="btn btn-neutral mt-4"
                onclick={() => createList(newTodoListTitle)}
            >
                Add
            </button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button onclick={() => (showModal = false)}>close</button>
    </form>
</dialog>
