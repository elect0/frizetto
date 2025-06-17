import { readable } from 'svelte/store';
import type { AuthSession } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export const session = readable<AuthSession | null>(null, (set) => {
	supabase.auth.getSession().then(({ data: { session } }) => {
		set(session);
	});

	const {
		data: { subscription }
	} = supabase.auth.onAuthStateChange((_event, session) => {
		set(session);
	});

	return () => {
		subscription.unsubscribe();
	};
});
