<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	type Props = {
		href: string;
		replace?: boolean;
		strict?: boolean;
		keepfocus?: boolean;
		noscroll?: boolean;
		prefetch?: boolean;
		activeClass?: string;
		tooltip?: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	};

	let {
		href,
		replace = false,
		strict = false,
		keepfocus = false,
		noscroll = false,
		prefetch = true,
		activeClass = 'active',
		tooltip,
		disabled = false,
		class: className = '',
		children
	} = $props<Props>();

	const resolvedHref = $derived(() => resolve(href));

	const isActive = $derived(() => {
		const current = page.url.pathname;
		if (strict) {
			return current === resolvedHref;
		}
		if (resolvedHref === '/') {
			return current === resolvedHref;
		}
		return current.startsWith(resolvedHref);
	});

	const combinedClass = $derived(() => {
		const classes = [className, isActive && activeClass].filter(Boolean);
		return classes.join(' ');
	});

	const handleClick = async (event: MouseEvent) => {
		if (disabled) {
			event.preventDefault();
			return;
		}

		if (
			event.defaultPrevented ||
			event.metaKey ||
			event.ctrlKey ||
			event.altKey ||
			event.shiftKey ||
			event.button !== 0
		) {
			return;
		}

		event.preventDefault();
		await goto(href, { replaceState: replace, keepfocus, noscroll });
	};
</script>

<a
	href={resolvedHref}
	on:click={handleClick}
	aria-current={isActive ? 'page' : undefined}
	aria-disabled={disabled ? 'true' : undefined}
	class={combinedClass}
	data-tip={tooltip}
	data-sveltekit-prefetch={prefetch ? '' : undefined}
>
	{@render children?.()}
</a>
