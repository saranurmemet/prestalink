'use client';

import { useEffect } from 'react';

export default function ServiceWorkerUpdater() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Service worker güncellemelerini kontrol et
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
          
          // Yeni service worker bulunduğunda hemen aktif et
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Yeni versiyon hazır, kullanıcıya bildir
                  if (confirm('Yeni versiyon mevcut! Sayfayı yenilemek ister misiniz?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        });
      });

      // Service worker mesajlarını dinle
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  return null;
}

