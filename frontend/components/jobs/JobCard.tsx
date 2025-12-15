'use client';

import type { Job } from '@/services/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { MapPin, Euro, Briefcase, Clock, Building2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  compact?: boolean;
  onClick?: () => void;
}

const JobCard = ({ job, compact, onClick }: JobCardProps) => {
  const { t } = useLanguage();

  // İş kategorisine göre ikon ve renk belirle
  const getJobCategory = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('cnc') || titleLower.includes('machinist') || titleLower.includes('operatör')) {
      return { icon: '⚙️', color: 'bg-blue-100 dark:bg-blue-900/20', textColor: 'text-blue-700 dark:text-blue-300' };
    }
    if (titleLower.includes('kaynak') || titleLower.includes('welder')) {
      return { icon: '🔧', color: 'bg-orange-100 dark:bg-orange-900/20', textColor: 'text-orange-700 dark:text-orange-300' };
    }
    if (titleLower.includes('montaj') || titleLower.includes('assembly')) {
      return { icon: '📦', color: 'bg-green-100 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-300' };
    }
    if (titleLower.includes('forklift') || titleLower.includes('lojistik') || titleLower.includes('depo')) {
      return { icon: '🚚', color: 'bg-purple-100 dark:bg-purple-900/20', textColor: 'text-purple-700 dark:text-purple-300' };
    }
    if (titleLower.includes('gıda') || titleLower.includes('food')) {
      return { icon: '🍽️', color: 'bg-red-100 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-300' };
    }
    if (titleLower.includes('temizlik') || titleLower.includes('clean')) {
      return { icon: '🧹', color: 'bg-cyan-100 dark:bg-cyan-900/20', textColor: 'text-cyan-700 dark:text-cyan-300' };
    }
    if (titleLower.includes('bakım') || titleLower.includes('maintenance')) {
      return { icon: '🔨', color: 'bg-yellow-100 dark:bg-yellow-900/20', textColor: 'text-yellow-700 dark:text-yellow-300' };
    }
    if (titleLower.includes('güvenlik') || titleLower.includes('security')) {
      return { icon: '🛡️', color: 'bg-indigo-100 dark:bg-indigo-900/20', textColor: 'text-indigo-700 dark:text-indigo-300' };
    }
    if (titleLower.includes('inşaat') || titleLower.includes('construction')) {
      return { icon: '🏗️', color: 'bg-gray-100 dark:bg-gray-800', textColor: 'text-gray-700 dark:text-gray-300' };
    }
    return { icon: '💼', color: 'bg-brandBlue/10', textColor: 'text-brandBlue' };
  };

  const category = getJobCategory(job.title);

  return (
    <div
      onClick={onClick}
      className="glass-panel card-hover flex flex-col gap-4 p-6 group cursor-pointer relative overflow-hidden transform transition-all duration-300 hover:scale-105"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brandBlue/0 to-brandBlue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        {/* Header with title and category */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-2xl ${category.textColor}`}>{category.icon}</span>
              <h3 className="text-xl font-semibold text-brandNavy dark:text-slate-100 group-hover:text-brandBlue transition-colors flex-1">
                {job.title}
              </h3>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${category.color} ${category.textColor}`}>
              <Building2 className="w-3 h-3" />
              Mavi Yaka
            </div>
          </div>
          <span className="pill bg-brandBlue/10 text-brandBlue dark:bg-brandBlue/20 group-hover:bg-brandBlue/20 transition-colors flex-shrink-0 ml-2">
            {job.requiredLanguage || 'EN'}
          </span>
        </div>

        {/* Description */}
        <p className={`text-sm text-brandGray dark:text-slate-300 ${compact ? 'line-clamp-2' : 'line-clamp-3'} leading-relaxed mb-3`}>
          {job.description}
        </p>

        {/* Job Details */}
        <div className="flex flex-wrap gap-3 text-sm text-brandGray dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brandBlue" />
            {job.location}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1.5 font-semibold text-brandOrange">
              <Euro className="h-4 w-4 text-brandOrange" />
              {job.salary}
            </span>
          )}
          {job.requiredExperience && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-brandBlue" />
              {job.requiredExperience}
            </span>
          )}
          {job.workType && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brandBlue" />
              {job.workType === 'full-time' ? 'Tam Zamanlı' : job.workType}
            </span>
          )}
        </div>

        {/* Apply Button */}
        <span className="mt-auto w-fit rounded-full border-2 border-brandBlue px-5 py-2.5 text-sm font-semibold text-brandBlue dark:text-brandBlue dark:border-brandBlue group-hover:bg-brandBlue group-hover:text-white transition-all duration-300 flex items-center gap-2">
          {t('jobs.apply')}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </div>
  );
};

export default JobCard;
