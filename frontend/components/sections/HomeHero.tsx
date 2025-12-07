'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import UIMockups from './UIMockups';

const HomeHero = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container pt-24 pb-6">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <p className="pill w-fit bg-brandBlue/10 text-brandBlue dark:bg-brandBlue/20">{t('hero.tag')}</p>
            <h1 className="text-3xl font-bold text-brandNavy dark:text-slate-100 sm:text-4xl lg:text-5xl leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-base text-brandGray dark:text-slate-300 lg:text-lg leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/contact" className="btn-primary text-sm px-6 py-2.5">
              {t('hero.ctaPrimary')}
            </Link>
            <Link href="/jobs" className="btn-secondary text-sm px-6 py-2.5">
              {t('hero.ctaSecondary')}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 pt-4">
            {[
              { value: '25K+', labelKey: 'hero.stats.placements' },
              { value: '180+', labelKey: 'hero.stats.partners' },
              { value: '4', labelKey: 'hero.stats.languages' },
            ].map((stat) => (
              <div key={stat.labelKey} className="glass-panel p-4 text-center card-hover">
                <p className="text-2xl font-bold text-brandBlue dark:text-brandBlue">{stat.value}</p>
                <p className="text-xs text-brandGray dark:text-slate-300 mt-1">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center lg:justify-end">
          <UIMockups />
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

