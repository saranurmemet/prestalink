'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/layout/ProtectedPage';
import EmployerLayout from '@/components/layout/EmployerLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs, deleteJob, fetchApplicationsByJob } from '@/services/api';
import type { Job } from '@/services/types';
import { Edit, Trash2, Users, PlusCircle, AlertCircle } from 'lucide-react';

const JobListingsPage = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const jobsRes = await fetchJobs();
        const userJobs = jobsRes.data.filter((job: any) => {
          // Handle both populated (object) and non-populated (string) employerId
          const jobEmployerId = typeof job.employerId === 'object' && job.employerId !== null
            ? job.employerId._id || job.employerId
            : job.employerId;
          const userId = user?._id;
          return jobEmployerId?.toString() === userId?.toString();
        });
        setJobs(userJobs);

        // Load applicant counts for each job
        const counts: Record<string, number> = {};
        for (const job of userJobs) {
          try {
            const appsRes = await fetchApplicationsByJob(job._id);
            counts[job._id] = appsRes.data.length;
          } catch {
            counts[job._id] = 0;
          }
        }
        setApplicantCounts(counts);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleDelete = async (jobId: string) => {
    if (!confirm(t('employerJobs.confirmDelete'))) return;

    try {
      await deleteJob(jobId);
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      alert(t('employerJobs.error') || 'İlan silinirken hata oluştu');
    }
  };

  const content = (
    <EmployerLayout>
      <div className="page-container py-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {t('employerJobs.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t('employerJobs.subtitle')}</p>
          </div>
          <Link
            href="/employer/jobs/new"
            className="flex items-center gap-2 px-6 py-3 bg-brandOrange text-white rounded-lg font-medium hover:bg-brandOrange/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5" />
            {t('employerNav.createJob')}
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brandOrange border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('auth.loading')}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">{t('employerJobs.noJobs')}</p>
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brandOrange text-white rounded-lg font-medium hover:bg-brandOrange/90 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              {t('employerNav.createJob')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span>{job.location}</span>
                      {job.salary && <span className="text-brandOrange font-medium">{job.salary}</span>}
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {applicantCounts[job._id] || 0} {t('employerJobs.totalApplicants')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (job as any).closed 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {(job as any).closed ? t('employerJobs.status.closed') : t('employerJobs.status.active')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/employer/jobs/${job._id}`}
                      className="px-4 py-2 bg-brandBlue text-white rounded-lg font-medium hover:bg-brandBlue/90 transition-colors text-sm"
                    >
                      {t('employerJobs.viewApplicants')}
                    </Link>
                    <button
                      onClick={() => router.push(`/employer/jobs/${job._id}?edit=true`)}
                      className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      title={t('employerJobs.edit')}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title={t('employerJobs.delete')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployerLayout>
  );

  return <ProtectedPage roles={['recruiter', 'admin', 'superadmin']}>{content}</ProtectedPage>;
};

export default JobListingsPage;

