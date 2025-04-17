/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

self.addEventListener('message', (event) => {
	if (event.data === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			console.log(`Adding assets to cache ${CACHE}`);
			const cache = await caches.open(CACHE);
			await cache.addAll(ASSETS);
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
		})()
	);
});

self.addEventListener('fetch', (event) => {
	if (!event.request.url.startsWith('http') || event.request.method !== 'GET') return;

	event.respondWith(
		caches.open(CACHE).then(async (cache) => {
			const cachedResponse = await cache.match(event.request.url);
			if (cachedResponse) {
				return cachedResponse;
			}
			const fetchedResponse = await fetch(event.request);
			cache.put(event.request, fetchedResponse.clone());
			return fetchedResponse;
		})
	);
});
