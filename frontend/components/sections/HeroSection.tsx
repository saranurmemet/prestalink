'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import CandidatesReviewWidget from './CandidatesReviewWidget';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container flex flex-col gap-6 sm:gap-8 lg:gap-10 pb-6 sm:pb-8 lg:pb-10 pt-12 sm:pt-16 lg:pt-20 lg:flex-row lg:items-start">
      <div className="flex-1 space-y-4 sm:space-y-6 lg:pt-8">
        <p className="pill w-fit bg-brandBlue/10 text-brandBlue text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
          {t('hero.tag')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-brandNavy dark:text-white md:text-5xl lg:text-6xl leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-base sm:text-lg text-brandGray dark:text-slate-200 leading-relaxed">{t('hero.subtitle')}</p>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link href="/register" className="rounded-full bg-brandOrange px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-soft">
            {t('hero.ctaPrimary')}
          </Link>
          <Link href="/about" className="rounded-full border border-brandBlue/20 dark:border-brandBlue/40 px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-brandBlue dark:text-blue-300 hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10">
            {t('hero.ctaSecondary')}
          </Link>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-3">
          {[
            { value: '25K+', labelKey: 'hero.stats.placements' },
            { value: '180+', labelKey: 'hero.stats.partners' },
            { value: '4', labelKey: 'hero.stats.languages' },
          ].map((stat) => (
            <div key={stat.labelKey} className="glass-panel text-center p-3 sm:p-4">
              <p className="text-2xl sm:text-3xl font-bold text-brandBlue dark:text-blue-400">{stat.value}</p>
              <p className="text-xs sm:text-sm text-brandGray dark:text-slate-300 mt-1">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center mt-4 sm:mt-0">
        <CandidatesReviewWidget />
      </div>
    </section>
  );
};

export default HeroSection;

