import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	const { isAdmin, session, user } = locals;
	return { isAdmin, session, user };
};
