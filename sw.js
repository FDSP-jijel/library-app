// Service Worker للتطبيق PWA

const CACHE_NAME = 'library-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

// Install Event
self.addEventListener('install', (event) => {
  console.log('⚙️ Service Worker تثبيت...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ تم فتح Cache');
      return cache.addAll(ASSETS).catch((err) => {
        console.log('⚠️ بعض الملفات لم تُخزن:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker تفعيل...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف Cache قديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First, then Cache
self.addEventListener('fetch', (event) => {
  // تخطي requests غير GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // تخزين الاستجابة الناجحة
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // في حالة عدم الاتصال، استخدم Cache
        return caches.match(event.request).then((response) => {
          return response || new Response('تحقق من اتصالك بالإنترنت', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Background Sync (اختياري)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('📡 مزامنة البيانات...');
  }
});
