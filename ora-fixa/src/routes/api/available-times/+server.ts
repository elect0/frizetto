import type { RequestHandler } from './$types';
import { json, error as SvelteKitError } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase }, setHeaders }) => {
	const date = url.searchParams.get('date');
	const durationParam = url.searchParams.get('duration');

	if (!date || !durationParam) {
		throw SvelteKitError(400, 'Parametrii "date" și "duration" sunt obligatorii.');
	}

	const duration = parseInt(durationParam);
	if (isNaN(duration) || duration <= 0) {
		throw SvelteKitError(400, 'Parametrul "duration" trebuie să fie un număr valid.');
	}

	const { data, error: dbError } = await supabase.rpc('get_available_slots', {
		p_date: date,
		p_duration_minutes: duration
	});

	if (dbError) {
		console.error('Eroare la apelul RPC get_available_slots:', dbError);
		throw SvelteKitError(500, 'A apărut o eroare la server.');
	}

	const slots = data as { available_slot: string }[];
	setHeaders({
		'Cache-Control': 'public, s-maxage=30, max-age=0'
	});

	return json({ slots });
};
