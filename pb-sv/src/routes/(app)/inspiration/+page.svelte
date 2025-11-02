<script lang="ts">
	import type { PageProps } from './$types';
	import { fade, scale, slide } from 'svelte/transition';

	let { data }: PageProps = $props();

	type SpotlightCard = {
		id: string;
		title: string;
		description: string;
		meta: string;
		accent: 'primary' | 'secondary' | 'accent';
		action: string;
	};

	type MetricCard = {
		id: string;
		label: string;
		value: string;
		delta: string;
		trend: 'up' | 'steady' | 'down';
		context: string;
	};

	type DashboardPulse = {
		id: string;
		title: string;
		progress: number;
		category: string;
		owner: string;
	};

	type LessonMoment = {
		id: string;
		title: string;
		window: string;
		goal: string;
		duration: string;
	};

	type CommentThread = {
		id: string;
		author: string;
		role: string;
		time: string;
		avatar: string;
		message: string;
		replies?: CommentThread[];
		pinned?: boolean;
	};

	const spotlightCards: SpotlightCard[] = [
		{
			id: 'cohort-planner',
			title: 'Curate a weekly mastery cohort',
			description:
				'Bundle live seminars, async prompts, and practice labs into a single trusted flow.',
			meta: 'Lesson Play • 45 min setup',
			accent: 'primary',
			action: 'Launch planner'
		},
		{
			id: 'micro-assessment',
			title: 'Design pulse checks in minutes',
			description:
				'Pull from question patterns that adapt difficulty as learners unlock new skills.',
			meta: 'Assessment Lab • Adaptive scoring',
			accent: 'secondary',
			action: 'Build assessment'
		},
		{
			id: 'studio-brief',
			title: 'Ship a studio briefing kit',
			description: 'Align facilitators with a concise script, visual aids, and success metrics.',
			meta: 'Facilitation • Ready-to-use assets',
			accent: 'accent',
			action: 'Generate briefing'
		}
	];

	const metricCards: MetricCard[] = [
		{
			id: 'completion',
			label: 'Cohort completion',
			value: '92%',
			delta: '+6.3%',
			trend: 'up',
			context: 'Up from 85% last cycle'
		},
		{
			id: 'engagement',
			label: 'Active discussion threads',
			value: '138',
			delta: '+24',
			trend: 'up',
			context: '3.4 threads per learner'
		},
		{
			id: 'feedback',
			label: 'Average session rating',
			value: '4.7 / 5',
			delta: 'Stable',
			trend: 'steady',
			context: 'Last 120 live events'
		},
		{
			id: 'response',
			label: 'Coach response time',
			value: '38m',
			delta: '-12m',
			trend: 'up',
			context: 'Quickest in the past quarter'
		}
	];

	const dashboardPulses: DashboardPulse[] = [
		{
			id: 'onboarding',
			title: 'Onboarding momentum',
			progress: 78,
			category: 'Adoption',
			owner: 'Sonia'
		},
		{
			id: 'feedback-loops',
			title: 'Feedback loops captured',
			progress: 64,
			category: 'Insights',
			owner: 'Marcos'
		},
		{
			id: 'coaching-hours',
			title: 'Coaching hours delivered',
			progress: 86,
			category: 'Support',
			owner: 'Ravi'
		},
		{
			id: 'content-updates',
			title: 'Content refresh cadence',
			progress: 52,
			category: 'Curriculum',
			owner: 'Amina'
		}
	];

	const lessonMoments: LessonMoment[] = [
		{
			id: 'warm-up',
			title: 'Ignition question',
			window: '0-5 min',
			goal: 'Prime what success looks like',
			duration: 'Short burst'
		},
		{
			id: 'demo',
			title: 'Guided walkthrough',
			window: '5-20 min',
			goal: 'Model process with annotations',
			duration: 'Core'
		},
		{
			id: 'lab',
			title: 'Hands-on lab',
			window: '20-40 min',
			goal: 'Learners apply with coaching',
			duration: 'Collaborative'
		},
		{
			id: 'retro',
			title: 'Reflection pulse',
			window: '40-50 min',
			goal: 'Capture signals + next steps',
			duration: 'Wrap'
		}
	];

	const commentThreads: CommentThread[] = [
		{
			id: 'thread-101',
			author: 'Camille Avery',
			role: 'Lead Facilitator',
			time: '2h ago',
			avatar: 'https://i.pravatar.cc/48?img=12',
			message:
				'Shared a draft facilitation prompt for tomorrow—looking for a sharper challenge portion.',
			pinned: true,
			replies: [
				{
					id: 'thread-101a',
					author: 'Jordan Ellis',
					role: 'Instructional Coach',
					time: '1h ago',
					avatar: 'https://i.pravatar.cc/48?img=33',
					message:
						'Try framing the challenge as a scenario choice. Gives learners room to defend their approach.'
				}
			]
		},
		{
			id: 'thread-207',
			author: 'Iris Chan',
			role: 'Learner',
			time: '4h ago',
			avatar: 'https://i.pravatar.cc/48?img=45',
			message:
				'Can we add a recap of last week’s breakout highlights? I want to connect new work with the wins.',
			replies: [
				{
					id: 'thread-207a',
					author: 'Dev Patel',
					role: 'Community Manager',
					time: '2h ago',
					avatar: 'https://i.pravatar.cc/48?img=18',
					message: 'Absolutely. Drafting a “wins reel” to play right after the warm-up.'
				},
				{
					id: 'thread-207b',
					author: 'Iris Chan',
					role: 'Learner',
					time: '1h ago',
					avatar: 'https://i.pravatar.cc/48?img=45',
					message: 'Amazing—thanks for the quick turn!'
				}
			]
		}
	];

	const enrollmentTracks = ['Product Discovery', 'Team Leadership', 'CX Design', 'Data Fluency'];
	const enrollmentFormats = ['Live virtual', 'Hybrid studio', 'On-demand library'];
	const enrollmentCohorts = ['July 8', 'August 5', 'September 9'];

	type CardView = 'spotlight' | 'metrics';
	type DashboardView = 'overview' | 'engagement' | 'support';
	type LessonView = 'timeline' | 'matrix';

	let cardView = $state<CardView>('spotlight');
	let enrollmentForm = $state({
		name: '',
		email: '',
		track: enrollmentTracks[0],
		format: enrollmentFormats[1],
		cohort: enrollmentCohorts[0],
		notifications: true,
		introNote: ''
	});
	let enrollmentNotice = $state<{ type: 'success' | 'info' | 'error'; message: string } | null>(
		null
	);
	let dashboardFocus = $state<DashboardView>('overview');
	let editorTone = $state<'supportive' | 'direct'>('supportive');
	let editorDraft = $state(
		'Celebrate yesterday’s breakout moments before revealing today’s build.'
	);
	let editorTags = $state(['Warm welcome', 'Actionable feedback']);
	let editorPreview = $state(false);
	let lessonView = $state<LessonView>('timeline');
	let openThreads = $state<Record<string, boolean>>({ 'thread-101': true, 'thread-207': false });
	let commentFilter = $state<'all' | 'pinned' | 'unread'>('all');

	const lessonMatrix = [
		{
			title: 'Design sprint',
			items: ['Brief recap', 'Moment of tension', 'Guided canvas', 'Share-out protocol']
		},
		{
			title: 'Practice lab',
			items: ['Scenario cards', 'Live coaching queue', 'Peer scoring matrix']
		},
		{
			title: 'Reflection',
			items: ['Voice note reactions', 'Pulse poll', 'Follow-up commitments']
		}
	];

	const spotlightBadge = (accent: SpotlightCard['accent']) =>
		`badge badge-${accent} badge-outline badge-sm`;

	const metricTrendClass = (trend: MetricCard['trend']) =>
		`badge badge-sm ${
			trend === 'up' ? 'badge-success' : trend === 'down' ? 'badge-error' : 'badge-neutral'
		}`;

	const noticeClass = (type: 'success' | 'info' | 'error') =>
		`alert ${
			type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-info'
		} mt-2`;

	const handleEnrollment = (event: Event) => {
		event.preventDefault();
		enrollmentNotice = {
			type: 'success',
			message: `Reserved a ${enrollmentForm.format.toLowerCase()} spot for ${enrollmentForm.cohort}.`
		};
	};

	const toggleNotification = () => {
		enrollmentForm = { ...enrollmentForm, notifications: !enrollmentForm.notifications };
	};

	const setCardView = (view: CardView) => {
		cardView = view;
	};

	const setDashboardFocus = (view: DashboardView) => {
		dashboardFocus = view;
	};

	const setLessonView = (view: LessonView) => {
		lessonView = view;
	};

	const toggleEditorTag = (tag: string) => {
		if (editorTags.includes(tag)) {
			editorTags = editorTags.filter((item) => item !== tag);
		} else {
			editorTags = [...editorTags, tag];
		}
	};

	const toggleThread = (id: string) => {
		openThreads = { ...openThreads, [id]: !openThreads[id] };
	};

	const filteredThreads = $derived(() => {
		if (commentFilter === 'all') return commentThreads;
		if (commentFilter === 'pinned') {
			return commentThreads.filter((thread) => thread.pinned);
		}
		return commentThreads.filter((thread) => !openThreads[thread.id]);
	});

	const editorCharacterCount = $derived(() => editorDraft.trim().length);
