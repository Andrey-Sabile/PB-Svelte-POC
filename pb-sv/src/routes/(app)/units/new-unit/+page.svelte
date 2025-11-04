<script lang="ts">
	import { ArrowLeft, Plus, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import pb from '$lib/pocketbase';
	import { authState } from '$lib/stores/auth';
	import { Collections, TeachingUnitsStatusOptions } from '$lib/types/pocketbase-types';
	import type {
		ClassroomsResponse,
		RecordIdString,
		TeachingUnitsRecord
	} from '$lib/types/pocketbase-types';
	import type { PageProps } from './$types';
	import type { TeachingUnitModel } from './+page';

	let { data }: PageProps = $props();
	const classes = $derived((data.classes ?? []) as ClassroomsResponse[]);
	let currentUserId = $state<RecordIdString | null>(null);

	const createDefaultUnit = (): TeachingUnitModel => ({
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
	const localUnit = $state(createDefaultUnit());

	$effect(() => {
		const unsubscribe = authState.subscribe(({ user }) => {
			const nextUserId = (user?.id ?? null) as RecordIdString | null;
			currentUserId = nextUserId;
			localUnit.userid = nextUserId;
		});

		return unsubscribe;
	});

	let newLearningObjective = $state('');
	let errorMessage = $state('');
	let isSaving = $state(false);

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

	const createLearningObjectives = async (): Promise<RecordIdString[]> => {
		const objectivesToCreate = localUnit.learningObjectives
			.map((description) => description.trim())
			.filter((description) => description.length > 0);

		if (!objectivesToCreate.length) return [];

		try {
			const created = await Promise.all(
				objectivesToCreate.map((description) => {
					return pb.collection(Collections.LearningObjectives).create<{ id: RecordIdString }>({
						description
					});
				})
			);

			return created.map((objective) => objective.id);
		} catch (error) {
			console.error('Failed to create learning objectives', error);
			throw error;
		}
	};

	const ensureTeacher = (): RecordIdString | null => {
		if (!currentUserId) {
			errorMessage = 'You must be signed in to create a teaching unit.';
		}
		return currentUserId;
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
			const learningObjectiveIds = await createLearningObjectives();

			const trimmedDescription = (localUnit.description ?? '').trim();
			const payload: Partial<TeachingUnitsRecord> & {
				title: string;
				classId: RecordIdString;
				userid: RecordIdString;
				status: TeachingUnitsStatusOptions;
				learningObjectives: RecordIdString[];
				lessons: RecordIdString[];
				resources: RecordIdString[];
				assignments: RecordIdString[];
				assessments: RecordIdString[];
				tags: string[];
			} = {
				title: trimmedTitle,
				description: trimmedDescription || undefined,
				classId: localUnit.classId,
				userid: userId,
				status: localUnit.status ?? TeachingUnitsStatusOptions.draft,
				subject: localUnit.subject?.trim() || undefined,
				gradeLevel: localUnit.gradeLevel?.trim() || undefined,
				startDate: localUnit.startDate ?? undefined,
				endDate: localUnit.endDate ?? undefined,
				learningObjectives: learningObjectiveIds,
				lessons: localUnit.lessons ?? [],
				resources: localUnit.resources ?? [],
				assignments: localUnit.assignments ?? [],
				assessments: localUnit.assessments ?? [],
				tags: localUnit.tags ?? []
			};

			const createdUnit = await pb.collection(Collections.TeachingUnits).create(payload);

			localUnit.title = trimmedTitle;
			localUnit.description = trimmedDescription;
			localUnit.userid = userId;
			localUnit.status = payload.status;
			localUnit.learningObjectives = learningObjectiveIds;

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

		<section>
			<div class="bg-base-100 card card-border border-neutral-200">
				<div class="card-body">
					<fieldset class="fieldset space-y-4">
						<div>
							<legend class="fieldset-legend text-lg">Resources</legend>
							<p class="text-base-content/70 text-sm">Add materials and resources for this unit</p>
						</div>

						<btn class="btn btn-block btn-primary">Add Resource</btn>
					</fieldset>
				</div>
			</div>
		</section>

		<section class="grid grid-cols-5 gap-3">
			<button type="submit" class="btn btn-neutral col-span-4" disabled={isSaving}>
				{#if isSaving}
					<span class="loading loading-spinner"></span>
					Saving...
				{:else}
					Create Unit
				{/if}
			</button>

			<button type="button" class="btn">Cancel</button>
		</section>

		<section class="bg-base-200 rounded-lg p-4 font-mono text-xs">
			<h2 class="text-sm font-semibold">Unit Preview</h2>
			<pre class="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(localUnit, null, 2)}</pre>
		</section>
	</form>
</main>
