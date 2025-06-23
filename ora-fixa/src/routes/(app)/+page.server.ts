import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { bookingSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const form = await superValidate(zod(bookingSchema));

	const { data: services, error } = await supabase.from('services').select('*');
	if (error) {
		console.error('Eroare la preluarea serviciilor:', error);
		return { services: [] }; // Returnează un array gol în caz de eroare
	}

	console.log('✅ [SERVER LOG]: Formularul creat pe server este:', form);

	return { form, services: services ?? [] };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const form = await superValidate(request, zod(bookingSchema));

		console.log('PULA', form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await safeGetSession();

		if (!session) {
			return fail(401, { message: 'Trebuie sa fii autentificat pentru a face o programare.' });
		}

		// const formData = await request.formData();
		// const serviceId = formData.get('serviceId') as string;
		// const startTimeISO = formData.get('startTime') as string;
		// const durationStr = formData.get('duration') as string;
		// const hasAgreed = formData.get('hasAgreedToPolicy');

		const startTime = new Date(form.data.startTime);
		const endTime = new Date(startTime.getTime() + form.data.duration * 60 * 1000);

		const newAppointment = {
			user_id: session.user?.id,
			service_id: form.data.serviceId,
			start_time: startTime.toISOString(),
			end_time: endTime.toISOString(),
			status: 'confirmed'
		};

		const { error } = await supabase.from('appointments').insert(newAppointment);
		if (error) {
			console.error('Eroare la INSERT programare:', error);
			return fail(500, {
				message:
					'A apărut o eroare la salvarea programării. Este posibil ca intervalul să fi fost ocupat. Te rugăm să încerci din nou.'
			});
		}

		throw redirect(303, '/programarile-mele');
	}
};
