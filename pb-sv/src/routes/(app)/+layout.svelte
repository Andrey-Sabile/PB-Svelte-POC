<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { setAuthContext } from '$lib/stores/auth.svelte';
	import type { LayoutProps } from './$types';
	import {
		ClipboardList,
		House,
		PanelLeftOpen,
		BookOpen,
		BookUser,
		Calendar,
		BookImage,
		Cuboid,
		NotepadText,
		type Icon as IconType
	} from '@lucide/svelte';

	type MenuItem = {
		name: string;
		href: string;
		icon: typeof IconType;
	};

	const menuItems: MenuItem[] = [
		{
			name: 'Home',
			href: '/home',
			icon: House
		},
		{
			name: 'Classes',
			href: '/classes',
			icon: BookOpen
		},
		{
			name: 'Teaching Units',
			href: '/units',
			icon: NotepadText
		},
		{
			name: 'Calendar',
			href: '/calendar',
			icon: Calendar
		},
		{
			name: 'Directory',
			href: '/directory',
			icon: BookUser
		},
		{
			name: 'Todo',
			href: '/todolist',
			icon: ClipboardList
		},
		{
			name: 'Catalogue',
			href: '/catalogue',
			icon: BookImage
		},
		{
			name: 'Components',
			href: '/inspiration',
			icon: Cuboid
		}
	];

	const auth = setAuthContext();

	$effect(() => {
		if (!auth.isSynced) return;
		if (!auth.user) goto(resolve('/login'));
	});

	const logout = async () => {
		auth.logout();
		await goto(resolve('/login'));
	};

	let { data, children }: LayoutProps = $props();
</script>

<div class="drawer-open drawer">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content p-8">
		{@render children()}
	</div>

	<div class="drawer-side is-drawer-close:overflow-visible">
		<label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div
			class="bg-base-100 is-drawer-close:w-20 is-drawer-open:w-60 flex min-h-full flex-col items-start shadow"
		>
			<a href="/" class="btn btn-ghost mt-4 self-center text-xl font-semibold">Leo</a>

			<ul class="menu mt-6 w-full grow space-y-4 p-4">
				{#each menuItems as item (item.name)}
					{@const Icon = item.icon}
					<li class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={item.name}>
						<a href={item.href} data-sveltekit-preload-data="hover">
							<Icon fill="none" stroke-width="2" class="size-5" />
							<span class="is-drawer-close:hidden">{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>

			<div class="is-drawer-close:tooltip is-drawer-close:tooltip-right m-2" data-tip="Open">
				<label
					for="app-drawer"
					class="drawer-button btn btn-circle btn-ghost is-drawer-open:rotate-y-180"
				>
					<PanelLeftOpen fill="none" stroke-width="2" class="size-5" />
				</label>
			</div>
			<button onclick={logout}>Logout</button>
		</div>
	</div>
</div>
