<script lang="ts">
	import { ArrowLeft, Plus, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getAuthContext } from '$lib/stores/auth.svelte';
	import {
		getTeachingUnitContext,
		type TeachingUnitCreateInput
	} from '$lib/stores/teachingUnitStore.svelte';
	import { setLessonsContext } from '$lib/pocketbase/lessons.svelte';
	import { setAssignmentsContext } from '$lib/pocketbase/assignments.svelte';
	import { setAssessmentsContext } from '$lib/pocketbase/assessments.svelte';
	import { setLearningObjectivesContext } from '$lib/pocketbase/learningObjectives.svelte';
	import { setResourcesContext } from '$lib/pocketbase/resources.svelte';
	import { setClassesContext } from '$lib/pocketbase/classes.svelte';
	import {
		TeachingUnitsStatusOptions,
		type IsoDateString,
		type LearningObjectivesResponse,
		type RecordIdString
	} from '$lib/types/pocketbase-types';

	type TeachingUnitForm = {
		title: string;
		description?: string;
		classId: RecordIdString | null;
		subject?: string;
		gradeLevel?: string;
		startDate?: IsoDateString | null;
		endDate?: IsoDateString | null;
		status: TeachingUnitsStatusOptions;
		userid: RecordIdString | null;
		learningObjectives: string[];
		lessons: RecordIdString[];
		resources: RecordIdString[];
		assignments: RecordIdString[];
		assessments: RecordIdString[];
		tags: string[];
	};

	const createDefaultUnit = (): TeachingUnitForm => ({
		title: '',
		description: '',
		classId: null,
		subject: '',
		gradeLevel: '',
		startDate: null,
		endDate: null,
		status: TeachingUnitsStatusOptions.draft,
		userid: null,
		learningObjectives: [],
		lessons: [],
		resources: [],
		assignments: [],
		assessments: [],
		tags: []
	});

	const auth = getAuthContext();
	const teachingUnitStore = getTeachingUnitContext();
	const lessonsStore = setLessonsContext();
	const assignmentsStore = setAssignmentsContext();
	const assessmentsStore = setAssessmentsContext();
	const learningObjectivesStore = setLearningObjectivesContext();
	const resourcesStore = setResourcesContext();
	const classesStore = setClassesContext();
	const classes = $derived(classesStore.classes);

	let currentUserId = $state<RecordIdString | null>(null);
	const localUnit = $state(createDefaultUnit());

	let newLearningObjective = $state('');
	let errorMessage = $state('');
	let isSaving = $state(false);

	onMount(async () => {
		if (!classesStore.classes.length) {
			try {
				await classesStore.refresh();
			} catch (error) {
				console.error('Failed to load classes', error);
			}
		}
	});

	$effect(() => {
		const nextUserId = (auth.user?.id ?? null) as RecordIdString | null;
		currentUserId = nextUserId;
		localUnit.userid = nextUserId;
	});

	const addLearningObjective = () => {
		const nextObjective = newLearningObjective.trim();
		if (!nextObjective) {
			return;
		}

		localUnit.learningObjectives = [...localUnit.learningObjectives, nextObjective];
		newLearningObjective = '';
	};

	const removeLearningObjective = (index: number) => {
		localUnit.learningObjectives = localUnit.learningObjectives.filter((_, idx) => idx !== index);
	};

	const handleClassChange = (event: Event) => {
		const value = (event.currentTarget as HTMLSelectElement).value;
		localUnit.classId = value ? (value as RecordIdString) : null;
	};

	const handleStartDateChange = (event: Event) => {
		const value = (event.currentTarget as HTMLInputElement).value;
		localUnit.startDate = value ? value : null;
	};

	const handleEndDateChange = (event: Event) => {
		const value = (event.currentTarget as HTMLInputElement).value;
		localUnit.endDate = value ? value : null;
	};

	const ensureTeacher = (): RecordIdString | null => {
		if (!currentUserId) {
			errorMessage = 'You must be signed in to create a teaching unit.';
		}
		return currentUserId;
	};

	const createLearningObjectives = async (
		unitId: RecordIdString,
		objectives: string[]
	): Promise<LearningObjectivesResponse[]> => {
		const trimmed = objectives
			.map((description) => description.trim())
			.filter((description) => description.length > 0);

		localUnit.learningObjectives = trimmed;

		if (!trimmed.length) return [];

		try {
			const created = await Promise.all(
				trimmed.map((description) =>
					learningObjectivesStore.createObjective({
						unitId,
						description,
						completed: false
					})
				)
			);

			learningObjectivesStore.hydrate(unitId, created);
			return created;
		} catch (error) {
			console.error('Failed to create learning objectives', error);
			throw error;
		}
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (isSaving) return;

		errorMessage = '';

		const userId = ensureTeacher();
		if (!userId) return;

		const trimmedTitle = localUnit.title.trim();
		if (!trimmedTitle) {
			errorMessage = 'Unit title is required.';
			return;
		}

		if (!localUnit.classId) {
			errorMessage = 'Please select a class before creating a unit.';
			return;
		}

		isSaving = true;

		try {
			const trimmedDescription = (localUnit.description ?? '').trim();
			const payload: TeachingUnitCreateInput = {
				title: trimmedTitle,
				description: trimmedDescription || undefined,
				classId: localUnit.classId as RecordIdString,
				userid: userId,
				status: localUnit.status ?? TeachingUnitsStatusOptions.draft,
				subject: localUnit.subject?.trim() || undefined,
				gradeLevel: localUnit.gradeLevel?.trim() || undefined,
				startDate: localUnit.startDate ?? undefined,
				endDate: localUnit.endDate ?? undefined,
				learningObjectives: [],
				lessons: localUnit.lessons,
				resources: localUnit.resources,
				assignments: localUnit.assignments,
				assessments: localUnit.assessments,
				tags: localUnit.tags ?? []
			};

			const createdUnit = await teachingUnitStore.createTeachingUnit(payload);

			const createdObjectives = await createLearningObjectives(
				createdUnit.id as RecordIdString,
				localUnit.learningObjectives
			);
			const learningObjectiveIds = createdObjectives.map(
				(objective) => objective.id as RecordIdString
			);

			if (learningObjectiveIds.length) {
				await teachingUnitStore.updateTeachingUnit(createdUnit.id, {
					learningObjectives: learningObjectiveIds
				});
			}

			lessonsStore.hydrate(createdUnit.id as RecordIdString, []);
			assignmentsStore.hydrate(createdUnit.id as RecordIdString, []);
			assessmentsStore.hydrate(createdUnit.id as RecordIdString, []);
			resourcesStore.hydrate(createdUnit.id as RecordIdString, []);

			localUnit.title = trimmedTitle;
			localUnit.description = trimmedDescription;
			localUnit.userid = userId;
			localUnit.status = payload.status ?? TeachingUnitsStatusOptions.draft;
			localUnit.learningObjectives = createdObjectives.map((objective) => objective.description);

			console.debug('Created teaching unit', createdUnit);
			await goto('/units');
		} catch (error) {
			console.error('Failed to create teaching unit', error);
			if (!errorMessage) {
				errorMessage = 'Failed to create teaching unit. Please try again.';
			}
		} finally {
			isSaving = false;
		}
	};
