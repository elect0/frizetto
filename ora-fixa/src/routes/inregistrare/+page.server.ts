import { registerSchema } from '$lib/schemas';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

import { message, superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	const form = await superValidate(zod(registerSchema));
	return { form, session };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(registerSchema));

		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			return fail(500, { form, message: 'Could not create user. Please try again.' });
		}

		return message(form, 'Contul tau a fost creat cu succes! Ai primit detaliile pe email.');
	}
};
