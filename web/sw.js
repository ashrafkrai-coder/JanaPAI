// Service Worker JanaPAI — caching fail statik supaya aplikasi dibuka pantas & boleh dilancar luar talian.
// Tukar VERSION setiap kali fail app shell berubah untuk memaksa kemas kini cache.
const VERSION = 'v10';
const SHELL_CACHE = `janapai-shell-${VERSION}`;
const CDN_CACHE = `janapai-cdn-${VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './js/app.js',
  './js/api.js',
  './js/backend.js',
  './js/config.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Pustaka pihak ketiga (URL berversi — selamat di-cache lama).
const CDN_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![SHELL_CACHE, CDN_CACHE].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // Edge Functions (POST) sentiasa ke rangkaian

  const url = new URL(request.url);

  // Supabase: JANGAN cache — data panitia & token.
  if (url.hostname.endsWith('.supabase.co')) return;

  // CDN: cache-first
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, CDN_CACHE));
    return;
  }

  // Fail aplikasi sendiri: stale-while-revalidate (cepat + dikemas kini di latar belakang)
  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') {
      event.respondWith(staleWhileRevalidate(new Request('./index.html'), SHELL_CACHE));
    } else {
      event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
    }
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Respons "opaque" (no-cors, status 0) juga disimpan supaya fon boleh dimuat luar talian.
  if (response.ok || response.type === 'opaque') {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached ?? Response.error());
  return cached ?? network;
}
