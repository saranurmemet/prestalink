'use client';

import { useEffect, useMemo, useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import { Settings, Bell, Globe, Moon, Sun, Shield, Trash2, Smartphone } from 'lucide-react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label = 'timeout') {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(label));
      }, ms);
    }),
  ]);
}

const SettingsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [pushStatus, setPushStatus] = useState<{
    supported: boolean;
    permission: NotificationPermission | 'unknown';
    subscribed: boolean;
    loading: boolean;
    error?: string;
  }>({
    supported: false,
    permission: 'unknown',
    subscribed: false,
    loading: true,
  });

  const pushSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.isSecureContext &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }, []);

  const getSWRegistration = async () => {
    // Avoid waiting forever for navigator.serviceWorker.ready (it only resolves when controlled)
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing) return existing;

    try {
      return await withTimeout(navigator.serviceWorker.ready, 4000, 'serviceWorker.ready timeout');
    } catch (_) {
      // Best-effort register (works even if not yet controlled)
      return await navigator.serviceWorker.register('/sw.js');
    }
  };

  const refreshPushStatus = async () => {
    if (!pushSupported) {
      setPushStatus((s) => ({ ...s, supported: false, loading: false }));
      return;
    }

    setPushStatus((s) => ({ ...s, supported: true, loading: true, error: undefined }));

    try {
      const permission = Notification.permission;
      const reg = await getSWRegistration();
      const sub = await withTimeout(reg.pushManager.getSubscription(), 4000, 'getSubscription timeout');

      setPushStatus({
        supported: true,
        permission,
        subscribed: !!sub,
        loading: false,
      });
    } catch (e: any) {
      setPushStatus({
        supported: true,
        permission: (typeof Notification !== 'undefined' ? Notification.permission : 'unknown') as any,
        subscribed: false,
        loading: false,
        error: e?.message || 'Push status error',
      });
    }
  };

  useEffect(() => {
    refreshPushStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enablePush = async () => {
    if (!pushSupported) return;

    setPushStatus((s) => ({ ...s, loading: true, error: undefined }));

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushStatus((s) => ({ ...s, loading: false, permission, subscribed: false }));
        return;
      }

      const keyRes = await api.get<{ key: string }>('/notifications/push/public-key');
      const publicKey = keyRes.data?.key;
      if (!publicKey) throw new Error('Missing VAPID public key');

      const reg = await getSWRegistration();
      const existing = await withTimeout(reg.pushManager.getSubscription(), 4000, 'getSubscription timeout');

      const subscription =
        existing ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      await api.post('/notifications/push/subscribe', {
        subscription,
        deviceName: 'User Settings',
      });

      await refreshPushStatus();
    } catch (e: any) {
      setPushStatus((s) => ({ ...s, loading: false, error: e?.message || 'Enable push failed' }));
    }
  };

  const disablePush = async () => {
    if (!pushSupported) return;
    setPushStatus((s) => ({ ...s, loading: true, error: undefined }));

    try {
      const reg = await getSWRegistration();
      const sub = await withTimeout(reg.pushManager.getSubscription(), 4000, 'getSubscription timeout');
      if (sub) {
        await api.post('/notifications/push/unsubscribe', { endpoint: sub.endpoint });
        await sub.unsubscribe();
      }
      await refreshPushStatus();
    } catch (e: any) {
      setPushStatus((s) => ({ ...s, loading: false, error: e?.message || 'Disable push failed' }));
    }
  };

  const sendTestPushToMe = async () => {
    setPushStatus((s) => ({ ...s, loading: true, error: undefined }));
    try {
      await api.post('/notifications/push/test-me', {
        title: 'PrestaLink',
        body: 'Test: Uygulama kapalıyken de bu bildirim gelmeli.',
        url: '/user/notifications',
      });
      setPushStatus((s) => ({ ...s, loading: false }));
    } catch (e: any) {
      setPushStatus((s) => ({ ...s, loading: false, error: e?.message || 'Test push failed' }));
    }
  };

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t('userSettings.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('userSettings.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-brandBlue" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('userSettings.notifications.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {t('userSettings.notifications.email.label')}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('userSettings.notifications.email.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email: e.target.checked })
                  }
                  className="w-5 h-5 text-brandBlue rounded focus:ring-brandBlue"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {t('userSettings.notifications.push.label')}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('userSettings.notifications.push.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) =>
                    setNotifications({ ...notifications, push: e.target.checked })
                  }
                  className="w-5 h-5 text-brandBlue rounded focus:ring-brandBlue"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {t('userSettings.notifications.sms.label')}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('userSettings.notifications.sms.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) =>
                    setNotifications({ ...notifications, sms: e.target.checked })
                  }
                  className="w-5 h-5 text-brandBlue rounded focus:ring-brandBlue"
                />
              </label>
            </div>
          </div>

          {/* Push Notifications (Real) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-5 h-5 text-brandBlue" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Push Bildirimleri (Canlı)
              </h2>
            </div>

            {!pushSupported ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Bu cihaz/tarayıcı push bildirimlerini desteklemiyor.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>İzin: <span className="font-semibold">{pushStatus.permission}</span></p>
                  <p>Abonelik: <span className="font-semibold">{pushStatus.subscribed ? 'var' : 'yok'}</span></p>
                  {pushStatus.error && (
                    <p className="text-red-600 dark:text-red-400 mt-1">{pushStatus.error}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {!pushStatus.subscribed ? (
                    <button
                      onClick={enablePush}
                      disabled={pushStatus.loading}
                      className="px-4 py-2 rounded-lg bg-brandBlue text-white text-sm font-semibold hover:bg-brandBlue/90 disabled:opacity-50"
                    >
                      Bildirimleri Aç
                    </button>
                  ) : (
                    <button
                      onClick={disablePush}
                      disabled={pushStatus.loading}
                      className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                    >
                      Bildirimleri Kapat
                    </button>
                  )}
                  <button
                    onClick={sendTestPushToMe}
                    disabled={pushStatus.loading || !pushStatus.subscribed}
                    className="px-4 py-2 rounded-lg bg-brandOrange text-white text-sm font-semibold hover:bg-brandOrange/90 disabled:opacity-50"
                  >
                    Test Bildirimi Gönder
                  </button>
                  <button
                    onClick={refreshPushStatus}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
                  >
                    Yenile
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Not: iPhone’da push için uygulamanın “Ana ekrana ekli” (PWA installed) olması gerekir.
                </p>
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-brandBlue" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('userSettings.privacy.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {t('userSettings.privacy.profileVisibility.label')}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('userSettings.privacy.profileVisibility.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-brandBlue rounded focus:ring-brandBlue"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {t('userSettings.privacy.cvVisibility.label')}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('userSettings.privacy.cvVisibility.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-brandBlue rounded focus:ring-brandBlue"
                />
              </label>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-brandBlue" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('userSettings.account.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-left">
                {t('userSettings.account.changePassword')}
              </button>
              <button className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {t('userSettings.account.deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );

  return <ProtectedPage>{content}</ProtectedPage>;
};

export default SettingsPage;




