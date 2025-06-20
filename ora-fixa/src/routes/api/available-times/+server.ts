import type { RequestHandler } from './$types';
import { json, error as SvelteKitError } from '@sveltejs/kit';

type RpcArgs = {
	p_date: string;
	p_duration_minutes: number;
};

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const date = url.searchParams.get('date');
	const durationParam = url.searchParams.get('duration');

	if (!date || !durationParam) {
		throw SvelteKitError(400, 'Data si durata sunt parametrii obligatorii.');
	}

	const duration = parseInt(durationParam);
	if (isNaN(duration) || duration <= 0) {
		throw SvelteKitError(400, 'Durata trebuie să fie un numar valid.');
	}

	// TODO: Supabase logic
	const { data, error: dbError } = await supabase.rpc('get_available_slots', {
		p_date: date,
		p_duration_minutes: duration
	});

	if (dbError) {
		console.error('Eroare la apelul RPC Supabase:', dbError);
		throw SvelteKitError(500, 'A aparut o eroare interna la server.');
	}

	const slots = data as { available_slot: string }[];

	return json({ slots });
};
