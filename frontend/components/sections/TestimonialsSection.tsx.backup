'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

const testimonials = [
  {
    nameKey: 'testimonials.item1.name',
    roleKey: 'testimonials.item1.role',
    textKey: 'testimonials.item1.text',
    country: '🇩🇪',
  },
  {
    nameKey: 'testimonials.item2.name',
    roleKey: 'testimonials.item2.role',
    textKey: 'testimonials.item2.text',
    country: '🇫🇷',
  },
  {
    nameKey: 'testimonials.item3.name',
    roleKey: 'testimonials.item3.role',
    textKey: 'testimonials.item3.text',
    country: '🇹🇷',
  },
];

const TestimonialsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container py-16 animate-fade-in bg-gradient-to-b from-transparent via-brandBlue/5 to-transparent">
      <div className="space-y-4 text-center mb-12">
        <p className="pill mx-auto bg-brandBlue/10 text-brandBlue">{t('testimonials.tag')}</p>
        <h2 className="section-title dark:text-white">{t('testimonials.title')}</h2>
        <p className="text-lg text-brandGray dark:text-slate-200 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.nameKey} className="glass-panel p-6 card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brandBlue/10 text-2xl">
                {testimonial.country}
              </div>
              <div>
                <p className="font-semibold text-brandNavy dark:text-white">{t(testimonial.nameKey)}</p>
                <p className="text-sm text-brandGray dark:text-slate-300">{t(testimonial.roleKey)}</p>
              </div>
            </div>
            <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed">&ldquo;{t(testimonial.textKey)}&rdquo;</p>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-brandOrange">★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;

