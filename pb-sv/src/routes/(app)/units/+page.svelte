<script lang="ts">
	import { BookOpen, Plus } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { getTeachingUnitContext } from '$lib/stores/teachingUnitStore.svelte';
	import { onMount } from 'svelte';

	const teachingUnitStore = getTeachingUnitContext();
	const teachingUnits = $derived(teachingUnitStore.teachingUnits);

	onMount(async () => {
		if (!teachingUnitStore.teachingUnits.length) {
			try {
				await teachingUnitStore.refresh();
			} catch (error) {
				console.error('Failed to load teaching units', error);
			}
		}
	});
</script>

<main class="grid gap-6 pb-20">
	<section class="flex justify-between align-middle">
		<div class="space-y-2">
			<h1 class="text-2xl font-semibold">Teaching Units</h1>
			<p class="text-base-content/70 text-sm">
				Integrated lesson planning, assignments, and assessments
			</p>
		</div>
		<div class="flex gap-6">
			<button type="button" class="btn btn-primary" onclick={() => goto('/units/newUnit')}>
				<Plus></Plus>
				Create Unit
			</button>
		</div>
	</section>

	<section class="flex space-x-3">
		<input type="search" class="input input-primary w-full" />
		<div class="join space-x-1">
			<button class="btn btn-active join-item"> All </button>
			<button class="btn join-item"> Draft </button>
			<button class="btn join-item"> Active </button>
			<button class="btn join-item"> Completed </button>
		</div>
	</section>

	<section class="space-y-4">
		{#if teachingUnits.length === 0}
			<div class="bg-base-100 card card-border border-neutral-200">
				<div class="card-body">
					<BookOpen></BookOpen>
					<p class="text-base-content/70">No teaching units found</p>
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each teachingUnits as unit}
					<a
						href={`/units/${unit.id}`}
						class="card bg-base-100 hover:shadow-xs border border-neutral-200 hover:cursor-pointer"
						data-sveltekit-preload-data="hover"
					>
						<div class="card-body">
							<div class="flex gap-2">
								<div class="badge badge-soft badge-warning">
									{unit.status ?? 'Unknown'}
								</div>
								<div class="badge badge-neutral badge-outline">
									{unit.expand?.classId?.Title ?? 'Unassigned'}
								</div>
							</div>

							<h2 class="text-lg">{unit.title}</h2>

							<div class="grid gap-2 md:grid-cols-3">
								<div class="card bg-blue-100">
									<div class="card-body items-center">
										<p class="text-sm">{unit.lessons?.length ?? 0}</p>
										<h3 class="text-sm">Lessons</h3>
									</div>
								</div>
								<div class="card bg-green-100">
									<div class="card-body items-center">
										<p class="text-sm">{unit.assignments?.length ?? 0}</p>
										<h3 class="text-sm">Assignments</h3>
									</div>
								</div>
								<div class="card bg-violet-100">
									<div class="card-body items-center">
										<p class="text-sm">{unit.assessments?.length ?? 0}</p>
										<h3 class="text-sm">Assessments</h3>
									</div>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</main>
