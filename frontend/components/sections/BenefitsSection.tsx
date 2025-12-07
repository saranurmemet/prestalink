'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

const benefits = [
  {
    icon: '🎯',
    titleKey: 'benefits.speed.title',
    bodyKey: 'benefits.speed.body',
  },
  {
    icon: '🔒',
    titleKey: 'benefits.security.title',
    bodyKey: 'benefits.security.body',
  },
  {
    icon: '💼',
    titleKey: 'benefits.support.title',
    bodyKey: 'benefits.support.body',
  },
  {
    icon: '🌐',
    titleKey: 'benefits.global.title',
    bodyKey: 'benefits.global.body',
  },
];

const BenefitsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container py-16 animate-fade-in">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6 animate-slide-up">
          <p className="pill w-fit bg-brandBlue/10 text-brandBlue">{t('benefits.tag')}</p>
          <h2 className="section-title text-left">{t('benefits.title')}</h2>
          <p className="text-lg text-brandGray">{t('benefits.subtitle')}</p>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={benefit.titleKey} className="flex gap-4 animate-fade-in group" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandBlue/10 text-2xl transition-all duration-300 group-hover:bg-brandBlue/20 group-hover:scale-110">
                  {benefit.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-brandNavy group-hover:text-brandBlue transition-colors">
                    {t(benefit.titleKey)}
                  </h3>
                  <p className="text-sm text-brandGray">{t(benefit.bodyKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 text-center card-hover">
                <p className="text-3xl font-bold text-brandBlue">98%</p>
                <p className="text-xs text-brandGray mt-1">{t('benefits.stats.satisfaction')}</p>
              </div>
              <div className="glass-panel p-4 text-center card-hover">
                <p className="text-3xl font-bold text-brandBlue">24/7</p>
                <p className="text-xs text-brandGray mt-1">{t('benefits.stats.support')}</p>
              </div>
              <div className="glass-panel p-4 text-center card-hover">
                <p className="text-3xl font-bold text-brandBlue">15+</p>
                <p className="text-xs text-brandGray mt-1">{t('benefits.stats.countries')}</p>
              </div>
              <div className="glass-panel p-4 text-center card-hover">
                <p className="text-3xl font-bold text-brandBlue">5K+</p>
                <p className="text-xs text-brandGray mt-1">{t('benefits.stats.active')}</p>
              </div>
            </div>
            <div className="glass-panel p-6 bg-gradient-to-br from-brandBlue/10 to-brandOrange/10">
              <p className="text-sm font-semibold text-brandNavy mb-2">{t('benefits.trust.title')}</p>
              <p className="text-xs text-brandGray">{t('benefits.trust.body')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;



