<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let showModal = $state(false);
</script>

<main class="grid gap-12 pb-20">
	<section class="flex justify-between align-middle">
		<div class="space-y-6">
			<h1 class="text-2xl font-semibold">Student Directory</h1>
			<p class="text-sm text-base-content/70">X amount of students</p>
		</div>
		<div class="flex gap-6">
			<button class="btn">Export</button>
			<button class="btn">Export</button>
		</div>
	</section>

	<section class="flex">
		<input
			type="search"
			class="w-full self-center rounded-xl border-base-300 bg-base-100 text-sm outline-none focus:border-neutral-50 focus:ring-neutral-content"
		/>
		<button class="btn">All Grades</button>
		<button class="btn">Grade 1</button>
		<button class="btn">Grade 2</button>
	</section>

	<section>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<div
				class="card border-base-100 bg-base-100 shadow hover:cursor-pointer hover:shadow-md"
				onclick={(showModal = true)}
			>
				<div class="card-body">
					<div class="flex items-start justify-start space-x-3">
						<div class="avatar avatar-placeholder">
							<div class="w-16 rounded-full bg-neutral text-neutral-content">
								<span class="text-3xl">D</span>
							</div>
						</div>

						<div class="flex flex-col">
							<p class="text-lg">Student Name</p>
							<p class="text-sm text-base-content/70">student.name@email.com</p>
							<span class="mt-2 badge badge-neutral">Grade 2</span>
						</div>
					</div>

					<div class="mt-6 space-y-3">
						<div>
							<p class="text-sm font-light">Classes</p>
							<span class="badge badge-outline badge-neutral">Grade 2</span>
							<span class="badge badge-outline badge-neutral">Grade 2</span>
							<span class="badge badge-outline badge-neutral">Grade 2</span>
						</div>
						<div>
							<p class="text-sm font-light">Guardians</p>
							<div class="flex">
								<p class="text-sm">Parent Name</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<dialog class="modal p-0" open={showModal}>
	<div class="modal-box p-2">
		<form method="dialog">
			<button
				class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
				onclick={(showModal = false)}>✕</button
			>
		</form>

		<div class="card">
			<div class="card-body">
				<div class="flex items-start justify-start space-x-3">
					<div class="avatar avatar-placeholder">
						<div class="w-16 rounded-full bg-neutral text-neutral-content">
							<span class="text-3xl">D</span>
						</div>
					</div>

					<div class="flex flex-col">
						<p class="text-lg">Student Name</p>
						<p class="text-sm text-base-content/70">student.name@email.com</p>
						<span class="mt-2 badge badge-neutral">Grade 2</span>
					</div>
				</div>

				<div class="mt-6 space-y-3">
					<div>
						<p class="text-sm font-light">Classes</p>
						<span class="badge badge-outline badge-neutral">Grade 2</span>
						<span class="badge badge-outline badge-neutral">Grade 2</span>
						<span class="badge badge-outline badge-neutral">Grade 2</span>
					</div>
					<div>
						<p class="text-sm font-light">Guardians</p>
						<div class="flex">
							<p class="text-sm">Parent Name</p>
						</div>
					</div>
				</div>
				<div class="mt-2 card-actions">
					<button class="btn w-full btn-neutral">Send Message</button>
				</div>
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={(showModal = false)}>close</button>
	</form>
</dialog>
