'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchJobs } from '@/services/api';
import { TrendingUp, Users, Globe, Briefcase } from 'lucide-react';

const QuickStats = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    jobs: 0,
    users: 4, // Demo kullanıcı sayısı
    languages: 4,
    avgSalary: '€3,200'
  });

  useEffect(() => {
    fetchJobs()
      .then((response) => {
        const jobs = response.data || [];
        // Maaş ortalaması hesapla
        const salaries = jobs
          .map(job => {
            const salaryStr = job.salary || '';
            const match = salaryStr.match(/€[\d,]+/);
            if (match) {
              const num = parseInt(match[0].replace(/[€,]/g, ''));
              return num;
            }
            return null;
          })
          .filter(s => s !== null) as number[];
        
        const avgSalary = salaries.length > 0
          ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
          : 3200;

        setStats({
          jobs: jobs.length,
          users: 4,
          languages: 4,
          avgSalary: `€${avgSalary.toLocaleString()}`
        });
      })
      .catch(() => {
        // Fallback değerler
        setStats({
          jobs: 19,
          users: 4,
          languages: 4,
          avgSalary: '€3,200'
        });
      });
  }, []);

  const statsData = [
    { 
      value: `${stats.jobs}+`, 
      labelKey: 'hero.stats.placements', 
      icon: Briefcase,
      color: 'text-brandBlue',
      bgColor: 'bg-brandBlue/10'
    },
    { 
      value: `${stats.users}+`, 
      labelKey: 'hero.stats.partners', 
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    { 
      value: stats.avgSalary, 
      label: 'Ortalama Maaş', 
      icon: TrendingUp,
      color: 'text-brandOrange',
      bgColor: 'bg-brandOrange/10'
    },
    { 
      value: `${stats.languages}`, 
      labelKey: 'hero.stats.languages', 
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
  ];

  return (
    <section className="page-container py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="glass-panel p-6 text-center card-hover group relative overflow-hidden"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className={`text-3xl font-bold ${stat.color} mb-1 group-hover:scale-105 transition-transform duration-300`}>
                {stat.value}
              </p>
              <p className="text-xs text-brandGray dark:text-slate-300 font-medium">
                {stat.labelKey ? t(stat.labelKey) : stat.label}
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 dark:from-transparent dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
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
      `}</style>
    </section>
  );
};

export default QuickStats;
