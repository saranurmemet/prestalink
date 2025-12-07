'use client';

import { useEffect, useState } from 'react';
import ProtectedPage from '@/components/layout/ProtectedPage';
import UserLayout from '@/components/layout/UserLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchApplicationsByUser } from '@/services/api';
import type { Application } from '@/services/types';
import { Calendar, FileText, Building2 } from 'lucide-react';

const UserApplications = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetchApplicationsByUser(user._id);
        setApplications(response.data);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, [user]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700',
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('userApplications.status.pending'),
      reviewing: t('userApplications.status.reviewing'),
      interview: t('userApplications.status.interview'),
      accepted: t('userApplications.status.accepted'),
      rejected: t('userApplications.status.rejected'),
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t('userApplications.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{t('userApplications.subtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brandBlue border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('auth.loading')}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">{t('userApplications.noApplications')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const jobInfo = typeof application.jobId === 'object' ? application.jobId : null;
              const statusColor = statusColors[application.status] || statusColors.pending;

              return (
                <div
                  key={application._id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 bg-brandBlue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-brandBlue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            {jobInfo?.title || 'İş Pozisyonu'}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {jobInfo?.location || 'Lokasyon bilgisi yok'}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{t('userApplications.appliedOn')}: {formatDate(application.createdAt)}</span>
                            </div>
                            {jobInfo?.salary && (
                              <span className="text-brandOrange font-medium">{jobInfo.salary}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {application.cvUrl && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <FileText className="w-4 h-4" />
                          <span>CV: {application.cvUrl.split('/').pop()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColor}`}
                      >
                        {getStatusLabel(application.status)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );

  return <ProtectedPage roles={['user']}>{content}</ProtectedPage>;
};

export default UserApplications;

