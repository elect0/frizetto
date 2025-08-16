import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { bookingSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_KEY } from '$env/static/private';
import { ro } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';

const resend = new Resend(RESEND_KEY);

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const serviceIdParam = url.searchParams.get('serviceId');

	const form = await superValidate(
		serviceIdParam ? { serviceId: serviceIdParam } : undefined,
		zod(bookingSchema)
	);

	const servicePromise = supabase.from('services').select('*');
	return { form, streamed: { services: servicePromise.then(({ data }) => data ?? []) } };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const form = await superValidate(request, zod(bookingSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await safeGetSession();

		if (!session) {
			throw redirect(303, '/login');
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('full_name, email, phone')
			.eq('id', session.user?.id)
			.single();
		const isProfileIncomplete = !profile?.full_name || !profile?.phone;

		if (isProfileIncomplete) {
			throw redirect(303, '/cont/completeaza-profilul');
		}

		const startTime = new Date(`${form.data.date.split('T')[0]}T${form.data.time}:00.000Z`);
		const endTime = new Date(startTime.getTime() + form.data.duration * 60 * 1000);

		const newAppointment = {
			user_id: session.user?.id,
			service_id: parseInt(form.data.serviceId, 10),
			start_time: startTime.toISOString(),
			end_time: endTime.toISOString(),
			client_notes: form.data.clientNotes,
			status: 'confirmata'
		};

		const { data, error } = await supabase
			.from('appointments')
			.insert(newAppointment)
			.select('*, services (*)');

		if (error) {
			console.error('Eroare la INSERT programare:', error);
			return message(form, 'Programarea ta nu a fost confirmată! Trebuie sa fii inregistrat.');
		}

		const appointment = data[0];

		const formattedDate = format(parseISO(appointment.start_time), 'dd MMMM yyyy, HH:mm:ss', {
			locale: ro
		});

		const { data: emailData, error: emailError } = await resend.emails.send({
			from: 'contact@frizetto.ro',
			to: profile.email,
			subject: 'Confirmarea programării',
			html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Appointment Confirmation - The Modern Barber</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
      background-color: #fafaf9;
    "
  >
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafaf9"
    >
      <tr>
        <td align="center" style="padding: 20px 0">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            "
          >
            <!-- Header -->
            <tr>
              <!-- Updated header to use white background with amber accents and modern typography -->
              <td
                align="center"
                style="
                  padding: 40px 20px;
                  background-color: #ffffff;
                  border-radius: 12px 12px 0 0;
                  border-bottom: 1px solid #f1f5f9;
                "
              >
                <h1
                  style="
                    margin: 0;
                    color: #0f172a;
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                  "
                >
                  Frizetto
                </h1>
                <p
                  style="
                    margin: 8px 0 0 0;
                    color: #64748b;
                    font-size: 16px;
                    font-weight: 500;
                  "
                >
                  Băilești
                </p>
              </td>
            </tr>

            <!-- Confirmation Message -->
            <tr>
              <!-- Updated confirmation section with cleaner styling and amber checkmark -->
              <td align="center" style="padding: 40px 20px 30px 20px">
                <div
                  style="
                    display: inline-block;
                    width: 56px;
                    height: 56px;
                    background-color: #f59e0b;
                    border-radius: 50%;
                    margin-bottom: 24px;
                    line-height: 56px;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                  "
                >
                  <span style="color: #ffffff; font-size: 24px">✓</span>
                </div>
                <h2
                  style="
                    margin: 0 0 12px 0;
                    color: #0f172a;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                  "
                >
                  Totul e gata, ${profile.full_name}!
                </h2>
                <p
                  style="
                    margin: 0;
                    color: #64748b;
                    font-size: 18px;
                    line-height: 1.6;
                    font-weight: 400;
                  "
                >
                  Programarea ta a fost confirmată și abia așteptăm să te vedem.
                </p>
              </td>
            </tr>

            <!-- Appointment Details -->
            <tr>
              <!-- Updated appointment card with stone background and refined typography -->
              <td style="padding: 0 20px 30px 20px">
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="
                    background-color: #fafaf9;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                  "
                >
                  <tr>
                    <td style="padding: 32px">
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td style="padding-bottom: 24px">
                            <h3
                              style="
                                margin: 0 0 8px 0;
                                color: #64748b;
                                font-size: 12px;
                                font-weight: 600;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                              "
                            >
                              SERVICIU
                            </h3>
                            <p
                              style="
                                margin: 0;
                                color: #0f172a;
                                font-size: 18px;
                                font-weight: 600;
                              "
                            >
                              ${appointment.services.name}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 24px">
                            <h3
                              style="
                                margin: 0 0 8px 0;
                                color: #64748b;
                                font-size: 12px;
                                font-weight: 600;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                              "
                            >
                              CÂND
                            </h3>
                            <p
                              style="
                                margin: 0;
                                color: #0f172a;
                                font-size: 18px;
                                font-weight: 600;
                              "
                            >
                              ${formattedDate}
                            </p>
                            <!-- <p
                              style="
                                margin: 4px 0 0 0;
                                color: #64748b;
                                font-size: 16px;
                                font-weight: 400;
                              "
                            >
                              2:00 PM - 2:45 PM (EEST)
                            </p> -->
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h3
                              style="
                                margin: 0 0 8px 0;
                                color: #64748b;
                                font-size: 12px;
                                font-weight: 600;
                                text-transform: uppercase;
                                letter-spacing: 0.05em;
                              "
                            >
                              UNDE
                            </h3>
                            <p
                              style="
                                margin: 0;
                                color: #0f172a;
                                font-size: 18px;
                                font-weight: 600;
                              "
                            >
                              Strada Victoriei 155, Băilești, Dolj
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Action Buttons -->
            <tr>
              <!-- Updated buttons with amber primary and refined secondary styling -->
              <td align="center" style="padding: 0 20px 30px 20px">
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td style="padding-right: 12px">
                      <a
                        href="https://frizetto.ro/api/calendar/${appointment.id}"
                        style="
                          display: inline-block;
                          padding: 14px 28px;
                          background-color: #f59e0b;
                          color: #ffffff;
                          text-decoration: none;
                          border-radius: 8px;
                          font-size: 16px;
                          font-weight: 600;
                          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
                        "
                      >
                        ➕ Adaugă în Calendar
                      </a>
                    </td>
                    <td style="padding-left: 12px">
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Strada%20Victoriei%20135%2C%20B%C4%83ile%C8%99ti%2C%20Dolj"
                        style="
                          display: inline-block;
                          padding: 14px 28px;
                          background-color: #ffffff;
                          color: #0f172a;
                          text-decoration: none;
                          border-radius: 8px;
                          font-size: 16px;
                          font-weight: 600;
                          border: 1px solid #e2e8f0;
                        "
                      >
                        🗺️ Obține Direcții
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Manage Appointment -->
            <tr>
              <!-- Updated manage link with amber accent color -->
              <td align="center" style="padding: 0 20px 30px 20px">
                <p
                  style="
                    margin: 0 0 8px 0;
                    color: #64748b;
                    font-size: 16px;
                    font-weight: 400;
                  "
                >
                Vrei să faci o modificare?
                </p>
                <a
                  href="https://frizetto.ro/cont/programari"
                  style="
                    color: #f59e0b;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 600;
                  "
                  >Gestionează programarea ta</a
                >
              </td>
            </tr>

            <!-- Instructions -->
            <tr>
              <!-- Updated instructions section with refined stone background -->
              <td style="padding: 0 20px 30px 20px">
                <div
                  style="
                    background-color: #fafaf9;
                    padding: 28px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                  "
                >
                  <h3
                    style="
                      margin: 0 0 16px 0;
                      color: #0f172a;
                      font-size: 18px;
                      font-weight: 600;
                    "
                  >
                  Ce trebuie să știi înainte să vii:
                  </h3>
                  <ul
                    style="
                      margin: 0;
                      padding-left: 20px;
                      color: #475569;
                      font-size: 16px;
                      line-height: 1.6;
                      font-weight: 400;
                    "
                  >
                    <li style="margin-bottom: 8px">
                      Te rugăm să ajungi cu 5 minute mai devreme.
                    </li>
                    <li style="margin-bottom: 8px">
                      Acceptăm plăți cash.
                    </li>
                    <li style="margin-bottom: 0">
                      Parcarea este disponibilă pe stradă.
                    </li>
                  </ul>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <!-- Updated footer background from slate to amber -->
              <td
                align="center"
                style="
                  padding: 32px 20px;
                  background-color: #f59e0b;
                  border-radius: 0 0 12px 12px;
                "
              >
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td style="padding-right: 16px">
                      <a
                        href="#"
                        style="
                          display: inline-block;
                          width: 44px;
                          height: 44px;
                          background-color: #3b5998;
                          border-radius: 50%;
                          line-height: 44px;
                          text-align: center;
                          text-decoration: none;
                        "
                      >
                        <span style="color: #ffffff; font-size: 18px">f</span>
                      </a>
                    </td>
                    <td style="padding-right: 16px">
                      <a
                        href="#"
                        style="
                          display: inline-block;
                          width: 44px;
                          height: 44px;
                          background-color: #e4405f;
                          border-radius: 50%;
                          line-height: 44px;
                          text-align: center;
                          text-decoration: none;
                        "
                      >
                        <span style="color: #ffffff; font-size: 18px">📷</span>
                      </a>
                    </td>
                    <td>
                      <a
                        href="#"
                        style="
                          display: inline-block;
                          width: 44px;
                          height: 44px;
                          background-color: #64748b;
                          border-radius: 50%;
                          line-height: 44px;
                          text-align: center;
                          text-decoration: none;
                        "
                      >
                        <span style="color: #ffffff; font-size: 18px">🌐</span>
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Updated text colors for better contrast on amber background -->
                <p
                  style="
                    margin: 24px 0 4px 0;
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: 600;
                  "
                >
                  Frizetto © 2025
                </p>
                <p
                  style="
                    margin: 0 0 16px 0;
                    color: #fef3c7;
                    font-size: 14px;
                    font-weight: 400;
                  "
                >
                  Strada Victoriei 135, Băilești, Dolj
              </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
		});

		console.log(emailError);

		return message(form, 'Felicitari! Te-ai programat cu sucess!');
	}
};
