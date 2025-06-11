// import type { PageServerLoad, Actions } from './$types';
import type { ActionData } from './$types';
import { fail, error as SvelteKitError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: workSchedules, error } = await supabase
		.from('work_schedules')
		.select('*')
		.order('day_of_week', { ascending: true });

	if (error) {
		throw SvelteKitError(500, {
			message: "Couldn't find any work schedules."
		});
	}

	return { workSchedules: workSchedules || [] };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const data = await request.formData();

		const schedulesToSave = [];
		let i = 1;
		while (i <= 7) {
			const isActive = data.get(`is_active_${i}`) === 'on';
			const startTime = data.get(`start_time_${i}`);
			const endTime = data.get(`end_time_${i}`);

			const daySchedule = {
				day_of_week: i,
				is_active: isActive,
				start_time: startTime,
				end_time: endTime
			};
			schedulesToSave.push(daySchedule);
			i++;
		}

		const { error } = await supabase
			.from('work_schedules')
			.upsert(schedulesToSave, { onConflict: 'day_of_week' });
		if (error) {
			return fail(500, { message: `Eroare la salvarea datelor: ${error.message}` });
		}

		return { success: true, message: 'Informațiile au fost salvate cu succes.' };
	}
};
