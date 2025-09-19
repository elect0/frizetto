import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { setMonth, endOfMonth, startOfMonth } from 'date-fns';
import { superValidate, message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { updateAppointmentSchema, updateStatusSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ locals: { supabase, session }, url }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const monthIndex = Number(url.searchParams.get('month') ?? new Date().getMonth() + 1);
	const limit = 60;
	const offset = (page - 1) * limit;

	const baseDate = setMonth(new Date(), monthIndex - 1);
	const startTime = startOfMonth(baseDate);
	const endTime = endOfMonth(baseDate);

	const { data, error: appointmentsError } = await supabase
		.from('appointments')
		.select(
			`id,
				start_time,
				end_time,
				status,
				client_notes,
				profiles ( id, full_name, phone, notes ),
				services ( id, name, duration_minutes, price )`
		)
		.gte('start_time', startTime.toISOString())
		.lte('end_time', endTime.toISOString())
		.order('start_time', { ascending: true })
		.range(offset, offset + limit - 1);

	if (appointmentsError) {
		throw error(500, 'A apărut o eroare la server.');
	}

	return {
		appointments: data ?? [],
		currentPage: page,
		session,
		pageTitle: 'Programări'
	};
};

export const actions: Actions = {
	updateAppointment: async ({ request, locals: { supabase, isAdmin } }) => {
		if (!isAdmin) {
			throw redirect(303, '/login');
		}

		const updateAppointmentForm = await superValidate(request, zod(updateAppointmentSchema));

		if (!updateAppointmentForm.valid) {
			return fail(400, {
				updateAppointmentForm
			});
		}

		const startTime = new Date(
			`${updateAppointmentForm.data.date.split('T')[0]}T${updateAppointmentForm.data.time}:00.000Z`
		);
		const endTime = new Date(startTime.getTime() + updateAppointmentForm.data.duration * 60 * 1000);

		const { error } = await supabase
			.from('appointments')
			.update({
				service_id: updateAppointmentForm.data.serviceId,
				start_time: startTime.toISOString(),
				end_time: endTime.toISOString(),
				status: updateAppointmentForm.data.status
			})
			.eq('id', updateAppointmentForm.data.appointmentId);

		if (error) {
			return fail(500, {
				updateAppointmentForm
			});
		}

		return message(updateAppointmentForm, 'Programarea a fost modificată cu succes!');
	},
	updateStatus: async ({ request, locals: { supabase, isAdmin } }) => {
		if (!isAdmin) {
			throw redirect(303, '/login');
		}

		const updateStatusForm = await superValidate(request, zod(updateStatusSchema));

		if (!updateStatusForm.valid) {
			return fail(400, {
				updateStatusForm
			});
		}

		const { error } = await supabase
			.from('appointments')
			.update({
				status: updateStatusForm.data.status
			})
			.eq('id', updateStatusForm.data.appointmentId);

		if (error) {
			return fail(500, {
				updateStatusForm
			});
		}

		return message(updateStatusForm, 'Statusul a fost modificat cu succes!');
	}
};
