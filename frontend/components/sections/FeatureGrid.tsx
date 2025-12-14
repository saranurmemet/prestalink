'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { 
  Globe, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Zap, 
  BadgeCheck 
} from 'lucide-react';

const features = [
  {
    Icon: Globe,
    titleKey: 'features.localization.title',
    bodyKey: 'features.localization.body',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    Icon: Sparkles,
    titleKey: 'features.matching.title',
    bodyKey: 'features.matching.body',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    Icon: FileText,
    titleKey: 'features.cvVault.title',
    bodyKey: 'features.cvVault.body',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800/50',
  },
  {
    Icon: ShieldCheck,
    titleKey: 'features.roles.title',
    bodyKey: 'features.roles.body',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    Icon: Zap,
    titleKey: 'features.speed.title',
    bodyKey: 'features.speed.body',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    Icon: BadgeCheck,
    titleKey: 'features.verified.title',
    bodyKey: 'features.verified.body',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
];

const FeatureGrid = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container py-16">
      <div className="space-y-4 text-center">
        <p className="pill mx-auto bg-brandBlue/10 text-brandBlue">{t('features.tag')}</p>
        <h2 className="section-title dark:text-white">{t('features.title')}</h2>
        <p className="text-lg text-brandGray dark:text-slate-200">{t('features.subtitle')}</p>
      </div>
      <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-2">
        {features.map((feature, index) => {
          const IconComponent = feature.Icon;
          return (
            <div key={feature.titleKey} className="card card-hover flex gap-3 sm:gap-4 animate-fade-in group p-4 sm:p-6" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl ${feature.bgColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0`}>
                <IconComponent className={`h-6 w-6 sm:h-7 sm:w-7 ${feature.color} transition-transform duration-300 group-hover:scale-110`} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-brandNavy dark:text-white group-hover:text-brandBlue dark:group-hover:text-blue-400 transition-colors">{t(feature.titleKey)}</h3>
                <p className="text-xs sm:text-sm text-brandGray dark:text-slate-300 mt-1 leading-relaxed">{t(feature.bodyKey)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureGrid;

