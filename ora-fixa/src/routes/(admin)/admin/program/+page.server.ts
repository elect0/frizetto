import { fail, message } from 'sveltekit-superforms';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad, Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { deleteScheduleOverrideSchema, scheduleOverrideSchema } from '$lib/schemas';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	const { data: workSchedules } = await supabase
		.from('work_schedules')
		.select('*')
		.order('day_of_week');
	const { data: scheduleOverrides } = await supabase.from('schedule_overrides').select('*');

	const overrideForm = await superValidate(zod(scheduleOverrideSchema));

	return {
		workSchedules,
		scheduleOverrides: scheduleOverrides || [],
		overrideForm,
		session,
		pageTitle: 'Program'
	};
};

export const actions: Actions = {
	updateWeeklySchedule: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const schedulesToSave = [];

		for (let i = 1; i <= 7; i++) {
			const isActive = formData.get(`is_active_${i}`);
			schedulesToSave.push({
				day_of_week: i,
				is_active: isActive ?? false,
				start_time:
					isActive && formData.get(`start_time_${i}`)
						? formData.get(`start_time_${i}`)
						: '12:00:00',
				end_time:
					isActive && formData.get(`end_time_${i}`) ? formData.get(`end_time_${i}`) : '12:00:00'
			});
		}

		const { error } = await supabase
			.from('work_schedules')
			.upsert(schedulesToSave, { onConflict: 'day_of_week' });

		if (error) return fail(500, { message: 'Eroare la salvarea programului standard.' });

		return { success: true };
	},
	setScheduleOverride: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(scheduleOverrideSchema));

		if (!form.valid) return fail(400, { form });

		const { date, isActive, startTime, endTime } = form.data;

		const { error } = await supabase.from('schedule_overrides').upsert(
			{
				date: date,
				is_active: isActive,
				start_time: startTime || '12:00:00',
				end_time: endTime || '12:00:00'
			},
			{ onConflict: 'date' }
		);

		console.log(error);

		if (error) return message(form, 'A apărut o eroare la salvarea excepției.', { status: 500 });

		return message(form, 'Excepția a fost salvată cu succes!');
	},
	deleteOverride: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(deleteScheduleOverrideSchema));

    console.log(form.data)

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('schedule_overrides').delete().eq('id', form.data.id);

    console.log(error)

    if (error) return message(form, 'A apărut o eroare la ștergerea excepției.', { status: 500 });

		return message(form, 'Excepția a fost ștearsă cu succes!');
	}
};
