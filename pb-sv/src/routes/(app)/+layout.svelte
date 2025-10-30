<script lang="ts">
	import pb, { clearPocketBaseAuth } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authState } from '$lib/stores/auth';
	import type { LayoutProps } from './$types';
	import { ClipboardList, PanelLeftOpen } from '@lucide/svelte';

	let unsub: () => void;

	onMount(() => {
		const check = ({ isValid }: { isValid: boolean }) => {
			if (!isValid) {
				goto(resolve('/login'));
			}
		};

		unsub = authState.subscribe(check);

		return () => {
			unsub?.();
		};
	});

	const logout = async () => {
		clearPocketBaseAuth();
		await goto(resolve('/login'));
	};

	let { data, children }: LayoutProps = $props();
</script>

<div class="drawer drawer-open">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		{@render children()}
	</div>

	<div class="drawer-side is-drawer-close:overflow-visible">
		<label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div
			class="is-drawer-close:w-20 is-drawer-open:w-50 bg-base-100 flex min-h-full flex-col items-start"
		>
			<a href="" class="btn btn-ghost mt-4 self-center text-xl font-semibold">Leo</a>

			<ul class="menu mt-6 w-full grow p-4">
				<li>
					<a
						href="todolist"
						class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
						data-tip="Homepage"
					>
						<ClipboardList fill="none" stroke-width="2" class="size-5"></ClipboardList>
						<span class="is-drawer-close:hidden">Todo List</span>
					</a>
				</li>

				<li>
					<a
						href=""
						class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
						data-tip="Settings"
					>
						<ClipboardList fill="none" stroke-width="2" class="size-5"></ClipboardList>

						<span class="is-drawer-close:hidden">Settings</span>
					</a>
				</li>
			</ul>

			<div class="is-drawer-close:tooltip is-drawer-close:tooltip-right m-2" data-tip="Open">
				<label
					for="app-drawer"
					class="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180"
				>
					<PanelLeftOpen fill="none" stroke-width="2" class="size-5" />
				</label>
			</div>
			<button onclick={logout}>Logout</button>
		</div>
	</div>
</div>
