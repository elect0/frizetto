import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session, user, isAdmin}, cookies }) => {
	return {
		session,
		isAdmin,
		user,
		cookies: cookies.getAll()
	};
};
