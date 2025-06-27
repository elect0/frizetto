import { z } from 'zod';

export const StatusEnum = z.enum(['Confirmată', 'Finalizată', 'Anulată', 'Neprezentat']);

export const schema = z.object({
	id: z.number(),

	ora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: 'Ora trebuie să fie în formatul HH:MM (ex: 10:00)'
	}),

	client: z.object({
		nume: z.string().min(1, 'Numele clientului este obligatoriu'),
		telefon: z
			.string()
			.regex(/^0\d{9}$/, {
				message: 'Numărul de telefon trebuie să aibă 10 cifre și să înceapă cu 0'
			})
	}),

	serviciu: z.object({
		nume: z.string().min(1, 'Numele serviciului este obligatoriu'),
		durataMinute: z.number().int().positive('Durata trebuie să fie un număr pozitiv')
	}),

	status: StatusEnum,

	pret: z.number().int().nonnegative('Prețul trebuie să fie un număr pozitiv sau zero')
});

export type Schema = z.infer<typeof schema>;