</script>

<main class="pb-20">
	<form class="mx-auto grid max-w-4xl justify-items-stretch gap-6" onsubmit={handleSubmit}>
		<section class="join items-center space-x-2">
			<a href="/units" class="btn btn-sm btn-ghost join-item"><ArrowLeft /></a>
			<h1 class="join-item">Create Teaching Unit</h1>
		</section>

		{#if errorMessage}
			<div class="alert alert-error">
				<span>{errorMessage}</span>
			</div>
		{/if}

		<section>
			<div class="bg-base-100 card card-border border-neutral-200">
				<div class="card-body gap-4">
					<fieldset class="fieldset space-y-4">
						<legend class="fieldset-legend text-lg">Basic Information</legend>

						<label class="floating-label">
							<span>Unit Title*</span>
							<input
								type="text"
								class="input input-md w-full bg-gray-100"
								placeholder="Unit Title*"
								bind:value={localUnit.title}
								required
							/>
						</label>

						<label class="floating-label">
							<span>Description</span>
							<input
								type="text"
								class="input input-md w-full bg-gray-100"
								placeholder="Brief Description of what this unit covers"
								bind:value={localUnit.description}
							/>
						</label>

						<div class="grid grid-cols-3 gap-4">
							<label class="floating-label">
								<span>Class*</span>
								<select
									class="select w-full"
									onchange={handleClassChange}
									value={localUnit.classId ?? ''}
									required
								>
									<option value="" disabled>Pick a Class</option>
									{#each classes as classroom (classroom.id)}
										<option value={classroom.id}>{classroom.Title}</option>
									{/each}
								</select>
							</label>

							<label class="floating-label">
								<span>Start Date</span>
								<input
									type="date"
									class="input input-md w-full bg-gray-100"
									value={localUnit.startDate ?? ''}
									onchange={handleStartDateChange}
								/>
							</label>

							<label class="floating-label">
								<span>End Date</span>
								<input
									type="date"
									class="input input-md w-full bg-gray-100"
									value={localUnit.endDate ?? ''}
									onchange={handleEndDateChange}
								/>
							</label>
						</div>
					</fieldset>
				</div>
			</div>
		</section>

		<section>
			<div class="bg-base-100 card card-border border-neutral-200">
				<div class="card-body">
					<fieldset class="fieldset space-y-4">
						<div>
							<legend class="fieldset-legend text-lg">Learning Objectives</legend>

							<p class="text-base-content/70 text-sm">
								Define what students will learn in this unit
							</p>
						</div>

						<div class="grid grid-cols-4">
							<label class="floating-label col-span-3">
								<span>Unit Title</span>
								<input
									type="text"
									class="input input-md w-full bg-gray-100"
									placeholder="Unit Title"
									bind:value={newLearningObjective}
								/>
							</label>
							<button
								type="button"
								class="btn btn-primary justify-self-end"
								onclick={addLearningObjective}
							>
								<Plus></Plus>
								Add Objective
							</button>
						</div>
						{#if localUnit.learningObjectives.length}
							<ul class="col-span-4 flex flex-wrap gap-2 text-sm" aria-label="Learning objectives">
								{#each localUnit.learningObjectives as objective, index (objective + index)}
									<li class="badge badge-outline gap-1">
										{objective}
										<button
											type="button"
											class="btn btn-ghost btn-xs"
											onclick={() => removeLearningObjective(index)}
										>
											<X size={12} />
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</fieldset>
				</div>
			</div>
		</section>

		<section class="flex justify-end">
			<button type="submit" class="btn btn-primary" disabled={isSaving}>
				{isSaving ? 'Saving…' : 'Create Unit'}
			</button>
		</section>
	</form>

	<section class="mx-auto mt-8 max-w-4xl">
		<h2 class="text-base-content/70 mb-2 text-sm font-semibold">Debug: Local Unit State</h2>
		<pre class="bg-base-200 rounded-lg p-4 text-xs">{JSON.stringify(localUnit, null, 2)}</pre>
	</section>
</main>
