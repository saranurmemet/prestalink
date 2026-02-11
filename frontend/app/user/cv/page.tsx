'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Download, FileText } from 'lucide-react';
import Link from 'next/link';

const CVPage = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [cvContent, setCvContent] = useState<string | null>(null);

  useEffect(() => {
    const content = (user as { cvContent?: string } | null)?.cvContent?.trim();
    setCvContent(content || null);
  }, [user]);

  const displayContent = cvContent ?? '';
  const hasContent = !!cvContent;

  const handleDownload = () => {
    if (!displayContent) return;
    const blob = new Blob([displayContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (user?.name || 'CV').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    a.download = `${safeName}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedPage roles={['user']}>
      <UserLayout>
        <div className="page-container py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('userCv.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.name} – {t('userCv.subtitle')}
                </p>
              </div>
              {hasContent && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue/90 transition-colors w-fit"
                >
                  <Download className="w-5 h-5" />
                  {t('userCv.download')}
                </button>
              )}
            </div>

            {!hasContent ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-8 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {t('userCv.notFound')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  {t('userCv.uploadHint')}
                </p>
                <Link
                  href="/user/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue/90 transition-colors"
                >
                  {t('userProfile.title')}
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {displayContent}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </UserLayout>
    </ProtectedPage>
  );
};

export default CVPage;
