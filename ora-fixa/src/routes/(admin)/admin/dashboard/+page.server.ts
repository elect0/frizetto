import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, session }, url }) => {
	const dateParam = url.searchParams.get('date');
	const targetDay = dateParam ? new Date(dateParam + 'T12:00:00.000Z') : new Date();
	targetDay.setUTCHours(0, 0, 0, 0);

	const nextDay = new Date(targetDay);
	nextDay.setUTCDate(targetDay.getUTCDate() + 1);

	const startOfDayISO = targetDay.toISOString();
	const endOfDayISO = nextDay.toISOString();

	const { data: appointments, error: appointmentsError } = await supabase
		.from('appointments')
		.select(
			`id,
        start_time,
        end_time,
        status,
        profiles ( id, full_name, phone, notes ),
        services ( name, duration_minutes, price )`
		)
		.gte('start_time', startOfDayISO)
		.lt('start_time', endOfDayISO)
		.order('start_time', { ascending: true });

	if (appointmentsError) {
		console.error('Eroare la preluarea programărilor:', appointmentsError);
		throw error(500, 'A apărut o eroare la încărcarea programului.');
	}

	const now = new Date();
	const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
	const lastDayOfMonth = new Date(
		now.getFullYear(),
		now.getMonth() + 1,
		0,
		23,
		59,
		59
	).toISOString();

	const totalRevenuePromise = supabase
		.from('appointments')
		.select('services(price)')
		.eq('status', 'finalizata')
		.gte('start_time', firstDayOfMonth)
		.lte('start_time', lastDayOfMonth);
	const newClientsPromise = supabase
		.from('profiles')
		.select('*', { count: 'exact', head: true })
		.gte('created_at', firstDayOfMonth)
		.lte('created_at', lastDayOfMonth);
	const noShowPromise = supabase
		.from('appointments')
		.select('*', { count: 'exact', head: true })
		.eq('status', 'neprezentat')
		.gte('start_time', firstDayOfMonth)
		.lte('start_time', lastDayOfMonth);
	const [revenueResult, newClientsResult, noShowResult] = await Promise.all([
		totalRevenuePromise,
		newClientsPromise,
		noShowPromise
	]);

	const totalRevenue =
		revenueResult.data?.reduce((sum, item) => sum + (item.services?.price || 0), 0) || 0;
	const newClientsCount = newClientsResult.count || 0;
	const noShowCount = noShowResult.count || 0;

	console.log(appointments, 'PROGRAMARI PROGRAMARI')

	return {
		appointments: appointments || [],
		currentDate: targetDay.toISOString().split('T')[0],
		kpis: {
			revenue: totalRevenue,
			newClients: newClientsCount,
			noShows: noShowCount
		},
		session
	};
};
