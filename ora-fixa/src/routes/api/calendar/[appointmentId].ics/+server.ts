import * as ics from 'ics';
import type { RequestHandler } from './$types';
import { json, error as SvelteKitError } from '@sveltejs/kit';
import { differenceInMinutes, parseISO } from 'date-fns';

export const GET: RequestHandler = async ({ params, locals: { supabase } }) => {
	const id = params.appointmentId;

	const { data: appointment, error } = await supabase
		.from('appointments')
		.select('*')
		.eq('id', id)
		.single();
	if (error) {
		throw SvelteKitError(500, 'A apărut o eroare la server.');
	}

	if (!appointment) {
		throw SvelteKitError(404, 'Programarea nu a fost găsită.');
	}

	const startTimeDate = parseISO(appointment.start_time);
	const duration = differenceInMinutes(parseISO(appointment.end_time), startTimeDate);

	const event = {
		start: [
			startTimeDate.getFullYear(),
			startTimeDate.getMonth() + 1,
			startTimeDate.getDate(),
			startTimeDate.getHours(),
			startTimeDate.getMinutes()
		] as [number, number, number, number, number],
		duration: { minutes: duration },
		title: 'Tuns Frizetto',
		location: 'Strada Victoriei, nr. 135, Bailesti, Jud. Dolj'
	};

	const { error: icsError, value: icsFileContent } = ics.createEvent(event);

	if (icsError) {
		throw SvelteKitError(500, 'A apărut o eroare la crearea fișierului ICS.');
	}

	return new Response(icsFileContent, {
		status: 200,
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Content-Disposition': `attachment; filename="programare.ics"`
		}
	});
};
