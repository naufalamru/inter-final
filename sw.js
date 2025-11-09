// cache names
const CACHE_NAME = 'storymap-v2';
const DYNAMIC_CACHE = 'storymap-dynamic-v2';
const STATIC_FILES = [
  '/inter-final/',
  '/inter-final/index.html',
  '/inter-final/styles.css',
  '/inter-final/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_FILES).catch(err => {
        console.warn('Cache addAll failed:', err);
      });
    }).then(() => {
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  
  // Skip caching for API requests
  if (url.hostname.includes('story-api.dicoding.dev') || url.pathname.includes('/v1/')) return;
  if (req.method !== 'GET' || url.pathname.includes('/sw.js')) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.status === 200) {
          const resClone = res.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(req, resClone));
        }
        return res;
      }).catch(() => caches.match('/inter-final/index.html'));
    })
  );
});

self.addEventListener('push', event => {
  let data = { title: 'Story Map', body: 'You have a new notification', url: '/' };
  try { if (event.data) data = event.data.json(); } catch (e) {}

  const options = {
    body: data.body,
    icon: data.icon || '/inter-final/icons/icon-192.png',
    badge: data.badge || '/inter-final/icons/icon-192.png',
    data: { url: data.url || '/inter-final/' },
    actions: [
      { action: 'open', title: 'Lihat' },
      { action: 'dismiss', title: 'Tutup' }
    ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/inter-final/';
  event.waitUntil(clients.openWindow(url));
});
