'use client';

import { useEffect, useState } from 'react';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs, fetchProfile, getAdminStats } from '@/services/api';
import type { Job, User } from '@/services/types';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    pwaInstalledUsers: number;
    totalJobs: number;
    totalRecruiters: number;
    totalApplications: number;
    recentRegistrations: number;
    recentJobs: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsRes, profileRes, statsRes] = await Promise.all([
          fetchJobs().catch(() => ({ data: [] })),
          fetchProfile().catch(() => ({ data: { user: null } })),
          getAdminStats().catch(() => ({ data: null })),
        ]);

        setJobs(jobsRes.data || []);
        if (profileRes.data?.user) {
          setAdmins([profileRes.data.user]);
        }
        if (statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ProtectedPage roles={['admin', 'superadmin']}>
      <div className="page-container space-y-8 py-16">
      <section className="glass-panel p-8">
        <p className="pill bg-brandBlue/10 text-brandBlue">{t('adminDashboard.title')}</p>
        <h1 className="text-3xl font-semibold text-brandNavy">{t('adminDashboard.subtitle')}</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-[28px] border border-white/60 bg-white/90 p-4 animate-pulse">
                  <div className="h-8 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </>
          ) : (
            [
              { value: stats?.totalJobs || jobs.length, label: t('adminDashboard.metrics.jobs') },
              { value: stats?.totalRecruiters || 0, label: t('adminDashboard.metrics.recruiters') },
              { value: stats?.totalUsers || 0, label: t('adminDashboard.metrics.users') },
              { value: stats?.activeUsers || 0, label: 'Aktif Kullanıcılar (30 gün)' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-[28px] border border-white/60 bg-white/90 p-4">
                <p className="text-3xl font-bold text-brandBlue">{metric.value}</p>
                <p className="text-sm text-brandGray">{metric.label}</p>
              </div>
            ))
          )}
        </div>
        {stats && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/60 bg-white/90 p-4">
              <p className="text-2xl font-bold text-brandOrange">{stats.pwaInstalledUsers}</p>
              <p className="text-sm text-brandGray">PWA Kurulumu Yapan</p>
            </div>
            <div className="rounded-[28px] border border-white/60 bg-white/90 p-4">
              <p className="text-2xl font-bold text-green-600">{stats.recentRegistrations}</p>
              <p className="text-sm text-brandGray">Son 7 Gün Kayıt</p>
            </div>
            <div className="rounded-[28px] border border-white/60 bg-white/90 p-4">
              <p className="text-2xl font-bold text-purple-600">{stats.totalApplications}</p>
              <p className="text-sm text-brandGray">Toplam Başvuru</p>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel">
          <h2 className="text-xl font-semibold text-brandNavy">{t('adminDashboard.manageUsers')}</h2>
          <div className="mt-4 space-y-3">
            {admins.map((admin) => (
              <div key={admin._id} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-brandNavy">{admin.name}</p>
                <p className="text-sm text-brandGray">{admin.email}</p>
                <p className="text-xs uppercase text-brandGray">{admin.role}</p>
              </div>
            ))}
            {!admins.length && <p className="text-sm text-slate-500">{t('adminDashboard.noUsers')}</p>}
          </div>
        </div>
        <div className="glass-panel">
          <h2 className="text-xl font-semibold text-brandNavy">{t('adminDashboard.manageJobs')}</h2>
          <div className="mt-4 space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-brandNavy">{job.title}</p>
                <p className="text-sm text-brandGray">{job.location}</p>
                <p className="text-xs text-brandGray">{job.requiredLanguage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel">
        <h2 className="text-xl font-semibold text-brandNavy">{t('adminDashboard.logs')}</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
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

