'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import EmployerLayout from '@/components/layout/EmployerLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJob, fetchApplicationsByJob, deleteJob } from '@/services/api';
import type { Job, Application, User } from '@/services/types';
import { getStaticFileUrl } from '@/utils/apiUrl';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Globe, Users, Download, Eye, Trash2 } from 'lucide-react';

const JobDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!params.id) return;
      setLoading(true);
      try {
        const [jobRes, appsRes] = await Promise.all([
          fetchJob(params.id as string),
          fetchApplicationsByJob(params.id as string).catch(() => ({ data: [] })),
        ]);
        setJob(jobRes.data);
        setApplications(appsRes.data);
      } catch (error) {
        console.error('Error loading job:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm(t('employerJobs.confirmDelete'))) return;
    try {
      await deleteJob(params.id as string);
      router.push('/employer/jobs');
    } catch (error) {
      alert('İlan silinirken hata oluştu');
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    viewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    interview: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700',
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('employerJobDetail.status.pending'),
      reviewing: t('employerJobDetail.status.reviewing'),
      viewed: t('employerJobDetail.status.viewed'),
      interview: t('employerJobDetail.status.interview'),
      accepted: t('employerJobDetail.status.accepted'),
      rejected: t('employerJobDetail.status.rejected'),
    };
    return statusMap[status] || status;
  };

  const content = (
    <EmployerLayout>
      <div className="page-container py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/employer/jobs"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brandOrange mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('employerJobDetail.backToJobs')}
          </Link>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brandOrange border-t-transparent"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">{t('employerJobs.loading')}</p>
            </div>
          ) : !job ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">{t('employerJobDetail.notFound')}</p>
            </div>
          ) : (
            <>
              {/* Job Info */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                      {job.title}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {job.location && (
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <MapPin className="w-5 h-5 text-brandOrange" />
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('jobDetail.location')}</p>
                            <p className="font-medium">{job.location}</p>
                          </div>
                        </div>
                      )}

                      {job.salary && (
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <DollarSign className="w-5 h-5 text-brandOrange" />
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('jobDetail.salary')}</p>
                            <p className="font-medium">{job.salary}</p>
                          </div>
                        </div>
                      )}

                      {job.requiredExperience && (
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <Briefcase className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('jobDetail.experience')}</p>
                            <p className="font-medium">{job.requiredExperience}</p>
                          </div>
                        </div>
                      )}

                      {job.requiredLanguage && (
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <Globe className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('jobDetail.languages')}</p>
                            <p className="font-medium">{job.requiredLanguage}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        {t('jobDetail.description')}
                      </h2>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDelete}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors ml-4"
                    title={t('employerJobs.delete')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Applicants List */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    {t('employerJobDetail.applicants')} ({applications.length})
                  </h2>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">{t('employerJobDetail.noApplicants')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => {
                      const applicant = typeof application.userId === 'object' ? application.userId : null;
                      const applicantData = applicant as User | null;
                      const statusColor = statusColors[application.status] || statusColors.pending;

                      return (
                        <div
                          key={application._id}
                          className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                {applicantData?.name || 'Aday'}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                                    {t('employerJobDetail.applicantInfo.country')}
                                  </p>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    {(applicantData as any)?.country || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                                    {t('employerJobDetail.applicantInfo.experience')}
                                  </p>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    {(applicantData as any)?.experienceLevel || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                                    {t('employerJobDetail.applicantInfo.languages')}
                                  </p>
                                  <p className="text-slate-700 dark:text-slate-300">
                                    {applicantData?.languages?.join(', ') || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 ml-4">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColor}`}>
                                {getStatusLabel(application.status)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                            {application.cvUrl && (
                              <a
                                href={getStaticFileUrl(application.cvUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue/90 transition-colors text-sm"
                              >
                                <Download className="w-4 h-4" />
                                {t('employerJobDetail.applicantInfo.downloadCv')}
                              </a>
                            )}
                            <Link
                              href={`/employer/jobs/${params.id}/applicants/${typeof application.userId === 'object' ? application.userId._id : application.userId}`}
                              className="flex items-center gap-2 px-4 py-2 bg-brandOrange text-white rounded-lg hover:bg-brandOrange/90 transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              {t('employerJobDetail.applicantInfo.viewProfile')}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </EmployerLayout>
  );

  return <ProtectedPage roles={['recruiter', 'admin', 'superadmin']}>{content}</ProtectedPage>;
};

export default JobDetailPage;

