'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { fetchProfile } from '@/services/api';
import { Download, FileText } from 'lucide-react';

const CVPage = () => {
  const { user, setUser } = useAuthStore();
  const [cvContent, setCvContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCV = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Backend'den güncel profil bilgilerini çek (cvContent dahil)
        const response = await fetchProfile();
        const updatedUser = response.data.user;
        
        // Auth store'u güncelle
        if (updatedUser) {
          setUser(updatedUser);
        }

        // CV içeriğini ayarla
        if ((updatedUser as any)?.cvContent) {
          setCvContent((updatedUser as any).cvContent);
        } else if (user.cvContent) {
          setCvContent((user as any).cvContent);
        } else {
          setCvContent('CV içeriği bulunamadı. Lütfen profil sayfanızdan CV\'nizi yükleyin.');
        }
      } catch (error) {
        console.error('CV yüklenirken hata:', error);
        // Fallback: user store'dan cvContent'i al
        if ((user as any)?.cvContent) {
          setCvContent((user as any).cvContent);
        } else {
          setCvContent('CV içeriği yüklenemedi. Lütfen tekrar deneyin.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCV();
  }, [user, setUser]);

  const handleDownload = () => {
    if (!cvContent || !user) return;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = user.name ? `${user.name.replace(/\s+/g, '_')}_CV.txt` : 'CV.txt';
    a.download = fileName;
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  My CV / Curriculum Vitae
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.name} - Europass Format
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download CV
              </button>
            </div>

            {/* CV Content */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandBlue mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">CV yükleniyor...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {cvContent}
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
