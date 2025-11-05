/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// https://kit.svelte.dev/docs/service-workers#type-safety

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

const sw = self as unknown as ServiceWorkerGlobalScope;

cleanupOutdatedCaches();


sw.skipWaiting()
clientsClaim()

// self.__WB_MANIFEST is default injection point
const entries = sw.__WB_MANIFEST

// we should pre-cache first
precacheAndRoute(entries)

console.log(sw.__WB_MANIFEST)

import { build, files, version } from '$service-worker';

const CACHE = `aj-cache-${version}`;

const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
  console.log("MERGE COAIEE")

	async function addFilesToCacheAndSkipWaiting() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		await sw.skipWaiting();
	}

	event.waitUntil(addFilesToCacheAndSkipWaiting());
});

sw.addEventListener('activate', (event) => {
	async function deleteOldCachesAndClaimClients() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}

		await sw.clients.claim();
	}

	event.waitUntil(deleteOldCachesAndClaimClients());
});

sw.addEventListener('fetch', (event) => {
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

sw.addEventListener('push', (event) => {
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
		sw.registration
			.showNotification(data.title, options)
			.then(() => console.log('✅ Service Worker: showNotification() successful.'))
			.catch((err) => console.error('❌ Service Worker: showNotification() failed:', err))
	);
});

sw.addEventListener('notificationclick', (event) => {
  console.log('👉 Service Worker: Notification clicked!');
  event.notification.close();

  // ***** THIS IS THE CORRECTED LINE *****
  event.waitUntil(
    sw.clients.openWindow(event.notification.data.url)
  );
});
