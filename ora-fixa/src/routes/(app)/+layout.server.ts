import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession }, cookies }) => {
	const { session, user} = await safeGetSession();
	const test = await supabase.auth.getUser()
	console.log(test.data.user?.user_metadata)
	return {
		session,
		user,
		cookies: cookies.getAll()
	};
};
