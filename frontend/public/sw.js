/* PrestaLink Service Worker (stable, repo-tracked)
 *
 * Purpose:
 * - Ensure /sw.js exists in production so PushManager can subscribe
 * - Handle push notifications + click navigation
 * - Provide basic runtime caching (optional) via Workbox CDN
 *
 * Note: Keep this file stable (avoid build-generated hashes).
 */

/* eslint-disable no-restricted-globals */

// Workbox (CDN) - optional; SW still works without it
try {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
} catch (e) {
  // ignore
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic runtime caching (best-effort)
if (self.workbox) {
  try {
    self.workbox.setConfig({ debug: false });

    // NetworkFirst for API (excluding auth)
    self.workbox.routing.registerRoute(
      ({ url }) => url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/auth/'),
      new self.workbox.strategies.NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
      })
    );

    // CacheFirst for static assets
    self.workbox.routing.registerRoute(
      ({ request }) => ['style', 'script', 'font'].includes(request.destination),
      new self.workbox.strategies.CacheFirst({
        cacheName: 'static-assets',
        plugins: [
          new self.workbox.expiration.ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      })
    );
  } catch (e) {
    // ignore
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    try {
      data = { body: event.data ? event.data.text() : '' };
    } catch (_) {
      data = {};
    }
  }

  const title = data.title || 'PrestaLink';
  const body = data.body || data.message || 'Yeni bir bildiriminiz var.';
  const url = data.url || '/user/dashboard';

  const options = {
    body,
    data: { url },
    icon: '/assets/logo.jpeg',
    badge: '/assets/logo.jpeg',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      // Prefer an existing tab
      for (const client of allClients) {
        try {
          if (client.url && client.url.startsWith(self.location.origin)) {
            await client.focus();
            client.navigate(url).catch(() => {});
            return;
          }
        } catch (_) {}
      }
      await self.clients.openWindow(url);
    })()
  );
});
