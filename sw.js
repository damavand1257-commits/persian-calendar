const CACHE_NAME = 'persian-calendar-v3'; // نسخه را تغییر دادیم تا آپدیت شود
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg',
    'https://cdn.jsdelivr.net/npm/jalaali-js@1.2.1/dist/jalaali.min.js',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@700;900&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(res => {
            if (res) return res;
            return fetch(event.request).then(networkRes => {
                return networkRes;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
