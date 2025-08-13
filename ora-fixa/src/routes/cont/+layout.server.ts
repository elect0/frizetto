import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals,
	url
}) => {
	const { session, supabase, user, isAdmin } = locals

	const { data: profile } = await supabase
		.from('profiles')
		.select('full_name, phone')
		.eq('id', session?.user.id)
		.single();

	const isOnCompletePage = url.pathname === '/cont/completeaza-profilul';

	const isProfileIncomplete = !profile?.full_name || !profile?.phone;

	 console.log(profile)

	if (isProfileIncomplete && !isOnCompletePage) {
		throw redirect(303, '/cont/completeaza-profilul');
	}

	if (!isProfileIncomplete && isOnCompletePage) {
		throw redirect(303, '/cont/');
	}

	return {
		session,
		user,
		isAdmin,
	};
};
