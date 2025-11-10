<script lang="ts">
	import { ArrowLeft, Plus } from '@lucide/svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import LessonsTab from '$lib/components/LessonsTab.svelte';
	import {
		getTeachingUnitContext,
		type TeachingUnitWithExpand
	} from '$lib/stores/teachingUnitStore.svelte';
	import { getLessonsContext } from '$lib/stores/lessonsStore.svelte';
	import { getAssignmentsContext } from '$lib/stores/assignmentsStore.svelte';
	import { getAssessmentsContext } from '$lib/stores/assessmentsStore.svelte';
	import { getLearningObjectivesContext } from '$lib/stores/learningObjectivesStore.svelte';
	import { getResourcesContext } from '$lib/stores/resourcesStore.svelte';
	import type { RecordIdString } from '$lib/types/pocketbase-types';
	import { untrack } from 'svelte';

	const teachingUnitStore = getTeachingUnitContext();
	const teachingUnits = $derived(teachingUnitStore.teachingUnits);
	const lessonsStore = getLessonsContext();
	const assignmentsStore = getAssignmentsContext();
	const assessmentsStore = getAssessmentsContext();
	const learningObjectivesStore = getLearningObjectivesContext();
	const resourcesStore = getResourcesContext();

	const unitId = $derived(
		(page.params.unitId ?? null) as RecordIdString | null satisfies RecordIdString | null
	);
	let teachingUnit = $state<TeachingUnitWithExpand | null>(null);
	let isLoading = $state(false);
	let errorMessage = $state<string | null>(null);
	let relatedErrorMessage = $state<string | null>(null);

	const lessons = $derived(unitId ? lessonsStore.getLessons(unitId) : []);
	const assignments = $derived(unitId ? assignmentsStore.getAssignments(unitId) : []);
	const assessments = $derived(unitId ? assessmentsStore.getAssessments(unitId) : []);
	const learningObjectives = $derived(unitId ? learningObjectivesStore.getObjectives(unitId) : []);
	const resources = $derived(unitId ? resourcesStore.getResources(unitId) : []);
	const tabOptions = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'lessons', label: 'Lessons' },
		{ id: 'assignments', label: 'Assignments' },
		{ id: 'assessments', label: 'Assessments' },
		{ id: 'resources', label: 'Resources' }
	] as const;
	let activeTab = $state<(typeof tabOptions)[number]['id']>('overview');

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

	$effect(() => {
		if (!unitId) return;

		relatedErrorMessage = null;
		void Promise.all([
			lessonsStore.refresh(unitId),
			assignmentsStore.refresh(unitId),
			assessmentsStore.refresh(unitId),
			learningObjectivesStore.refresh(unitId)
		]).catch((error) => {
			console.error('Failed to load related teaching unit data', error);
			relatedErrorMessage = 'Some teaching unit details may be incomplete.';
		});
	});

	$effect(() => {
		if (!unitId || !teachingUnit) return;
		const resourceIds = (teachingUnit.resources ?? []) as RecordIdString[];

		// Avoid tracking the internal store updates to prevent an infinite effect loop
		untrack(() => {
			void resourcesStore.hydrateFromIds(unitId, resourceIds).catch((error) => {
				console.error('Failed to load resources', error);
				relatedErrorMessage = 'Some teaching unit details may be incomplete.';
			});
		});
	});
</script>

<main class="grid gap-6 pb-20">
	<section class="flex justify-between">
		<div class="join items-center space-x-2">
			<a href="/units" class="btn btn-sm btn-ghost join-item"><ArrowLeft /></a>
			<h1 class="join-item">{teachingUnit?.title}</h1>
		</div>
		<div class="flex gap-6">
			<button type="button" class="btn btn-primary btn-sm" onclick={() => goto('')}>
				<Plus></Plus>
				Edit Unit
			</button>
		</div>
	</section>

	{#if relatedErrorMessage}
		<p class="text-error text-sm">{relatedErrorMessage}</p>
	{/if}

	{#if teachingUnit}
		<section class="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
			<div class="card bg-base-100 border border-neutral-200">
				<div class="card-body">
					<p class="text-sm text-neutral-500">Lessons</p>
					<p class="text-2xl font-semibold">{lessons.length}</p>
				</div>
			</div>
			<div class="card bg-base-100 border border-neutral-200">
				<div class="card-body">
					<p class="text-sm text-neutral-500">Assignments</p>
					<p class="text-2xl font-semibold">{assignments.length}</p>
				</div>
			</div>
			<div class="card bg-base-100 border border-neutral-200">
				<div class="card-body">
					<p class="text-sm text-neutral-500">Assessments</p>
					<p class="text-2xl font-semibold">{assessments.length}</p>
				</div>
			</div>
			<div class="card bg-base-100 border border-neutral-200">
				<div class="card-body">
					<p class="text-sm text-neutral-500">Objectives</p>
					<p class="text-2xl font-semibold">{learningObjectives.length}</p>
				</div>
			</div>
			<div class="card bg-base-100 border border-neutral-200">
				<div class="card-body">
					<p class="text-sm text-neutral-500">Resources</p>
					<p class="text-2xl font-semibold">{resources.length}</p>
				</div>
			</div>
		</section>

		<section>
			<div class="tabs tabs-lift">
				{#each tabOptions as tab (tab.id)}
					<input
						type="radio"
						name="unit-tabs"
						class={`tab ${activeTab === tab.id ? 'bg-base-100' : 'bg-base-200'}`}
						aria-label={tab.label}
						value={tab.id}
						bind:group={activeTab}
					/>
				<div class="tab-content bg-base-100 border-base-300 p-6">
					{#if tab.id === 'lessons'}
						<LessonsTab {unitId} {lessons} />
					{:else}
						<p class="text-sm text-neutral-500">Content coming soon.</p>
					{/if}
				</div>
			{/each}
		</div>
	</section>
	{/if}
</main>

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
