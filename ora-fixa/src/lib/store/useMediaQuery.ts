import { readable } from 'svelte/store';

// Funcția ta useMediaQuery
function useMediaQuery(query: string) {
	// Verificarea 'browser-only' este deja în funcție, dar o adăugăm și aici pentru siguranță.
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

// Aici creăm store-ul pe care îl vom folosi în toată aplicația.
// 768px este un breakpoint standard pentru tablete/mobil.
export const isMobile = useMediaQuery('(max-width: 768px)');
