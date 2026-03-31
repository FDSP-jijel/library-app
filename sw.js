const CACHE_NAME = "library-v1";

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

// تثبيت
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// تفعيل
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
});

// جلب
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
