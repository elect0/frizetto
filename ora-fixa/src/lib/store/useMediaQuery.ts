import { readable } from 'svelte/store';

function useMediaQuery(query: string) {
	if (typeof window === 'undefined') {
		return readable(false);
	}

	const mediaQuery = window.matchMedia(query);

	return readable(mediaQuery.matches, (set) => {
		const handler = (event: MediaQueryListEvent) => set(event.matches);
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});
}

export const isMobile = useMediaQuery('(max-width: 768px)');
