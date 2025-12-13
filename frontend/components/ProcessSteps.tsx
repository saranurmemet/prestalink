'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { MessageSquare, FileText, Languages, Send, Users, Plane } from 'lucide-react';

const ProcessSteps = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: MessageSquare,
      title: t('processSteps.step1.title'),
      desc: t('processSteps.step1.desc'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: t('processSteps.step2.title'),
      desc: t('processSteps.step2.desc'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Languages,
      title: t('processSteps.step3.title'),
      desc: t('processSteps.step3.desc'),
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Send,
      title: t('processSteps.step4.title'),
      desc: t('processSteps.step4.desc'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Users,
      title: t('processSteps.step5.title'),
      desc: t('processSteps.step5.desc'),
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Plane,
      title: t('processSteps.step6.title'),
      desc: t('processSteps.step6.desc'),
      color: 'from-green-500 to-green-600'
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
            {t('processSteps.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('processSteps.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {step.desc}
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

export default ProcessSteps;
