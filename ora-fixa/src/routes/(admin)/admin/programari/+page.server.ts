import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setMonth, endOfMonth, startOfMonth } from 'date-fns';

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
		.select('*')
		.gte('start_time', startTime.toISOString())
		.lte('end_time', endTime.toISOString())
		.order('start_time', { ascending: true })
		.range(offset, offset + limit - 1);

	if (appointmentsError) {
		console.error('Eroare la încărcarea datelor:', appointmentsError);
		throw error(500, 'A apărut o eroare la server.');
	}

	return {
		appointments: data ?? [],
		currentPage: page,
		session
	};
};
