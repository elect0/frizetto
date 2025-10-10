import { superValidate } from 'sveltekit-superforms';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { reviewSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
	const { data: appointment, error: queryError } = await supabase
		.from('appointments')
		.select('*, profiles ( * )')
		.eq('id', params.appointmentId);

	if (queryError || !appointment) {
		throw error(500, 'a apărut o eroare la server.');
	}
	//  if(appointment?.profiles?.id !== session?.user.id ){
	//
	//    redirect(308, "/")
	//
	//  }
	//

	const form = await superValidate(zod(reviewSchema));

	return { form, appointment };
};
