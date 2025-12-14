'use client';

import { useEffect, useMemo, useState } from 'react';
import JobCard from '@/components/jobs/JobCard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs } from '@/services/api';
import type { Job } from '@/services/types';

const JobsPage = () => {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchJobs()
      .then((res) => {
        if (mounted) {
          // Remove duplicates based on title + location + salary
          const uniqueJobs = res.data.filter((job, index, self) =>
            index === self.findIndex((j) =>
              j.title === job.title &&
              j.location === job.location &&
              j.salary === job.salary
            )
          );
          setJobs(uniqueJobs);
        }
      })
      .catch(() => setJobs([]));
    return () => {
      mounted = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());
      const matchesLanguage = languageFilter
        ? (job.requiredLanguage || '').toLowerCase().includes(languageFilter.toLowerCase())
        : true;
      return matchesSearch && matchesLanguage;
    });
  }, [jobs, search, languageFilter]);

  return (
    <div className="page-container space-y-8 py-20 animate-fade-in">
      <div className="glass-panel p-8 text-center animate-slide-up">
        <p className="pill mx-auto bg-brandBlue/10 dark:bg-brandBlue/20 text-brandBlue">{t('jobs.tag')}</p>
        <h1 className="section-title dark:text-white">{t('jobs.title')}</h1>
        <p className="text-lg text-brandGray dark:text-slate-300">{t('jobs.subtitle')}</p>
      </div>
      <div className="glass-panel flex flex-col gap-4 p-6 md:flex-row animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <input
          type="text"
          placeholder={t('jobs.searchPlaceholder')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="input md:flex-1"
        />
        <input
          type="text"
          placeholder={t('jobs.filterPlaceholder')}
          value={languageFilter}
          onChange={(event) => setLanguageFilter(event.target.value)}
          className="input md:w-60"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredJobs.map((job, index) => (
          <div key={job._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <JobCard job={job} />
          </div>
        ))}
        {!filteredJobs.length && (
          <div className="col-span-2 animate-fade-in">
            <div className="glass-panel p-12 text-center">
              <p className="text-lg text-brandGray dark:text-slate-300">{search ? t('jobs.noMatches') : t('jobs.noJobsYet')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;

