<script lang="ts">
	import type { ClassroomsResponse } from '$lib/types/pocketbase-types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let classrooms = $state<ClassroomsResponse[]>(data.classrooms ?? []);
</script>

<main class="flex flex-col gap-12">
	<section class="flex items-center justify-around">
		<h1 class="text-3xl font-bold">My Classes</h1>
		<button class="btn btn-neutral">Create Class</button>
	</section>

	<input
		type="search"
		class="border-base-300 bg-base-100 focus:ring-neutral-content w-8/12 self-center rounded-xl border text-sm outline-none focus:border-neutral-50"
	/>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each classrooms as classroom (classroom.id)}
			<a href="" class="card bg-base-100 border-base-300 hover:cursor-pointer">
				<div class="card-body">
					<h2 class="card-title text-lg font-semibold">{classroom.Title}</h2>
					<p class="text-base-content/60 text-sm">{classroom.Description}</p>
				</div></a
			>
		{/each}
	</div>
</main>
