'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchJob } from '@/services/api';
import type { Job } from '@/services/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';

const JobDetailPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const handleApply = () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent(`/jobs/${params?.id}`)}`);
    } else if (user.role !== 'user') {
      // Only users can apply, recruiters/admins cannot
      alert(t('jobs.onlyUsersCanApply') || 'Only users can apply for jobs');
    } else {
      // Redirect to dashboard with job ID in query param
      router.push(`/user/dashboard?apply=${params?.id}`);
    }
  };

  useEffect(() => {
    if (!params?.id) return;
    
    // Try to fetch from API first
    fetchJob(params.id as string)
      .then((res) => setJob(res.data))
      .catch(() => {
        // If API fails, try to find in fallback jobs list
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
        
        const fallbackJob = fallbackJobs.find(j => j._id === params.id);
        if (fallbackJob) {
          setJob(fallbackJob);
        } else {
          setJob(null);
        }
      })
      .finally(() => setLoading(false));
  }, [params]);

  if (!params?.id) {
    notFound();
  }

  if (loading) {
    return (
      <div className="page-container py-20">
        <div className="glass-panel p-8">
          <div className="flex items-center justify-center gap-3">
            <span className="h-6 w-6 animate-spin rounded-full border-4 border-brandBlue border-t-transparent" />
            <p className="text-brandGray dark:text-slate-300">{t('jobs.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-container py-20 animate-fade-in">
        <div className="glass-panel p-8 animate-scale-in">
          <p className="text-brandGray dark:text-slate-300">{t('jobs.notFound')}</p>
          <button className="btn-secondary mt-4 px-6 py-2" onClick={() => router.push('/jobs')}>
            {t('jobs.backToJobs')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-20 animate-fade-in">
      <div className="glass-panel space-y-6 p-8 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="pill bg-brandBlue/10 text-brandBlue">{job.requiredLanguage || 'EN'}</p>
            <h1 className="mt-2 text-3xl font-semibold text-brandNavy">{job.title}</h1>
            <p className="text-brandGray">{job.location}</p>
          </div>
          <button
            onClick={handleApply}
            className="rounded-full bg-brandOrange px-6 py-3 font-semibold text-white shadow-soft hover:bg-brandOrange/90 transition disabled:opacity-60"
            disabled={loading}
          >
            {t('jobs.apply')}
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {job.salary && (
            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 text-sm text-brandGray card-hover animate-fade-in">
              <p className="font-semibold text-brandNavy">{t('jobDetail.salary')}</p>
              <p className="text-lg font-semibold text-brandBlue">{job.salary}</p>
            </div>
          )}
          {job.requiredExperience && (
            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 text-sm text-brandGray card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <p className="font-semibold text-brandNavy">{t('jobDetail.experience')}</p>
              <p className="text-lg font-semibold text-brandBlue">{job.requiredExperience}</p>
            </div>
          )}
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold text-brandNavy">{t('jobDetail.description')}</h2>
          <p className="mt-2 text-brandGray leading-relaxed">{job.description}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;

