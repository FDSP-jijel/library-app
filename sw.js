self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("library-cache").then(cache => {
      return cache.addAll([
        "index.html",
        "catalog_FDSP_jijel.csv",
        "logo.png",
        "faculty.jpg"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});