</script>

<main class="text-base-content grid gap-12 pb-20">
	<section class="flex flex-wrap items-center justify-between gap-6">
		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Experience Library</h1>
			<p class="text-base-content/70 max-w-2xl">
				A curated palette of Tailwind and daisyUI patterns designed for learning systems. Mix and
				match layouts that feel intuitive, supportive, and effortless to navigate.
			</p>
		</div>
		<div class="join">
			<button
				class="btn join-item btn-sm"
				class:btn-primary={cardView === 'spotlight'}
				class:btn-outline={cardView !== 'spotlight'}
				onclick={() => setCardView('spotlight')}
			>
				Curation
			</button>
			<button
				class="btn join-item btn-sm"
				class:btn-primary={cardView === 'metrics'}
				class:btn-outline={cardView !== 'metrics'}
				onclick={() => setCardView('metrics')}
			>
				Metrics
			</button>
		</div>
		<div class="rounded-box bg-base-100 shadow">
			<div class="grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
				{#if cardView === 'spotlight'}
					<div class="space-y-6">
						<h2 class="text-base-content text-2xl font-semibold">Spotlight cards</h2>
						<p class="text-base-content/70 text-sm">
							Use bold, elongated cards to orient teams toward the next meaningful action.
						</p>
						<div class="grid gap-4 sm:grid-cols-2">
							{#each spotlightCards as card (card.id)}
								<article class="card bg-base-200 border-base-300 border shadow-sm" transition:scale>
									<div class="card-body gap-3">
										<div class="flex items-center gap-2">
											<div class={spotlightBadge(card.accent)}>New</div>
											<span class="text-base-content/60 text-xs uppercase tracking-wide">
												{card.meta}
											</span>
										</div>
										<h3 class="text-lg font-semibold leading-tight">{card.title}</h3>
										<p class="text-base-content/70 text-sm">{card.description}</p>
										<div class="flex items-center justify-between pt-3">
											<button class="btn btn-primary btn-sm">{card.action}</button>
											<button class="btn btn-ghost btn-sm">Preview</button>
										</div>
									</div>
								</article>
							{/each}
						</div>
					</div>
				{:else}
					<div class="space-y-6">
						<h2 class="text-base-content text-2xl font-semibold">Progress metrics</h2>
						<p class="text-base-content/70 text-sm">
							Stack compact tiles for course health overviews, pulse decks, and quick wins.
						</p>
						<div class="grid gap-4 sm:grid-cols-2">
							{#each metricCards as metric (metric.id)}
								<article class="card bg-base-200 border-base-300 border shadow-sm" transition:scale>
									<div class="card-body gap-3">
										<div class="flex items-center justify-between">
											<h3 class="text-base-content/80 text-sm font-semibold">
												{metric.label}
											</h3>
											<div class={metricTrendClass(metric.trend)}>{metric.delta}</div>
										</div>
										<p class="text-3xl font-semibold">{metric.value}</p>
										<p class="text-base-content/60 text-xs uppercase tracking-wide">
											{metric.context}
										</p>
									</div>
								</article>
							{/each}
						</div>
					</div>
				{/if}
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:fade>
					<div class="card-body gap-4">
						<h3 class="text-base-content text-lg font-semibold">Why it works</h3>
						<ul class="text-base-content/70 grid gap-3 text-sm">
							<li class="rounded-box bg-base-100 p-3">
								<b>Hierarchy</b> comes from stacking typography scales and badge accents.
							</li>
							<li class="rounded-box bg-base-100 p-3">
								<b>Actions</b> stay visible: primary and ghost buttons live in the same row.
							</li>
							<li class="rounded-box bg-base-100 p-3">
								<b>Accessibility</b> stays high using default DaisyUI contrasts and spacing.
							</li>
						</ul>
						<div class="divider my-2"></div>
						<p class="text-base-content/60 text-xs">
							Tip: swap <code class="font-mono text-[10px]">bg-base-200</code> for
							<code class="font-mono text-[10px]">bg-base-300</code> and add a
							<code class="font-mono text-[10px]">shadow-lg</code> class to increase focus in dashboards.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold">Enrollment forms</h2>
				<p class="text-base-content/70 text-sm">
					Use gentle guardrails to keep applicants confident while capturing meaningful context.
				</p>
			</div>
			<div class="join">
				<button
					class="btn join-item btn-sm"
					class:btn-primary={enrollmentForm.notifications}
					onclick={toggleNotification}
				>
					Notify mentors
				</button>
				<button class="btn join-item btn-sm btn-ghost" onclick={() => (enrollmentNotice = null)}>
					Clear alert
				</button>
			</div>
		</div>
		<div class="rounded-box bg-base-100 shadow">
			<div class="grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
				<form class="card bg-base-200 border-base-300 border shadow-sm" onsubmit={handleEnrollment}>
					<div class="card-body gap-4">
						<header class="space-y-1">
							<h3 class="text-lg font-semibold">Learner intake</h3>
							<p class="text-base-content/70 text-sm">
								Capture just enough context to tailor the kickoff.
							</p>
						</header>
						<label class="form-control w-full">
							<div class="label">
								<span class="label-text">Full name</span>
							</div>
							<input
								class="input input-bordered w-full"
								placeholder="Alex Rivera"
								bind:value={enrollmentForm.name}
								required
							/>
						</label>
						<label class="form-control w-full">
							<div class="label">
								<span class="label-text">Work email</span>
								<span class="label-text-alt text-base-content/60">We send cohort updates here</span>
							</div>
							<input
								type="email"
								class="input input-bordered input-primary w-full"
								placeholder="alex@team.co"
								bind:value={enrollmentForm.email}
								required
							/>
						</label>
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="form-control">
								<div class="label">
									<span class="label-text">Track focus</span>
								</div>
								<select class="select select-bordered" bind:value={enrollmentForm.track}>
									{#each enrollmentTracks as track}
										<option value={track}>{track}</option>
									{/each}
								</select>
							</label>
							<label class="form-control">
								<div class="label">
									<span class="label-text">Experience format</span>
								</div>
								<select class="select select-bordered" bind:value={enrollmentForm.format}>
									{#each enrollmentFormats as format}
										<option value={format}>{format}</option>
									{/each}
								</select>
							</label>
						</div>
						<label class="form-control">
							<div class="label">
								<span class="label-text">Preferred cohort</span>
							</div>
							<div class="join flex">
								{#each enrollmentCohorts as cohort}
									<button
										type="button"
										class="btn join-item"
										class:btn-primary={enrollmentForm.cohort === cohort}
										class:btn-outline={enrollmentForm.cohort !== cohort}
										onclick={() => (enrollmentForm = { ...enrollmentForm, cohort })}
									>
										{cohort}
									</button>
								{/each}
							</div>
						</label>
						<label class="form-control">
							<div class="label">
								<span class="label-text">What should we know?</span>
								<span class="label-text-alt text-base-content/60">Optional</span>
							</div>
							<textarea
								class="textarea textarea-bordered h-24"
								placeholder="Share team goals, access needs, or current blockers."
								bind:value={enrollmentForm.introNote}
							></textarea>
						</label>
						<label class="label rounded-box bg-base-100 border-base-300 border px-4 py-3 shadow-sm">
							<span class="label-text text-base-content/70 text-sm">
								Send weekly mentor nudges when learners fall behind milestones.
							</span>
							<input
								type="checkbox"
								class="toggle toggle-primary"
								checked={enrollmentForm.notifications}
								onchange={toggleNotification}
							/>
						</label>
						<button class="btn btn-primary" type="submit">Confirm enrollment</button>
						{#if enrollmentNotice}
							<div class={noticeClass(enrollmentNotice.type)} in:fade>
								{enrollmentNotice.message}
							</div>
						{/if}
					</div>
				</form>
				<div class="grid gap-6">
					<div class="card bg-base-200 border-base-300 border shadow-sm">
						<div class="card-body gap-4">
							<h3 class="text-lg font-semibold">Form design notes</h3>
							<ul class="text-base-content/70 space-y-3 text-sm">
								<li class="rounded-box bg-base-100 p-3">
									<b>Inputs</b> alternate between
									<code class="font-mono text-[10px]">select</code> and
									<code class="font-mono text-[10px]">join</code>
									groups for clarity on choice vs. entry.
								</li>
								<li class="rounded-box bg-base-100 p-3">
									<b>Inline helper text</b> sets expectations and reduces form anxiety.
								</li>
								<li class="rounded-box bg-base-100 p-3">
									<b>Alerts</b> anchor below the primary call-to-action when the form submits.
								</li>
							</ul>
						</div>
					</div>
					<div class="card bg-base-200 border-base-300 border shadow-sm" transition:slide>
						<div class="card-body gap-4">
							<h3 class="text-lg font-semibold">Quick checklist</h3>
							<div class="text-base-content/70 space-y-3 text-sm">
								<label
									class="label rounded-box bg-base-100 cursor-pointer justify-start gap-3 px-4 py-2"
								>
									<input type="checkbox" class="checkbox checkbox-primary" checked />
									<span>Add inline reassurance copy</span>
								</label>
								<label
									class="label rounded-box bg-base-100 cursor-pointer justify-start gap-3 px-4 py-2"
								>
									<input type="checkbox" class="checkbox checkbox-secondary" />
									<span>Offer collaborative enrollment for teams</span>
								</label>
								<label
									class="label rounded-box bg-base-100 cursor-pointer justify-start gap-3 px-4 py-2"
								>
									<input type="checkbox" class="checkbox checkbox-accent" />
									<span>Include quick save + return later</span>
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold">Learning dashboard</h2>
				<p class="text-base-content/70 text-sm">
					Turn complex data into approachable pulses and snapshots. Toggle perspectives to keep
					everyone aligned.
				</p>
			</div>
			<div class="join">
				<button
					class="btn btn-sm join-item"
					class:btn-primary={dashboardFocus === 'overview'}
					class:btn-outline={dashboardFocus !== 'overview'}
					onclick={() => setDashboardFocus('overview')}
				>
					Overview
				</button>
				<button
					class="btn btn-sm join-item"
					class:btn-primary={dashboardFocus === 'engagement'}
					class:btn-outline={dashboardFocus !== 'engagement'}
					onclick={() => setDashboardFocus('engagement')}
				>
					Engagement
				</button>
				<button
					class="btn btn-sm join-item"
					class:btn-primary={dashboardFocus === 'support'}
					class:btn-outline={dashboardFocus !== 'support'}
					onclick={() => setDashboardFocus('support')}
				>
					Support
				</button>
			</div>
		</div>
		<div class="rounded-box bg-base-100 shadow">
			<div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:fade>
					<div class="card-body gap-4">
						<header class="flex flex-wrap items-center justify-between gap-3">
							<div>
								<h3 class="text-lg font-semibold">Snapshot</h3>
								<p class="text-base-content/60 text-xs uppercase tracking-wide">
									Updated 12 minutes ago
								</p>
							</div>
							<div class="badge badge-outline badge-sm">Live</div>
						</header>
						<div class="stats stats-vertical lg:stats-horizontal shadow-sm">
							{#if dashboardFocus === 'overview'}
								<div class="stat">
									<div class="stat-title">Active learners</div>
									<div class="stat-value text-primary">864</div>
									<div class="stat-desc text-success">Up 8% vs last quarter</div>
								</div>
								<div class="stat">
									<div class="stat-title">Milestones unlocked</div>
									<div class="stat-value text-secondary">1,432</div>
									<div class="stat-desc text-base-content/60">Avg 3.6 per learner</div>
								</div>
								<div class="stat">
									<div class="stat-title">Completion velocity</div>
									<div class="stat-value text-accent">14d</div>
									<div class="stat-desc text-warning">Holding steady</div>
								</div>
							{:else if dashboardFocus === 'engagement'}
								<div class="stat">
									<div class="stat-title">Live attendance</div>
									<div class="stat-value text-primary">82%</div>
									<div class="stat-desc text-success">+5% week over week</div>
								</div>
								<div class="stat">
									<div class="stat-title">Async submissions</div>
									<div class="stat-value text-secondary">426</div>
									<div class="stat-desc text-base-content/60">2.2 per learner</div>
								</div>
								<div class="stat">
									<div class="stat-title">Peer feedback</div>
									<div class="stat-value text-accent">1,204</div>
									<div class="stat-desc text-info">Response within 10h</div>
								</div>
							{:else}
								<div class="stat">
									<div class="stat-title">Coach responses</div>
									<div class="stat-value text-primary">318</div>
									<div class="stat-desc text-success">Median 30m</div>
								</div>
								<div class="stat">
									<div class="stat-title">Office hours filled</div>
									<div class="stat-value text-secondary">14 / 16</div>
									<div class="stat-desc text-warning">Add more seats</div>
								</div>
								<div class="stat">
									<div class="stat-title">Support satisfaction</div>
									<div class="stat-value text-accent">4.9 / 5</div>
									<div class="stat-desc text-base-content/60">Last 60 ratings</div>
								</div>
							{/if}
						</div>
						<div class="rounded-box bg-base-100 text-base-content/70 p-4 text-sm">
							Tip: combine <code class="font-mono text-[10px]">stats</code> with
							<code class="font-mono text-[10px]">badge</code> and microcopy to surface deltas without
							overwhelming.
						</div>
					</div>
				</div>
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:slide>
					<div class="card-body gap-5">
						<header class="flex flex-wrap items-center justify-between gap-3">
							<h3 class="text-lg font-semibold">Pulse board</h3>
							<button class="btn btn-ghost btn-sm">Export board</button>
						</header>
						<div class="grid gap-4 md:grid-cols-2">
							{#each dashboardPulses as pulse (pulse.id)}
								<div class="rounded-box bg-base-100 p-4 shadow-sm">
									<div class="text-base-content/60 flex items-center justify-between text-sm">
										<span>{pulse.category}</span>
										<span>Owner: {pulse.owner}</span>
									</div>
									<h4 class="text-base font-semibold leading-tight">{pulse.title}</h4>
									<progress
										class="progress progress-primary mt-3"
										value={pulse.progress}
										max="100"
									/>
									<p class="text-base-content/60 mt-2 text-xs">
										{pulse.progress}% momentum toward this sprint goal.
									</p>
								</div>
							{/each}
						</div>
						<div class="alert alert-info shadow-sm" transition:fade>
							<span>Use the same card skeleton to display blockers, risk tags, or weekly wins.</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold">Text editor &amp; messaging</h2>
				<p class="text-base-content/70 text-sm">
					Pair a calm writing surface with contextual guidance. Help coaches craft coaching nudges
					in minutes.
				</p>
			</div>
			<div class="join">
				<button
					class="btn join-item btn-sm"
					class:btn-primary={editorTone === 'supportive'}
					class:btn-outline={editorTone !== 'supportive'}
					onclick={() => (editorTone = 'supportive')}
				>
					Supportive tone
				</button>
				<button
					class="btn join-item btn-sm"
					class:btn-primary={editorTone === 'direct'}
					class:btn-outline={editorTone !== 'direct'}
					onclick={() => (editorTone = 'direct')}
				>
					Direct tone
				</button>
			</div>
		</div>
		<div class="rounded-box bg-base-100 shadow">
			<div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:fade>
					<div class="card-body gap-4">
						<header class="flex flex-wrap items-center justify-between gap-3">
							<div>
								<h3 class="text-lg font-semibold">Coaching note</h3>
								<p class="text-base-content/60 text-xs uppercase tracking-wide">
									Tone: {editorTone === 'supportive'
										? 'Warm + encouraging'
										: 'Clear + outcome driven'}
								</p>
							</div>
							<div class="badge badge-neutral badge-outline">
								{editorCharacterCount} characters
							</div>
						</header>
						<div class="join flex-wrap">
							<button class="btn join-item btn-sm btn-ghost">B</button>
							<button class="btn join-item btn-sm btn-ghost">Italic</button>
							<button class="btn join-item btn-sm btn-ghost">Checklist</button>
							<button class="btn join-item btn-sm btn-ghost">Callout</button>
							<button class="btn join-item btn-sm btn-ghost">Insert link</button>
						</div>
						<textarea
							class="textarea textarea-bordered h-40"
							placeholder="Draft the guidance learners will see..."
							bind:value={editorDraft}
						></textarea>
						<div class="flex flex-wrap items-center justify-between gap-3 text-sm">
							<div class="flex flex-wrap gap-2">
								{#each ['Warm welcome', 'Actionable feedback', 'Momentum anchor', 'Celebration'] as tag}
									<button
										class="btn btn-sm"
										class:btn-outline={!editorTags.includes(tag)}
										class:btn-secondary={editorTags.includes(tag)}
										type="button"
										onclick={() => toggleEditorTag(tag)}
									>
										{tag}
									</button>
								{/each}
							</div>
							<button class="btn btn-ghost btn-sm" onclick={() => (editorPreview = !editorPreview)}>
								{editorPreview ? 'Hide preview' : 'Preview message'}
							</button>
						</div>
						{#if editorPreview}
							<div class="rounded-box bg-base-100 text-base-content/70 p-4 text-sm" transition:fade>
								<p class="text-base-content mb-2 font-semibold">Preview</p>
								<p>{editorDraft}</p>
							</div>
						{/if}
					</div>
				</div>
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:scale>
					<div class="card-body gap-5">
						<h3 class="text-lg font-semibold">Message playbook</h3>
						<ul class="timeline timeline-vertical timeline-compact text-base-content/70 text-sm">
							<li>
								<div class="timeline-middle">
									<div class="badge badge-primary badge-sm"></div>
								</div>
								<div class="timeline-start timeline-box bg-base-100 shadow-sm">
									<h4 class="text-base-content font-semibold">Start with celebration</h4>
									<p>Affirm a win before suggesting a next move.</p>
								</div>
							</li>
							<li>
								<hr />
								<div class="timeline-middle">
									<div class="badge badge-secondary badge-sm"></div>
								</div>
								<div class="timeline-start timeline-box bg-base-100 shadow-sm">
									<h4 class="text-base-content font-semibold">Surface one action</h4>
									<p>Anchor on the most important task to reduce friction.</p>
								</div>
							</li>
							<li>
								<hr />
								<div class="timeline-middle">
									<div class="badge badge-accent badge-sm"></div>
								</div>
								<div class="timeline-start timeline-box bg-base-100 shadow-sm">
									<h4 class="text-base-content font-semibold">Offer agency</h4>
									<p>Provide a choice so the learner feels in control.</p>
								</div>
							</li>
						</ul>
						<div class="alert alert-info">
							<span
								>Stack timelines and checklists to guide new facilitators composing messages.</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold">Lesson planning canvas</h2>
				<p class="text-base-content/70 text-sm">
					Render an agenda in both linear and matrix views. Switching views supports different
					planning styles.
				</p>
			</div>
			<div class="join">
				<button
					class="btn join-item btn-sm"
					class:btn-primary={lessonView === 'timeline'}
					class:btn-outline={lessonView !== 'timeline'}
					onclick={() => setLessonView('timeline')}
				>
					Timeline
				</button>
				<button
					class="btn join-item btn-sm"
					class:btn-primary={lessonView === 'matrix'}
					class:btn-outline={lessonView !== 'matrix'}
					onclick={() => setLessonView('matrix')}
				>
					Matrix
				</button>
			</div>
		</div>
		<div class="rounded-box bg-base-100 shadow">
			<div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:slide>
					<div class="card-body gap-6">
						<header class="flex flex-wrap items-center justify-between gap-3">
							<h3 class="text-lg font-semibold">Session rhythm</h3>
							<div class="badge badge-outline badge-sm">High fidelity</div>
						</header>
						{#if lessonView === 'timeline'}
							<ul class="timeline timeline-vertical timeline-compact">
								{#each lessonMoments as moment, index (moment.id)}
									<li>
										<div class="timeline-middle">
											<div class="badge badge-primary badge-sm"></div>
										</div>
										<div class="timeline-start">
											<div class="rounded-box bg-base-100 space-y-1 p-4 shadow-sm">
												<h4 class="text-base font-semibold">{moment.title}</h4>
												<p class="text-base-content/60 text-xs uppercase tracking-wide">
													{moment.window} • {moment.duration}
												</p>
												<p class="text-base-content/70 text-sm">{moment.goal}</p>
											</div>
										</div>
									</li>
									{#if index < lessonMoments.length - 1}
										<li><hr /></li>
									{/if}
								{/each}
							</ul>
						{:else}
							<div class="grid gap-4 md:grid-cols-3">
								{#each lessonMatrix as column (column.title)}
									<div class="rounded-box bg-base-100 space-y-3 p-4 shadow-sm">
										<h4 class="text-base font-semibold">{column.title}</h4>
										<ul class="text-base-content/70 grid gap-2 text-sm">
											{#each column.items as item}
												<li class="rounded-box bg-base-200/60 px-3 py-2">{item}</li>
											{/each}
										</ul>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:fade>
					<div class="card-body gap-5">
						<h3 class="text-lg font-semibold">Facilitator prep</h3>
						<ul class="text-base-content/70 space-y-3 text-sm">
							<li class="rounded-box bg-base-100 p-3">
								<b>Timeline view</b> helps new facilitators memorize the flow quickly.
							</li>
							<li class="rounded-box bg-base-100 p-3">
								<b>Matrix view</b> reveals parallel tracks—great for hybrid classrooms.
							</li>
							<li class="rounded-box bg-base-100 p-3">
								<b>Badges</b> draw attention to sections that require materials or co-hosts.
							</li>
						</ul>
						<div class="divider my-2"></div>
						<div class="join flex-wrap gap-2">
							<button class="btn btn-sm btn-outline">Duplicate template</button>
							<button class="btn btn-sm btn-ghost">Share link</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold">Comments &amp; posts</h2>
				<p class="text-base-content/70 text-sm">
					Create welcoming feedback loops. Threads stay easy to scan, and facilitators can expand
					detail on demand.
				</p>
			</div>
			<div class="join">
				<button
					class="btn join-item btn-sm"
					class:btn-primary={commentFilter === 'all'}
					class:btn-outline={commentFilter !== 'all'}
					onclick={() => (commentFilter = 'all')}
				>
					All
				</button>
				<button
					class="btn join-item btn-sm"
					class:btn-primary={commentFilter === 'pinned'}
					class:btn-outline={commentFilter !== 'pinned'}
					onclick={() => (commentFilter = 'pinned')}
				>
					Pinned
				</button>
				<button
					class="btn join-item btn-sm"
					class:btn-primary={commentFilter === 'unread'}
					class:btn-outline={commentFilter !== 'unread'}
					onclick={() => (commentFilter = 'unread')}
				>
					Unread
				</button>
			</div>
		</div>
		<div class="rounded-box bg-base-100 shadow">
			<div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:slide>
					<div class="card-body gap-6">
						<header class="flex flex-wrap items-center justify-between gap-3">
							<h3 class="text-lg font-semibold">Community threads</h3>
							<button class="btn btn-primary btn-sm">New post</button>
						</header>
						<div class="grid gap-4">
							{#each filteredThreads as thread (thread.id)}
								<article class="rounded-box bg-base-100 space-y-4 p-4 shadow-sm">
									<header class="flex items-center justify-between gap-3">
										<div class="flex items-center gap-3">
											<div class="avatar">
												<div class="mask mask-squircle h-10 w-10">
													<img alt={thread.author} src={thread.avatar} />
												</div>
											</div>
											<div>
												<p class="text-base font-semibold">{thread.author}</p>
												<p class="text-base-content/60 text-xs uppercase tracking-wide">
													{thread.role}
												</p>
											</div>
										</div>
										<div class="flex items-center gap-2">
											{#if thread.pinned}
												<div class="badge badge-warning badge-outline badge-sm">Pinned</div>
											{/if}
											<span class="text-base-content/60 text-xs">{thread.time}</span>
										</div>
									</header>
									<p class="text-base-content/80 text-sm">{thread.message}</p>
									{#if thread.replies?.length}
										<button class="btn btn-ghost btn-sm" onclick={() => toggleThread(thread.id)}>
											{openThreads[thread.id]
												? 'Hide replies'
												: `Show ${thread.replies.length} replies`}
										</button>
										{#if openThreads[thread.id]}
											<div class="border-base-200 border-l pl-4" transition:fade>
												{#each thread.replies as reply (reply.id)}
													<div class="rounded-box bg-base-200/60 grid gap-2 p-3">
														<div
															class="text-base-content/60 flex items-center justify-between text-xs"
														>
															<span>{reply.author} • {reply.role}</span>
															<span>{reply.time}</span>
														</div>
														<p class="text-base-content/80 text-sm">{reply.message}</p>
													</div>
												{/each}
											</div>
										{/if}
									{/if}
									<div class="flex flex-wrap items-center gap-2 text-sm">
										<button class="btn btn-outline btn-sm">Acknowledge</button>
										<button class="btn btn-ghost btn-sm">Add to agenda</button>
										<button class="btn btn-ghost btn-sm">Share recap</button>
									</div>
								</article>
							{/each}
						</div>
					</div>
				</div>
				<div class="card bg-base-200 border-base-300 border shadow-sm" transition:fade>
					<div class="card-body gap-5">
						<h3 class="text-lg font-semibold">Engagement cues</h3>
						<div class="text-base-content/70 space-y-3 text-sm">
							<div class="rounded-box bg-base-100 p-3">
								<b>Badges + timestamps</b> help facilitators scan for urgency.
							</div>
							<div class="rounded-box bg-base-100 p-3">
								<b>Reply reveal</b> keeps the main thread compact while still being available.
							</div>
							<div class="rounded-box bg-base-100 p-3">
								<b>Action bar</b> encourages fast follow-up—acknowledge, plan, or broadcast.
							</div>
						</div>
						<div class="divider my-2"></div>
						<div class="rounded-box bg-base-100 p-4 text-sm">
							<p class="text-base-content mb-1 font-semibold">Quick tip</p>
							<p class="text-base-content/70">
								Add
								<code class="font-mono text-[10px]">toast toast-end</code>
								in the layout to surface new replies while staying in the same view.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
