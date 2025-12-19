'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Briefcase, Users, TrendingUp, CheckCircle2, Clock, FileText } from 'lucide-react';

const CandidatesReviewWidget = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data - gerçek uygulamada API'den gelecek
  const stats = {
    totalApplications: 2547,
    activeJobs: 184,
    partnerCompanies: 127,
    successRate: 94,
  };

  const monthlyData = [
    { month: 'jan', applications: 320, interviews: 45, hired: 12 },
    { month: 'feb', applications: 380, interviews: 52, hired: 15 },
    { month: 'mar', applications: 420, interviews: 58, hired: 18 },
    { month: 'apr', applications: 450, interviews: 62, hired: 20 },
    { month: 'may', applications: 480, interviews: 68, hired: 22 },
    { month: 'jun', applications: 497, interviews: 72, hired: 25 },
  ];

  const recentApplications = [
    { name: 'Sara Ahmed', role: 'Nurse', sector: 'Healthcare', company: 'Hospital Paris', status: 'new' },
    { name: 'Mehmet Yılmaz', role: 'Engineer', sector: 'IT', company: 'TechCorp Berlin', status: 'review' },
    { name: 'Fatima Benali', role: 'Teacher', sector: 'Education', company: 'School Lyon', status: 'match' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'match':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const maxValue = Math.max(...monthlyData.map(d => d.applications));

  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-[28px] bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-600 p-4 sm:p-6 shadow-2xl">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
          {t('hero.widget.candidates')}
        </h2>
        
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 border-b border-slate-700 dark:border-slate-600 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          {(['dashboard', 'jobs', 'candidates'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t(`hero.widget.tabs.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 sm:mb-4">
          {t('hero.widget.candidates')}
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-600/50">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs text-slate-400 leading-tight">{t('hero.widget.stats.totalApplications')}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">
                {stats.totalApplications.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                <span className="leading-tight">{t('hero.widget.changes.fromLastMonth')}</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-600/50">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs text-slate-400 leading-tight">{t('hero.widget.stats.activeJobs')}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">
                {stats.activeJobs}
              </span>
              <span className="text-[10px] sm:text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                <span className="leading-tight">{t('hero.widget.changes.newThisWeek')}</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-600/50">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs text-slate-400 leading-tight">{t('hero.widget.stats.partnerCompanies')}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">
                {stats.partnerCompanies}
              </span>
              <span className="text-[10px] sm:text-xs text-orange-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                <span className="leading-tight">{t('hero.widget.changes.newPartners')}</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-600/50">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs text-slate-400 leading-tight">{t('hero.widget.stats.successRate')}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-xl sm:text-2xl font-bold text-white">
                {stats.successRate}%
              </span>
              <span className="text-[10px] sm:text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                <span className="leading-tight">{t('hero.widget.changes.improvement')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Applications Chart */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3">
          {t('hero.widget.monthlyApplications')}
        </h3>
        <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/30">
          <div className="flex items-end gap-1 sm:gap-2 h-32 sm:h-40 mb-3 sm:mb-4">
            {monthlyData.map((data, index) => {
              const appHeight = (data.applications / maxValue) * 100;
              const intHeight = (data.interviews / maxValue) * 100;
              const hiredHeight = (data.hired / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full">
                  <div className="relative w-full h-full flex items-end justify-center gap-0.5">
                    {/* Stacked bars */}
                    <div className="w-full max-w-[24px] sm:max-w-[30px] flex flex-col-reverse gap-0.5 h-full">
                      {/* Applications bar (bottom) */}
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-400"
                        style={{ height: `${appHeight}%`, minHeight: appHeight > 0 ? '3px' : '0' }}
                        title={`${data.applications} ${t('hero.widget.chartLegend.applications')}`}
                      />
                      {/* Interviews bar (middle) */}
                      {data.interviews > 0 && (
                        <div
                          className="w-full bg-orange-500 rounded-t transition-all duration-500 hover:bg-orange-400"
                          style={{ height: `${intHeight}%`, minHeight: intHeight > 0 ? '3px' : '0' }}
                          title={`${data.interviews} ${t('hero.widget.chartLegend.interviews')}`}
                        />
                      )}
                      {/* Hired bar (top) */}
                      {data.hired > 0 && (
                        <div
                          className="w-full bg-green-500 rounded-t transition-all duration-500 hover:bg-green-400"
                          style={{ height: `${hiredHeight}%`, minHeight: hiredHeight > 0 ? '3px' : '0' }}
                          title={`${data.hired} ${t('hero.widget.chartLegend.hired')}`}
                        />
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2 font-medium">
                    {t(`hero.widget.months.${data.month}`)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center pt-2 border-t border-slate-600/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
              <span className="text-[10px] sm:text-xs text-slate-400">{t('hero.widget.chartLegend.applications')}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
              <span className="text-[10px] sm:text-xs text-slate-400">{t('hero.widget.chartLegend.interviews')}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="text-[10px] sm:text-xs text-slate-400">{t('hero.widget.chartLegend.hired')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3">
          {t('hero.widget.recentApplications')}
        </h3>
        <div className="space-y-2">
          {recentApplications.map((app, index) => (
            <div
              key={index}
              className="bg-slate-700/50 rounded-lg p-2.5 sm:p-3 border border-slate-600/50 flex items-center justify-between hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <span className="font-semibold text-xs sm:text-sm text-white truncate">
                    {app.name}
                  </span>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(app.status)}`}
                  >
                    {t(`hero.widget.status.${app.status}`)}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-slate-300 truncate">
                  {app.role} - {app.sector}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 truncate">
                  {t('hero.widget.appliedTo')} {app.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesReviewWidget;


