import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: reviews, error: reviewsError } = await supabase
		.from('reviews')
		.select('*, profiles( full_name, phone )')
		.order('created_at', { ascending: true });


  console.log(reviewsError)
	if (reviewsError) {
		throw error(500, 'Internal server error');
	}

	return { reviews };
};
