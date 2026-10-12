// Service worker: po pierwszym wejściu aplikacja działa offline (na stoku zwykle brak zasięgu).
const CACHE = "skisense-v1";
const ASSETS = [
  "./", "index.html", "style.css", "manifest.webmanifest",
  "js/app.js", "js/analysis.js", "js/signal.js", "js/ble.js", "js/store.js", "js/charts.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// cache-first, a w tle odświeżamy (nowa wersja pojawi się po następnym otwarciu)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((res) => {
      if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
