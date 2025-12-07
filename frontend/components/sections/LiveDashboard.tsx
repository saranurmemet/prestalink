'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs } from '@/services/api';
import type { Job } from '@/services/types';
import { MapPin } from 'lucide-react';

const LiveDashboard = () => {
  const { t } = useLanguage();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    fetchJobs()
      .then((response) => {
        setRecentJobs(response.data.slice(0, 3));
        setActiveCount(response.data.length);
      })
      .catch(() => {
        setRecentJobs([]);
      });
  }, []);

  const candidates = [
    { name: 'Layla Al-Hassan', role: 'CNC Specialist', location: 'Munich', status: 'active', time: '2m' },
    { name: 'Omar Al-Mansouri', role: 'Nurse', location: 'Hamburg', status: 'review', time: '5m' },
    { name: 'Sara Al-Fahad', role: 'Chef', location: 'Paris', status: 'active', time: '8m' },
  ];

  return (
    <div className="glass-panel relative w-full max-w-xl overflow-hidden rounded-[48px] border-white/70 p-6 lg:p-8 shadow-card card-hover">
      <div className="absolute inset-0 bg-gradient-to-br from-brandBlue/10 via-transparent to-brandOrange/10" />
      
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-brandBlue backdrop-blur-sm shadow-md">
            <span className="h-2 w-2 rounded-full bg-brandOrange animate-pulse" />
            {t('hero.widget.candidates')}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-700">Live</span>
          </div>
        </div>

        {/* Active Candidates List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {candidates.map((candidate, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border border-white/60 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] ${
                candidate.status === 'active' ? 'bg-blue-50/80' : 'bg-purple-50/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                      candidate.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'
                    }`} />
                    <p className="font-semibold text-brandNavy text-sm truncate">{candidate.name}</p>
                    <span className="text-xs text-brandGray flex-shrink-0">· {candidate.time}</span>
                  </div>
                  <p className="text-xs font-medium text-brandBlue mb-1">{candidate.role}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-brandGray flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brandBlue" />
                      {candidate.location}
                    </span>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${
                  candidate.status === 'active' 
                    ? 'bg-green-500/20 text-green-700 font-semibold' 
                    : 'bg-orange-500/20 text-orange-700 font-semibold'
                }`}>
                  {candidate.status === 'active' ? 'Active' : 'Review'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Jobs */}
        <div className="pt-4 border-t border-white/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-brandNavy">Recent Jobs</h3>
            <Link href="/jobs" className="text-xs font-semibold text-brandBlue hover:underline transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentJobs.slice(0, 2).map((job) => (
              <Link 
                key={job._id} 
                href={`/jobs/${job._id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-white/60 hover:bg-white/90 transition-all hover:shadow-sm group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brandNavy truncate group-hover:text-brandBlue transition-colors">
                    {job.title}
                  </p>
                  <p className="text-xs text-brandGray">{job.location}</p>
                </div>
                {job.salary && (
                  <span className="text-xs font-semibold text-brandOrange ml-2 flex-shrink-0">
                    {job.salary}
                  </span>
                )}
              </Link>
            ))}
            {recentJobs.length === 0 && (
              <div className="text-center py-4 text-xs text-brandGray">
                <div className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-brandBlue border-t-transparent rounded-full animate-spin" />
                  Loading jobs...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="pt-4 border-t border-white/60">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-brandBlue">{activeCount}+</p>
              <p className="text-xs text-brandGray">Active Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brandBlue">25K+</p>
              <p className="text-xs text-brandGray">{t('hero.stats.placements')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brandBlue">180+</p>
              <p className="text-xs text-brandGray">{t('hero.stats.partners')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;

