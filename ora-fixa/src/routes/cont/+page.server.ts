import { redirect, error, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { passwordSchema, preferencesSchema, accountSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		throw redirect(303, '/login');
	}

	const profilePromise = supabase
		.from('profiles')
		.select('*, services(name, id)')
		.eq('id', session.user.id)
		.single();

	const statsPromise = supabase.rpc('get_user_stats', { p_user_id: session.user.id }).single();

	const nextAppointmentPromise = supabase
		.from('appointments')
		.select('*, services (name, duration_minutes, price)')
		.eq('user_id', session.user?.id)
		.eq('status', 'confirmata')
		.gt('start_time', new Date().toISOString())
		.order('start_time', { ascending: true })
		.limit(1)
		.maybeSingle();

	const [
		{ data: profile, error: profileError },
		{ data: stats, error: statsError },
		{ data: nextAppointment, error: appointmentError }
	] = await Promise.all([profilePromise, statsPromise, nextAppointmentPromise]);


	if (profileError || statsError || appointmentError) {
		throw error(500, 'Nu am putut incarca profilul tau.');
	}

	const profileForm = await superValidate(profile, zod(accountSchema), { id: 'profile' });
	const passwordForm = await superValidate(zod(passwordSchema), { id: 'password' });
	const preferencesForm = await superValidate(profile, zod(preferencesSchema), {
		id: 'preferences'
	});

	const loyaltyStats = {
		name: profileForm.data.full_name,
		memberSince: session.user.created_at,
		totalSpent: stats?.total_spent || 0,
		totalVisits: stats?.total_visits || 0,
		status:
			(stats?.total_visits || 0) > 10
				? 'Diamant'
				: (stats?.total_visits || 0) > 5
					? 'Aur'
					: 'Argint'
	};

	return {
		profileForm,
		passwordForm,
		preferencesForm,
		nextAppointment,
		loyaltyStats,
		favoriteService: profile.services
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
		const form = await superValidate(request, zod(accountSchema), { id: 'profile' });
		if (!form.valid) return fail(400, { form });

		const { session } = await safeGetSession();
		if (!session) throw redirect(303, '/login');

		const { error } = await supabase
			.from('profiles')
			.update({
				full_name: form.data.full_name,
				phone: form.data.phone,
				notes: form.data.notes
			})
			.eq('id', session.user?.id);

		if (error) return message(form, 'Profilul nu a putut fi actualizat.');

		return message(form, 'Profilul tau a fost actualizat cu succes.');
	},
	updatePassword: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(passwordSchema), { id: 'password' });
		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.auth.updateUser({ password: form.data.newPassword });
		if (error) return message(form, `Eroare: ${error.message}`, { status: 500 });
		return message(form, 'Parola a fost schimbată cu succes!');
	},
	updatePreferences: async ({ request, locals: { supabase, safeGetSession } }) => {
		const form = await superValidate(request, zod(preferencesSchema), { id: 'preferences' });
		if (!form.valid) return fail(400, { form });

		const { session } = await safeGetSession();
		if (!session) throw redirect(303, '/login');

		const { error } = await supabase
			.from('profiles')
			.update({
				notify_email_confirmation: form.data.notify_email_confirmation,
				notify_sms_reminder: form.data.notify_sms_reminder,
				marketing_opt_in: form.data.marketing_opt_in
			})
			.eq('id', session.user?.id);

		if (error) return message(form, 'A apărut o eroare.', { status: 500 });
		return message(form, 'Preferințele au fost salvate!');
	}
};
