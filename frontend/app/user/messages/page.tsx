'use client';

import { useEffect, useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { MessageSquare, Send, User } from 'lucide-react';

const MessagesPage = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated messages - in real app, fetch from API
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender: 'Recruiter',
          senderName: 'TechCorp HR',
          message: t('userMessages.sampleMessage1'),
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
        },
        {
          id: 2,
          sender: 'Recruiter',
          senderName: 'Healthcare Solutions',
          message: t('userMessages.sampleMessage2'),
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: true,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [t]);

  const content = (
    <UserLayout>
      <div className="page-container py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t('userMessages.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('userMessages.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandBlue mx-auto"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('userMessages.emptyTitle')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t('userMessages.emptyDescription')}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    !msg.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-brandBlue/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-brandBlue" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                          {msg.senderName}
                        </h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {msg.timestamp.toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{msg.message}</p>
                      {!msg.read && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                          {t('userMessages.new')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );

  return <ProtectedPage>{content}</ProtectedPage>;
};

export default MessagesPage;





