'use client';

import type { Job } from '@/services/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { MapPin, Euro, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: Job;
  compact?: boolean;
  onClick?: () => void;
}

const JobCard = ({ job, compact, onClick }: JobCardProps) => {
  const { t } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="glass-panel card-hover flex flex-col gap-3 p-6 group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-brandNavy dark:text-slate-100 group-hover:text-brandBlue transition-colors">{job.title}</h3>
        <span className="pill bg-brandBlue/10 text-brandBlue dark:bg-brandBlue/20 group-hover:bg-brandBlue/20 transition-colors">{job.requiredLanguage || 'EN'}</span>
      </div>
      <p className={`text-sm text-brandGray dark:text-slate-300 ${compact ? 'line-clamp-2' : ''} leading-relaxed`}>{job.description}</p>
      <div className="flex flex-wrap gap-3 text-sm text-brandGray dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-brandBlue" />
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1.5">
            <Euro className="h-4 w-4 text-brandBlue" />
            {job.salary}
          </span>
        )}
        {job.requiredExperience && (
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-brandBlue" />
            {job.requiredExperience}
          </span>
        )}
      </div>
      <span className="mt-2 w-fit rounded-full border border-brandBlue px-4 py-2 text-sm font-semibold text-brandBlue dark:text-brandBlue dark:border-brandBlue group-hover:bg-brandBlue group-hover:text-white transition-all duration-300">
        {t('jobs.apply')} →
      </span>
    </div>
  );
};

export default JobCard;

