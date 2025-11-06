<script lang="ts">
</script>

<main class="grid gap-12 pb-20">
	<section class="flex flex-wrap items-end justify-between gap-6">
		<div class="flex flex-col items-start space-y-2">
			<button class="btn place-self-start p-0">Back to classes</button>
			<h1 class="text-2xl font-semibold">My Classes</h1>
		</div>
		<div>
			<button class="btn btn-ghost">Settings</button>
			<button class="btn btn-neutral">Add Student</button>
		</div>
	</section>

	<section class="flex flex-col">
		<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<div class="stats bg-base-100 shadow">
				<div class="stat">
					<div class="stat-title">Students</div>
					<div class="stat-value">3</div>
					<div class="stat-desc">Total Enrolled</div>
				</div>
			</div>
			<div class="stats bg-base-100 shadow">
				<div class="stat">
					<div class="stat-title">Teachers</div>
					<div class="stat-value">3</div>
					<div class="stat-desc">Total Enrolled</div>
				</div>
			</div>
			<div class="stats bg-base-100 shadow">
				<div class="stat">
					<div class="stat-title">Assignments</div>
					<div class="stat-value">3</div>
					<div class="stat-desc">Total Enrolled</div>
				</div>
			</div>
			<div class="stats bg-base-100 shadow">
				<div class="stat">
					<div class="stat-title">Upcoming events</div>
					<div class="stat-value">3</div>
					<div class="stat-desc">Total Enrolled</div>
				</div>
			</div>
		</div>
	</section>

	<section>
		<div class="tabs tabs-lift">
			<label class="tab">
				<input type="radio" name="my_tabs_4" checked />
				Assignment
			</label>
			<div class="tab-content bg-base-100 border-base-300 p-6">Tab content 1</div>

			<label class="tab">
				<input type="radio" name="my_tabs_4" />
				People
			</label>
			<div class="tab-content bg-base-100 border-base-300 p-6">
				<h3 class="text-lg font-semibold">Teachers</h3>
				<h3 class="text-lg font-semibold">Students</h3>
			</div>

			<label class="tab">
				<input type="radio" name="my_tabs_4" />
				Announcements
			</label>
			<div class="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
		</div>
	</section>

	<section></section>
</main>
