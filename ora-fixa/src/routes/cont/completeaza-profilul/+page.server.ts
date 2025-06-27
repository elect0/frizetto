import { message, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { profileSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({}) => {
	const form = await superValidate(zod(profileSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.clone().formData();
		const dataAsObject = Object.fromEntries(formData);

		console.log('🕵️‍♂️ [SERVER] Am primit acest pachet de date brut:', dataAsObject);
		// ==========================================================

		const form = await superValidate(request, zod(profileSchema));
		console.log(form);
		const session = await safeGetSession();

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error, count } = await supabase
			.from('profiles')
			.update({
				full_name: form.data.fullName,
				phone: form.data.phoneNumber
			})
			.eq('id', session.user?.id);

		if (error) {
			return fail(400, { form });
		}

		console.log(count);

		return message(form, 'Detaliile contului tau au fost modificate cu succes!');
	}
};
