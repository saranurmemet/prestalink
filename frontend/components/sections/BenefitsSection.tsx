'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { TrendingUp, Users, Globe, Clock, Shield, Briefcase } from 'lucide-react';

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

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  prefix?: string;
  isVisible: boolean;
}

const AnimatedCounter = ({ end, suffix = '', duration = 2000, prefix = '', isVisible }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * end);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span className="inline-block">
      {prefix}{count}{suffix}
    </span>
  );
};

const BenefitsSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    // Sayfa yüklendiğinde animasyonu başlat
    const checkVisibility = () => {
      if (sectionRef.current && !hasAnimated.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 1.5 && rect.bottom > -100;
        if (isInView) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      }
    };

    // İlk kontrol - daha kısa gecikme
    const timer = setTimeout(checkVisibility, 100);

    // Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.01, rootMargin: '300px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      // Hemen kontrol et
      checkVisibility();
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const stats = [
    { 
      value: 98, 
      suffix: '%', 
      labelKey: 'benefits.stats.satisfaction',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      value: 24, 
      suffix: '/7', 
      labelKey: 'benefits.stats.support',
      icon: Clock,
      color: 'from-orange-500 to-red-500'
    },
    { 
      value: 15, 
      suffix: '+', 
      labelKey: 'benefits.stats.countries',
      icon: Globe,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      value: 5000, 
      suffix: '+', 
      labelKey: 'benefits.stats.active',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <section ref={sectionRef} className="page-container py-16 animate-fade-in relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brandBlue/5 dark:bg-brandBlue/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brandOrange/5 dark:bg-brandOrange/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center relative z-10">
        <div className="space-y-6 animate-slide-up">
          <p className="pill w-fit bg-brandBlue/10 text-brandBlue dark:bg-brandBlue/20 dark:text-blue-300">{t('benefits.tag')}</p>
          <h2 className="section-title text-left dark:text-white">{t('benefits.title')}</h2>
          <p className="text-lg text-brandGray dark:text-slate-200">{t('benefits.subtitle')}</p>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.titleKey} 
                className="flex gap-4 animate-fade-in group" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandBlue/10 dark:bg-brandBlue/20 text-2xl transition-all duration-500 group-hover:bg-brandBlue/20 dark:group-hover:bg-brandBlue/30 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-brandBlue/20">
                  {benefit.icon}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-brandNavy dark:text-white group-hover:text-brandBlue dark:group-hover:text-blue-400 transition-colors duration-300">
                    {t(benefit.titleKey)}
                  </h3>
                  <p className="text-sm text-brandGray dark:text-slate-300 leading-relaxed">{t(benefit.bodyKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Floating animation container */}
          <div className="relative transform transition-all duration-1000 hover:scale-[1.02]">
            <div className="glass-panel p-8 space-y-6 relative overflow-hidden">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brandBlue/5 via-transparent to-brandOrange/5 dark:from-brandBlue/10 dark:to-brandOrange/10 animate-gradient opacity-50" />
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={stat.labelKey}
                      className={`glass-panel p-5 text-center card-hover relative overflow-hidden group ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ 
                        animationDelay: `${index * 0.15}s`,
                        animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                        transition: 'opacity 0.3s ease-out'
                      }}
                    >
                      {/* Animated background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      {/* Icon with pulse animation */}
                      <div className="relative mb-3 flex justify-center">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110`}>
                          <IconComponent className="h-5 w-5 text-brandBlue dark:text-blue-400" />
                        </div>
                        {/* Pulse ring effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 animate-pulse-slow`} />
                      </div>

                      {/* Animated number */}
                      <p className="text-3xl font-bold text-brandBlue dark:text-blue-400 mb-1 relative z-10">
                        <AnimatedCounter 
                          end={stat.value} 
                          suffix={stat.suffix}
                          duration={2000}
                          isVisible={isVisible}
                        />
                      </p>
                      
                      {/* Glow effect on number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-3xl font-bold text-brandBlue/20 dark:text-blue-400/20 blur-sm">
                          {stat.value}{stat.suffix}
                        </p>
                      </div>

                      <p className="text-xs text-brandGray dark:text-slate-300 mt-1 relative z-10 font-medium">
                        {t(stat.labelKey)}
                      </p>

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                  );
                })}
              </div>

              {/* Trust card with enhanced animations */}
              <div className="glass-panel p-6 bg-gradient-to-br from-brandBlue/10 to-brandOrange/10 dark:from-brandBlue/20 dark:to-brandOrange/20 relative overflow-hidden group">
                {/* Animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-brandBlue/20 via-brandOrange/20 to-brandBlue/20 dark:from-brandBlue/30 dark:via-brandOrange/30 dark:to-brandBlue/30 animate-gradient opacity-50" />
                
                {/* Shield icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <Shield className="h-16 w-16 text-brandBlue dark:text-blue-400" />
                </div>

                <div className="relative z-10">
                  <p className="text-sm font-semibold text-brandNavy dark:text-white mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brandOrange" />
                    {t('benefits.trust.title')}
                  </p>
                  <p className="text-xs text-brandGray dark:text-slate-300 leading-relaxed">
                    {t('benefits.trust.body')}
                  </p>
                </div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-brandBlue/20 rounded-full animate-bounce-slow"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '3s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brandBlue/10 dark:bg-brandBlue/20 rounded-full blur-2xl animate-pulse-slow" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brandOrange/10 dark:bg-brandOrange/20 rounded-full blur-2xl animate-pulse-slow animation-delay-2000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;



















