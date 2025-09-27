import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { SERVICE_ROLE_KEY } from '$env/static/private';

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, {
						...options,
						path: '/'
					});
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	const { data } = await event.locals.supabase
		.from('profiles')
		.select('is_admin')
		.eq('id', user?.id)
		.single();

	event.locals.isAdmin = data?.is_admin;
	event.locals.session = session;
	event.locals.user = user;

	if (
		!event.locals.session &&
		(event.url.pathname.startsWith('/cont') || event.url.pathname.startsWith('/admin'))
	) {
		redirect(303, '/login');
	}

	if (
		event.locals.session &&
		(event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/inregistrare'))
	) {
		redirect(303, '/cont');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
