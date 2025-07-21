import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	return {
		session,
		user,
		cookies: cookies.getAll()
	};
};
