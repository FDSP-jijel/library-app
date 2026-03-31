const CACHE_NAME = "library-catalog-v5";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./faculty.jpg",
  "./icons.png",
  "./icon.png",
  "./catalog_FLPS_jijel.csv"
];

// install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// fetch (äÓÎÉ ÂãäÉ ÈÏæä loop)
self.addEventListener("fetch", event => {

  const request = event.request;

  // ÊÌÇåá ÇáØáÈÇÊ ÛíÑ GET
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
