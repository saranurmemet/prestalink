'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { MapPin, Languages, Send, Shield, ArrowRight } from 'lucide-react';

const QuickFeatures = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: MapPin,
      title: 'Avrupa İş İlanları',
      description: 'Avrupa\'daki güvenilir firmalardan güncel iş fırsatları',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Languages,
      title: 'Çok Dilli CV Sistemi',
      description: 'Europass uyumlu CV\'ler – TR / EN / FR / AR',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Send,
      title: 'Başvuru & Takip',
      description: 'Tüm başvurularını tek panelden yönet',
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-500/10 dark:bg-orange-500/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Shield,
      title: 'Güvenli & Resmi Süreç',
      description: 'Sözleşmeli, şeffaf ve takip edilebilir sistem',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/10 dark:bg-green-500/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-slate-900/30">
      <div className="page-container">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brandBlue/10 dark:bg-brandBlue/20 text-brandBlue font-semibold text-sm mb-6">
            <span>✨</span>
            <span>Neden PrestaLink?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brandNavy dark:text-white mb-4">
            Profesyonel İş Bulma Platformu
          </h2>
          <p className="text-lg text-brandGray dark:text-slate-300 max-w-2xl mx-auto">
            Avrupa'da kariyer hayalinizi gerçekleştirmek için ihtiyacınız olan her şey tek platformda
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-brandNavy dark:text-white mb-2 group-hover:text-brandBlue dark:group-hover:text-brandBlue transition-colors">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-brandGray dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow Icon on Hover */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-brandBlue" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-brandGray dark:text-slate-400 mb-4">
            25.000+ başarılı yerleştirme · 180+ Avrupa şirketi
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-slate-800" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white dark:border-slate-800" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white dark:border-slate-800" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white dark:border-slate-800" />
            </div>
            <span className="text-brandGray dark:text-slate-400 font-medium">
              Binlerce kullanıcı tarafından güvenilir
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default QuickFeatures;

