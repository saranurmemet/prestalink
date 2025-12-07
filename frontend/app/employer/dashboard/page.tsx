'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import EmployerLayout from '@/components/layout/EmployerLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  fetchJobs,
  fetchNotifications,
} from '@/services/api';
import type { Job, Application } from '@/services/types';
import { PlusCircle, Briefcase, Users, MapPin, CheckCircle2 } from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [countries, setCountries] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const jobsRes = await fetchJobs().catch(() => ({ data: [] }));
        const userJobs = jobsRes.data.filter((job: any) => 
          job.employerId === user?._id || job.employerId?._id === user?._id
        );
        setJobs(userJobs);
        
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

        // Calculate total applicants (would need to fetch all applications)
        setTotalApplicants(0);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const activeJobs = jobs.filter((job: any) => !job.closed);

  const content = (
    <EmployerLayout>
      <div className="page-container py-8 px-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-brandOrange to-orange-600 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">
              {t('employerDashboard.welcome').replace('{name}', user?.name || 'Employer')}
            </h1>
            <p className="text-white/90">{t('employerDashboard.subtitle')}</p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
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

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
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

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
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
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandOrange group"
            >
              <div className="w-12 h-12 bg-brandOrange/10 rounded-lg flex items-center justify-center group-hover:bg-brandOrange transition-colors">
                <PlusCircle className="w-6 h-6 text-brandOrange" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('employerDashboard.createNewJob')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('recruiterDashboard.createJob')}</p>
              </div>
            </Link>

            <Link
              href="/employer/jobs"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group"
            >
              <div className="w-12 h-12 bg-brandBlue/10 rounded-lg flex items-center justify-center group-hover:bg-brandBlue transition-colors">
                <Briefcase className="w-6 h-6 text-brandBlue" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('employerDashboard.viewJobListings')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('employerJobs.subtitle')}</p>
              </div>
            </Link>

            <Link
              href="/employer/jobs"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-green-500 group"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('employerDashboard.viewApplicants')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('employerJobs.viewApplicants')}</p>
              </div>
            </Link>
          </div>
        </section>

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
                  <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                    {job.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </EmployerLayout>
  );

  return <ProtectedPage roles={['recruiter', 'admin', 'superadmin']}>{content}</ProtectedPage>;
};

export default EmployerDashboard;

