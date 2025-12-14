'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Briefcase, FileText, Home, Languages, UserCheck, Star, TrendingUp, Users, Globe } from 'lucide-react';

const AboutPage = () => {
  const { t } = useLanguage();

  const services = [
    { icon: Briefcase, index: 0 },
    { icon: FileText, index: 1 },
    { icon: Home, index: 2 },
    { icon: FileText, index: 3 },
    { icon: Languages, index: 4 },
    { icon: UserCheck, index: 5 },
  ];

  const testimonials = [
    {
      nameKey: 'testimonials.item1.name',
      roleKey: 'testimonials.item1.role',
      textKey: 'testimonials.item1.text',
      country: 'DE',
    },
    {
      nameKey: 'testimonials.item2.name',
      roleKey: 'testimonials.item2.role',
      textKey: 'testimonials.item2.text',
      country: 'DE',
    },
    {
      nameKey: 'testimonials.item3.name',
      roleKey: 'testimonials.item3.role',
      textKey: 'testimonials.item3.text',
      country: 'FR',
    },
  ];

  return (
    <div className="page-container space-y-12 py-20 animate-fade-in">
      {/* Hero Section */}
      <div className="glass-panel p-8 animate-slide-up">
        <div className="text-center mb-6">
          <p className="pill mx-auto bg-brandOrange/10 text-brandOrange dark:bg-brandOrange/20 w-fit">{t('about.title')}</p>
        </div>
        <p className="text-lg text-brandGray dark:text-slate-300 max-w-4xl mx-auto leading-relaxed text-center">
          {t('about.description')}
        </p>
      </div>

      {/* How We Work Section */}
      <div className="glass-panel p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-brandNavy dark:text-white mb-6">{t('about.howWeWorkTitle')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '1', titleKey: 'about.steps.0.title', descKey: 'about.steps.0.description' },
            { step: '2', titleKey: 'about.steps.1.title', descKey: 'about.steps.1.description' },
            { step: '3', titleKey: 'about.steps.2.title', descKey: 'about.steps.2.description' },
            { step: '4', titleKey: 'about.steps.3.title', descKey: 'about.steps.3.description' },
          ].map((step, index) => (
            <div key={step.step} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="h-12 w-12 rounded-full bg-brandBlue text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                {step.step}
              </div>
              <h3 className="text-base font-semibold text-brandNavy dark:text-white mb-2">
                {t(step.titleKey)}
              </h3>
              <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed">
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8 card-hover animate-fade-in">
          <h2 className="text-2xl font-bold text-brandNavy dark:text-white mb-4">{t('about.missionTitle')}</h2>
          <p className="text-base text-brandGray dark:text-slate-300 leading-relaxed">{t('about.missionBody')}</p>
        </div>
        <div className="glass-panel p-8 card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-brandNavy dark:text-blue-300 mb-4">{t('about.visionTitle')}</h2>
          <p className="text-base text-brandGray dark:text-slate-300 leading-relaxed">{t('about.visionBody')}</p>
        </div>
      </div>

      {/* Values */}
      <div className="glass-panel p-8 card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold text-brandNavy dark:text-white mb-6">{t('about.valuesTitle')}</h2>
        <ul className="space-y-5 text-base text-brandGray dark:text-slate-300">
          {[t('about.values.0'), t('about.values.1'), t('about.values.2')].map((value, index) => (
            <li key={index} className="flex items-start gap-4 transition-colors hover:text-brandBlue dark:hover:text-blue-300">
              <Star className="h-5 w-5 text-brandOrange flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Services Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-brandNavy dark:text-blue-300">{t('about.servicesTitle')}</h2>
          <p className="text-base text-brandGray dark:text-slate-300 max-w-2xl mx-auto">
            {t('about.servicesSubtitle')}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.index}
                className="glass-panel p-6 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandBlue/10 dark:bg-brandBlue/20 mb-4">
                  <IconComponent className="h-6 w-6 text-brandBlue" />
                </div>
                <h3 className="text-lg font-semibold text-brandNavy dark:text-white mb-2">
                  {t(`about.services.${service.index}.title`)}
                </h3>
                <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed">
                  {t(`about.services.${service.index}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="glass-panel p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-brandNavy dark:text-white mb-6">{t('about.whyChooseUsTitle')}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { titleKey: 'about.whyChooseUs.0.title', descKey: 'about.whyChooseUs.0.description' },
            { titleKey: 'about.whyChooseUs.1.title', descKey: 'about.whyChooseUs.1.description' },
            { titleKey: 'about.whyChooseUs.2.title', descKey: 'about.whyChooseUs.2.description' },
          ].map((item, index) => (
            <div key={item.titleKey} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="text-lg font-semibold text-brandNavy dark:text-white mb-2">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed">
                {t(item.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass-panel p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-brandNavy dark:text-white text-center mb-8">
          {t('about.statsTitle')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: '25K+', index: 0, icon: TrendingUp },
            { value: '180+', index: 1, icon: Users },
            { value: '4', index: 2, icon: Globe },
            { value: '98%', index: 3, icon: Star },
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.index}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 rounded-full bg-brandBlue/10 dark:bg-brandBlue/20 flex items-center justify-center">
                    <IconComponent className="h-7 w-7 text-brandBlue" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-brandBlue mb-2">{stat.value}</p>
                <p className="text-sm text-brandGray dark:text-slate-300">{t(`about.stats.${stat.index}.label`)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="pill mx-auto bg-brandBlue/10 text-brandBlue dark:bg-brandBlue/20 w-fit">
            {t('about.testimonialsTitle')}
          </p>
          <h2 className="text-3xl font-bold text-brandNavy dark:text-white">{t('testimonials.title')}</h2>
          <p className="text-base text-brandGray dark:text-slate-300 max-w-2xl mx-auto">
            {t('about.testimonialsSubtitle')}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.nameKey}
              className="glass-panel p-6 card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-brandBlue/10 dark:bg-brandBlue/20 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-brandBlue" />
                </div>
                <div>
                  <p className="font-semibold text-brandNavy dark:text-slate-100">{t(testimonial.nameKey)}</p>
                  <p className="text-sm text-brandGray dark:text-slate-300">{t(testimonial.roleKey)}</p>
                </div>
              </div>
              <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed mb-4">
                &ldquo;{t(testimonial.textKey)}&rdquo;
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-brandOrange fill-brandOrange" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
