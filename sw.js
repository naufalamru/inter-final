const CACHE_NAME = 'storymap-v4';
const DYNAMIC_CACHE = 'storymap-dynamic-v4';

// ✅ gunakan path absolut yang sesuai GitHub Pages
const STATIC_FILES = [
  '/inter-final/',
  '/inter-final/index.html',
  '/inter-final/styles.css',
  '/inter-final/manifest.json',
  '/inter-final/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        // cache file satu-satu supaya tidak gagal total
        for (const file of STATIC_FILES) {
          try {
            await cache.add(file);
          } catch (e) {
            console.warn('⚠️ Gagal cache', file, e);
          }
        }
      })
      .finally(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME && k !== DYNAMIC_CACHE) return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.hostname.includes('story-api.dicoding.dev') || url.pathname.includes('/v1/')) return;
  if (req.method !== 'GET') return;
  if (url.pathname.endsWith('sw.js')) return;

  // ✅ fallback saat refresh
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/inter-final/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => caches.match('/inter-final/index.html'));
    })
  );
});

self.addEventListener('push', event => {
  let data = { title: 'Story Map', body: 'You have a new notification', url: '/inter-final/' };
  try { if (event.data) data = event.data.json(); } catch {}
  const options = {
    body: data.body,
    icon: data.icon || '/inter-final/icon-192.png',
    badge: data.badge || '/inter-final/icon-192.png',
    data: { url: data.url || '/inter-final/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/inter-final/';
  event.waitUntil(clients.openWindow(url));
});
