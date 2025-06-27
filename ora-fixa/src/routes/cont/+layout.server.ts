import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { supabase, safeGetSession },
	cookies,
	url
}) => {
	const { session } = await safeGetSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('full_name, phone')
		.eq('id', session.user.id)
		.single();

	const isOnCompletePage = url.pathname === '/cont/completeaza-profilul';

	const isProfileIncomplete = !profile?.full_name || !profile?.phone;

	if (isProfileIncomplete && !isOnCompletePage) {
		throw redirect(303, '/cont/completeaza-profilul');
	}

	if (!isProfileIncomplete && isOnCompletePage) {
		throw redirect(303, '/cont/programari');
	}

	return {
		session,
		cookies: cookies.getAll()
	};
};
