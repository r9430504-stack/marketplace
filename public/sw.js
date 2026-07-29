// Galaxy Archive service worker.
// Strategy is chosen to feel like an app WITHOUT ever serving stale content:
//  - Pages (navigations): network-first — online users always get fresh HTML,
//    offline users fall back to a cached copy (then the home shell).
//  - Immutable assets (_next/static, model images, icons, fonts): cache-first.
//  - API / auth: never touched by the worker.

const VERSION = "ga-v1";
const STATIC_CACHE = `static-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((c) => c.add("/"))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // leave cross-origin alone
  if (url.pathname.startsWith("/api/")) return; // never cache API / auth

  const isStatic =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/models/") ||
    /\.(?:png|jpe?g|webp|svg|ico|woff2?)$/.test(url.pathname);

  // Immutable assets → cache-first.
  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Pages → network-first (fresh online, cached copy offline).
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match("/")))
    );
  }
});
