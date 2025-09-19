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
		const form = await superValidate(request, zod(profileSchema));

		const session = await safeGetSession();

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase
			.from('profiles')
			.update({
				full_name: form.data.fullName,
				phone: form.data.phoneNumber
			})
			.eq('id', session.user?.id);

		if (error) {
			return fail(400, { form });
		}

		return message(form, 'Detaliile contului tau au fost modificate cu succes!');
	}
};
