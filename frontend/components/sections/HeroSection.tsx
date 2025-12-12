'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container flex flex-col gap-10 pb-10 pt-24 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6">
        <p className="pill w-fit bg-brandBlue/10 text-brandBlue">
          {t('hero.tag')}
        </p>
        <h1 className="text-4xl font-bold text-brandNavy sm:text-5xl lg:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="text-lg text-brandGray">{t('hero.subtitle')}</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/register" className="rounded-full bg-brandOrange px-8 py-3 font-semibold text-white shadow-soft">
            {t('hero.ctaPrimary')}
          </Link>
          <Link href="/about" className="rounded-full border border-brandBlue/20 px-8 py-3 font-semibold text-brandBlue">
            {t('hero.ctaSecondary')}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { value: '25K+', labelKey: 'hero.stats.placements' },
            { value: '180+', labelKey: 'hero.stats.partners' },
            { value: '4', labelKey: 'hero.stats.languages' },
          ].map((stat) => (
            <div key={stat.labelKey} className="glass-panel text-center">
              <p className="text-3xl font-bold text-brandBlue">{stat.value}</p>
              <p className="text-sm text-brandGray">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="glass-panel relative w-full max-w-xl overflow-hidden rounded-[48px] border-white/70 p-8 shadow-card">
          <Image
            src="/assets/ui-preview.svg"
            alt="PrestaLink UI preview"
            width={640}
            height={480}
            className="w-full"
            priority
          />
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-brandBlue">
            <span className="h-2 w-2 rounded-full bg-brandOrange" />
            {t('hero.widget.candidates')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

