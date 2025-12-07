'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import EmployerLayout from '@/components/layout/EmployerLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchProfile, updateProfile } from '@/services/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const EmployerProfile = () => {
  const { user, setUser } = useAuthStore();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    industry: '',
    country: '',
    city: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      // Load company profile data (if exists in user object)
      setFormData({
        companyName: (user as any).companyName || user.name || '',
        companyDescription: (user as any).companyDescription || '',
        industry: (user as any).industry || '',
        country: (user as any).country || '',
        city: (user as any).city || '',
        contactEmail: user.email || '',
        contactPhone: user.phone || '',
      });
    }
  }, [user]);

  const isProfileComplete = () => {
    return (
      formData.companyName &&
      formData.companyDescription &&
      formData.industry &&
      formData.country &&
      formData.city &&
      formData.contactEmail &&
      formData.contactPhone
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.companyName);
      submitData.append('companyName', formData.companyName);
      submitData.append('companyDescription', formData.companyDescription);
      submitData.append('industry', formData.industry);
      submitData.append('country', formData.country);
      submitData.append('city', formData.city);
      submitData.append('email', formData.contactEmail);
      submitData.append('phone', formData.contactPhone);
      if (companyLogo) submitData.append('profilePhoto', companyLogo);

      const response = await updateProfile(submitData);
      setUser(response.data.user);
      setMessage({ type: 'success', text: t('employerProfile.saved') });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t('employerProfile.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <EmployerLayout>
      <div className="page-container py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {t('employerProfile.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t('employerProfile.subtitle')}</p>
          </div>

          {!isProfileComplete() && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {t('employerProfile.incompleteWarning')}
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mb-6 rounded-lg p-4 flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <p
                className={`text-sm ${
                  message.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                {t('employerProfile.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.companyName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.companyDescription')} *
                  </label>
                  <textarea
                    required
                    value={formData.companyDescription}
                    onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                    rows={4}
                    placeholder={t('employerProfile.fields.companyDescription')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.industry')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder={t('employerProfile.fields.industry')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.country')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.city')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.contactEmail')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.contactPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('employerProfile.fields.companyLogo')}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-brandOrange text-white rounded-lg font-medium hover:bg-brandOrange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.loading') : t('employerProfile.save')}
              </button>
              <Link
                href="/employer/dashboard"
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {t('userProfile.cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </EmployerLayout>
  );

  return <ProtectedPage roles={['recruiter', 'admin', 'superadmin']}>{content}</ProtectedPage>;
};

export default EmployerProfile;

