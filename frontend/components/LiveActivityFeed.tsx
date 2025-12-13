'use client';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const LiveActivityFeed = () => {
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  const activityTypes = [
    'europassReady',
    'applicationSent',
    'interviewScheduled',
    'visaApproved',
    'profileReviewed',
    'documentApproved'
  ];

  const userNames = [
    'user1', 'user2', 'user3', 'user4', 'user5', 'user6'
  ];

  const generateActivities = () => {
    const now = Date.now();
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      user: t(`liveActivity.users.${userNames[i]}`),
      activity: t(`liveActivity.activities.${activityTypes[i % activityTypes.length]}`),
      time: i === 0 ? t('liveActivity.justNow') : `${Math.floor(Math.random() * 30) + 1} ${t('liveActivity.minsAgo')}`,
      timestamp: now - i * 60000
    }));
  };

  useEffect(() => {
    setActivities(generateActivities());
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setActivities(generateActivities());
        setIsRefreshing(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, [t]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {t('liveActivity.refreshing')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('liveActivity.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            {t('liveActivity.subtitle')}
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isRefreshing ? 0.5 : 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      <span className="font-semibold">{activity.user}</span>
                      {' • '}
                      <span className="text-gray-600 dark:text-gray-300">{activity.activity}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveActivityFeed;
