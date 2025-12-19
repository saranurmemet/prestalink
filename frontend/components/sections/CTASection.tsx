'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 animate-fade-in">
      <div className="page-container rounded-[40px] bg-gradient-to-r from-brandBlue via-brandBlue to-brandBlueDark px-8 py-12 text-white shadow-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brandBlue/50 to-transparent opacity-20 animate-pulse" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="animate-slide-up">
            <p className="text-sm uppercase tracking-wide text-white/70">{t('cta.tag')}</p>
            <h2 className="text-3xl font-bold">{t('cta.title')}</h2>
            <p className="mt-2 text-lg text-white/80">{t('cta.subtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/register" className="btn-white">
              {t('cta.primary')}
            </Link>
            <Link
              href="/employer/dashboard"
              className="rounded-full border border-white/70 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-white active:scale-100"
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

