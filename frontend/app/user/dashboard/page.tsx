'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import UserLayout from '@/components/layout/UserLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  fetchJobs,
  fetchApplicationsByUser,
  fetchNotifications,
} from '@/services/api';
import type { Job, Application, Notification } from '@/services/types';
import { Edit3, Briefcase, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { getProfilePhotoUrl } from '@/utils/apiUrl';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasCV, setHasCV] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes, notifRes] = await Promise.all([
          fetchJobs().catch(() => ({ data: [] })),
          user ? fetchApplicationsByUser(user._id).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          fetchNotifications().catch(() => ({ data: [] })),
        ]);
        // Remove duplicates based on title + location + salary
        const uniqueJobs = jobsRes.data.filter((job, index, self) =>
          index === self.findIndex((j) =>
            j.title === job.title &&
            j.location === job.location &&
            j.salary === job.salary
          )
        );
        setJobs(uniqueJobs);
        setApplications(appsRes.data);
        setNotifications(notifRes.data);
        
        // Check if user has CV uploaded (check from applications)
        const hasUploadedCV = appsRes.data.some((app: Application) => app.cvUrl);
        setHasCV(hasUploadedCV);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const recommendedJobs = jobs.slice(0, 4);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-brandBlue to-brandBlue/80 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <img
                  src={getProfilePhotoUrl(user?.profilePhoto)}
                  alt={user?.name || 'Profile'}
                  className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl object-cover"
                />
              </div>
              {/* Welcome Text */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {t('userDashboard.welcomeUser').replace('{name}', user?.name || 'Kullanıcı')}
                </h1>
                <p className="text-white/90">{t('userDashboard.subtitle')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* CV Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t('userDashboard.cvStatus')}
              </h3>
              {hasCV || user?.cvUrl ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className={`text-2xl font-bold ${hasCV || user?.cvUrl ? 'text-green-600' : 'text-red-600'}`}>
              {hasCV || user?.cvUrl ? t('userDashboard.cvUploaded') : t('userDashboard.cvNotUploaded')}
            </p>
            {(hasCV || user?.cvUrl) && (
              <Link
                href="/user/cv"
                className="mt-3 inline-flex items-center gap-2 text-sm text-brandBlue hover:text-brandBlue/80 font-medium"
              >
                <FileText className="w-4 h-4" />
                CV'yi Görüntüle
              </Link>
            )}
          </div>

          {/* Total Applications */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('userDashboard.totalApplications')}
            </h3>
            <p className="text-2xl font-bold text-brandBlue">{applications.length}</p>
          </div>

          {/* New Job Matches */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('userDashboard.newJobMatches')}
            </h3>
            <p className="text-2xl font-bold text-brandOrange">{recommendedJobs.length}</p>
          </div>

          {/* Unread Notifications */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('userDashboard.metrics.notifications')}
            </h3>
            <p className="text-2xl font-bold text-purple-600">{unreadNotifications}</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {t('userDashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/user/profile"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group"
            >
              <div className="w-12 h-12 bg-brandBlue/10 rounded-lg flex items-center justify-center group-hover:bg-brandBlue transition-colors">
                <Edit3 className="w-6 h-6 text-brandBlue" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('userDashboard.editProfile')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Profilinizi güncelleyin</p>
              </div>
            </Link>

            <Link
              href="/user/jobs"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandOrange group"
            >
              <div className="w-12 h-12 bg-brandOrange/10 rounded-lg flex items-center justify-center group-hover:bg-brandOrange transition-colors">
                <Briefcase className="w-6 h-6 text-brandOrange" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('userDashboard.viewJobs')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">İş ilanlarını görüntüleyin</p>
              </div>
            </Link>

            <Link
              href="/user/applications"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('userDashboard.viewApplications')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('userApplications.subtitle')}</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('userDashboard.newJobMatches')}
              </h2>
              <Link
                href="/user/jobs"
                className="text-brandBlue hover:text-brandBlue/80 font-medium text-sm"
              >
                {t('jobs.viewFullPage')} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedJobs.map((job) => {
                const jobInfo = typeof job === 'object' ? job : null;
                if (!jobInfo) return null;
                return (
                  <Link
                    key={jobInfo._id}
                    href={`/user/jobs/${jobInfo._id}`}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group"
                  >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-brandBlue transition-colors">
                      {jobInfo.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {jobInfo.location}
                    </p>
                    {jobInfo.salary && (
                      <p className="text-sm font-medium text-brandOrange mb-2">
                        {jobInfo.salary}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                      {jobInfo.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </UserLayout>
  );

  return <ProtectedPage roles={['user']}>{content}</ProtectedPage>;
};

export default UserDashboard;
