import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (!user) {
		throw redirect(303, '/auth');
	}

	const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

	if (!profile || !profile.is_admin) {
		throw redirect(303, '/');
	}
};
