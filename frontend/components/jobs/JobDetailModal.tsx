'use client';

import { useEffect, useState } from 'react';
import type { Job } from '@/services/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchJob } from '@/services/api';
import { useRouter } from 'next/navigation';
import { MapPin, Euro, Briefcase, X } from 'lucide-react';

interface JobDetailModalProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
  fallbackJob?: Job | null;
}

const JobDetailModal = ({ jobId, isOpen, onClose, fallbackJob }: JobDetailModalProps) => {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(fallbackJob || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !jobId) {
      setJob(fallbackJob || null);
      return;
    }

    setLoading(true);
    fetchJob(jobId)
      .then((res) => setJob(res.data))
      .catch(() => {
        // If API fails, try fallback
        const fallbackJobs: Job[] = [
          {
            _id: '1',
            title: 'CNC Specialist',
            description: 'Leading automotive supplier in Germany seeking experienced CNC specialist. Operate and maintain precision machining equipment. Full relocation support, housing assistance, and visa sponsorship included. Professional development opportunities available.',
            location: 'Munich, DE',
            salary: '€48K - €58K',
            requiredLanguage: 'DE',
            requiredExperience: '3+ years',
          },
          {
            _id: '2',
            title: 'Hospitality Manager',
            description: 'Luxury 5-star resort in French Riviera seeking bilingual hospitality manager. Oversee guest services, staff management, and daily operations. Competitive benefits package with accommodation. Beautiful coastal location with excellent work-life balance.',
            location: 'Nice, FR',
            salary: '€42K - €50K',
            requiredLanguage: 'FR / EN',
            requiredExperience: '5+ years',
          },
          {
            _id: '3',
            title: 'Software Engineer',
            description: 'Fast-growing tech startup in Berlin looking for talented software engineer. Work with modern tech stack (React, Node.js, TypeScript). Remote-friendly with flexible hours. Equity participation and career growth opportunities.',
            location: 'Berlin, DE',
            salary: '€60K - €75K',
            requiredLanguage: 'EN',
            requiredExperience: '4+ years',
          },
          {
            _id: '4',
            title: 'Marketing Specialist',
            description: 'Digital marketing agency in Amsterdam seeking creative marketing specialist. Develop and execute campaigns for international clients. Dynamic work environment with creative freedom. Relocation support and professional training provided.',
            location: 'Amsterdam, NL',
            salary: '€38K - €45K',
            requiredLanguage: 'EN',
            requiredExperience: '2+ years',
          },
          {
            _id: '5',
            title: 'Registered Nurse',
            description: 'Modern hospital in Hamburg requires registered nurses for various departments. Excellent working conditions, competitive salary, and comprehensive health insurance. Visa sponsorship and German language courses included. Career advancement opportunities.',
            location: 'Hamburg, DE',
            salary: '€45K - €55K',
            requiredLanguage: 'DE / EN',
            requiredExperience: '2+ years',
          },
          {
            _id: '6',
            title: 'Chef de Cuisine',
            description: 'Award-winning restaurant in Paris seeking experienced head chef. Create innovative menus, manage kitchen team, and maintain Michelin standards. Competitive salary with performance bonuses. Accommodation assistance provided.',
            location: 'Paris, FR',
            salary: '€50K - €65K',
            requiredLanguage: 'FR',
            requiredExperience: '7+ years',
          },
          {
            _id: '7',
            title: 'Data Analyst',
            description: 'International finance company in Frankfurt seeking data analyst. Analyze market trends, create reports, and support decision-making. Hybrid work model. Professional certifications and advanced training opportunities available.',
            location: 'Frankfurt, DE',
            salary: '€55K - €68K',
            requiredLanguage: 'EN',
            requiredExperience: '3+ years',
          },
          {
            _id: '8',
            title: 'Project Manager',
            description: 'Construction company in Munich requires experienced project manager. Oversee construction projects from planning to completion. Competitive package with bonuses. Company car and comprehensive benefits included.',
            location: 'Munich, DE',
            salary: '€58K - €72K',
            requiredLanguage: 'DE / EN',
            requiredExperience: '5+ years',
          },
          {
            _id: '9',
            title: 'UX/UI Designer',
            description: 'Creative agency in Barcelona seeking talented UX/UI designer. Design user interfaces for digital products and mobile apps. Creative and collaborative work environment. Relocation package and Spanish language courses provided.',
            location: 'Barcelona, ES',
            salary: '€40K - €52K',
            requiredLanguage: 'EN / ES',
            requiredExperience: '3+ years',
          },
        ];
        const found = fallbackJobs.find(j => j._id === jobId);
        setJob(found || fallbackJob || null);
      })
      .finally(() => setLoading(false));
  }, [jobId, isOpen, fallbackJob]);

  const handleApply = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/jobs/${jobId}`)}`);
      onClose();
    } else if (user.role !== 'user') {
      alert(t('jobs.onlyUsersCanApply') || 'Only users can apply for jobs');
    } else {
      router.push(`/user/dashboard?apply=${jobId}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-[32px] p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 text-brandGray dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12">
            <span className="h-6 w-6 animate-spin rounded-full border-4 border-brandBlue border-t-transparent" />
            <p className="text-brandGray dark:text-slate-300">{t('jobs.loading')}</p>
          </div>
        ) : job ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pr-12">
              <div className="flex-1">
                <span className="pill bg-brandBlue/10 dark:bg-brandBlue/20 text-brandBlue mb-3 inline-block">
                  {job.requiredLanguage || 'EN'}
                </span>
                <h2 className="text-3xl font-bold text-brandNavy dark:text-slate-100 mb-2">
                  {job.title}
                </h2>
                <p className="text-base text-brandGray dark:text-slate-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brandBlue" />
                  {job.location}
                </p>
              </div>
            </div>

            {/* Salary & Experience Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {job.salary && (
                <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 card-hover">
                  <p className="text-sm font-semibold text-brandNavy dark:text-slate-200 mb-2">
                    Salary
                  </p>
                  <p className="text-2xl font-bold text-brandBlue">{job.salary}</p>
                </div>
              )}
              {job.requiredExperience && (
                <div className="glass-panel p-5 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 card-hover">
                  <p className="text-sm font-semibold text-brandNavy dark:text-slate-200 mb-2">
                    Experience
                  </p>
                  <p className="text-2xl font-bold text-brandBlue">{job.requiredExperience}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brandNavy dark:text-slate-100">
                Description
              </h3>
              <p className="text-base text-brandGray dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Apply Button */}
            <div className="flex gap-3 pt-4 border-t border-white/60 dark:border-slate-700/60">
              <button
                onClick={handleApply}
                className="flex-1 rounded-full bg-brandOrange px-6 py-3 font-semibold text-white shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brandOrange/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {t('jobs.apply')}
              </button>
              <button
                onClick={() => {
                  router.push(`/jobs/${jobId}`);
                  onClose();
                }}
                className="rounded-full border border-brandBlue/20 dark:border-brandBlue/40 px-6 py-3 font-semibold text-brandBlue dark:text-brandBlue transition-all duration-300 hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 hover:scale-105"
              >
                {t('jobs.viewFullPage')}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-brandGray dark:text-slate-300 mb-4">{t('jobs.notFound')}</p>
            <button
              onClick={onClose}
              className="btn-secondary px-6 py-2"
            >
              {t('jobs.backToJobs')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailModal;

