'use client';

import { useEffect } from 'react';

export default function ServiceWorkerUpdater() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      let refreshing = false;

      // Service worker güncellemelerini kontrol et
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            // Her 60 saniyede bir güncelleme kontrol et
            registration.update();

            // Yeni service worker bulunduğunda hemen aktif et
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  // Yeni service worker hazır olduğunda otomatik aktif et
                  if (newWorker.state === 'installed') {
                    // Eğer zaten bir controller varsa (eski service worker çalışıyorsa)
                    if (navigator.serviceWorker.controller) {
                      // SKIP_WAITING mesajı gönder - service worker'ı hemen aktif et
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                      
                      // Service worker aktif olduğunda otomatik yenile
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'activated' && !refreshing) {
                          refreshing = true;
                          window.location.reload();
                        }
                      });
                    } else {
                      // İlk yükleme - hemen aktif et
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                    }
                  }
                });
              }
            });
          });
        });
      };

      // İlk yüklemede kontrol et
      checkForUpdates();

      // Her 60 saniyede bir otomatik kontrol et
      const updateInterval = setInterval(checkForUpdates, 60000);

      // Service worker mesajlarını dinle
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // Sayfa görünür olduğunda kontrol et (kullanıcı uygulamaya geri döndüğünde)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          checkForUpdates();
        }
      });

      // Focus olduğunda kontrol et
      window.addEventListener('focus', checkForUpdates);

      // Cleanup
      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('focus', checkForUpdates);
      };
    }
  }, []);

  return null;
}

