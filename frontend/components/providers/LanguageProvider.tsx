'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

export type LanguageCode = 'en' | 'tr' | 'fr' | 'ar';

interface LanguageContextShape {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Record<string, unknown>;
}

const LanguageContext = createContext<LanguageContextShape>({
  language: 'en',
  setLanguage: () => undefined,
  t: (key, params) => key,
  translations: {},
});

const resources: Record<LanguageCode, Record<string, unknown>> = {
  en,
  tr,
  fr,
  ar,
};

const STORAGE_KEY = 'prestalink-lang';

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (saved && resources[saved]) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string, params?: Record<string, string | number>) => {
        const segments = key.split('.');
        let current: unknown = resources[language];
        for (const segment of segments) {
          if (typeof current !== 'object' || current === null || !(segment in current)) {
            return key;
          }
          current = (current as Record<string, unknown>)[segment];
        }
        let result = typeof current === 'string' ? current : key;
        
        // Replace {{key}} with params
        if (params) {
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
          });
        }
        
        return result;
      },
      translations: resources[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

