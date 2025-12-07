'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import EmployerLayout from '@/components/layout/EmployerLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { createJob } from '@/services/api';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const CreateJobPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    requiredExperience: '',
    requiredLanguage: '',
    workType: 'full-time',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await createJob(formData);
      setMessage({ type: 'success', text: t('createJob.success') });
      
      // Redirect to jobs list after 2 seconds
      setTimeout(() => {
        router.push('/employer/jobs');
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t('createJob.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <EmployerLayout>
      <div className="page-container py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/employer/jobs"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brandOrange mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('employerJobDetail.backToJobs')}
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {t('createJob.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t('createJob.subtitle')}</p>
          </div>

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
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('createJob.fields.jobTitle')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('createJob.fields.jobDescription')} *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  placeholder={t('createJob.placeholders.jobDescription')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('createJob.fields.location')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t('createJob.placeholders.location')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('createJob.fields.salaryRange')}
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder={t('createJob.placeholders.salaryRange')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('createJob.fields.requiredExperience')}
                  </label>
                  <input
                    type="text"
                    value={formData.requiredExperience}
                    onChange={(e) => setFormData({ ...formData, requiredExperience: e.target.value })}
                    placeholder={t('createJob.placeholders.requiredExperience')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('createJob.fields.requiredLanguages')}
                  </label>
                  <input
                    type="text"
                    value={formData.requiredLanguage}
                    onChange={(e) => setFormData({ ...formData, requiredLanguage: e.target.value })}
                    placeholder={t('createJob.placeholders.requiredLanguages')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('createJob.fields.workType')}
                  </label>
                  <select
                    value={formData.workType}
                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandOrange focus:border-transparent"
                  >
                    <option value="full-time">{t('createJob.workTypes.fullTime')}</option>
                    <option value="part-time">{t('createJob.workTypes.partTime')}</option>
                    <option value="seasonal">{t('createJob.workTypes.seasonal')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || message?.type === 'success'}
                className="px-8 py-3 bg-brandOrange text-white rounded-lg font-semibold hover:bg-brandOrange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? t('createJob.publishing') : message?.type === 'success' ? t('createJob.published') : t('createJob.publish')}
              </button>
              <Link
                href="/employer/jobs"
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {t('createJob.cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </EmployerLayout>
  );

  return <ProtectedPage roles={['recruiter', 'admin', 'superadmin']}>{content}</ProtectedPage>;
};

export default CreateJobPage;

