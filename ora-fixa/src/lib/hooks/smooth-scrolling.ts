import type { Action } from 'svelte/action';

interface SmoothScrollOptions {
	offset?: number;
}

export const smoothscroll: Action<HTMLAnchorElement, SmoothScrollOptions> = (
	node,
	options
) => {
	const handleClick = (event: MouseEvent) => {
		event.preventDefault();

		const targetId = node.href.split('#')[1];
		if (!targetId) return;

		const targetElement = document.getElementById(targetId);
		if (!targetElement) return;

		const offset = options?.offset || 0;
		const targetPosition =
			targetElement.getBoundingClientRect().top + window.scrollY - offset;

		window.scrollTo({
			top: targetPosition,
			behavior: 'smooth'
		});
	};

	node.addEventListener('click', handleClick, true);

	return {
		destroy() {
			node.removeEventListener('click', handleClick, true);
		},
		update(newOptions) {
			options = newOptions;
		}
	};
};