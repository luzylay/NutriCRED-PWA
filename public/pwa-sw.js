const CACHE_NAME = "yanapiri-wawa-v2";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "404.html"
];

// Install event: cache core files safely
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("[Service Worker] Caching core assets...");
      try {
        await cache.addAll(ASSETS);
      } catch (err) {
        console.warn("[Service Worker] Advertencia al precargar lista estática:", err);
      }
    })
  );
  self.skipWaiting();
});

// Activate event: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Network-First for JS/HTML, Cache-First for images/fonts
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests and external APIs
  if (event.request.method !== "GET" || event.request.url.includes("/api/") || event.request.url.includes("/auth/")) {
    return;
  }
  
  const url = new URL(event.request.url);

  // Static assets (images, fonts) -> Cache-First
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|woff2|woff|ttf|webp|css)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
            }
            return response;
          }).catch(() => cached)
        );
      })
    );
    return;
  }

  // Application JS & HTML -> Network-First (with instant local fallback)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        console.log("[Service Worker] Servidor no disponible o modo offline. Sirviendo desde caché:", event.request.url);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === "navigate") {
            return caches.match("index.html") || caches.match("./");
          }
        });
      })
  );
});

// BACKGROUND SYNC API
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-yanapiri-measurements") {
    console.log("[Service Worker] Sincronización en segundo plano iniciada...");
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "BACKGROUND_SYNC_TRIGGERED" });
        });
      })
    );
  }
});

// WEB PUSH NOTIFICATIONS API
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Yanapiri Wawa", body: "Recordatorio de control de crecimiento CRED" };
  
  const options = {
    body: data.body,
    icon: "./foods/f1.png",
    badge: "./foods/f1.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "./familia"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || "./")
  );
});
