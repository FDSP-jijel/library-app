const CACHE_NAME = "library-catalog-v3";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./faculty.jpg",
  "./icons.png", // 192x192
  "./icon.png",  // 512x512
  "./catalog_FLPS_jijel.csv"
];

// 🔵 التثبيت
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );

  // تفعيل فوري
  self.skipWaiting();
});

// 🔵 التفعيل + حذف الكاش القديم
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// 🔵 إصلاح مهم جدًا (يحل مشكلة Install + loop)
self.addEventListener("fetch", event => {

  // مهم جدًا لفتح التطبيق بدون مشاكل (Navigation fix)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // باقي الملفات
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
