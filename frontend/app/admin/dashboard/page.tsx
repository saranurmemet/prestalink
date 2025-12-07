'use client';

import { useEffect, useState } from 'react';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs, fetchProfile } from '@/services/api';
import type { Job, User } from '@/services/types';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);

  useEffect(() => {
    fetchJobs().then((res) => setJobs(res.data)).catch(() => setJobs([]));
    fetchProfile()
      .then((res) => setAdmins([res.data.user]))
      .catch(() => setAdmins([]));
  }, []);

  return (
    <ProtectedPage roles={['admin', 'superadmin']}>
      <div className="page-container space-y-8 py-16 animate-fade-in">
      <section className="glass-panel p-8 animate-slide-up">
        <p className="pill bg-brandBlue/10 text-brandBlue">{t('adminDashboard.title')}</p>
        <h1 className="text-3xl font-semibold text-brandNavy dark:text-slate-100">{t('adminDashboard.subtitle')}</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: jobs.length, label: t('adminDashboard.metrics.jobs') },
            { value: 12, label: t('adminDashboard.metrics.recruiters') },
            { value: 320, label: t('adminDashboard.metrics.users') },
            { value: 5, label: t('adminDashboard.metrics.logs') },
          ].map((metric, index) => (
            <div key={metric.label} className="rounded-[28px] border border-white/60 dark:border-slate-700 bg-white/90 dark:bg-slate-800 p-4 card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <p className="text-3xl font-bold text-brandBlue transition-transform duration-300 hover:scale-110">{metric.value}</p>
              <p className="text-sm text-brandGray dark:text-slate-300">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel animate-fade-in">
          <h2 className="text-xl font-semibold text-brandNavy dark:text-slate-100">{t('adminDashboard.manageUsers')}</h2>
          <div className="mt-4 space-y-3">
            {admins.map((admin, index) => (
              <div key={admin._id} className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-4 transition-all duration-300 hover:border-brandBlue/30 hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 hover:shadow-md group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <p className="font-semibold text-brandNavy dark:text-slate-100 group-hover:text-brandBlue transition-colors">{admin.name}</p>
                <p className="text-sm text-brandGray dark:text-slate-300">{admin.email}</p>
                <p className="text-xs uppercase text-brandGray dark:text-slate-400 pill w-fit mt-1">{admin.role}</p>
              </div>
            ))}
            {!admins.length && <p className="text-sm text-slate-500 dark:text-slate-400">{t('adminDashboard.noUsers')}</p>}
          </div>
        </div>
        <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-brandNavy dark:text-slate-100">{t('adminDashboard.manageJobs')}</h2>
          <div className="mt-4 space-y-3">
            {jobs.slice(0, 5).map((job, index) => (
              <div key={job._id} className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 p-4 transition-all duration-300 hover:border-brandBlue/30 hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 hover:shadow-md group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <p className="font-semibold text-brandNavy dark:text-slate-100 group-hover:text-brandBlue transition-colors">{job.title}</p>
                <p className="text-sm text-brandGray dark:text-slate-300">{job.location}</p>
                <p className="text-xs text-brandGray dark:text-slate-400 pill w-fit mt-1">{job.requiredLanguage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel">
        <h2 className="text-xl font-semibold text-brandNavy dark:text-slate-100">{t('adminDashboard.logs')}</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• {t('adminDashboard.logEntries.0')}</li>
          <li>• {t('adminDashboard.logEntries.1')}</li>
          <li>• {t('adminDashboard.logEntries.2')}</li>
        </ul>
      </section>
      </div>
    </ProtectedPage>
  );
};

export default AdminDashboard;

