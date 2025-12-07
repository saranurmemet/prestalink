'use client';

import { useEffect, useState } from 'react';
import ProtectedPage from '@/components/layout/ProtectedPage';
import UserLayout from '@/components/layout/UserLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchNotifications, markNotificationsRead } from '@/services/api';
import type { Notification } from '@/services/types';
import { Bell, CheckCircle2 } from 'lucide-react';

const UserNotifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetchNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    setMarkingRead(true);
    try {
      await markNotificationsRead();
      setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    } finally {
      setMarkingRead(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Az önce';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;

    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {t('userNotifications.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t('userNotifications.subtitle')}</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingRead}
              className="px-4 py-2 bg-brandBlue text-white rounded-lg font-medium hover:bg-brandBlue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t('userNotifications.markAllRead')}
            </button>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {unreadCount} {t('userNotifications.unread')} bildirim
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brandBlue border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('auth.loading')}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">{t('userNotifications.noNotifications')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`
                  bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border transition-all
                  ${notification.read
                    ? 'border-slate-200 dark:border-slate-700'
                    : 'border-brandBlue/50 dark:border-brandBlue/30 bg-blue-50/50 dark:bg-blue-900/10'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${notification.read
                      ? 'bg-slate-100 dark:bg-slate-700'
                      : 'bg-brandBlue/10 dark:bg-brandBlue/20'
                    }
                  `}>
                    <Bell className={`
                      w-5 h-5
                      ${notification.read
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-brandBlue'
                      }
                    `} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`
                        font-semibold
                        ${notification.read
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-900 dark:text-slate-100'
                        }
                      `}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-brandBlue rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );

  return <ProtectedPage roles={['user']}>{content}</ProtectedPage>;
};

export default UserNotifications;

