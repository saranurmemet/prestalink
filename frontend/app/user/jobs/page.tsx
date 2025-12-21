'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import UserLayout from '@/components/layout/UserLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs } from '@/services/api';
import type { Job } from '@/services/types';
import { Search, MapPin, DollarSign, Briefcase, Globe } from 'lucide-react';

const JobListings = () => {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    salaryRange: '',
    position: '',
    experience: '',
    language: '',
  });

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const response = await fetchJobs();
        // Remove duplicates using utility function
        const { removeDuplicateJobs } = await import('@/utils/jobUtils');
        const uniqueJobs = removeDuplicateJobs(response.data);
        setJobs(uniqueJobs);
        setFilteredJobs(uniqueJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
        // Set empty arrays on error to prevent showing stale data
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    // Language filter
    if (filters.language) {
      filtered = filtered.filter(
        (job) => job.requiredLanguage?.toLowerCase() === filters.language.toLowerCase()
      );
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter((job) =>
        job.requiredExperience?.toLowerCase().includes(filters.experience.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, filters]);

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t('userJobs.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{t('userJobs.subtitle')}</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('userJobs.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('userJobs.filters.country')}
              </label>
              <input
                type="text"
                placeholder={t('userJobs.placeholders.country')}
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('userJobs.filters.language')}
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              >
                <option value="">{t('userJobs.all')}</option>
                <option value="EN">English</option>
                <option value="DE">Deutsch</option>
                <option value="FR">Français</option>
                <option value="TR">Türkçe</option>
                <option value="AR">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('userJobs.filters.experience')}
              </label>
              <input
                type="text"
                placeholder={t('userJobs.placeholders.experience')}
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('userJobs.filters.salaryRange')}
              </label>
              <input
                type="text"
                placeholder={t('userJobs.placeholders.salaryRange')}
                value={filters.salaryRange}
                onChange={(e) => setFilters({ ...filters, salaryRange: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    country: '',
                    salaryRange: '',
                    position: '',
                    experience: '',
                    language: '',
                  });
                }}
                className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brandBlue border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('auth.loading')}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              {jobs.length === 0 ? t('userJobs.noJobs') : t('userJobs.noMatches')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link
                key={job._id}
                href={`/user/jobs/${job._id}`}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group"
              >
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-brandBlue transition-colors">
                  {job.title}
                </h3>

                <div className="space-y-2 mb-4">
                  {job.location && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                  )}

                  {job.salary && (
                    <div className="flex items-center gap-2 text-brandOrange">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">{job.salary}</span>
                    </div>
                  )}

                  {job.requiredExperience && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{job.requiredExperience}</span>
                    </div>
                  )}

                  {job.requiredLanguage && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">{job.requiredLanguage}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                  {job.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-brandBlue">
                    {t('userJobs.viewDetails')}
                  </span>
                  <span className="text-brandBlue group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );

  return <ProtectedPage roles={['user']}>{content}</ProtectedPage>;
};

export default JobListings;

