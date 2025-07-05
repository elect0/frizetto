import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const session = await safeGetSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	const appointmentsPromise = supabase
		.from('appointments')
		.select('*, services(*)')
		.eq('user_id', session.user?.id)
		.order('start_time', { ascending: false });

	const profilePromise = supabase
		.from('profiles')
		.select('favorite_service_id')
		.eq('id', session.user?.id)
		.single();

	// Așteptăm ambele promisiuni
	const [{ data: allAppointments }, { data: profile }] = await Promise.all([
		appointmentsPromise,
		profilePromise
	]);

	if (!allAppointments) {
		console.error('Eroare la preluarea programărilor:');
		throw error(500, 'Nu am putut încărca programările tale.');
	}

	const now = new Date();

	const upcomingAppointments = allAppointments?.filter(
		(app) => new Date(app.start_time) > now && app.status === 'confirmata'
	);

	const pastAppointments = allAppointments?.filter(
		(app) =>
			new Date(app.start_time) <= now ||
			['finalizata', 'anulata', 'neprezentat'].includes(app.status)
	);

	// console.log('Upcoming Appointments:', upcomingAppointments);
	// console.log('Past Appointments:', pastAppointments);
	console.log(profile?.favorite_service_id);

	return {
		upcomingAppointments,
		pastAppointments,
		favoriteServiceId: profile?.favorite_service_id
	};
};

export const actions: Actions = {
	cancel: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session) {
			return fail(401, { message: 'Nu ești autorizat.' });
		}

		const formData = await request.formData();
		const appointmentId = formData.get('appointmentId') as string;
		console.log(appointmentId, 'APP');

		if (!appointmentId) {
			return fail(400, { message: 'ID-ul programarii lipseste.' });
		}

		const { data: appointment, error: checkError } = await supabase
			.from('appointments')
			.select('id')
			.eq('id', appointmentId)
			.eq('user_id', session.user?.id)
			.single();

		if (checkError || !appointment) {
			return fail(403, { message: 'Nu ai permisiunea să anulezi această programare.' });
		}

		const { error: updateError } = await supabase
			.from('appointments')
			.update({ status: 'anulata' })
			.eq('id', appointmentId);

		if (updateError) {
			return fail(500, { message: 'A apărut o eroare la anularea programării.' });
		}

		return { success: true };
	},
	rebook: async ({ request }) => {
		const formData = await request.formData();
		const serviceId = formData.get('serviceId') as string;

		if (!serviceId) {
			return fail(400, { message: 'ID-ul serviciului lipsește.' });
		}

		throw redirect(303, `/?serviceId=${serviceId}#booking`);
	},
	setFavorite: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session) {
			return fail(401, { message: 'Nu ești autorizat.' });
		}

		const formData = await request.formData();
		const serviceId = formData.get('serviceId') as string;

		if (!serviceId) {
			return fail(400, { message: 'ID-ul serviciului lipsește.' });
		}
		const { error } = await supabase
			.from('profiles')
			.update({ favorite_service_id: serviceId })
			.eq('id', session.user?.id);

		if (error) {
			console.error('Eroare la setarea serviciului favorit:', error);
			return fail(500, { message: 'A apărut o eroare. Te rugăm să încerci din nou.' });
		}
		return { success: true };
	}
};
