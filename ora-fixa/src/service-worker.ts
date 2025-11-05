// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

self.skipWaiting();
clientsClaim();

// self.__WB_MANIFEST is default injection point

// we should pre-cache first
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
	console.log('MERGE COAIEE');
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
});

self.addEventListener('notificationclick', (event) => {
	console.log('👉 Service Worker: Notification clicked!');
	event.notification.close();

	// ***** THIS IS THE CORRECTED LINE *****
	event.waitUntil(self.clients.openWindow(event.notification.data.url));
});
