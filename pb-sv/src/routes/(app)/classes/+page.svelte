<script lang="ts">
	import type { ClassroomsResponse } from '$lib/types/pocketbase-types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let classrooms = $state<ClassroomsResponse[]>(data.classrooms ?? []);
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
		class="w-8/12 w-full self-center rounded-xl border-base-300 bg-base-100 text-sm outline-none focus:border-neutral-50 focus:ring-neutral-content"
	/>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each classrooms as classroom (classroom.id)}
			<a
				href={`/classes/${classroom.id}`}
				class="card bg-base-100 shadow hover:cursor-pointer hover:shadow-md"
			>
				<div class="card-body">
					<h2 class="card-title text-lg font-semibold">{classroom.Title}</h2>
					<p class="text-sm text-base-content/60">{classroom.Description}</p>
				</div>
			</a>
		{/each}
	</div>
</main>
