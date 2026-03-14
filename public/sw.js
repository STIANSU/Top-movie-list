const CACHE_NAME = "filmtoppen-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/userform.html",
  "/TOS.html",
  "/PRIVACY.html",
  "/style.css",
  "/app.mjs",
  "/api.mjs",
  "/userform.mjs",
  "/manifest.json",
  "/locals/en.json",
  "/locals/no.json",
  "/Pictures/FilmToppen192.png",
  "/Pictures/FilmToppen512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Filer er lagret i cache (offline-modus klar)");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});