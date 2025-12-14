'use client';

import { useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { Settings, Bell, Globe, Moon, Sun, Shield, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

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




