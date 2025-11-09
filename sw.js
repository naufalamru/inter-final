
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// cache names
const CACHE_NAME = 'storymap-v1';
const DYNAMIC_CACHE = 'storymap-dynamic-v1';
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/styles.css'
];

// basic cache on fetch
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      }).catch(() => {
        // fallback to offline page or return cached root
        return caches.match('/index.html');
      });
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
    icon: data.icon || '/public/icons/icon-192.png',
    badge: data.badge || '/public/icons/icon-192.png',
    data: { url: data.url || '/' },
    actions: [
      {action: 'open', title: 'Lihat'},
      {action: 'dismiss', title: 'Tutup'}
    ]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  if (event.action === 'open') {
    event.waitUntil(clients.openWindow(url));
  } else {
    event.waitUntil(clients.openWindow(url));
  }
});
