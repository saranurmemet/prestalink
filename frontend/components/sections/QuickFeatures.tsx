'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import Link from 'next/link';
import { FileText, Sparkles, Send, Globe, FileCheck, Briefcase } from 'lucide-react';

const QuickFeatures = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: FileText,
      titleKey: 'features.europassCv.title',
      bodyKey: 'features.europassCv.body',
    },
    {
      icon: Sparkles,
      titleKey: 'features.aiMatching.title',
      bodyKey: 'features.aiMatching.body',
    },
    {
      icon: Send,
      titleKey: 'features.autoApplication.title',
      bodyKey: 'features.autoApplication.body',
    },
    {
      icon: Globe,
      titleKey: 'features.localization.title',
      bodyKey: 'features.localization.body',
    },
    {
      icon: FileCheck,
      titleKey: 'features.documentSupport.title',
      bodyKey: 'features.documentSupport.body',
    },
    {
      icon: Briefcase,
      titleKey: 'features.visaSupport.title',
      bodyKey: 'features.visaSupport.body',
    },
  ];

  return (
    <section className="page-container py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-brandNavy dark:text-slate-100">{t('features.title')}</h2>
        <Link href="/about" className="text-sm font-semibold text-brandBlue hover:underline">
          {t('hero.ctaSecondary')} →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.titleKey} className="glass-panel p-5 card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandBlue/10 dark:bg-brandBlue/20 mb-3">
                <IconComponent className="h-6 w-6 text-brandBlue" />
              </div>
              <h3 className="text-lg font-semibold text-brandNavy dark:text-slate-100 mb-2">{t(feature.titleKey)}</h3>
              <p className="text-sm text-brandGray dark:text-slate-300">{t(feature.bodyKey)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickFeatures;

