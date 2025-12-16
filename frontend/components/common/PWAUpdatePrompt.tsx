'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { RefreshCw, X } from 'lucide-react';

export default function PWAUpdatePrompt() {
  const { t } = useLanguage();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Service worker registration kontrolü
    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg);

      // Güncelleme kontrolü
      const checkForUpdates = () => {
        reg.update();
      };

      // Her 60 saniyede bir güncelleme kontrol et
      const interval = setInterval(checkForUpdates, 60000);

      // Service worker güncelleme eventi
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Yeni service worker yüklendi, kullanıcıya bildir
              setUpdateAvailable(true);
            }
          });
        }
      });

      // Sayfa yüklendiğinde kontrol et
      checkForUpdates();

      return () => clearInterval(interval);
    });

    // Service worker controller değişikliği
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Yeni service worker aktif oldu, sayfayı yenile
      window.location.reload();
    });
  }, []);

  const handleUpdate = async () => {
    if (!registration || !registration.waiting) return;

    setIsUpdating(true);

    // Service worker'a skipWaiting mesajı gönder
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Sayfayı yenile
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
        <div className="flex-shrink-0">
          <RefreshCw className={`w-5 h-5 text-brandBlue ${isUpdating ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {t('pwa.updateAvailable') || 'Yeni güncelleme mevcut!'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {t('pwa.updateDescription') || 'Uygulamayı güncellemek için yenileyin.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-brandBlue text-white text-sm font-medium rounded-lg hover:bg-brandBlue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating 
              ? (t('pwa.updating') || 'Güncelleniyor...') 
              : (t('pwa.update') || 'Güncelle')
            }
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
