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
