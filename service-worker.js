const cacheName = 'cache-v1';

const prechacheResources = [
    '/',
    'assets/css/style.css',
    'assets/sounds/snap.mp3',
    'index.html',
    'scripts.js',
]

self.addEventListener('install', event => {
    console.log('SW install event');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(prechacheResources);
        })
    )
})

self.addEventListener('fetch', event => {
    console.log('fetch intercepted for', event.request.url);
    event.respondWith(caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    )
})