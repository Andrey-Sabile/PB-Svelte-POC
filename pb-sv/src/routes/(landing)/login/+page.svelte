<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginUser } from '$lib/stores/auth';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let form = $state({ email: '', password: '', error: '' });
	let loading = $state(false);

	const handleLogin = async (event: SubmitEvent) => {
		event.preventDefault();
		form.error = '';
		loading = true;

		try {
			await loginUser(form.email, form.password);
			await goto('/todolist');
		} catch (error) {
			form.error = 'Invalid email or password';
		} finally {
			loading = false;
		}
	};
</script>

<main class="hero bg-base-200 px-4 py-16">
	<div class="hero-content w-full flex-col gap-12 lg:flex-row">
		<div class="card bg-base-100 w-full max-w-md shadow">
			<div class="card-body gap-6">
				<header class="space-y-2 text-center">
					<h2 class="text-2xl font-semibold">Welcome Back</h2>
				</header>

				<form class="grid gap-4" onsubmit={handleLogin}>
					<label class="form-control w-full">
						<input
							class="input w-full"
							type="email"
							placeholder="email"
							bind:value={form.email}
							required
						/>
					</label>

					<label class="form-control w-full">
						<span class="label-text-alt"> </span>
						<input
							class="input input-bordered w-full"
							type="password"
							placeholder="Enter your password"
							bind:value={form.password}
							required
						/>
					</label>

					<div class="flex items-center justify-between">
						<label class="label cursor-pointer gap-3 p-0">
							<input type="checkbox" class="checkbox" />
							<span class="label-text text-base-content/70 text-sm">Remember this device</span>
						</label>
						<a class="link link-hover" href="/forgot-password">Forgot?</a>
					</div>

					{#if form.error}
						<div class="alert alert-error">
							<span>{form.error}</span>
						</div>
					{/if}

					<button class="btn btn-neutral w-full" type="submit" disabled={loading}>
						{loading ? 'Logging in…' : 'Log in'}
					</button>
				</form>

				<div class="divider">or</div>
				<button class="btn btn-outline btn-neutral w-full" type="button">
					Continue with company SSO
				</button>
			</div>
		</div>
	</div>
</main>
