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
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
  console.log('E OK')
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});

self.addEventListener('push', (event) => {
	console.log('📬 Service Worker: PUSH EVENT RECEIVED!');
 
	if (!event.data) {
		console.error('❌ Service Worker: Push event had no data.');
		return;
	}
 
	console.log('📦 Service Worker: Raw push data:', event.data);
 
	console.log(event.data);
 
	const data = event.data?.json();
	const options = {
		body: data.body || 'No content',
		icon: '/favicon.png',
		badge: '/badge.png',
		data: {
			url: data.data?.url || '/' // URL to open on click
		}
	};
 
	console.log('🔔 Service Worker: Attempting to show notification with title:', data.title);
 
	event.waitUntil(
		self.registration
			.showNotification(data.title, options)
			.then(() => console.log('✅ Service Worker: showNotification() successful.'))
			.catch((err) => console.error('❌ Service Worker: showNotification() failed:', err))
	);
})

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

})
