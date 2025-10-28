<script lang="ts">
	import pb from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let form = $state({ email: '', password: '', error: '' });
	let loading = $state(false);

	const login = async () => {
		form.error = '';
		loading = true;

		try {
			await pb.collection('users').authWithPassword(form.email, form.password);
			await goto('/todolist');
		} catch (error) {
			form.error = 'Invalid email or password';
		} finally {
			loading = false;
		}
	};
</script>

<!--Create a Login Page Form-->
<form onsubmit={login}>
	<label class="form-control">
		<input type="email" bind:value={form.email} required />
	</label>

	<label class="form-control">
		<span class="label-text">Password</span>
		<input type="password" bind:value={form.password} required />
	</label>

	{#if form.error}
		<p class="text-error">{form.error}</p>
	{/if}

	<button class="btn btn-primary" type="submit" disabled={loading}>
		{loading ? 'Logging in…' : 'Log in'}
	</button>
</form>
