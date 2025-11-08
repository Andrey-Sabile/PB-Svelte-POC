<script lang="ts">
	import { onMount } from 'svelte';
	import { getClassesContext } from '$lib/stores/classesStore.svelte';

	const classesStore = getClassesContext();
	const classrooms = $derived(classesStore.classes);

	onMount(async () => {
		if (!classesStore.classes.length) {
			try {
				await classesStore.refresh();
			} catch (error) {
				console.error('Failed to load classes', error);
			}
		}
	});
</script>

<main class="grid gap-12 pb-20">
	<section class="flex flex-wrap items-center justify-between gap-6">
		<div class="space-y-2">
			<h1 class="text-2xl font-semibold">My Classes</h1>
		</div>
		<button class="btn btn-primary">Create Class</button>
	</section>

	<input
		type="search"
		class="border-base-300 bg-base-100 focus:ring-neutral-content w-full self-center rounded-xl text-sm outline-none focus:border-neutral-50"
	/>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each classrooms as classroom (classroom.id)}
			<a
				href={`/classes/${classroom.id}`}
				class="card bg-base-100 hover:shadow-xs border border-neutral-200 hover:cursor-pointer"
			>
				<div class="card-body">
					<h2 class="card-title text-lg font-semibold">{classroom.Title}</h2>
					<p class="text-base-content/60 text-sm">{classroom.Description}</p>
				</div>
			</a>
		{/each}
	</div>
</main>
