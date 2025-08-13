import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { bookingSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const serviceIdParam = url.searchParams.get('serviceId');

	const form = await superValidate(
		serviceIdParam ? { serviceId: serviceIdParam } : undefined,
		zod(bookingSchema)
	);

	const servicePromise = supabase.from('services').select('*');
	return { form, streamed: { services: servicePromise.then(({ data }) => data ?? []) } };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const form = await superValidate(request, zod(bookingSchema));

		if (!form.valid) {
			console.log(form.errors, form.data)
			return fail(400, { form });
		}

		const session = await safeGetSession();

		if (!session) {
			console.log('re')
			return fail(401, { message: 'Trebuie sa fii autentificat pentru a face o programare.' });
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('full_name, phone')
			.eq('id', session.user?.id)
			.single();
		const isProfileIncomplete = !profile?.full_name || !profile?.phone;

		if (isProfileIncomplete) {
			throw redirect(303, '/cont/completeaza-profilul');
		}

		const startTime = new Date(`${form.data.date.split('T')[0]}T${form.data.time}:00.000Z`);
		const endTime = new Date(startTime.getTime() + form.data.duration * 60 * 1000);

		const newAppointment = {
			user_id: session.user?.id,
			service_id: parseInt(form.data.serviceId, 10),
			start_time: startTime.toISOString(),
			end_time: endTime.toISOString(),
			client_notes: form.data.clientNotes,
			status: 'confirmata'
		};

		const { error } = await supabase.from('appointments').insert(newAppointment);

		console.log('EROARE')


		if (error) {
			console.error('Eroare la INSERT programare:', error);
			return message(form, 'Programarea ta nu a fost confirmată! Trebuie sa fii inregistrat.');
		}

		return message(form, 'Felicitari! Te-ai programat cu sucess!');
	}
};
