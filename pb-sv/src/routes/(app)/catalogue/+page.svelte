<script lang="ts">
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	type PulseKey = 'adoption' | 'retention';
	type PulsePanel = {
		id: string;
		title: string;
		summary: string;
		metric: string;
		delta: string;
		emphasis: 'primary' | 'secondary' | 'accent' | 'info';
	};

	type Initiative = {
		id: string;
		title: string;
		owner: string;
		impact: number;
		effort: number;
		focus: 'Now' | 'Next' | 'Later';
	};

	type MotionSentiment = 'momentum' | 'steady' | 'attention';
	type MotionKey = 'launches' | 'experiments';
type MotionSort = 'progress' | 'alphabetical';
type MotionPanel = {
	id: string;
	title: string;
	summary: string;
	signal: string;
	progress: number;
	lane: string;
	sentiment: MotionSentiment;
};

type LoginMode = 'signin' | 'magic';
type LoginFeedback = { type: 'error' | 'success'; message: string } | null;

let loginMode = $state<LoginMode>('signin');
let loginForm = $state({
	email: '',
	password: '',
	remember: true
});
let loginLoading = $state(false);
let loginFeedback = $state<LoginFeedback>(null);

let pulseMode = $state<PulseKey>('adoption');
	let showPulseGrid = $state(true);
	let pulseSets: Record<PulseKey, PulsePanel[]> = {
		adoption: [
			{
				id: 'welcome-series',
				title: 'Welcome Series',
				summary: 'Automations deliver tailored walkthroughs within 24 hours.',
				metric: '82% completion',
				delta: '▲ 6% vs last sprint',
				emphasis: 'primary'
			},
			{
				id: 'workspace-health',
				title: 'Workspace Health',
				summary: 'Teams activating templates within seven days of signup.',
				metric: '74% active',
				delta: '▲ 4% uplift',
				emphasis: 'accent'
			},
			{
				id: 'pilot-handoff',
				title: 'Pilot Handoff',
				summary: 'Customer success touches delivered with contextual playbooks.',
				metric: '31 hr turnaround',
				delta: '▼ 5 hrs faster',
				emphasis: 'info'
			},
			{
				id: 'advocacy-loop',
				title: 'Advocacy Loop',
				summary: 'New champions invited to peer cohorts after week three.',
				metric: '58 invites',
				delta: '▲ 12 new voices',
				emphasis: 'secondary'
			}
		],
		retention: [
			{
				id: 'adoption-review',
				title: 'Adoption Review',
				summary: 'Quarterly product councils aligned on roadmap checkpoints.',
				metric: '92% attendance',
				delta: '▲ 8% engagement',
				emphasis: 'accent'
			},
			{
				id: 'change-log',
				title: 'Change Log Broadcasts',
				summary: 'Release notes personalized by segment and sent in-product.',
				metric: '68% read-through',
				delta: '▲ 10% uplift',
				emphasis: 'primary'
			},
			{
				id: 'insight-forum',
				title: 'Insight Forum',
				summary: 'Advisory board shares quarterly impact stories across orgs.',
				metric: '21 case studies',
				delta: '▲ 5 launches',
				emphasis: 'secondary'
			},
			{
				id: 'renewal-signal',
				title: 'Renewal Signal',
				summary: 'Health scores recalculated weekly for revenue planning.',
				metric: '88% stable',
				delta: '▲ 3% lift',
				emphasis: 'info'
			}
		]
	};

	let initiativeSort = $state<'impact' | 'effort'>('impact');
	const initiatives = $state<Initiative[]>([
		{
			id: 'playbook-refine',
			title: 'Playbook Refinement',
			owner: 'Leah Sands',
			impact: 9,
			effort: 3,
			focus: 'Now'
		},
		{
			id: 'partner-launch',
			title: 'Partner Launch Program',
			owner: 'Hugo Wren',
			impact: 8,
			effort: 5,
			focus: 'Next'
		},
		{
			id: 'data-sandbox',
			title: 'Customer Data Sandbox',
			owner: 'Morgan Patel',
			impact: 7,
			effort: 4,
			focus: 'Now'
		},
		{
			id: 'leadership-summit',
			title: 'Leadership Summit',
			owner: 'Priya Roy',
			impact: 6,
			effort: 6,
			focus: 'Later'
		},
		{
			id: 'role-based-training',
			title: 'Role-Based Training Paths',
			owner: 'Daniel Cho',
			impact: 8,
			effort: 4,
			focus: 'Next'
		},
		{
			id: 'signal-automation',
			title: 'Signal Automation',
			owner: 'Ivy Chen',
			impact: 9,
			effort: 5,
			focus: 'Now'
		}
	]);

	const motionSets: Record<MotionKey, MotionPanel[]> = {
		launches: [
			{
				id: 'launchpad',
				title: 'Lifecycle Launchpad',
				summary: 'Sequenced nudges align first-week value moments for new workspaces.',
				signal: '▲ 12% activation',
				progress: 78,
				lane: 'Lifecycle',
				sentiment: 'momentum'
			},
			{
				id: 'advocate-hub',
				title: 'Advocacy Hub',
				summary: 'Champions share reusable win stories through moderated cohorts.',
				signal: '▲ 18 new advocates',
				progress: 64,
				lane: 'Advocacy',
				sentiment: 'steady'
			},
			{
				id: 'pilot-bridge',
				title: 'Pilot Bridge',
				summary: 'Implementation kits bundle playbooks, enablement, and metrics dashboards.',
				signal: '▲ 9 pt CSAT swing',
				progress: 82,
				lane: 'Enablement',
				sentiment: 'momentum'
			},
			{
				id: 'signal-drift',
				title: 'Signal Drift Guard',
				summary: 'Revenue alerts flag idle teams for success handoffs with automated play.',
				signal: '▼ 6 churn signals',
				progress: 55,
				lane: 'Revenue',
				sentiment: 'attention'
			}
		],
		experiments: [
			{
				id: 'immersive-demo',
				title: 'Immersive Demo Rooms',
				summary: 'Spatial walkthroughs remix feature tours into narrative-rich journeys.',
				signal: '▲ 24% dwell time',
				progress: 47,
				lane: 'Product Marketing',
				sentiment: 'steady'
			},
			{
				id: 'cohort-labs',
				title: 'Cohort Labs',
				summary: 'Research pods pair product, design, and ops to prototype weekly.',
				signal: '▲ 3 validated bets',
				progress: 69,
				lane: 'Research',
				sentiment: 'momentum'
			},
			{
				id: 'microsurvey-haze',
				title: 'Microsurvey Haze',
				summary: 'In-app microcopy tests capture contextual sentiment mid-feature.',
				signal: '▼ 4 friction points',
				progress: 58,
				lane: 'Insights',
				sentiment: 'attention'
			},
			{
				id: 'retention-loop',
				title: 'Retention Loop Stories',
				summary: 'Narrative snippets capture before-and-after moments for exec recaps.',
				signal: '▲ 11 executive shares',
				progress: 62,
				lane: 'Communications',
				sentiment: 'steady'
			}
		]
	};

	let motionView = $state<MotionKey>('launches');
	let motionSort = $state<MotionSort>('progress');
	let revealMotionGrid = $state(true);
	let motionTiles = $state<MotionPanel[]>([]);

	$effect(() => {
		const base = motionSets[motionView];
		const sorted =
			motionSort === 'progress'
				? base.slice().sort((a, b) => b.progress - a.progress)
				: base.slice().sort((a, b) => a.title.localeCompare(b.title));

	motionTiles = sorted;
});

