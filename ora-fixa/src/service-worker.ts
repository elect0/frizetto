// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from '$service-worker';

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
self.addEventListener('push', (event) => {

	if (!event.data) {
		return;
	}



	const data = event.data?.json();
	const options = {
		body: data.body || 'No content',
		icon: '/favicon.png',
		badge: '/badge.png',
		data: {
			url: data.data?.url || '/' // URL to open on click
		}
	};


	event.waitUntil(
		self.registration
			.showNotification(data.title, options)
			.then(() => console.log('✅ Service Worker: showNotification() successful.'))
			.catch((err) => console.error('❌ Service Worker: showNotification() failed:', err))
	);
});

self.addEventListener('notificationclick', (event) => {
	console.log('👉 Service Worker: Notification clicked!');
	event?.notification.close();

	// ***** THIS IS THE CORRECTED LINE *****
	event.waitUntil(
		self.clients
			.matchAll({ type: 'window' })
			.then((clientsArr) => {
				// https://web-push-book.gauntface.com/common-notification-patterns/

				// If we have a client, pick the first one and open it
				const hadWindowToFocus = clientsArr.length && clientsArr.length > 0;

				// Otherwise, open a new tab to the applicable URL and focus it.
				if (hadWindowToFocus) {
					const client = clientsArr[0];
					if (!client.url.includes('/jar')) {
						client.navigate('/jar');
					}
					client.focus();
				} else
					self.clients
						.openWindow('/jar')
						.then((windowClient) => (windowClient ? windowClient.focus() : null));
			})
			.catch((e) => {
				console.error(e);
			})
	);
});
