import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user, isAdmin } = locals;

	if (!isAdmin || !user) {
		error(403, { message: 'Acces interzis. Autentificare necesară.' });
	}

	return {
		session,
		user,
		isAdmin,
	}
};
