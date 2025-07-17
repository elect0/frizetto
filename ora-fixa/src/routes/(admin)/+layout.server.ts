import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, supabase } = locals;


	const {data: user, error: userError} = await supabase.from('profiles').select('*').eq('id', session?.user.id).single()

	if (!user?.is_admin || userError) {
		error(403, { message: 'Acces interzis. Autentificare necesară.' });
	}
};
