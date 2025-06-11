// src/routes/(admin)/+layout.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
	const {
		data: { session },
		error
	} = await supabase.auth.getSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('is_admin')
		.eq('id', session.user.id)
		.single();

	if (!profile || !profile.is_admin) {
		throw redirect(303, '/'); // Sau către o pagină de "acces interzis"
	}

	return { session, profile };
};
