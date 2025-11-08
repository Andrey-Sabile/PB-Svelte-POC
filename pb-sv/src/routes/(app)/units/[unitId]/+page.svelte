<script lang="ts">
	import { page } from '$app/state';
	import {
		getTeachingUnitContext,
		type TeachingUnitWithExpand
	} from '$lib/stores/teachingUnitStore.svelte';
	import type { RecordIdString } from '$lib/types/pocketbase-types';

	const teachingUnitStore = getTeachingUnitContext();
	const teachingUnits = $derived(teachingUnitStore.teachingUnits);

	const unitId = $derived(
		(page.params.unitId ?? null) as RecordIdString | null satisfies RecordIdString | null
	);
	let teachingUnit = $state<TeachingUnitWithExpand | null>(null);
	let isLoading = $state(false);
	let errorMessage = $state<string | null>(null);

	$effect(() => {
		if (!unitId) {
			teachingUnit = null;
			return;
		}

		const existing = teachingUnits.find((unit) => unit.id === unitId) ?? null;
		if (existing) {
			teachingUnit = existing;
			isLoading = false;
			return;
		}

		isLoading = true;
		errorMessage = null;

		void teachingUnitStore
			.fetchTeachingUnit(unitId)
			.then((record) => {
				teachingUnit = record;
			})
			.catch((error) => {
				console.error('Failed to load teaching unit', error);
				errorMessage = 'Unable to load teaching unit.';
			})
			.finally(() => {
				isLoading = false;
			});
	});
</script>

{#if !unitId}
	<p>Missing teaching unit id.</p>
{:else if errorMessage}
	<p>{errorMessage}</p>
{:else if isLoading}
	<p>Loading teaching unit...</p>
{:else if teachingUnit}
	<article>
		<h1>{teachingUnit.title}</h1>
		{#if teachingUnit.description}
			<p>{teachingUnit.description}</p>
		{/if}
		<p>Status: {teachingUnit.status ?? 'Unknown'}</p>
		<p>Class: {teachingUnit.expand?.classId?.Title ?? 'Unassigned'}</p>
	</article>
{:else}
	<p>Teaching unit not found.</p>
{/if}
