<script lang="ts">
	import { ArrowLeft, Plus, X } from '@lucide/svelte';
	import type { TeachingUnitModel } from './+page';
	import type { RecordIdString } from '$lib/types/pocketbase-types';
	import { TeachingUnitsStatusOptions } from '$lib/types/pocketbase-types';

	const createDefaultUnit = (): TeachingUnitModel => ({
		title: '',
		description: '',
		classId: null,
		subject: '',
		gradeLevel: '',
		startDate: null,
		endDate: null,
		status: TeachingUnitsStatusOptions.draft,
		teacherId: null,
		learningObjectives: [],
		lessons: [],
		resources: [],
		assignments: [],
		assessments: [],
		tags: []
	});

	const localUnit = $state(createDefaultUnit());

	let newLearningObjective = $state('');

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
</script>

<main class="mx-auto grid max-w-4xl justify-items-stretch gap-6 pb-20">
	<section class="join items-center space-x-2">
		<a href="/units" class="btn btn-sm btn-ghost join-item"><ArrowLeft /></a>
		<h1 class="join-item">Create Teaching Unit</h1>
	</section>

	<section>
		<div class="bg-base-100 card card-border border-neutral-200">
			<div class="card-body gap-4">
				<fieldset class="fieldset space-y-4">
					<legend class="fieldset-legend text-lg">Basic Information</legend>

					<label class="floating-label">
						<span>Unit Title</span>
						<input
							type="text"
							class="input input-md w-full bg-gray-100"
							placeholder="Unit Title"
							bind:value={localUnit.title}
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

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="floating-label">
								<span>Class</span>
								<select
									class="select w-full"
									onchange={handleClassChange}
									value={localUnit.classId ?? ''}
								>
									<option value="" disabled>Pick a Class</option>
								</select>
							</label>
						</div>
						<div>
							<label class="floating-label">
								<span>Subject</span>
								<input
									type="text"
									class="input input-md w-full bg-gray-100"
									placeholder="Subject"
									bind:value={localUnit.subject}
								/>
							</label>
						</div>
					</div>

					<div class="grid grid-cols-3 gap-4">
						<label class="floating-label">
							<span>Grade Level</span>
							<input
								type="text"
								class="input input-md w-full bg-gray-100"
								placeholder="Grade Level"
								bind:value={localUnit.gradeLevel}
							/>
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

						<p class="text-base-content/70 text-sm">Define what students will learn in this unit</p>
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
		<button class="btn btn-neutral col-span-4">Create Unit</button>
		<button class="btn">Cancel</button>
	</section>

	<section class="bg-base-200 rounded-lg p-4 font-mono text-xs">
		<h2 class="text-sm font-semibold">Unit Preview</h2>
		<pre class="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(localUnit, null, 2)}</pre>
	</section>
</main>
