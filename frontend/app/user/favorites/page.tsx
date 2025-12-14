'use client';

import { useEffect, useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs } from '@/services/api';
import type { Job } from '@/services/types';
import { Heart, MapPin, Euro, Briefcase } from 'lucide-react';

const FavoritesPage = () => {
  const { t } = useLanguage();
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Get favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem('prestalink-favorites') || '[]');
        
        if (favorites.length > 0) {
          // Fetch all jobs and filter favorites
          const response = await fetchJobs();
          const allJobs = response.data;
          const favoriteJobsList = allJobs.filter((job: Job) => 
            favorites.includes(job._id)
          );
          setFavoriteJobs(favoriteJobsList);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (jobId: string) => {
    const favorites = JSON.parse(localStorage.getItem('prestalink-favorites') || '[]');
    const updated = favorites.filter((id: string) => id !== jobId);
    localStorage.setItem('prestalink-favorites', JSON.stringify(updated));
    setFavoriteJobs(favoriteJobs.filter(job => job._id !== jobId));
  };

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t('userFavorites.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('userFavorites.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandBlue mx-auto"></div>
          </div>
        ) : favoriteJobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('userFavorites.emptyTitle')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {t('userFavorites.emptyDescription')}
            </p>
            <a
              href="/user/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue/90 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              {t('userFavorites.goToJobs')}
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {favoriteJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        {job.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          {job.salary}
                        </div>
                      )}
                      {job.workType && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                          {job.workType}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => removeFavorite(job._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title={t('userFavorites.remove')}
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                    <a
                      href={`/user/jobs/${job._id}`}
                      className="px-4 py-2 bg-brandBlue text-white rounded-lg hover:bg-brandBlue/90 transition-colors text-center"
                    >
                      Detaylar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );

  return <ProtectedPage>{content}</ProtectedPage>;
};

export default FavoritesPage;




