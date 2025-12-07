'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

const features = [
  {
    icon: '🌍',
    titleKey: 'features.localization.title',
    bodyKey: 'features.localization.body',
  },
  {
    icon: '🧠',
    titleKey: 'features.matching.title',
    bodyKey: 'features.matching.body',
  },
  {
    icon: '📄',
    titleKey: 'features.cvVault.title',
    bodyKey: 'features.cvVault.body',
  },
  {
    icon: '🛡️',
    titleKey: 'features.roles.title',
    bodyKey: 'features.roles.body',
  },
  {
    icon: '⚡',
    titleKey: 'features.speed.title',
    bodyKey: 'features.speed.body',
  },
  {
    icon: '✅',
    titleKey: 'features.verified.title',
    bodyKey: 'features.verified.body',
  },
];

const FeatureGrid = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container py-16">
      <div className="space-y-4 text-center">
        <p className="pill mx-auto bg-brandBlue/10 text-brandBlue">{t('features.tag')}</p>
        <h2 className="section-title">{t('features.title')}</h2>
        <p className="text-lg text-brandGray">{t('features.subtitle')}</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <div key={feature.titleKey} className="card card-hover flex gap-4 animate-fade-in group" style={{ animationDelay: `${index * 0.1}s` }}>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brandBlue/10 text-2xl transition-all duration-300 group-hover:bg-brandBlue/20 group-hover:scale-110 group-hover:rotate-3">{feature.icon}</span>
            <div>
              <h3 className="text-xl font-semibold text-brandNavy group-hover:text-brandBlue transition-colors">{t(feature.titleKey)}</h3>
              <p className="text-sm text-brandGray">{t(feature.bodyKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;

