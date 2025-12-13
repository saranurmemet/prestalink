'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { FileText, MessageCircle, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CTAFinal = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            {t('ctaFinal.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            {t('ctaFinal.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link href="/contact" className="block">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-center group h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('ctaFinal.btnForm')}
                </h3>
                <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mt-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <a
              href="https://wa.me/213555123456"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-center group h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('ctaFinal.btnWhatsApp')}
                </h3>
                <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mt-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link href="/jobs" className="block">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-center group h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('ctaFinal.btnJobs')}
                </h3>
                <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mt-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTAFinal;
