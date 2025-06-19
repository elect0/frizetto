import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad, Actions } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();
	return {
		session,
		cookies: cookies.getAll()
	};
};