function toggleLoginMode(mode: LoginMode) {
	if (loginMode === mode) {
		return;
	}

	loginMode = mode;
	loginFeedback = null;
	loginForm.password = '';
}

async function handleLogin(event: SubmitEvent) {
	event.preventDefault();
	loginFeedback = null;

	if (!loginForm.email) {
		loginFeedback = { type: 'error', message: 'Add a workspace email to continue.' };
		return;
	}

	if (loginMode === 'signin' && loginForm.password.length < 8) {
		loginFeedback = { type: 'error', message: 'Use at least 8 characters for your password.' };
		return;
	}

	loginLoading = true;
	await new Promise((resolve) => setTimeout(resolve, 850));

	loginFeedback =
		loginMode === 'signin'
			? {
					type: 'success',
					message: 'Welcome back. We are routing you to your workspace.'
				}
			: {
					type: 'success',
					message: 'Magic link sent. Check your inbox for quick access.'
				};

	loginLoading = false;
	loginForm.password = '';
}

function setPulseMode(mode: PulseKey) {
	pulseMode = mode;
}

	function togglePulse() {
		showPulseGrid = !showPulseGrid;
	}

	function resort(mode: 'impact' | 'effort') {
		if (initiativeSort === mode) {
			initiatives.reverse();
		} else {
			initiatives.sort((a, b) => (mode === 'impact' ? b.impact - a.impact : a.effort - b.effort));
			initiativeSort = mode;
		}
	}

	function setMotionView(view: MotionKey) {
		if (motionView === view) {
			return;
		}

		motionView = view;
	}

	function toggleMotionGrid() {
		revealMotionGrid = !revealMotionGrid;
	}

	function sortMotion(mode: MotionSort) {
		if (motionSort === mode) {
			motionTiles = motionTiles.slice().reverse();
			return;
		}

		motionSort = mode;
	}
</script>

