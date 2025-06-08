import { supabase } from '$lib/supabaseClient';
import { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	console.log('Se incarca serviciile de pe server.');

	const { data: services, error } = await supabase.from('services').select('*');
	if (error) {
		console.error('Eroare la preluarea serviciilor:', error);
		return { services: [] }; // Returnează un array gol în caz de eroare
	}
	console.log('Servicii preluate cu succes', services);
	return { services: services ?? [] };
};
