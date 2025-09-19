import { LoginSchema } from '$lib/schemas';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

import { superValidate } from 'sveltekit-superforms';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	const form = await superValidate(zod(LoginSchema));
	return { form, session, pageTitle: 'Autentificare' };
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(LoginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			return fail(500, { form, message: 'Could not login in user. Please try again.' });
		}

		return message(form, 'Te-ai autentificat cu succes!');
	}
} satisfies Actions;
