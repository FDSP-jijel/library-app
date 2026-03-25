const CACHE_NAME = "library-app-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./catalog_FDSP_jijel.csv",
  "./logo.png",
  "./faculty.jpg"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting(); // مهم جدًا
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim(); // مهم جدًا
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
