import { fail, message, superValidate } from 'sveltekit-superforms';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { reviewSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
	const { data: appointment, error: queryError } = await supabase
		.from('appointments')
		.select('*')
		.eq('id', params.appointmentId)
		.single();

	if (queryError || !appointment) {
		throw error(500, 'a apărut o eroare la server.');
	}

	const { data: existingReview } = await supabase
		.from('reviews')
		.select('id')
		.eq('appointment_id', appointment.id)
		.maybeSingle();

	if (existingReview) {
		redirect(308, '/cont/programari');
	}

	if (appointment.user_id !== session?.user.id) {
		redirect(308, '/cont');
	}

	const form = await superValidate(zod(reviewSchema));

	return { form, appointment };
};

export const actions = {
	review: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(reviewSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const reviewData = {
			user_id: form.data.userId,
			appointment_id: form.data.appointmentId,
			content: form.data.reviewContent,
			mood: form.data.mood
		};

		const { error: queryError } = await supabase.from('reviews').insert(reviewData);

		if (queryError) {
			return message(form, 'Recenzia nu a putut fi trimisă cu succes.', {
				status: 500
			});
		}

		return message(form, 'Recenzia a fost trimisă cu succes.');
	}
} satisfies Actions;
