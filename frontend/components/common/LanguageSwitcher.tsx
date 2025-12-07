'use client';

import { useLanguage, type LanguageCode } from '@/components/providers/LanguageProvider';

const languages: Array<{ code: LanguageCode; label: string }> = [
  { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
] as const;

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 shadow-sm transition-all duration-300 hover:shadow-md">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={`rounded-full px-3 py-1 text-sm transition-all duration-200 ${
            language === lang.code 
              ? 'bg-brandBlue text-white shadow-sm scale-105' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

