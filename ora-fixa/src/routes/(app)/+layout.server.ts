import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals: { session, user, isAdmin}, cookies }) => {
	return {
		session,
		isAdmin,
		user,
		cookies: cookies.getAll()
	};
};
