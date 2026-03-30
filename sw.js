const CACHE_NAME = "library-catalog-v3";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./faculty.jpg",
  "./icon-192.png",
  "./icon-512.png",
  "./catalog_FLPS_jijel.csv"
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// تنشيط الـ Service Worker وحذف الكاش القديم
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// التقاط الطلبات: حاول تحميل الإنترنت، وإذا لم يكن متاحًا استخدم الكاش
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
