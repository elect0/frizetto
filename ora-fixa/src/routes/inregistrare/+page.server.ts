import { registerSchema } from '$lib/schemas';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

import { superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(registerSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(registerSchema));
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

		console.log('Account created');
		return { form, message: 'Account created! Please check your email.' };
	}
};
