'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import EmployerLayout from '@/components/layout/EmployerLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchApplicationsByJob, updateApplicationStatus, fetchProfile } from '@/services/api';
import type { Application, User } from '@/services/types';
import { ArrowLeft, Download, FileText, Save, CheckCircle2 } from 'lucide-react';

const ApplicantReviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [application, setApplication] = useState<Application | null>(null);
  const [applicant, setApplicant] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!params.id || !params.applicantId) return;
      setLoading(true);
      try {
        const appsRes = await fetchApplicationsByJob(params.id as string);
        const foundApp = appsRes.data.find((app: Application) => {
          const userId = typeof app.userId === 'object' ? app.userId._id : app.userId;
          return userId === params.applicantId;
        });

        if (foundApp) {
          setApplication(foundApp);
          setStatus(foundApp.status);
          
          // Get applicant data
          const applicantData = typeof foundApp.userId === 'object' ? foundApp.userId : null;
          if (applicantData) {
            setApplicant(applicantData as User);
          } else {
            // Fetch user profile
            try {
              const userRes = await fetchProfile();
              if (userRes.data.user._id === foundApp.userId) {
                setApplicant(userRes.data.user);
              }
            } catch {}
          }
        }
      } catch (error) {
        console.error('Error loading applicant:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params]);

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return;
    setSaving(true);
    setSaved(false);

    try {
      await updateApplicationStatus(application._id, {
        status: newStatus,
        message: notes,
      });
      setStatus(newStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!application) return;
    setSaving(true);
    setSaved(false);

    try {
      await updateApplicationStatus(application._id, {
        status: status,
        message: notes,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Notlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: t('applicantReview.status.pending') },
    { value: 'viewed', label: t('applicantReview.status.viewed') },
    { value: 'interview', label: t('applicantReview.status.interview') },
    { value: 'accepted', label: t('applicantReview.status.accepted') },
    { value: 'rejected', label: t('applicantReview.status.rejected') },
  ];

  const content = (
    <EmployerLayout>
      <div className="page-container py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/employer/jobs/${params.id}`}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brandOrange mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('applicantReview.backToJob')}
          </Link>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brandOrange border-t-transparent"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">{t('applicantReview.loading')}</p>
            </div>
          ) : !application || !applicant ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">Aday bulunamadı</p>
            </div>
          ) : (
            <>
              {/* Applicant Profile */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                  {t('applicantReview.title')}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                      {t('applicantReview.profile')}
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('auth.name')}</p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{applicant.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('auth.email')}</p>
                        <p className="text-slate-800 dark:text-slate-200">{applicant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('auth.phone')}</p>
                        <p className="text-slate-800 dark:text-slate-200">{applicant.phone}</p>
                      </div>
                      {(applicant as any)?.country && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('userProfile.fields.country')}</p>
                          <p className="text-slate-800 dark:text-slate-200">{(applicant as any).country}</p>
                        </div>
                      )}
                      {applicant.languages && applicant.languages.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('userProfile.fields.languages')}</p>
                          <p className="text-slate-800 dark:text-slate-200">{applicant.languages.join(', ')}</p>
                        </div>
                      )}
                      {(applicant as any)?.experienceLevel && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t('userProfile.fields.experienceLevel')}</p>
                          <p className="text-slate-800 dark:text-slate-200">{(applicant as any).experienceLevel}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                      {t('applicantReview.files')}
                    </h2>
                    <div className="space-y-3">
                      {application.cvUrl && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'https://prestalink.onrender.com'}${application.cvUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-brandBlue/10 hover:bg-brandBlue/20 rounded-lg transition-colors group"
                        >
                          <Download className="w-5 h-5 text-brandBlue" />
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {t('applicantReview.downloadCv')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {application.cvUrl.split('/').pop()}
                            </p>
                          </div>
                        </a>
                      )}

                      {application.certificates && application.certificates.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            {t('applicantReview.downloadCertificates')}
                          </p>
                          <div className="space-y-2">
                            {application.certificates.map((cert, index) => (
                              <a
                                key={index}
                                href={`${process.env.NEXT_PUBLIC_API_URL || 'https://prestalink.onrender.com'}${cert}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm"
                              >
                                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                <span className="text-slate-700 dark:text-slate-300">
                                  {cert.split('/').pop()}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Notes */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  {t('applicantReview.changeStatus')}
                </h2>

                <div className="mb-6">
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      handleStatusChange(e.target.value);
                    }}
                    disabled={saving}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('applicantReview.internalNotes')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                    placeholder={t('applicantReview.notesPlaceholder')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-brandOrange text-white rounded-lg font-medium hover:bg-brandOrange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t('applicantReview.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t('applicantReview.saveNotes')}
                      </>
                    )}
                  </button>

                  {saved && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm">{t('applicantReview.statusUpdated')}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </EmployerLayout>
  );

  return <ProtectedPage roles={['recruiter', 'admin', 'superadmin']}>{content}</ProtectedPage>;
};

export default ApplicantReviewPage;

