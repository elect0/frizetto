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
	}),
	clientNotes: z.string().optional()
});

export const profileSchema = z.object({
	fullName: z.string().nonempty('Te rugăm să completezi acest câmp.'),
	phoneNumber: z.string().min(10, 'Numărul de telefon trebuie să conțină cel puțin 10 cifre.')
});
