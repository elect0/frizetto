import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	return {
		session,
		cookies: cookies.getAll()
	};
};
