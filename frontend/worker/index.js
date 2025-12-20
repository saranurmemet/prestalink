/* eslint-disable no-restricted-globals */

// This file is built by next-pwa and injected into sw.js via importScripts().
// It lets us add custom service worker handlers (e.g. Push Notifications)
// without committing generated sw.js/workbox files.

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
      const existing = allClients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        await existing.focus();
        try {
          existing.postMessage({ type: 'NAVIGATE', url });
        } catch (_) {}
        return;
      }
      await self.clients.openWindow(url);
    })()
  );
});



