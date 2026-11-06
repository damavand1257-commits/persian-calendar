const CACHE_NAME = 'persian-calendar-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg'
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
                // کش کردن فونت‌های گوگل برای استفاده آفلاین
                if (event.request.url.includes('fonts.g')) {
                    const clone = networkRes.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return networkRes;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
