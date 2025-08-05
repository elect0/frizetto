import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email('Te rugam sa introduci o adresa de email valida.'),
	password: z.string().min(6, 'Parola trebuie sa contina cel putin 6 caractere')
});

export const registerSchema = z
	.object({
		email: z.string().email('Te rugam sa introduci o adresa de email valida.'),
		password: z.string().min(8, 'Parola trebuie sa contina cel putin 8 caractere'),
		passwordConfirm: z.string()
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Parolele nu coincid.',
		path: ['passwordConfirm']
	});

export const bookingSchema = z
	.object({
		serviceId: z.string().min(1, { message: 'Te rugăm să alegi un serviciu.' }),
		date: z.string().min(1, { message: 'Te rugăm să alegi o zi.' }),
		duration: z.coerce.number().positive(),
		time: z.string().min(1, { message: 'Te rugăm să alegi o oră.' }),
		hasAgreedToPolicy: z.boolean(),
		clientNotes: z.string().optional()
	})
	.refine((data) => data.hasAgreedToPolicy === true, {
		message: 'Trebuie sa confirmi angajamentul pentru a continua.',
		path: ['hasAgreedToPolicy']
	});

export const profileSchema = z.object({
	fullName: z.string().nonempty('Te rugăm să completezi acest câmp.'),
	phoneNumber: z.string().min(10, 'Numărul de telefon trebuie să conțină cel puțin 10 cifre.')
});

export const accountSchema = z.object({
	full_name: z.string().nonempty('Te rugăm să completezi acest câmp.'),
	phone: z.string().min(10, 'Numărul de telefon trebuie să conțină cel puțin 10 cifre.'),
	notes: z.string().nullable().optional()
});

export const passwordSchema = z
	.object({
		newPassword: z.string().min(8, 'Noua parola trebuie sa aiba minim 8 caractere.'),
		passwordConfirm: z.string()
	})
	.refine((data) => data.newPassword === data.passwordConfirm, {
		message: 'Parolele noi nu se potrivesc',
		path: ['passwordConfirm']
	});

export const preferencesSchema = z.object({
	notify_email_confirmation: z.boolean(),
	notify_sms_reminder: z.boolean(),
	marketing_opt_in: z.boolean()
});

export const idSchema = z.object({
	appointmentId: z.coerce.number().positive('ID-ul programării este invalid.')
});

export const walkInSchema = z.object({
	clientId: z.string().uuid(),
	serviceId: z.string().min(1, { message: 'Te rugăm să alegi un serviciu.' }),
	duration: z.coerce.number(),
	date: z.string(),
	time: z.string().min(1, { message: 'Te rugăm să alegi o oră.' }),
	clientNotes: z.string().optional()
});

export const updateAppointmentSchema = z.object({
	appointmentId: z.string(),
	serviceId: z.string(),
	duration: z.coerce.number(),
	date: z.string().min(1, 'Data este obligatorie.'),
	time: z.string().min(1, 'Ora este obligatorie.'),
	status: z.string().min(1, 'Statusul este obligatoriu.')
});

export const updateStatusSchema = z.object({
    appointmentId: z.string(),
    status: z.string()
})

export const scheduleOverrideSchema = z.object({
	date: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	isActive: z.boolean()
});

export const updateServiceSchema = z.object({
	serviceId: z.string(),
	name: z.string().min(1, 'Numele serviciului este obligatoriu.'),
	description: z.string(),
	price: z.coerce.number().positive('Pretul trebuie să fie un număr pozitiv.'),
	duration: z.coerce.number().positive('Durata serviciului trebuie să fie un număr pozitiv.')
});

export const addServiceSchema = z.object({
	name: z.string().min(1, 'Numele serviciului este obligatoriu.'),
	description: z.string(),
	price: z.coerce.number().positive('Pretul trebuie să fie un număr pozitiv.'),
	duration: z.coerce.number().positive('Durata serviciului trebuie să fie un număr pozitiv.')
});

