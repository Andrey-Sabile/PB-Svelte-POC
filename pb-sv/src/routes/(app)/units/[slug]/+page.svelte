<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		getTeachingUnitContext,
		setTeachingUnitContext,
		type TeachingUnitWithExpand
	} from '$lib/pocketbase/teachingUnit.svelte';
	import { getLessonsContext, setLessonsContext } from '$lib/pocketbase/lessons.svelte';
	import { getAssignmentsContext, setAssignmentsContext } from '$lib/pocketbase/assignments.svelte';
	import { getAssessmentsContext, setAssessmentsContext } from '$lib/pocketbase/assessments.svelte';
	import {
		getLearningObjectivesContext,
		setLearningObjectivesContext
	} from '$lib/pocketbase/learningObjectives.svelte';
	import { getResourcesContext, setResourcesContext } from '$lib/pocketbase/resources.svelte';
	import type { PageProps } from './$types';

	const teachingUnitStore = (() => {
		try {
			return getTeachingUnitContext();
		} catch {
			return setTeachingUnitContext();
		}
	})();

	const lessonsStore = (() => {
		try {
			return getLessonsContext();
		} catch {
			return setLessonsContext();
		}
	})();

	const assignmentsStore = (() => {
		try {
			return getAssignmentsContext();
		} catch {
			return setAssignmentsContext();
		}
	})();

	const assessmentsStore = (() => {
		try {
			return getAssessmentsContext();
		} catch {
			return setAssessmentsContext();
		}
	})();

	const learningObjectivesStore = (() => {
		try {
			return getLearningObjectivesContext();
		} catch {
			return setLearningObjectivesContext();
		}
	})();

	const resourcesStore = (() => {
		try {
			return getResourcesContext();
		} catch {
			return setResourcesContext();
		}
	})();

	let { data }: PageProps = $props();
	const slug = data.slug;
	const unit = $derived(() => teachingUnitStore.getTeachingUnit(slug) ?? null);
	const lessons = $derived(() => lessonsStore.getLessons(slug));
	const assignments = $derived(() => assignmentsStore.getAssignments(slug));
	const assessments = $derived(() => assessmentsStore.getAssessments(slug));
	const learningObjectives = $derived(() => learningObjectivesStore.getObjectives(slug));
	const resources = $derived(() => resourcesStore.getResources(slug));

	onMount(async () => {
		if (!slug) {
			await goto('/units');
			return;
		}

		let loadedUnit: TeachingUnitWithExpand | null = teachingUnitStore.getTeachingUnit(slug);

		if (!loadedUnit) {
			try {
				loadedUnit = await teachingUnitStore.fetchTeachingUnit(slug);
			} catch (error) {
				console.error('Failed to load teaching unit', error);
				await goto('/units');
				return;
			}
		}

		if (!loadedUnit) {
			await goto('/units');
			return;
		}

		const unitLessons = loadedUnit.lessons ?? [];
		const unitAssignments = loadedUnit.assignments ?? [];
		const unitAssessments = loadedUnit.assessments ?? [];
		const unitResources = loadedUnit.resources ?? [];
		const unitObjectiveIds = loadedUnit.learningObjectives ?? [];

		if (loadedUnit.expand?.lessons) {
			lessonsStore.hydrate(loadedUnit.id, loadedUnit.expand.lessons);
		} else if (unitLessons.length) {
			await lessonsStore.refresh(loadedUnit.id);
		}

		if (loadedUnit.expand?.assignments) {
			assignmentsStore.hydrate(loadedUnit.id, loadedUnit.expand.assignments);
		} else if (unitAssignments.length) {
			await assignmentsStore.refresh(loadedUnit.id);
		}

		if (loadedUnit.expand?.assessments) {
			assessmentsStore.hydrate(loadedUnit.id, loadedUnit.expand.assessments);
		} else if (unitAssessments.length) {
			await assessmentsStore.refresh(loadedUnit.id);
		}

		if (loadedUnit.expand?.learningObjectives) {
			learningObjectivesStore.hydrate(loadedUnit.id, loadedUnit.expand.learningObjectives);
		} else if (unitObjectiveIds.length) {
			await learningObjectivesStore.refresh(loadedUnit.id);
		}

		if (loadedUnit.expand?.resources) {
			resourcesStore.hydrate(loadedUnit.id, loadedUnit.expand.resources);
		} else if (unitResources.length) {
			await resourcesStore.hydrateFromIds(loadedUnit.id, unitResources);
		}
	});
</script>
