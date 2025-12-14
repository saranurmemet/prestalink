'use client';

import { useState } from 'react';
import { useLanguage, type LanguageCode } from '@/components/providers/LanguageProvider';
import { ChevronDown } from 'lucide-react';

const languages: Array<{ code: LanguageCode; label: string; flag: string }> = [
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

// Ensure no duplicates by code
const uniqueLanguages = languages.filter((lang, index, self) => 
  index === self.findIndex((l) => l.code === lang.code)
);

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <>
      {/* Desktop - Button Group */}
      <div className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 shadow-sm transition-all duration-300 hover:shadow-md">
        {uniqueLanguages.map((lang) => (
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
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Mobile - Dropdown */}
      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium shadow-sm transition-all hover:shadow-md"
        >
          <span>{currentLang.flag}</span>
          <span className="text-slate-700 dark:text-slate-200">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden animate-fade-in">
              {uniqueLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    language === lang.code
                      ? 'bg-brandBlue text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LanguageSwitcher;

