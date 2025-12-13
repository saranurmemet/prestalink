'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { TrendingUp, Briefcase, Star, Clock } from 'lucide-react';

const TrustIndicators = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: TrendingUp,
      value: t('trustIndicators.stat1'),
      label: t('trustIndicators.label1'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Briefcase,
      value: t('trustIndicators.stat2'),
      label: t('trustIndicators.label2'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Star,
      value: t('trustIndicators.stat3'),
      label: t('trustIndicators.label3'),
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Clock,
      value: t('trustIndicators.stat4'),
      label: t('trustIndicators.label4'),
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('trustIndicators.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            {t('trustIndicators.subtitle')}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
