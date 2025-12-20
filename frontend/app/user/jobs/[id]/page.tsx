'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import UserLayout from '@/components/layout/UserLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJob, submitApplication, fetchApplicationsByUser } from '@/services/api';
import type { Job, Application } from '@/services/types';
import { MapPin, DollarSign, Briefcase, Globe, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { getStaticFileUrl } from '@/utils/apiUrl';

const JobDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasCV, setHasCV] = useState(false);
  const [showCvWarning, setShowCvWarning] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      if (!params.id) return;
      setLoading(true);
      try {
        const response = await fetchJob(params.id as string);
        setJob(response.data);
      } catch (error) {
        console.error('Error loading job:', error);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [params.id]);

  useEffect(() => {
    const checkCV = async () => {
      if (!user) return;
      // Check if user has CV in profile or in previous applications
      const hasProfileCV = !!user.cvUrl;
      try {
        const appsResponse = await fetchApplicationsByUser(user._id);
        const hasUploadedCV = appsResponse.data.some((app: Application) => app.cvUrl);
        setHasCV(hasProfileCV || hasUploadedCV);
      } catch (error) {
        console.error('Error checking CV:', error);
        // Fallback to profile CV check
        setHasCV(hasProfileCV);
      }
    };
    checkCV();
  }, [user]);

  const handleApply = async () => {
    if (!user || !job) return;

    // Check if CV exists
    if (!hasCV && !user.cvUrl) {
      setShowCvWarning(true);
      return;
    }

    setApplying(true);
    setShowCvWarning(false);

    try {
      const formData = new FormData();
      formData.append('jobId', job._id);
      
      // Get CV file from user profile
      if (user.cvUrl) {
        try {
          // Fetch CV file from URL using getStaticFileUrl helper
          const cvUrl = getStaticFileUrl(user.cvUrl);
          
          // Add credentials and proper headers for fetch
          const cvResponse = await fetch(cvUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*',
            },
          });
          
          if (cvResponse.ok) {
            const cvBlob = await cvResponse.blob();
            // Get file extension from URL or default to pdf
            const fileName = user.cvUrl.split('/').pop() || `cv_${user._id}.pdf`;
            // Determine MIME type from blob or file extension
            let mimeType = cvBlob.type || 'application/pdf';
            if (!mimeType || mimeType === 'application/octet-stream') {
              const ext = fileName.split('.').pop()?.toLowerCase();
              if (ext === 'docx') {
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              } else if (ext === 'doc') {
                mimeType = 'application/msword';
              } else {
                mimeType = 'application/pdf';
              }
            }
            const cvFile = new File([cvBlob], fileName, { type: mimeType });
            formData.append('cv', cvFile);
          } else {
            // If CV fetch fails, try to send application with CV URL instead
            // Backend will use the user's profile CV URL if file upload fails
            console.warn('CV fetch failed, attempting to use profile CV URL:', cvResponse.status);
            // Continue without file - backend will use user.cvUrl
            formData.append('useProfileCV', 'true');
          }
        } catch (cvError: any) {
          // If fetch completely fails, try to use profile CV URL
          console.warn('CV fetch error, attempting to use profile CV URL:', cvError);
          // Continue without file - backend will use user.cvUrl
          formData.append('useProfileCV', 'true');
        }
      } else {
        // If no CV in profile, show warning
        setShowCvWarning(true);
        setApplying(false);
        return;
      }
      
      await submitApplication(formData);
      setSuccessMessage(true);
      
      // Redirect to applications page after 2 seconds
      setTimeout(() => {
        router.push('/user/applications');
      }, 2000);
    } catch (error: any) {
      console.error('Error applying:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Başvuru gönderilemedi';
      alert(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/user/jobs"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brandBlue mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('jobDetail.backToJobs')}
          </Link>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brandBlue border-t-transparent"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">{t('auth.loading')}</p>
            </div>
          ) : !job ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">İş bulunamadı</p>
            </div>
          ) : (
            <>
              {/* Job Header */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  {job.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {job.location && (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-5 h-5 text-brandBlue" />
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

                {/* CV Warning */}
                {showCvWarning && (
                  <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                        {t('jobDetail.cvRequired')}
                      </p>
                      <Link
                        href="/user/profile"
                        className="inline-block text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
                      >
                        {t('jobDetail.uploadCv')} →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {t('jobDetail.applicationSuccess')}
                    </p>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={handleApply}
                  disabled={applying || successMessage}
                  className="w-full md:w-auto px-8 py-4 bg-brandOrange text-white rounded-lg font-semibold text-lg hover:bg-brandOrange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {applying ? 'Gönderiliyor...' : successMessage ? 'Başvuruldu!' : t('jobDetail.applyNow')}
                </button>
              </div>

              {/* Job Description */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  {t('jobDetail.description')}
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Company Info (if available) */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  {t('jobDetail.company')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('jobDetail.companyInfoComingSoon')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );

  return <ProtectedPage roles={['user']}>{content}</ProtectedPage>;
};

export default JobDetail;

