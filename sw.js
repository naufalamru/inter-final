const CACHE_NAME = 'storymap-v3';
const DYNAMIC_CACHE = 'storymap-dynamic-v3';

// ✅ Gunakan path RELATIF, bukan absolute
const STATIC_FILES = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(STATIC_FILES);
      } catch (err) {
        console.warn('Cache addAll failed, continuing...', err);
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME && name !== DYNAMIC_CACHE) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // ✅ Jangan cache API
  if (url.pathname.includes('/v1/') || url.hostname.includes('story-api.dicoding.dev')) return;
  if (req.method !== 'GET') return;
  if (url.pathname.endsWith('sw.js')) return;

  // ✅ Fallback untuk navigasi (refresh)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(DYNAMIC_CACHE).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('push', event => {
  let data = { title: 'Story Map', body: 'You have a new notification', url: './' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {}
  const options = {
    body: data.body,
    icon: data.icon || './icon-192.png',
    badge: data.badge || './icon-192.png',
    data: { url: data.url || './' },
    actions: [
      { action: 'open', title: 'Lihat' },
      { action: 'dismiss', title: 'Tutup' }
    ]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || './';
  event.waitUntil(clients.openWindow(url));
});
