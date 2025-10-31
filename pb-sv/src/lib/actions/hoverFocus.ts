import type { Attachment } from 'svelte/attachments';
import type { Readable } from 'svelte/store';

type ToggleVisibility = (value: boolean) => void;

type HoverFocusController = {
	attachment: Attachment<HTMLElement>;
	visible: Readable<boolean>;
	set(value: boolean): void;
};

/**
 * Creates an attachment that toggles a boolean callback when an element gains or loses hover/focus.
 */
export const hoverFocus = (setVisibility: ToggleVisibility): Attachment<HTMLElement> => {
	return (node) => {
		const show = () => setVisibility(true);
		const hide = () => setVisibility(false);

		node.addEventListener('mouseenter', show);
		node.addEventListener('mouseleave', hide);
		node.addEventListener('focusin', show);
		node.addEventListener('focusout', hide);

		return () => {
			node.removeEventListener('mouseenter', show);
			node.removeEventListener('mouseleave', hide);
			node.removeEventListener('focusin', show);
			node.removeEventListener('focusout', hide);
		};
	};
};

/**
 * Convenience helper that bundles a reactive visibility store with the attachment.
 */
export const createHoverFocus = (initial = false): HoverFocusController => {
	let current = initial;
	const subscribers = new Set<(value: boolean) => void>();

	const notify = (value: boolean) => {
		if (value === current) return;
		current = value;
		for (const subscriber of subscribers) {
			subscriber(current);
		}
	};

	const visible: Readable<boolean> = {
		subscribe(run) {
			run(current);
			subscribers.add(run);
			return () => subscribers.delete(run);
		}
	};

	return {
		attachment: hoverFocus((value) => notify(value)),
		visible,
		set: notify
	};
};
