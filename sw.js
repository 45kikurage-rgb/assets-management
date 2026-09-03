const CACHE = 'asset-manager-v3-20260903all';
const CORE = [
  './',
  './index.html',
  './styles.css?v=20260903all',
  './app.js?v=20260903all',
  './manifest.webmanifest?v=20260903all',
  './home-scene.jpg',
  './treasure-icon.png',
  './icon-192.png?v=20260903all',
  './icon-512.png?v=20260903all',
  './icon-maskable.png?v=20260903all'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request)
        .then(response => response || caches.match('./index.html')))
  );
});
