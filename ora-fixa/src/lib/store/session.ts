import { writable } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';

function createSessionStore() {
	const { subscribe, set } = writable<Session | null>(null);

	return {
		subscribe,
		setSession: (session: Session | null) => set(session),
		clear: () => set(null)
	};
}

export const session = createSessionStore();
