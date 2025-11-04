<script lang="ts">
	import type { PageProps } from './$types';
	import { BookOpen, Plus } from '@lucide/svelte';

	let { data }: PageProps = $props();
	const teachingUnits = $derived(data.teachingUnits ?? []);
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
			<a class="btn btn-primary" type="button" href="/units/new-unit">
				<Plus></Plus>
				Create Unit
			</a>
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
			<ul class="space-y-3">
				{#each teachingUnits as unit}
					<li class="bg-base-100 card card-border border-neutral-200">
						<div class="card-body gap-2">
							<h2 class="text-lg font-medium">{unit.title}</h2>
							{#if unit.description}
								<p class="text-base-content/70 text-sm">{unit.description}</p>
							{/if}
							<div class="text-base-content/60 text-xs">
								Status: {unit.status}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</main>
