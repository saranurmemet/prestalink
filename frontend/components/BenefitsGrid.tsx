'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Award, Globe, Activity, Shield, Zap, Plane } from 'lucide-react';

const BenefitsGrid = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Award,
      title: t('benefitsGrid.benefit1.title'),
      desc: t('benefitsGrid.benefit1.desc'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: t('benefitsGrid.benefit2.title'),
      desc: t('benefitsGrid.benefit2.desc'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Activity,
      title: t('benefitsGrid.benefit3.title'),
      desc: t('benefitsGrid.benefit3.desc'),
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: t('benefitsGrid.benefit4.title'),
      desc: t('benefitsGrid.benefit4.desc'),
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: t('benefitsGrid.benefit5.title'),
      desc: t('benefitsGrid.benefit5.desc'),
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Plane,
      title: t('benefitsGrid.benefit6.title'),
      desc: t('benefitsGrid.benefit6.desc'),
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('benefitsGrid.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('benefitsGrid.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="h-full bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
