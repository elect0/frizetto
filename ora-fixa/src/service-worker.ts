// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

self.skipWaiting()
clientsClaim()

// self.__WB_MANIFEST is default injection point
const entries = self.__WB_MANIFEST

// we should pre-cache first
precacheAndRoute(entries)

console.log(self.__WB_MANIFEST)

import { build, files, version } from '$service-worker';

const CACHE = `aj-cache-${version}`;

const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
  console.log("MERGE COAIEE")

	async function addFilesToCacheAndSkipWaiting() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		await self.skipWaiting();
	}

	event.waitUntil(addFilesToCacheAndSkipWaiting());
});

self.addEventListener('activate', (event) => {
	async function deleteOldCachesAndClaimClients() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}

		await self.clients.claim();
	}

	event.waitUntil(deleteOldCachesAndClaimClients());
});

self.addEventListener('fetch', (event) => {
	const matchUrl = new URL(event.request.url);
	if (event.request.method !== 'GET') return;
	if (matchUrl.pathname.startsWith('/api')) return;
	if (matchUrl.pathname.startsWith('/admin')) return;
  if (matchUrl.pathname.startsWith('/')) return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		const cacheMatch = await cache.match(event.request);

		if (ASSETS.includes(url.pathname) && cacheMatch) {
			return cacheMatch;
		}

		try {
			const response = await fetch(event.request);

			if (response.status === 200) {
				await cache.put(event.request, response.clone());
			}

			return response;
		} catch (error) {
			const lastCacheMatchAttempt = await cache.match(event.request);

			if (lastCacheMatchAttempt) {
				return lastCacheMatchAttempt;
			} else {
				return new Response('something went wrong. try force closing and reloading the app', {
					status: 408,
					headers: { 'Content-Type': 'text/html' }
				});
			}
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


  console.log(event.data)

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
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});
