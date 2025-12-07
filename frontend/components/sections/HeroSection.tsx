'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="page-container flex flex-col gap-10 pb-10 pt-24 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6 animate-fade-in">
        <p className="pill w-fit bg-brandBlue/10 text-brandBlue animate-slide-up">
          {t('hero.tag')}
        </p>
        <h1 className="text-4xl font-bold text-brandNavy sm:text-5xl lg:text-6xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {t('hero.title')}
        </h1>
        <p className="text-lg text-brandGray animate-fade-in" style={{ animationDelay: '0.2s' }}>{t('hero.subtitle')}</p>
        <div className="flex flex-wrap items-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link href="/register" className="btn-primary">
            {t('hero.ctaPrimary')}
          </Link>
          <Link href="/about" className="btn-secondary">
            {t('hero.ctaSecondary')}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '25K+', labelKey: 'hero.stats.placements' },
            { value: '180+', labelKey: 'hero.stats.partners' },
            { value: '4', labelKey: 'hero.stats.languages' },
          ].map((stat, index) => (
            <div key={stat.labelKey} className="glass-panel text-center card-hover animate-scale-in" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
              <p className="text-3xl font-bold text-brandBlue">{stat.value}</p>
              <p className="text-sm text-brandGray">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glass-panel relative w-full max-w-xl overflow-hidden rounded-[48px] border-white/70 p-8 shadow-card card-hover">
          <div className="absolute inset-0 bg-gradient-to-br from-brandBlue/10 via-transparent to-brandOrange/10" />
          <div className="relative space-y-6">
            {/* Dashboard Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-brandBlue backdrop-blur-sm shadow-md w-fit animate-pulse">
                <span className="h-2 w-2 rounded-full bg-brandOrange animate-pulse" />
                {t('hero.widget.candidates')}
              </div>
              <div className="grid gap-3">
                {[
                  { name: 'Layla Al-Hassan', role: '5 yrs exp - Munich', lang: 'FR', color: 'bg-blue-100', icon: '👩‍💼' },
                  { name: 'Omar Al-Mansouri', role: 'B1 German - Hamburg', lang: 'TR', color: 'bg-green-100', icon: '👨‍⚕️' },
                  { name: 'Sara Al-Fahad', role: 'EN & FR - Paris', lang: 'AR', color: 'bg-purple-100', icon: '👩‍🍳' },
                ].map((item, index) => (
                  <div key={index} className={`${item.color} rounded-xl p-4 border border-white/60 shadow-sm animate-slide-up group`} style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <p className="font-semibold text-brandNavy text-sm">{item.name}</p>
                      </div>
                      <span className="pill text-xs bg-brandBlue/20">{item.lang}</span>
                    </div>
                    <p className="text-xs text-brandGray">{item.role}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs text-brandOrange">★★★★★</span>
                      <span className="text-xs text-brandGray ml-1">5.0</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/60">
                <p className="text-xs text-brandGray">{t('hero.widget.updated')}</p>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-brandGray">Live</span>
                </div>
              </div>
            </div>
            {/* Mobile Preview */}
            <div className="flex justify-center mt-6">
              <div className="relative w-32 h-48 rounded-3xl bg-gradient-to-br from-brandBlue to-brandBlueDark shadow-2xl p-3 animate-scale-in" style={{ animationDelay: '0.8s' }}>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-black/20 rounded-full" />
                <div className="w-full h-full bg-white rounded-2xl p-3 space-y-2">
                  <div className="h-8 w-full rounded-lg bg-brandBlue/20 animate-pulse" />
                  <div className="h-12 w-full rounded-lg bg-brandOrange/20" />
                  <div className="h-4 w-3/4 rounded bg-brandGray/20" />
                  <div className="h-4 w-1/2 rounded bg-brandGray/20" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-brandBlue" />
                    <div className="h-2 w-2 rounded-full bg-brandOrange" />
                    <div className="h-2 w-2 rounded-full bg-brandGray/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

