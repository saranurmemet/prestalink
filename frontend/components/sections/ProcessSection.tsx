'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Phone, FileText, User, Sparkles, Globe, Send, Briefcase, FileCheck } from 'lucide-react';

const ProcessSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Phone,
      titleKey: 'process.step1.title',
      bodyKey: 'process.step1.body',
      number: '01',
    },
    {
      icon: FileText,
      titleKey: 'process.step2.title',
      bodyKey: 'process.step2.body',
      number: '02',
    },
    {
      icon: User,
      titleKey: 'process.step3.title',
      bodyKey: 'process.step3.body',
      number: '03',
    },
    {
      icon: Sparkles,
      titleKey: 'process.step4.title',
      bodyKey: 'process.step4.body',
      number: '04',
    },
    {
      icon: Globe,
      titleKey: 'process.step5.title',
      bodyKey: 'process.step5.body',
      number: '05',
    },
    {
      icon: Send,
      titleKey: 'process.step6.title',
      bodyKey: 'process.step6.body',
      number: '06',
    },
    {
      icon: Briefcase,
      titleKey: 'process.step7.title',
      bodyKey: 'process.step7.body',
      number: '07',
    },
    {
      icon: FileCheck,
      titleKey: 'process.step8.title',
      bodyKey: 'process.step8.body',
      number: '08',
    },
  ];

  return (
    <section className="page-container py-16 animate-fade-in">
      <div className="space-y-4 text-center mb-12">
        <p className="pill mx-auto bg-brandOrange/10 text-brandOrange dark:bg-brandOrange/20 w-fit">{t('process.tag')}</p>
        <h2 className="text-3xl font-bold text-brandNavy dark:text-white sm:text-4xl">{t('process.title')}</h2>
        <p className="text-lg text-brandGray dark:text-slate-300 max-w-2xl mx-auto">{t('process.subtitle')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={step.titleKey} className="relative group">
              <div className="glass-panel p-6 h-full flex flex-col items-center text-center card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brandBlue/10 dark:bg-brandBlue/20 transition-all duration-300 group-hover:bg-brandBlue/20 group-hover:scale-110">
                    <IconComponent className="h-8 w-8 text-brandBlue" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brandOrange text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-brandNavy dark:text-white mb-2 group-hover:text-brandBlue dark:group-hover:text-blue-400 transition-colors">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed">{t(step.bodyKey)}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-brandBlue to-transparent transform -translate-y-1/2 z-10" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProcessSection;
