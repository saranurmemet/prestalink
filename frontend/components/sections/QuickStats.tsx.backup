'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

const QuickStats = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container py-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { value: '25K+', labelKey: 'hero.stats.placements', icon: '✓' },
          { value: '180+', labelKey: 'hero.stats.partners', icon: '🤝' },
          { value: '4', labelKey: 'hero.stats.languages', icon: '🌍' },
        ].map((stat) => (
          <div key={stat.labelKey} className="glass-panel p-4 text-center card-hover">
            <p className="text-2xl font-bold text-brandBlue dark:text-blue-400">{stat.value}</p>
            <p className="text-xs text-brandGray dark:text-slate-300 mt-1">{t(stat.labelKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickStats;

