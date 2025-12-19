'use client';

import { useEffect, useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchApplicationsByUser, fetchJobs } from '@/services/api';
import { BarChart3, FileText, CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react';

const StatisticsPage = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    reviewing: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
    totalJobs: 0,
    profileCompletion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      if (!user) return;

      try {
        const [applicationsRes, jobsRes] = await Promise.all([
          fetchApplicationsByUser(user._id),
          fetchJobs(),
        ]);

        const applications = applicationsRes.data;
        const jobs = jobsRes.data;

        const statusCounts = {
          pending: 0,
          reviewing: 0,
          viewed: 0,
          interview: 0,
          accepted: 0,
          rejected: 0,
        };

        applications.forEach((app: any) => {
          const status = app.status || 'pending';
          if (statusCounts[status as keyof typeof statusCounts] !== undefined) {
            statusCounts[status as keyof typeof statusCounts]++;
          }
        });

        // Calculate profile completion
        const profileFields = [
          user.name,
          user.email,
          user.phone,
          (user as any).country,
          (user as any).bio,
          (user as any).experienceLevel,
          user.languages?.length > 0,
          user.profilePhoto,
        ];
        const completedFields = profileFields.filter(Boolean).length;
        const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

        setStats({
          totalApplications: applications.length,
          pending: statusCounts.pending,
          reviewing: statusCounts.reviewing,
          interview: statusCounts.interview,
          accepted: statusCounts.accepted,
          rejected: statusCounts.rejected,
          totalJobs: jobs.length,
          profileCompletion,
        });
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [user]);

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t('userStatistics.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('userStatistics.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandBlue mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Completion */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {t('userStatistics.profileCompletion')}
                </h3>
                <TrendingUp className="w-5 h-5 text-brandBlue" />
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>{t('userStatistics.completionRate')}</span>
                  <span className="font-semibold">{stats.profileCompletion}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-brandBlue h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.profileCompletion}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Applications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {t('userStatistics.totalApplications')}
                </h3>
                <FileText className="w-5 h-5 text-brandBlue" />
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {stats.totalApplications}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {t('userStatistics.applicationsSent')}
              </p>
            </div>

            {/* Total Jobs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {t('userStatistics.totalJobs')}
                </h3>
                <BarChart3 className="w-5 h-5 text-brandBlue" />
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {stats.totalJobs}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {t('userStatistics.activeJobs')}
              </p>
            </div>

            {/* Application Status Cards */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                {t('userStatistics.applicationStatuses')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-slate-700 dark:text-slate-300">{t('userStatistics.pending')}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-700 dark:text-slate-300">{t('userStatistics.reviewing')}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.reviewing}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-slate-700 dark:text-slate-300">{t('userStatistics.interview')}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.interview}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">{t('userStatistics.accepted')}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.accepted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-slate-700 dark:text-slate-300">{t('userStatistics.rejected')}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.rejected}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {t('userStatistics.successRate')}
                </h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.totalApplications > 0
                  ? Math.round((stats.accepted / stats.totalApplications) * 100)
                  : 0}
                %
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {t('userStatistics.acceptedApplications')}
              </p>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );

  return <ProtectedPage>{content}</ProtectedPage>;
};

export default StatisticsPage;





