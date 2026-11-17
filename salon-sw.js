const ONBELLEK = "salon-v1";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(ONBELLEK).then(c => c.add("salon.html")).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  if (url.origin === location.origin && url.pathname.endsWith("/salon.html")) {
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
        .then(cevap => {
          const kopya = cevap.clone();
          caches.open(ONBELLEK).then(c => c.put("salon.html", kopya));
          return cevap;
        })
        .catch(() => caches.match("salon.html"))
    );
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(e.request).then(kayitli => kayitli || fetch(e.request).then(cevap => {
        const kopya = cevap.clone();
        caches.open(ONBELLEK).then(c => c.put(e.request, kopya));
        return cevap;
      }))
    );
  }
});
