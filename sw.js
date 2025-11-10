// cache names
const CACHE_NAME = 'storymap-v1';
const DYNAMIC_CACHE = 'storymap-dynamic-v1';
const STATIC_FILES = [
  '/inter-final/',
  '/inter-final/index.html',
  '/inter-final/src/styles.css'
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// basic cache on fetch
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip caching for API requests
  if (url.pathname.includes('/v1/') || url.hostname.includes('story-api.dicoding.dev')) return;

  // Skip non-GET
  if (req.method !== 'GET') return;

  // Skip service worker itself
  if (url.pathname.includes('/sw.js')) return;

  // ✅ Tambahan: jika request navigasi (refresh halaman)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/inter-final/index.html') || caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.status === 200) {
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(req, res.clone()));
        }
        return res;
      }).catch(() => caches.match('/inter-final/index.html') || caches.match('/index.html'));
    })
  );
});

// push event - show notification using payload data if present
self.addEventListener('push', event => {
  let data = { title: 'Story Map', body: 'You have a new notification', url: '/' };
  try {
    if (event.data) data = event.data.json();
  } catch(e){}
  const options = {
    body: data.body,
    icon: data.icon || '/inter-final/public/icons/icon-192.png',
    badge: data.badge || '/inter-final/public/icons/icon-192.png',
    data: { url: data.url || '/inter-final/' },
    actions: [
      {action: 'open', title: 'Lihat'},
      {action: 'dismiss', title: 'Tutup'}
    ]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/inter-final/';
  if (event.action === 'open') {
    event.waitUntil(clients.openWindow(url));
  } else {
    event.waitUntil(clients.openWindow(url));
  }
});
