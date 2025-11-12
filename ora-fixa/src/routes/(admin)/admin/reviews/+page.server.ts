import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: reviews, error: reviewsError } = await supabase
		.from('reviews')
		.select('*, profiles( full_name, phone )')
		.order('created_at', { ascending: true });

	if (reviewsError) {
		throw error(500, 'Internal server error');
	}

	return { reviews, pageTitle: "Reviews" };
};

export const actions = {
	deleteReview: async ({ request, locals: { supabase } }) => {
		const data = await request.formData();
		const id = data.get('reviewId');

		if (!id) return fail(400, { message: 'ID-ul review-ului lipsește.' });

		const { error } = await supabase.from('reviews').delete().eq('id', id);

		if (error) {
			return fail(500, { message: 'Review-ul nu a putut fi blocat cu succes.' });
		}

		return { success: true };
	}
} satisfies Actions;
