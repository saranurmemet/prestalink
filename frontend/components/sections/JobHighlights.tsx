'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs } from '@/services/api';
import type { Job } from '@/services/types';
import JobCard from '@/components/jobs/JobCard';
import JobDetailModal from '@/components/jobs/JobDetailModal';

const JobHighlights = () => {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchJobs()
      .then((response) => {
        if (mounted) {
          // Remove duplicates based on title + location + salary
          const uniqueJobs = response.data.filter((job, index, self) =>
            index === self.findIndex((j) =>
              j.title === job.title &&
              j.location === job.location &&
              j.salary === job.salary
            )
          );
          setJobs(uniqueJobs.slice(0, 9));
        }
      })
      .catch(() => {
        if (mounted) {
          setJobs([
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
          ]);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="page-container py-8">
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-brandNavy dark:text-slate-100 sm:text-4xl">{t('jobs.title')}</h2>
            <p className="text-base text-brandGray dark:text-slate-300 max-w-2xl leading-relaxed">{t('jobs.subtitle')}</p>
            <p className="text-sm text-brandGray dark:text-slate-400 max-w-2xl leading-relaxed">
              {t('jobs.extraDescription')}
            </p>
          </div>
          <Link href="/jobs" className="hidden md:flex items-center gap-2 rounded-full bg-brandBlue px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brandBlue/30">
            {t('nav.jobs')} →
          </Link>
        </div>
        <Link href="/jobs" className="md:hidden flex items-center justify-center gap-2 w-full rounded-full bg-brandBlue px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:scale-105">
          {t('nav.jobs')} →
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              compact
              onClick={() => {
                setSelectedJob(job);
                setSelectedJobId(job._id);
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-brandGray dark:text-slate-300">
            <p>{t('jobs.loading')}</p>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        jobId={selectedJobId}
        isOpen={selectedJobId !== null}
        onClose={() => {
          setSelectedJobId(null);
          setSelectedJob(null);
        }}
        fallbackJob={selectedJob}
      />
    </section>
  );
};

export default JobHighlights;

