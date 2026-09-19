const CACHE_NAME = 'sunshine-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/flower.svg',
  '/icons/heart.svg',
  '/icons/shuffle.svg',
  '/icons/plus.svg',
  '/icons/shuffle-action.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
  self.clients.claim();
});

// Network-first so a fresh version always wins when online; cache is the offline fallback.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
