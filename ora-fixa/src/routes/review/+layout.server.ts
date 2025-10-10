import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, supabase, user} = locals;

	const { data: profile } = await supabase
		.from('profiles')
		.select('full_name, phone')
		.eq('id', session?.user.id)
		.single();


	const isProfileIncomplete = !profile?.full_name || !profile?.phone;

	if (isProfileIncomplete) {
    throw redirect(303, '/cont/completeaza-profilul');	
  }

	return {
		session,
		user,
	};
}

