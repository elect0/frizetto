import type { PageServerLoad, Actions } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { walkInSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({locals: {supabase, session}, url}) => {
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sort') || 'created_at';
    const sortOrder = url.searchParams.get('order') || 'desc';
    const pageSize = 30;

    const servicesPromise = supabase.from('services').select('*')

    const clientsPromise = supabase.rpc('get_clients_with_stats', {
        p_search_term: search,
        p_page_number: page,
        p_page_size: pageSize,
        p_sort_order: sortOrder,
        p_sort_column: sortBy,
    })
    
    const countPromise = supabase.rpc('get_clients_count', {
        p_search_term: search,
    })

    const [{data: clients}, {data: count}, {data:services}] = await Promise.all([clientsPromise, countPromise, servicesPromise])

    return {
        clients: clients || [],
        totalClients: count || 0,
        currentPage: page,
        pageSize,
        services: services || [],
        session,
        pageTitle: "Clienti"
    }
}

export const actions = {
    addWalkInAppointment: async ({request, locals: {supabase}}) => {
        const form = await superValidate(request, zod(walkInSchema))
        if (!form.valid) {
            return fail(400, {form})
        }
        const startTime = new Date(`${form.data.date.split('T')[0]}T${form.data.time}:00.000Z`);
		const endTime = new Date(startTime.getTime() + form.data.duration * 60 * 1000);

        
		const walkInAppointment = {
			user_id: form.data.clientId,
			service_id: form.data.serviceId,
			start_time: startTime.toISOString(),
			end_time: endTime.toISOString(),
			client_notes: form.data.clientNotes,
			status: 'confirmata'
		};

        const {error} = await supabase.from('appointments').insert(walkInAppointment)

		if (error) {
			console.error('Eroare la INSERT programare:', error);
			return message(form, 'Programarea nu a fost confirmată!');
		}

		return message(form, 'Programarea a fost confirmată cu succes!');
    }
} satisfies Actions
