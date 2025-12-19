'use client';

import { useEffect, useRef } from 'react';

export default function PWAUpdatePrompt() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const refreshingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Ensure the service worker is registered (required for Push + updates)
    const ensureRegistered = async () => {
      const existing = await navigator.serviceWorker.getRegistration();
      if (existing) return existing;
      return navigator.serviceWorker.register('/sw.js');
    };

    const checkForUpdates = () => {
      registrationRef.current?.update().catch(() => {});
    };

    const onControllerChange = () => {
      // Avoid reload loops
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      window.location.reload();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    window.addEventListener('focus', checkForUpdates);
    window.addEventListener('online', checkForUpdates);
    document.addEventListener('visibilitychange', onVisibilityChange);

    let interval: number | undefined;
    let updateFoundHandler: (() => void) | undefined;

    ensureRegistered()
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        registrationRef.current = reg;

        // Check on load + periodically
        checkForUpdates();
        interval = window.setInterval(checkForUpdates, 60_000);

        // When a new SW is installed, force activation (for configs that support waiting)
        updateFoundHandler = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // If there is a waiting worker, ask it to activate immediately.
              // (With skipWaiting:true this is usually unnecessary, but harmless.)
              if (reg.waiting) {
                reg.waiting.postMessage({ type: 'SKIP_WAITING' });
              }
            }
          });
        };

        reg.addEventListener('updatefound', updateFoundHandler);
      })
      .catch(() => {});

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.removeEventListener('focus', checkForUpdates);
      window.removeEventListener('online', checkForUpdates);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (interval) window.clearInterval(interval);
      if (updateFoundHandler && registrationRef.current) {
        registrationRef.current.removeEventListener('updatefound', updateFoundHandler);
      }
    };
  }, []);

  return null;
}

