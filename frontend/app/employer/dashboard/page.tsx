'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/layout/ProtectedPage';
import EmployerLayout from '@/components/layout/EmployerLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  fetchJobs,
  fetchNotifications,
  fetchApplicationsByJob,
} from '@/services/api';
import type { Application, Job, User } from '@/services/types';
import { Briefcase, Globe2, Bell, PlusCircle, Users, Building2 } from 'lucide-react';
import { getProfilePhotoUrl } from '@/utils/apiUrl';

const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [countries, setCountries] = useState<Set<string>>(new Set());
  const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({});
  const [recentApplications, setRecentApplications] = useState<
    Array<{ application: Application; job: Job; applicant: User | null }>
  >([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsRes, notifRes] = await Promise.all([
          fetchJobs().catch(() => ({ data: [] })),
          fetchNotifications().catch(() => ({ data: [] })),
        ]);

        const userJobs = (jobsRes.data || []).filter(
          (job: any) => job.employerId === user?._id || job.employerId?._id === user?._id
        );
        setJobs(userJobs);

        const notifications = notifRes.data || [];
        setUnreadNotifications(notifications.filter((n: any) => !n.read).length);
        
        // Calculate unique countries
        const uniqueCountries = new Set<string>();
        userJobs.forEach((job: Job) => {
          if (job.location) {
            const parts = job.location.split(',');
            if (parts.length > 1) {
              uniqueCountries.add(parts[parts.length - 1].trim());
            } else {
              uniqueCountries.add(job.location);
            }
          }
        });
        setCountries(uniqueCountries);

        // Fetch applications per job (counts + recent list)
        const counts: Record<string, number> = {};
        let total = 0;
        const combined: Array<{ application: Application; job: Job; applicant: User | null }> = [];

        await Promise.all(
          userJobs.map(async (job: Job) => {
            const appsRes = await fetchApplicationsByJob(job._id).catch(() => ({ data: [] }));
            const apps: Application[] = appsRes.data || [];
            counts[job._id] = apps.length;
            total += apps.length;

            apps.forEach((application) => {
              const applicant = typeof application.userId === 'object' ? (application.userId as User) : null;
              combined.push({ application, job, applicant });
            });
          })
        );

        setApplicantCounts(counts);
        setTotalApplicants(total);

        combined.sort((a, b) => {
          const aTime = new Date((a.application as any).createdAt || 0).getTime();
          const bTime = new Date((b.application as any).createdAt || 0).getTime();
          return bTime - aTime;
        });
        setRecentApplications(combined.slice(0, 6));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const activeJobs = jobs.filter((job: any) => !job.closed);

  const profileCompletion = user
    ? (() => {
        let completed = 0;
        const fields = [
          'companyName',
          'companyDescription',
          'industry',
          'country',
          'city',
          'email',
          'phone',
          'profilePhoto',
        ];
        fields.forEach((field) => {
          if ((user as any)[field]) completed++;
        });
        return Math.round((completed / fields.length) * 100);
      })()
    : 0;

  const content = (
    <EmployerLayout>
      <div className="page-container py-8 px-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-brandOrange to-orange-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex items-center gap-6">
              <div className="flex-shrink-0 relative">
                <img
                  src={getProfilePhotoUrl((user as any)?.profilePhoto)}
                  alt={(user as any)?.companyName || user?.name || 'Company'}
                  className="w-20 h-20 rounded-2xl border-4 border-white/30 shadow-xl object-cover bg-white/10"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {t('employerDashboard.welcome', { name: (user as any)?.companyName || user?.name || 'Employer' })}
                </h1>
                <p className="text-white/90 mb-3">{t('employerDashboard.subtitle')}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/90">{t('employerDashboard.profileCompletion')}</span>
                    <span className="text-sm font-semibold text-white">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
            onClick={() => router.push('/employer/jobs')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-brandBlue/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-brandBlue" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t('employerDashboard.totalActiveJobs')}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{activeJobs.length}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
            onClick={() => router.push('/employer/jobs')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t('employerDashboard.totalApplicants')}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{totalApplicants}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
            onClick={() => router.push('/employer/notifications')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t('employerDashboard.unreadNotifications')}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{unreadNotifications}</p>
              </div>
            </div>
          </div>

          <div
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
            onClick={() => router.push('/employer/profile')}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-brandOrange/10 rounded-lg flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-brandOrange" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t('employerDashboard.countriesHiring')}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{countries.size}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {t('employerDashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/employer/jobs/new"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandOrange group transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-brandOrange/10 rounded-lg flex items-center justify-center group-hover:bg-brandOrange transition-colors">
                <PlusCircle className="w-6 h-6 text-brandOrange group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('employerDashboard.createNewJob')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('employerDashboard.createJobDesc')}</p>
              </div>
            </Link>

            <Link
              href="/employer/jobs"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-brandBlue/10 rounded-lg flex items-center justify-center group-hover:bg-brandBlue transition-colors">
                <Briefcase className="w-6 h-6 text-brandBlue group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('employerDashboard.viewJobListings')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('employerJobs.subtitle')}</p>
              </div>
            </Link>

            <Link
              href="/employer/profile"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-green-500 group transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <Building2 className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('employerDashboard.completeProfile')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('employerDashboard.completeProfileDesc')}</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Applicants */}
        {recentApplications.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('employerDashboard.recentApplicants')}
              </h2>
              <Link
                href="/employer/jobs"
                className="text-brandOrange hover:text-brandOrange/80 font-medium text-sm"
              >
                {t('employerDashboard.viewAll')} →
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
              {recentApplications.map(({ application, job, applicant }) => (
                <Link
                  key={application._id}
                  href={`/employer/jobs/${job._id}/applicants/${typeof application.userId === 'object' ? (application.userId as any)._id : application.userId}`}
                  className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {applicant?.name || t('employerDashboard.unknownApplicant')}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {job.title}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brandOrange/10 text-brandOrange">
                    {t(`employerJobDetail.status.${application.status}`)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Jobs */}
        {jobs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('employerDashboard.recentJobs')}
              </h2>
              <Link
                href="/employer/jobs"
                className="text-brandOrange hover:text-brandOrange/80 font-medium text-sm"
              >
                {t('jobs.viewFullPage')} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.slice(0, 6).map((job) => (
                <Link
                  key={job._id}
                  href={`/employer/jobs/${job._id}`}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandOrange group"
                >
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-brandOrange transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {job.location}
                  </p>
                  {job.salary && (
                    <p className="text-sm font-medium text-brandOrange mb-2">
                      {job.salary}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {t('employerDashboard.applicantsCount', { count: applicantCounts[job._id] || 0 })}
                    </span>
                    <span className="text-brandOrange group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </EmployerLayout>
  );

  return <ProtectedPage roles={['recruiter', 'admin', 'superadmin']}>{content}</ProtectedPage>;
};

export default EmployerDashboard;

