<script lang="ts">
	import {
		getLessonsContext,
		type LessonCreateInput,
		type LessonResponse
	} from '$lib/stores/lessonsStore.svelte';
	import { getAuthContext } from '$lib/stores/auth.svelte';
	import type { RecordIdString } from '$lib/types/pocketbase-types';

	const createEmptyDraft = () => ({
		title: '',
		scheduledDate: '',
		duration: '',
		content: '',
		resources: ''
	});

	let {
		unitId = null,
		lessons = [],
		onCreateLesson
	}: {
		unitId: RecordIdString | null;
		lessons: LessonResponse[];
		onCreateLesson?: () => void;
	} = $props();

	const lessonsStore = getLessonsContext();
	const auth = getAuthContext();

	let draft = $state(createEmptyDraft());
	let isSaving = $state(false);
	let errorMessage = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	const teacherId = $derived((auth.user?.id ?? null) as RecordIdString | null);
	const lessonCount = $derived(lessons.length);
	const hasLessons = $derived(lessonCount > 0);
	const trimmedTitle = $derived(draft.title.trim());
	const isValidTitle = $derived(trimmedTitle.length > 0);
	const canSubmit = $derived(Boolean(unitId && isValidTitle && !isSaving));

	const resetDraft = () => {
		draft = createEmptyDraft();
	};

	const parseResources = (): RecordIdString[] => {
		return draft.resources
			.split(/\n|,/)
			.map((value) => value.trim())
			.filter((value): value is RecordIdString => value.length > 0);
	};

	const handleRefresh = async () => {
		if (!unitId) return;
		await lessonsStore.refresh(unitId);
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (isSaving) return;

		if (!unitId) {
			errorMessage = 'Select a teaching unit before creating lessons.';
			return;
		}

		if (!teacherId) {
			errorMessage = 'You must be signed in to create lessons.';
			return;
		}

		if (!isValidTitle) {
			errorMessage = 'Lesson title is required.';
			return;
		}

		errorMessage = null;
		successMessage = null;
		isSaving = true;

		const durationMinutes = draft.duration.trim() ? Number.parseInt(draft.duration, 10) : null;
		if (durationMinutes !== null && Number.isNaN(durationMinutes)) {
			errorMessage = 'Duration must be a number of minutes.';
			isSaving = false;
			return;
		}

		const resources = parseResources();
		const scheduledIso = draft.scheduledDate
			? new Date(draft.scheduledDate).toISOString()
			: undefined;
		const payload: LessonCreateInput = {
			unitId,
			teacherId,
			title: trimmedTitle,
			scheduledDate: scheduledIso,
			duration: durationMinutes ?? undefined,
			content: draft.content.trim() || undefined,
			resources: resources.length ? resources : undefined
		};

		try {
			await lessonsStore.createLesson(payload);
			successMessage = 'Lesson created successfully.';
			onCreateLesson?.();
			resetDraft();
			await lessonsStore.refresh(unitId);
		} catch (error) {
			console.error('Failed to create lesson', error);
			errorMessage = 'Unable to save lesson. Please try again.';
		} finally {
			isSaving = false;
		}
	};

	const formatScheduledDate = (value?: string | null) => {
		if (!value) return 'No scheduled date';

		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return 'No scheduled date';

		return new Intl.DateTimeFormat('en', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(parsed);
	};

	const resourcesHint = 'Enter resource IDs separated by commas or new lines.';
</script>

<section class="flex flex-col gap-4">
	<header class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<p class="text-sm text-neutral-500">Total lessons</p>
			<p class="text-2xl font-semibold">{lessonCount}</p>
		</div>
		<button type="button" class="btn btn-outline btn-sm" onclick={handleRefresh} disabled={!unitId}>
			Refresh
		</button>
	</header>

	<form class="card border-base-200 bg-base-100 border" onsubmit={handleSubmit}>
		<div class="card-body gap-4">
			<div>
				<h2 class="card-title text-base">Create a lesson</h2>
				<p class="text-sm text-neutral-500">
					Provide the lesson details below. Required fields are marked with *.
				</p>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="form-control w-full sm:col-span-2">
					<div class="label">
						<span class="label-text">Title *</span>
					</div>
					<input
						type="text"
						placeholder="Intro to photosynthesis"
						class="input input-bordered"
						bind:value={draft.title}
						required
					/>
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Date</span>
					</div>
					<input type="date" class="input input-bordered" bind:value={draft.scheduledDate} />
				</label>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Duration (minutes)</span>
					</div>
					<input type="number" class="input input-bordered" min="0" bind:value={draft.duration} />
				</label>
			</div>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Content / Notes</span>
				</div>
				<textarea
					class="textarea textarea-bordered min-h-32"
					placeholder="Outline goals, activities, or resources"
					bind:value={draft.content}
				></textarea>
			</label>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Resource IDs</span>
				</div>
				<textarea
					class="textarea textarea-bordered min-h-24"
					placeholder={resourcesHint}
					bind:value={draft.resources}
				></textarea>
				<div class="label">
					<span class="label-text-alt text-xs text-neutral-500">{resourcesHint}</span>
				</div>
			</label>
			{#if errorMessage}
				<p class="text-error text-sm" aria-live="assertive">{errorMessage}</p>
			{:else if successMessage}
				<p class="text-success text-sm" aria-live="polite">{successMessage}</p>
			{/if}
			<div class="flex flex-wrap gap-3">
				<button type="submit" class="btn btn-primary" disabled={!canSubmit}>
					{#if isSaving}
						Saving...
					{:else}
						Create lesson
					{/if}
				</button>
				<span class="text-sm text-neutral-500">
					Title required · Auto-resets after a successful create
				</span>
			</div>
		</div>
	</form>

	{#if hasLessons}
		<ul class="grid gap-3">
			{#each lessons as lesson (lesson.id)}
				<li class="card border-base-200 bg-base-100 border">
					<div class="card-body gap-1">
						<p class="font-medium">{lesson.title}</p>
						<p class="text-sm text-neutral-500">{formatScheduledDate(lesson.scheduledDate)}</p>
						{#if lesson.duration}
							<p class="text-sm text-neutral-500">{lesson.duration} minutes</p>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="card border-base-300 bg-base-100 border border-dashed">
			<div class="card-body gap-4">
				<div>
					<p class="font-medium">No lessons yet</p>
					<p class="text-sm text-neutral-500">
						Start building this unit by scheduling your first lesson.
					</p>
				</div>
			</div>
		</div>
	{/if}
</section>
