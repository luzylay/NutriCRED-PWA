const CACHE_NAME = "yanapiri-wawa-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/app/App.tsx",
  "/src/styles/globals.css",
  "/src/styles/theme.css",
  "/src/styles/fonts.css",
  "/src/styles/index.css"
];

// Install event: cache core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching core assets...");
      return cache.addAll(ASSETS);
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

// Fetch event: Network-First strategy for HTML/JS (always fresh), Cache-First for images/fonts
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests and API endpoints
  if (event.request.method !== "GET" || event.request.url.includes("/api/") || event.request.url.includes("/auth/")) {
    return;
  }
  
  const url = new URL(event.request.url);

  // For static assets (images, fonts), use Cache-First
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|woff2|woff|ttf|webp)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        });
      })
    );
    return;
  }

  // For HTML, CSS, JS: Network-First (Guarantee always updated version!)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If we get a valid response from network, save it to cache and return it
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails (offline), fallback to cache
        console.log("[Service Worker] Offline, serving from cache:", event.request.url);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // If asking for a page and not in cache, return index.html (SPA routing)
          if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
            return caches.match("/index.html");
          }
        });
      })
  );
});

// ─── BACKGROUND SYNC API ($0 Costo) ──────────────────────────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-yanapiri-measurements") {
    console.log("[Service Worker] Ejecutando sincronización en segundo plano...");
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "BACKGROUND_SYNC_TRIGGERED" });
        });
      })
    );
  }
});

// ─── WEB PUSH NOTIFICATIONS API ($0 Costo) ────────────────────────────────────
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Yanapiri Wawa", body: "Recordatorio de control de crecimiento CRED" };
  
  const options = {
    body: data.body,
    icon: "/foods/f1.png",
    badge: "/foods/f1.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/familia"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || "/")
  );
});

