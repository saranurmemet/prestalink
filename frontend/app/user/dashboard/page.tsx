'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import UserLayout from '@/components/layout/UserLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  fetchJobs,
  fetchApplicationsByUser,
  fetchNotifications,
} from '@/services/api';
import type { Job, Application, Notification } from '@/services/types';
import { Edit3, Briefcase, FileText, CheckCircle2, XCircle, TrendingUp, Award, Star } from 'lucide-react';
import { getProfilePhotoUrl } from '@/utils/apiUrl';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasCV, setHasCV] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes, notifRes] = await Promise.all([
          fetchJobs().catch(() => ({ data: [] })),
          user ? fetchApplicationsByUser(user._id).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          fetchNotifications().catch(() => ({ data: [] })),
        ]);
        // Remove duplicates based on title + location + salary
        const uniqueJobs = jobsRes.data.filter((job, index, self) =>
          index === self.findIndex((j) =>
            j.title === job.title &&
            j.location === job.location &&
            j.salary === job.salary
          )
        );
        setJobs(uniqueJobs);
        setApplications(appsRes.data);
        setNotifications(notifRes.data);
        
        // Check if user has CV uploaded (check from applications)
        const hasUploadedCV = appsRes.data.some((app: Application) => app.cvUrl);
        setHasCV(hasUploadedCV);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const recommendedJobs = jobs.slice(0, 4);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  
  // Profil tamamlanma yüzdesi hesapla
  const profileCompletion = user ? (() => {
    let completed = 0;
    const fields = ['name', 'bio', 'country', 'city', 'languages', 'experienceLevel', 'profilePhoto', 'cvUrl'];
    fields.forEach(field => {
      if (user[field as keyof typeof user] && (Array.isArray(user[field as keyof typeof user]) ? (user[field as keyof typeof user] as any[]).length > 0 : true)) {
        completed++;
      }
    });
    return Math.round((completed / fields.length) * 100);
  })() : 0;

  // Başarı rozetleri
  const badges = [
    ...(hasCV || user?.cvUrl ? [{ icon: Award, label: 'CV Yüklendi', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' }] : []),
    ...(applications.length > 0 ? [{ icon: Star, label: `${applications.length} Başvuru`, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' }] : []),
    ...(profileCompletion >= 80 ? [{ icon: TrendingUp, label: 'Profil Tamamlandı', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' }] : []),
  ];

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        {/* Welcome Section with Profile Completion */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-brandBlue to-brandBlue/80 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex items-center gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0 relative">
                <img
                  src={getProfilePhotoUrl(user?.profilePhoto)}
                  alt={user?.name || 'Profile'}
                  className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl object-cover"
                />
                {profileCompletion >= 80 && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              {/* Welcome Text */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {t('userDashboard.welcomeUser').replace('{name}', user?.name || 'Kullanıcı')}
                </h1>
                <p className="text-white/90 mb-3">{t('userDashboard.subtitle')}</p>
                {/* Profile Completion Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/90">Profil Tamamlanma</span>
                    <span className="text-sm font-semibold text-white">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        {badges.length > 0 && (
          <section className="mb-6">
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${badge.bgColor} border border-current/20`}
                    style={{
                      animation: `fadeInLeft 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <Icon className={`w-4 h-4 ${badge.color}`} />
                    <span className={`text-sm font-medium ${badge.color}`}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Stats Grid with Animations */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* CV Status */}
          <div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t('userDashboard.cvStatus')}
              </h3>
              {hasCV || user?.cvUrl ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className={`text-3xl font-bold mb-1 ${hasCV || user?.cvUrl ? 'text-green-600' : 'text-red-600'}`}>
              {hasCV || user?.cvUrl ? '✓' : '✗'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hasCV || user?.cvUrl ? t('userDashboard.cvUploaded') : t('userDashboard.cvNotUploaded')}
            </p>
            {(hasCV || user?.cvUrl) && (
              <Link
                href="/user/cv"
                className="mt-3 inline-flex items-center gap-2 text-sm text-brandBlue hover:text-brandBlue/80 font-medium"
              >
                <FileText className="w-4 h-4" />
                CV'yi Görüntüle
              </Link>
            )}
          </div>

          {/* Total Applications */}
          <div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
          >
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('userDashboard.totalApplications')}
            </h3>
            <p className="text-3xl font-bold text-brandBlue mb-1">{applications.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {applications.length > 0 ? 'Aktif başvurular' : 'Henüz başvuru yok'}
            </p>
          </div>

          {/* New Job Matches */}
          <div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
          >
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('userDashboard.newJobMatches')}
            </h3>
            <p className="text-3xl font-bold text-brandOrange mb-1">{recommendedJobs.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Size uygun işler
            </p>
          </div>

          {/* Unread Notifications */}
          <div 
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
          >
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {t('userDashboard.metrics.notifications')}
            </h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">{unreadNotifications}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unreadNotifications > 0 ? 'Okunmamış bildirim' : 'Tüm bildirimler okundu'}
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {t('userDashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/user/profile"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-brandBlue/10 rounded-lg flex items-center justify-center group-hover:bg-brandBlue transition-colors">
                <Edit3 className="w-6 h-6 text-brandBlue group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('userDashboard.editProfile')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Profilinizi güncelleyin</p>
              </div>
            </Link>

            <Link
              href="/user/jobs"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandOrange group transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-brandOrange/10 rounded-lg flex items-center justify-center group-hover:bg-brandOrange transition-colors">
                <Briefcase className="w-6 h-6 text-brandOrange group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('userDashboard.viewJobs')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">İş ilanlarını görüntüleyin</p>
              </div>
            </Link>

            <Link
              href="/user/applications"
              className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <FileText className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('userDashboard.viewApplications')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t('userApplications.subtitle')}</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {t('userDashboard.newJobMatches')}
              </h2>
              <Link
                href="/user/jobs"
                className="text-brandBlue hover:text-brandBlue/80 font-medium text-sm"
              >
                {t('jobs.viewFullPage')} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedJobs.map((job, index) => {
                const jobInfo = typeof job === 'object' ? job : null;
                if (!jobInfo) return null;
                return (
                  <Link
                    key={jobInfo._id}
                    href={`/user/jobs/${jobInfo._id}`}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:border-brandBlue group transform hover:scale-105"
                    style={{ animation: `fadeInUp 0.5s ease-out ${0.5 + index * 0.1}s both` }}
                  >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-brandBlue transition-colors">
                      {jobInfo.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {jobInfo.location}
                    </p>
                    {jobInfo.salary && (
                      <p className="text-sm font-medium text-brandOrange mb-2">
                        {jobInfo.salary}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                      {jobInfo.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </UserLayout>
  );

  return <ProtectedPage roles={['user']}>{content}</ProtectedPage>;
};

export default UserDashboard;
