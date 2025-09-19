import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addServiceSchema, updateServiceSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	const addServiceForm = await superValidate(zod(addServiceSchema));

	const { data: services, error: servicesError } = await supabase.rpc('get_service_popularity');

	if (servicesError) {
		throw error(500, 'A apărut o eroare la server.');
	}

	return {
		services,
		addServiceForm,
		session,
		pageTitle: 'Servicii'
	};
};

export const actions: Actions = {
	updateService: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(updateServiceSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: serviceError } = await supabase
			.from('services')
			.update({
				name: form.data.name,
				description: form.data.description,
				price: form.data.price,
				duration_minutes: form.data.duration
			})
			.eq('id', parseInt(form.data.serviceId));

		if (serviceError) {
			return fail(400, { message: 'A apărut o eroare la server.' });
		}

		return { form };
	},

	addService: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(addServiceSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: serviceError } = await supabase.from('services').insert({
			name: form.data.name,
			description: form.data.description,
			price: form.data.price,
			duration_minutes: form.data.duration
		});

		if (serviceError) {
			return fail(400, { message: 'A apărut o eroare la server.' });
		}

		return { form };
	}
};
