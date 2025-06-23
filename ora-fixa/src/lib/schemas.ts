import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email('Te rugam sa introduci o adresa de email valida.'),
	password: z.string().min(6, 'Parola trebuie sa contina cel putin 6 caractere')
});

export const registerSchema = z
	.object({
		email: z.string().email('Te rugam sa introduci o adresa de email valida.'),
		password: z.string().min(6, 'Parola trebuie sa contina cel putin 6 caractere'),
		passwordConfirm: z.string()
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Parolele nu coincid.',
		path: ['passwordConfirm']
	});

export const bookingSchema = z.object({
	serviceId: z.coerce.number().positive(),
	startTime: z.string().datetime(),
	duration: z.coerce.number().positive(),
	time: z.string().min(1, { message: 'Te rugăm să alegi o oră.' }),
	hasAgreedToPolicy: z.literal(true, {
		errorMap: () => ({ message: 'Trebuie sa confirmi angajamentul pentru a continua.' })
	})
});
