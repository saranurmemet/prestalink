'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { Star, MapPin, User } from 'lucide-react';

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      nameKey: 'testimonials.story1.name',
      roleKey: 'testimonials.story1.role',
      locationKey: 'testimonials.story1.location',
      textKey: 'testimonials.story1.text',
      jobKey: 'testimonials.story1.job',
      country: '🇩🇪',
      rating: 5,
    },
    {
      nameKey: 'testimonials.story2.name',
      roleKey: 'testimonials.story2.role',
      locationKey: 'testimonials.story2.location',
      textKey: 'testimonials.story2.text',
      jobKey: 'testimonials.story2.job',
      country: '🇫🇷',
      rating: 5,
    },
    {
      nameKey: 'testimonials.story3.name',
      roleKey: 'testimonials.story3.role',
      locationKey: 'testimonials.story3.location',
      textKey: 'testimonials.story3.text',
      jobKey: 'testimonials.story3.job',
      country: '🇳🇱',
      rating: 5,
    },
  ];

  return (
    <section className="page-container py-16 animate-fade-in bg-gradient-to-b from-transparent via-brandBlue/5 to-transparent">
      <div className="space-y-4 text-center mb-12">
        <p className="pill mx-auto bg-brandBlue/10 text-brandBlue">{t('testimonials.tag')}</p>
        <h2 className="section-title dark:text-white">{t('testimonials.title')}</h2>
        <p className="text-lg text-brandGray dark:text-slate-200 max-w-2xl mx-auto">
          {t('testimonials.subtitle')}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="glass-panel p-6 card-hover group relative overflow-hidden"
            style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brandBlue/0 to-brandBlue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              {/* Header with icon instead of photo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brandBlue/20 to-brandBlue/40 flex items-center justify-center border-2 border-brandBlue/30 shadow-md">
                    <User className="w-8 h-8 text-brandBlue dark:text-brandBlue" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-md border-2 border-white dark:border-slate-800">
                    <span className="text-xl">{testimonial.country}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brandNavy dark:text-white truncate">
                    {t(testimonial.nameKey)}
                  </p>
                  <p className="text-sm text-brandGray dark:text-slate-300 truncate">
                    {t(testimonial.roleKey)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-brandBlue" />
                    <p className="text-xs text-brandGray dark:text-slate-400 truncate">
                      {t(testimonial.locationKey)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brandOrange text-brandOrange" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed mb-3 italic">
                &ldquo;{t(testimonial.textKey)}&rdquo;
              </p>

              {/* Job info */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-brandBlue dark:text-brandBlue">
                  {t('testimonials.foundJob')}: {t(testimonial.jobKey)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
