'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Briefcase, TrendingUp, Globe, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import HeroPreview from './HeroPreview';

const HomeHero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Simple Background Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brandBlue/5 dark:bg-brandBlue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brandOrange/5 dark:bg-brandOrange/10 rounded-full blur-3xl" />
      </div>

      <div className="page-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brandBlue/10 dark:bg-brandBlue/20 border border-brandBlue/20 dark:border-brandBlue/30">
              <Sparkles className="w-4 h-4 text-brandBlue" />
              <span className="text-sm font-semibold text-brandBlue">
                {t('hero.tag')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brandNavy dark:text-white leading-tight">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-brandGray dark:text-slate-300 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Free Registration</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Globe className="w-4 h-4 text-brandBlue" />
                <span className="text-sm font-medium">Multi-language</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <TrendingUp className="w-4 h-4 text-brandOrange" />
                <span className="text-sm font-medium">High Success Rate</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/contact" 
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brandBlue to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>{t('hero.ctaPrimary')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/jobs" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-brandBlue text-brandBlue font-semibold hover:bg-brandBlue hover:text-white transition-all"
              >
                <Briefcase className="w-5 h-5" />
                <span>{t('hero.ctaSecondary')}</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-brandBlue mb-1">25K+</div>
                <div className="text-sm text-brandGray dark:text-slate-400">{t('hero.stats.placements')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brandBlue mb-1">180+</div>
                <div className="text-sm text-brandGray dark:text-slate-400">{t('hero.stats.partners')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brandBlue mb-1">4</div>
                <div className="text-sm text-brandGray dark:text-slate-400">{t('hero.stats.languages')}</div>
              </div>
            </div>
          </div>

          {/* Right Preview - Animated Dashboard */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
            <HeroPreview />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHero;