<main class="space-y-16">
	<section class="space-y-6">
		<h1 class="text-base-content text-3xl font-bold tracking-tight">Grid Pattern Catalogue</h1>
		<p class="text-base-content/70">
			Grid-focused layout inspirations leveraging Tailwind CSS and DaisyUI.
		</p>
	</section>

	<section class="space-y-10">
		<div
			class="rounded-box relative overflow-hidden bg-gradient-to-br from-base-200 via-base-100 to-base-300 p-6 sm:p-10"
		>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 translate-x-10 bg-gradient-to-l from-primary/10 via-transparent to-transparent blur-3xl lg:block"
			></div>
			<div
				class="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-center"
			>
				<div class="space-y-6">
					<div class="badge badge-outline badge-primary badge-lg">Workspace Access</div>
					<h2 class="text-base-content text-3xl font-bold tracking-tight sm:text-4xl">
						Sign in to your team command center
					</h2>
					<p class="text-base-content/70 text-base">
						Join live projects, track momentum, and stay synced with the latest launches in seconds.
					</p>
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="rounded-box border border-base-300 bg-base-100/80 p-4 shadow-sm backdrop-blur">
							<h3 class="text-base-content text-base font-semibold">Enterprise ready</h3>
							<p class="text-base-content/70 text-sm">
								SSO, device handoff, and adaptive security controls keep every login seamless.
							</p>
						</div>
						<div class="rounded-box border border-base-300 bg-base-100/80 p-4 shadow-sm backdrop-blur">
							<h3 class="text-base-content text-base font-semibold">Always synced</h3>
							<p class="text-base-content/70 text-sm">
								Magic links and password sessions stay in rhythm with your workspace cadence.
							</p>
						</div>
					</div>
				</div>
				<div class="card bg-base-100 shadow-2xl">
					<div class="card-body gap-6">
						<header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div class="space-y-1">
								<h3 class="text-base-content text-xl font-semibold">Member Access</h3>
								<p class="text-base-content/60 text-sm">
									Choose a secure path back into the workspace.
								</p>
							</div>
							<div class="join">
								<button
									type="button"
									class="btn btn-sm join-item"
									class:btn-primary={loginMode === 'signin'}
									class:btn-outline={loginMode !== 'signin'}
									onclick={() => toggleLoginMode('signin')}
								>
									Password
								</button>
								<button
									type="button"
									class="btn btn-sm join-item"
									class:btn-primary={loginMode === 'magic'}
									class:btn-outline={loginMode !== 'magic'}
									onclick={() => toggleLoginMode('magic')}
								>
									Magic link
								</button>
							</div>
						</header>
						<form class="grid gap-4" onsubmit={handleLogin}>
							<label class="form-control w-full">
								<div class="label">
									<span class="label-text">Work email</span>
								</div>
								<input
									required
									type="email"
									placeholder="alex@workspace.com"
									class="input input-bordered input-primary w-full"
									bind:value={loginForm.email}
								/>
							</label>
							{#if loginMode === 'signin'}
								<label class="form-control w-full" in:fade>
									<div class="label">
										<span class="label-text">Password</span>
										<span class="label-text-alt">
											<a class="link link-hover text-primary" href="/forgot-password">Forgot?</a>
										</span>
									</div>
									<input
										type="password"
										placeholder="Enter your password"
										class="input input-bordered w-full"
										minlength={8}
										bind:value={loginForm.password}
									/>
								</label>
								<label class="label cursor-pointer justify-start gap-3 rounded-box bg-base-200/60 px-4 py-3">
									<input
										type="checkbox"
										class="checkbox checkbox-primary"
										bind:checked={loginForm.remember}
									/>
									<span class="label-text text-sm text-base-content/80">
										Keep me signed in on this device
									</span>
								</label>
							{:else}
								<div
									class="rounded-box border border-dashed border-base-300 bg-base-200/60 p-4 text-sm text-base-content/70"
									in:fade
								>
									Instant access without a password. We will email you a one-time link that lasts 15
									minutes.
								</div>
							{/if}
							{#if loginFeedback}
								<div
									class={`alert ${loginFeedback.type === 'error' ? 'alert-error' : 'alert-success'} shadow-sm`}
									in:fade
								>
									<span>{loginFeedback.message}</span>
								</div>
							{/if}
							<button
								type="submit"
								class="btn btn-primary w-full"
								class:loading={loginLoading}
								disabled={loginLoading}
							>
								{loginMode === 'signin' ? 'Sign in' : 'Send magic link'}
							</button>
						</form>
						<div class="divider">or</div>
						<div class="grid gap-3">
							<button class="btn btn-outline btn-neutral w-full">
								Continue with company SSO
							</button>
							<button class="btn btn-ghost w-full">Use device passkey</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Responsive Product Grid</h2>
		<div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
			<article class="card bg-base-100 shadow">
				<figure class="bg-base-200">
					<img
						src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=640&q=80"
						alt="Wireless headphones"
						class="h-48 w-full object-cover"
					/>
				</figure>
				<div class="card-body gap-3">
					<h3 class="card-title text-base-content text-lg font-semibold">Aurora Headphones</h3>
					<p class="text-base-content/70 text-sm">
						Immersive sound with adaptive noise control in a lightweight frame.
					</p>
					<div class="flex items-center gap-3">
						<div class="badge badge-primary badge-lg">New</div>
						<span class="text-base-content text-lg font-semibold">$199</span>
					</div>
					<div class="card-actions justify-end">
						<button class="btn btn-primary btn-sm">Add to Cart</button>
					</div>
				</div>
			</article>
			<article class="card bg-base-100 shadow">
				<figure class="bg-base-200">
					<img
						src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&q=80"
						alt="Smart speaker"
						class="h-48 w-full object-cover"
					/>
				</figure>
				<div class="card-body gap-3">
					<h3 class="card-title text-base-content text-lg font-semibold">Pulse Speaker</h3>
					<p class="text-base-content/70 text-sm">
						360° audio with multi-room pairing and smart assistant support.
					</p>
					<div class="flex items-center gap-3">
						<div class="badge badge-secondary badge-lg">Top Rated</div>
						<span class="text-base-content text-lg font-semibold">$149</span>
					</div>
					<div class="card-actions justify-end">
						<button class="btn btn-outline btn-secondary btn-sm">View Details</button>
					</div>
				</div>
			</article>
			<article class="card bg-base-100 shadow">
				<figure class="bg-base-200">
					<img
						src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=640&q=80"
						alt="Mirrorless camera"
						class="h-48 w-full object-cover"
					/>
				</figure>
				<div class="card-body gap-3">
					<h3 class="card-title text-base-content text-lg font-semibold">Lumen Camera</h3>
					<p class="text-base-content/70 text-sm">
						Capture 4K detail with interchangeable lenses and seamless sharing.
					</p>
					<div class="flex items-center gap-3">
						<div class="badge badge-accent badge-lg">Bundle</div>
						<span class="text-base-content text-lg font-semibold">$1,249</span>
					</div>
					<div class="card-actions justify-end">
						<button class="btn btn-accent btn-sm">Preorder</button>
					</div>
				</div>
			</article>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Editorial Content Grid</h2>
		<div class="grid gap-6 lg:grid-cols-3">
			<article class="lg:col-span-2">
				<div class="card bg-base-200 shadow-none">
					<div class="card-body gap-4 lg:gap-6">
						<div class="flex flex-wrap items-center gap-3">
							<div class="badge badge-outline badge-lg">Featured Insight</div>
							<span class="text-base-content/60 text-sm">Strategy</span>
						</div>
						<h3 class="text-base-content text-2xl font-bold leading-tight">
							Designing Modular Product Narratives for Global Teams
						</h3>
						<p class="text-base-content/70 text-base">
							Create adaptable storytelling frameworks that scale across markets while preserving
							brand authenticity and measurable impact.
						</p>
						<button class="btn btn-neutral btn-sm w-full sm:w-auto">Read the Playbook</button>
					</div>
				</div>
			</article>
			<ul class="grid gap-4">
				<li class="card bg-base-100 shadow">
					<div class="card-body gap-3">
						<h4 class="card-title text-base-content text-base font-semibold">
							Rapid Workshop Toolkit
						</h4>
						<p class="text-base-content/70 text-sm">
							Align product leads in two hours with focused ideation grids.
						</p>
					</div>
				</li>
				<li class="card bg-base-100 shadow">
					<div class="card-body gap-3">
						<h4 class="card-title text-base-content text-base font-semibold">
							Persona Grid Templates
						</h4>
						<p class="text-base-content/70 text-sm">
							Standardize research output for stakeholder-ready summaries.
						</p>
					</div>
				</li>
				<li class="card bg-base-100 shadow">
					<div class="card-body gap-3">
						<h4 class="card-title text-base-content text-base font-semibold">
							Localization Matrix
						</h4>
						<p class="text-base-content/70 text-sm">
							Map messaging variants with multi-market compliance guidance.
						</p>
					</div>
				</li>
			</ul>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Team Portfolio Grid</h2>
		<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
			<article class="card bg-base-100 shadow">
				<div class="card-body items-center text-center">
					<div class="avatar">
						<div class="w-20 rounded-full">
							<img
								src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80"
								alt="Product designer"
							/>
						</div>
					</div>
					<h3 class="text-base-content text-lg font-semibold">Avery Kim</h3>
					<p class="text-base-content/60 text-sm">Product Design Lead</p>
					<div class="text-base-content/70 grid grid-cols-3 gap-2 text-xs">
						<span class="bg-base-300 rounded-full px-3 py-1">UX</span>
						<span class="bg-base-300 rounded-full px-3 py-1">UI</span>
						<span class="bg-base-300 rounded-full px-3 py-1">Systems</span>
					</div>
				</div>
			</article>
			<article class="card bg-base-100 shadow">
				<div class="card-body items-center text-center">
					<div class="avatar">
						<div class="w-20 rounded-full">
							<img
								src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=256&q=80"
								alt="Brand strategist"
							/>
						</div>
					</div>
					<h3 class="text-base-content text-lg font-semibold">Maya Cooper</h3>
					<p class="text-base-content/60 text-sm">Brand Strategist</p>
					<div class="text-base-content/70 grid grid-cols-3 gap-2 text-xs">
						<span class="bg-base-300 rounded-full px-3 py-1">Research</span>
						<span class="bg-base-300 rounded-full px-3 py-1">Positioning</span>
						<span class="bg-base-300 rounded-full px-3 py-1">Writing</span>
					</div>
				</div>
			</article>
			<article class="card bg-base-100 shadow">
				<div class="card-body items-center text-center">
					<div class="avatar">
						<div class="w-20 rounded-full">
							<img
								src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80"
								alt="Engineering manager"
							/>
						</div>
					</div>
					<h3 class="text-base-content text-lg font-semibold">Jordan Blake</h3>
					<p class="text-base-content/60 text-sm">Engineering Manager</p>
					<div class="text-base-content/70 grid grid-cols-3 gap-2 text-xs">
						<span class="bg-base-300 rounded-full px-3 py-1">APIs</span>
						<span class="bg-base-300 rounded-full px-3 py-1">Security</span>
						<span class="bg-base-300 rounded-full px-3 py-1">Delivery</span>
					</div>
				</div>
			</article>
			<article class="card bg-base-100 shadow">
				<div class="card-body items-center text-center">
					<div class="avatar">
						<div class="w-20 rounded-full">
							<img
								src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80"
								alt="Customer success lead"
							/>
						</div>
					</div>
					<h3 class="text-base-content text-lg font-semibold">Leia Howard</h3>
					<p class="text-base-content/60 text-sm">Customer Success</p>
					<div class="text-base-content/70 grid grid-cols-3 gap-2 text-xs">
						<span class="bg-base-300 rounded-full px-3 py-1">Onboarding</span>
						<span class="bg-base-300 rounded-full px-3 py-1">Insights</span>
						<span class="bg-base-300 rounded-full px-3 py-1">Retention</span>
					</div>
				</div>
			</article>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Pricing Comparison Grid</h2>
		<div class="grid gap-6 md:grid-cols-3">
			<article class="card border-base-200 bg-base-100 border">
				<div class="card-body gap-4">
					<h3 class="text-base-content text-lg font-semibold">Starter</h3>
					<p class="text-base-content/70">Launch projects with foundational collaboration tools.</p>
					<span class="text-base-content text-3xl font-bold">$29</span>
					<ul class="text-base-content/70 grid gap-2 text-sm">
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Analytics Dashboard
						</li>
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Community Support
						</li>
						<li class="flex items-center gap-2">
							<span class="badge badge-ghost badge-sm"></span>
							Automated Reports
						</li>
					</ul>
					<button class="btn btn-outline btn-primary">Choose Plan</button>
				</div>
			</article>
			<article class="card border-primary bg-base-100 border-2 shadow-lg md:scale-105">
				<div class="card-body gap-4">
					<div class="flex items-center justify-between">
						<h3 class="text-base-content text-lg font-semibold">Growth</h3>
						<div class="badge badge-primary badge-outline">Most Popular</div>
					</div>
					<p class="text-base-content/70">Scale teams with advanced automation and insights.</p>
					<span class="text-base-content text-3xl font-bold">$79</span>
					<ul class="text-base-content/70 grid gap-2 text-sm">
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Advanced Analytics
						</li>
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Dedicated Success Manager
						</li>
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Automated Reports
						</li>
					</ul>
					<button class="btn btn-primary">Start Trial</button>
				</div>
			</article>
			<article class="card border-base-200 bg-base-100 border">
				<div class="card-body gap-4">
					<h3 class="text-base-content text-lg font-semibold">Enterprise</h3>
					<p class="text-base-content/70">
						Tailored solutions with governance and enterprise support.
					</p>
					<span class="text-base-content text-3xl font-bold">Custom</span>
					<ul class="text-base-content/70 grid gap-2 text-sm">
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Infinite Workspaces
						</li>
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Compliance Suite
						</li>
						<li class="flex items-center gap-2">
							<span class="badge badge-success badge-sm"></span>
							Priority Engineering Access
						</li>
					</ul>
					<button class="btn btn-outline btn-primary">Talk to Sales</button>
				</div>
			</article>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Operational Analytics Dashboard</h2>
		<div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
			<div class="grid gap-6">
				<article class="card bg-base-100 shadow">
					<div class="card-body gap-6">
						<h3 class="text-base-content text-lg font-semibold">Key Metrics</h3>
						<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title text-base-content/60 text-sm">Monthly Revenue</div>
								<div class="stat-value text-base-content text-2xl font-bold">$482K</div>
								<div class="stat-desc text-success text-sm">▲ 8.3% vs last month</div>
							</div>
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title text-base-content/60 text-sm">Active Accounts</div>
								<div class="stat-value text-base-content text-2xl font-bold">12.4K</div>
								<div class="stat-desc text-success text-sm">▲ 4.1% net growth</div>
							</div>
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title text-base-content/60 text-sm">Support SLA</div>
								<div class="stat-value text-base-content text-2xl font-bold">94%</div>
								<div class="stat-desc text-error text-sm">▼ 2% response dip</div>
							</div>
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title text-base-content/60 text-sm">Revenue per Seat</div>
								<div class="stat-value text-base-content text-2xl font-bold">$38</div>
								<div class="stat-desc text-success text-sm">▲ 6.5% upsell lift</div>
							</div>
						</div>
					</div>
				</article>
				<article class="card bg-base-100 shadow">
					<div class="card-body gap-6">
						<div class="flex items-center justify-between">
							<h3 class="text-base-content text-lg font-semibold">Pipeline Health</h3>
							<div class="badge badge-outline badge-primary">Q3 Forecast</div>
						</div>
						<div class="grid gap-4 sm:grid-cols-3">
							<div class="bg-base-200 rounded-box grid gap-2 p-4">
								<span class="text-base-content text-sm font-semibold">Discovery</span>
								<div class="radial-progress text-primary" style="--value:72;" role="progressbar">
									72%
								</div>
								<p class="text-base-content/60 text-xs">58 deals active</p>
							</div>
							<div class="bg-base-200 rounded-box grid gap-2 p-4">
								<span class="text-base-content text-sm font-semibold">Evaluation</span>
								<div class="radial-progress text-secondary" style="--value:54;" role="progressbar">
									54%
								</div>
								<p class="text-base-content/60 text-xs">36 deals advancing</p>
							</div>
							<div class="bg-base-200 rounded-box grid gap-2 p-4">
								<span class="text-base-content text-sm font-semibold">Commit</span>
								<div class="radial-progress text-accent" style="--value:81;" role="progressbar">
									81%
								</div>
								<p class="text-base-content/60 text-xs">21 agreements pending</p>
							</div>
						</div>
						<div class="grid gap-3">
							<div class="flex items-center gap-3">
								<span class="text-base-content/70 w-24 text-sm">North America</span>
								<progress class="progress progress-primary flex-1" value="82" max="100"></progress>
								<span class="text-base-content text-sm font-semibold">82%</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-base-content/70 w-24 text-sm">EMEA</span>
								<progress class="progress progress-secondary flex-1" value="68" max="100"
								></progress>
								<span class="text-base-content text-sm font-semibold">68%</span>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-base-content/70 w-24 text-sm">APAC</span>
								<progress class="progress progress-accent flex-1" value="57" max="100"></progress>
								<span class="text-base-content text-sm font-semibold">57%</span>
							</div>
						</div>
					</div>
				</article>
				<article class="card bg-base-100 shadow">
					<div class="card-body gap-4">
						<h3 class="text-base-content text-lg font-semibold">Top Accounts</h3>
						<div class="overflow-x-auto">
							<table class="table-zebra table">
								<thead>
									<tr class="text-base-content/60 text-sm">
										<th>Company</th>
										<th>Stage</th>
										<th>ARPA</th>
										<th>Owner</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="text-base-content font-medium">Orbit Labs</td>
										<td><div class="badge badge-outline badge-success">Commit</div></td>
										<td class="text-base-content text-base font-semibold">$46K</td>
										<td class="text-base-content/70">Kim Edwards</td>
									</tr>
									<tr>
										<td class="text-base-content font-medium">Alpine Systems</td>
										<td><div class="badge badge-outline badge-warning">Evaluation</div></td>
										<td class="text-base-content text-base font-semibold">$39K</td>
										<td class="text-base-content/70">Miguel Ortiz</td>
									</tr>
									<tr>
										<td class="text-base-content font-medium">Flux Retail</td>
										<td><div class="badge badge-outline badge-info">Discovery</div></td>
										<td class="text-base-content text-base font-semibold">$33K</td>
										<td class="text-base-content/70">Rowena Hill</td>
									</tr>
									<tr>
										<td class="text-base-content font-medium">Signal Cloud</td>
										<td><div class="badge badge-outline badge-success">Commit</div></td>
										<td class="text-base-content text-base font-semibold">$28K</td>
										<td class="text-base-content/70">Jared Lin</td>
									</tr>
									<tr>
										<td class="text-base-content font-medium">Beacon Analytics</td>
										<td><div class="badge badge-outline badge-warning">Evaluation</div></td>
										<td class="text-base-content text-base font-semibold">$22K</td>
										<td class="text-base-content/70">Asha Rao</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</article>
			</div>
			<aside class="grid gap-6">
				<article class="card bg-base-100 shadow">
					<div class="card-body gap-6">
						<h3 class="text-base-content text-lg font-semibold">Weekly Revenue Flow</h3>
						<div class="grid gap-4">
							<div class="rounded-box bg-base-200 flex items-end gap-3 p-4">
								<div class="grid flex-1 gap-1 text-center">
									<div class="bg-primary h-32 rounded-t-lg"></div>
									<span class="text-base-content/60 text-xs">Mon</span>
								</div>
								<div class="grid flex-1 gap-1 text-center">
									<div class="bg-primary/90 h-40 rounded-t-lg"></div>
									<span class="text-base-content/60 text-xs">Tue</span>
								</div>
								<div class="grid flex-1 gap-1 text-center">
									<div class="bg-primary/80 h-28 rounded-t-lg"></div>
									<span class="text-base-content/60 text-xs">Wed</span>
								</div>
								<div class="grid flex-1 gap-1 text-center">
									<div class="bg-primary/70 h-36 rounded-t-lg"></div>
									<span class="text-base-content/60 text-xs">Thu</span>
								</div>
								<div class="grid flex-1 gap-1 text-center">
									<div class="bg-primary/60 h-44 rounded-t-lg"></div>
									<span class="text-base-content/60 text-xs">Fri</span>
								</div>
								<div class="grid flex-1 gap-1 text-center">
									<div class="bg-primary/50 h-24 rounded-t-lg"></div>
									<span class="text-base-content/60 text-xs">Sat</span>
								</div>
								<div class="grid flex-1 gap-1 text-center">
									<div class="bg-primary/40 h-20 rounded-t-lg"></div>
									<span class="text-base-content/60 text-xs">Sun</span>
								</div>
							</div>
							<div class="text-base-content/70 flex items-center justify-between text-sm">
								<span>Weekly Total</span>
								<span class="text-base-content font-semibold">$114K</span>
							</div>
						</div>
					</div>
				</article>
				<article class="card bg-base-100 shadow">
					<div class="card-body gap-6">
						<h3 class="text-base-content text-lg font-semibold">Customer Health Mix</h3>
						<div class="grid gap-4">
							<div class="rounded-box bg-base-200 grid gap-3 p-4 text-center">
								<div class="mx-auto w-32">
									<div
										class="radial-progress text-secondary"
										style="--value:64;"
										role="progressbar"
									>
										64% Healthy
									</div>
								</div>
								<p class="text-base-content/70 text-xs">Accounts above engagement threshold</p>
							</div>
							<ul class="text-base-content/70 grid gap-2 text-sm">
								<li class="rounded-box bg-base-200 flex items-center justify-between px-4 py-2">
									<span>GREEN · Champions</span>
									<span class="text-base-content font-semibold">46%</span>
								</li>
								<li class="rounded-box bg-base-200 flex items-center justify-between px-4 py-2">
									<span>AMBER · Monitoring</span>
									<span class="text-base-content font-semibold">32%</span>
								</li>
								<li class="rounded-box bg-base-200 flex items-center justify-between px-4 py-2">
									<span>RED · At Risk</span>
									<span class="text-base-content font-semibold">22%</span>
								</li>
							</ul>
						</div>
					</div>
				</article>
			</aside>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Interactive Engagement Grid</h2>
		<div class="card bg-base-100 shadow">
			<div class="card-body space-y-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="btn-group">
						<button
							class="btn btn-sm btn-outline"
							class:btn-active={pulseMode === 'adoption'}
							onclick={() => setPulseMode('adoption')}
						>
							New Adoption
						</button>
						<button
							class="btn btn-sm btn-outline"
							class:btn-active={pulseMode === 'retention'}
							onclick={() => setPulseMode('retention')}
						>
							Retention Cycles
						</button>
					</div>
					<button class="btn btn-sm btn-ghost" onclick={togglePulse}>
						{showPulseGrid ? 'Hide Highlights' : 'Show Highlights'}
					</button>
				</div>
				{#if showPulseGrid}
					{#key pulseMode}
						<div
							class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
							transition:fade={{ duration: 200 }}
						>
							{#each pulseSets[pulseMode] as panel (panel.id)}
								<article
									class="card bg-base-200 shadow-sm"
									in:fly={{ y: 24, duration: 220 }}
									out:fade={{ duration: 160 }}
								>
									<div class="card-body gap-4">
										<div class="badge badge-outline badge-{panel.emphasis} w-fit">
											{panel.metric}
										</div>
										<h3 class="text-base-content text-lg font-semibold">{panel.title}</h3>
										<p class="text-base-content/70 text-sm leading-relaxed">{panel.summary}</p>
										<span class="text-base-content/80 text-xs uppercase tracking-wide"
											>{panel.delta}</span
										>
									</div>
								</article>
							{/each}
						</div>
					{/key}
				{/if}
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Sortable Initiative Grid</h2>
		<div class="card bg-base-100 shadow">
			<div class="card-body space-y-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="btn-group">
						<button
							class="btn btn-sm btn-outline"
							class:btn-active={initiativeSort === 'impact'}
							onclick={() => resort('impact')}
						>
							Impact First
						</button>
						<button
							class="btn btn-sm btn-outline"
							class:btn-active={initiativeSort === 'effort'}
							onclick={() => resort('effort')}
						>
							Effort First
						</button>
					</div>
					<div class="badge badge-outline badge-primary">Order updates animate with flip</div>
				</div>
				<div class="grid gap-5 lg:grid-cols-3">
					{#each initiatives as initiative (initiative.id)}
						<article class="card bg-base-200 shadow-sm" animate:flip>
							<div class="card-body gap-4">
								<div class="flex items-center justify-between">
									<h3 class="text-base-content text-lg font-semibold">{initiative.title}</h3>
									<div class="badge badge-outline badge-secondary">{initiative.focus}</div>
								</div>
								<p class="text-base-content/70 text-sm">Owned by {initiative.owner}</p>
								<div class="space-y-3">
									<div class="grid gap-1">
										<div class="text-base-content/60 flex items-center justify-between text-xs">
											<span>Impact</span>
											<span class="text-base-content font-semibold">{initiative.impact}/10</span>
										</div>
										<progress
											class="progress progress-primary"
											value={initiative.impact * 10}
											max="100"
										></progress>
									</div>
									<div class="grid gap-1">
										<div class="text-base-content/60 flex items-center justify-between text-xs">
											<span>Effort</span>
											<span class="text-base-content font-semibold">{initiative.effort}/10</span>
										</div>
										<progress
											class="progress progress-accent"
											value={initiative.effort * 10}
											max="100"
										></progress>
									</div>
								</div>
								<div class="text-base-content/60 grid gap-2 text-xs">
									<span>Reprioritize by selecting a new lens above.</span>
									<span class="text-base-content/80">Motion courtesy of animate:flip.</span>
								</div>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Visual Storytelling Grid</h2>
		<div class="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<figure class="card image-full sm:col-span-2">
				<img
					src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
					alt="Team collaborating in studio"
				/>
				<div class="card-body justify-end">
					<h3 class="card-title text-base-100 text-lg font-semibold">Innovation Sprints</h3>
					<p class="text-base-100/80 text-sm">
						Guided workshops unlock new product angles in five days.
					</p>
				</div>
			</figure>
			<figure class="card image-full">
				<img
					src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
					alt="Developer pairing on laptop"
				/>
				<div class="card-body justify-end">
					<h3 class="card-title text-base-100 text-lg font-semibold">Engineering Partnerships</h3>
					<p class="text-base-100/80 text-sm">
						Integrated squads deliver stable releases on a weekly cadence.
					</p>
				</div>
			</figure>
			<figure class="card image-full">
				<img
					src="https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&w=600&q=80"
					alt="Designer planning wireframes"
				/>
				<div class="card-body justify-end">
					<h3 class="card-title text-base-100 text-lg font-semibold">Experience Mapping</h3>
					<p class="text-base-100/80 text-sm">
						Blueprint epic journeys through modular research syntheses.
					</p>
				</div>
			</figure>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Resource Library Grid</h2>
		<div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
			<div class="grid gap-6 md:grid-cols-2">
				<article class="card bg-base-100 shadow">
					<div class="card-body gap-3">
						<h3 class="card-title text-base-content text-lg font-semibold">
							Customer Journey Workbook
						</h3>
						<p class="text-base-content/70 text-sm">
							Map lifecycle touchpoints with pre-built stakeholder worksheets.
						</p>
						<button class="btn btn-outline btn-primary btn-sm w-full sm:w-auto">Download PDF</button
						>
					</div>
				</article>
				<article class="card bg-base-100 shadow">
					<div class="card-body gap-3">
						<h3 class="card-title text-base-content text-lg font-semibold">
							Executive Metrics Board
						</h3>
						<p class="text-base-content/70 text-sm">
							Align leadership on consistent KPIs with refresh-ready dashboards.
						</p>
						<button class="btn btn-outline btn-primary btn-sm w-full sm:w-auto"
							>Access Template</button
						>
					</div>
				</article>
				<article class="card bg-base-100 shadow md:col-span-2">
					<div class="card-body gap-3">
						<h3 class="card-title text-base-content text-lg font-semibold">
							Service Blueprint Kit
						</h3>
						<p class="text-base-content/70 text-sm">
							Visualize backstage operations and cross-team dependencies in one view.
						</p>
						<button class="btn btn-outline btn-primary btn-sm w-full sm:w-auto"
							>Launch Toolkit</button
						>
					</div>
				</article>
			</div>
			<aside class="card bg-base-200 shadow-none">
				<div class="card-body gap-4">
					<h3 class="text-base-content text-lg font-semibold">Upcoming Sessions</h3>
					<ul class="text-base-content/70 grid gap-3 text-sm">
						<li class="rounded-box bg-base-100 grid gap-1 p-4">
							<span class="text-base-content text-base font-semibold">Enterprise Design QA</span>
							<span>June 18 · Remote Clinic</span>
						</li>
						<li class="rounded-box bg-base-100 grid gap-1 p-4">
							<span class="text-base-content text-base font-semibold">Voice of Customer Forum</span>
							<span>June 25 · Hybrid Workshop</span>
						</li>
						<li class="rounded-box bg-base-100 grid gap-1 p-4">
							<span class="text-base-content text-base font-semibold">Systems Design Lab</span>
							<span>July 2 · Onsite Sprint</span>
						</li>
					</ul>
					<button class="btn btn-primary btn-sm">Reserve a Seat</button>
				</div>
			</aside>
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-base-content text-2xl font-semibold">Motion Patterns Lab</h2>
		<div class="card bg-base-100 shadow">
			<div class="card-body space-y-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="btn-group">
						<button
							class="btn btn-sm btn-outline"
							class:btn-active={motionView === 'launches'}
							onclick={() => setMotionView('launches')}
						>
							Launch Programs
						</button>
						<button
							class="btn btn-sm btn-outline"
							class:btn-active={motionView === 'experiments'}
							onclick={() => setMotionView('experiments')}
						>
							Experiment Queue
						</button>
					</div>
					<div class="flex flex-wrap items-center gap-3">
						<div class="join">
							<button
								class="btn join-item btn-sm btn-outline"
								class:btn-active={motionSort === 'progress'}
								onclick={() => sortMotion('progress')}
							>
								Momentum
							</button>
							<button
								class="btn join-item btn-sm btn-outline"
								class:btn-active={motionSort === 'alphabetical'}
								onclick={() => sortMotion('alphabetical')}
							>
								A–Z
							</button>
						</div>
						<button class="btn btn-sm btn-ghost" onclick={toggleMotionGrid}>
							{revealMotionGrid ? 'Collapse Grid' : 'Expand Grid'}
						</button>
					</div>
				</div>
				{#if revealMotionGrid}
					<div transition:slide={{ duration: 180 }}>
						{#key motionView + ':' + motionSort}
							<div
								class="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
								transition:fade={{ duration: 160 }}
							>
								{#each motionTiles as tile (tile.id)}
									<article
										class="card bg-base-200 border-base-300 border shadow-sm"
										transition:scale={{ duration: 220, start: 0.9 }}
										animate:flip={{ duration: 220 }}
									>
										<div class="card-body gap-4">
											<div class="flex items-center justify-between">
												<div class="badge badge-outline badge-primary">{tile.lane}</div>
												<div
													class="badge badge-outline"
													class:badge-success={tile.sentiment === 'momentum'}
													class:badge-info={tile.sentiment === 'steady'}
													class:badge-warning={tile.sentiment === 'attention'}
												>
													{tile.signal}
												</div>
											</div>
											<h3 class="text-base-content text-lg font-semibold leading-tight">
												{tile.title}
											</h3>
											<p class="text-base-content/70 text-sm leading-relaxed">{tile.summary}</p>
											<div class="grid gap-1">
												<div class="text-base-content/60 flex items-center justify-between text-xs">
													<span>Rollout progress</span>
													<span class="text-base-content font-semibold">{tile.progress}%</span>
												</div>
												<progress
													class="progress"
													class:progress-success={tile.sentiment === 'momentum'}
													class:progress-info={tile.sentiment === 'steady'}
													class:progress-warning={tile.sentiment === 'attention'}
													value={tile.progress}
													max="100"
												></progress>
											</div>
											<div class="text-base-content/60 text-xs">
												Switch views or resort to watch animate:flip remap the grid.
											</div>
										</div>
									</article>
								{/each}
							</div>
						{/key}
					</div>
				{:else}
					<div class="rounded-box bg-base-200 text-base-content/70 p-6 text-center" transition:fade>
						Grid transitions paused — reopen to replay the motion study.
					</div>
				{/if}
			</div>
		</div>
	</section>
</main>
