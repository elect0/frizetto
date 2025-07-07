import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = locals;

	if (user?.role !== 'admin') {
		error(403, { message: 'Acces interzis. Autentificare necesară.' });
	}
};
