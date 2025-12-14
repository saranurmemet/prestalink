'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

interface MenuItem {
  href: string;
  labelKey: string;
}

const MobileMenu = ({ items }: { items: MenuItem[] }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout } = useAuthStore();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Toggle navigation"
        className="rounded-full border border-white/50 bg-white/80 p-2 text-brandBlue shadow-soft"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-brandBlue">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-brandBlue">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="absolute right-4 top-4 w-64 rounded-[28px] border border-white/40 dark:border-slate-700/40 bg-white/95 dark:bg-slate-900/95 p-6 shadow-card backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <nav className="flex flex-col gap-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
                    pathname === item.href 
                      ? 'bg-brandBlue/10 text-brandBlue dark:bg-brandBlue/20 dark:text-brandBlue' 
                      : 'text-brandGray dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              {user ? (
                <button
                  type="button"
                  className="w-full rounded-full bg-brandOrange hover:bg-brandOrange/90 py-2 text-sm font-semibold text-white transition-colors"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="rounded-full border border-brandBlue/30 dark:border-brandBlue/50 px-4 py-2 text-center text-sm font-semibold text-brandBlue dark:text-brandBlue hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 transition-colors" onClick={() => setOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="rounded-full bg-brandBlue hover:bg-brandBlue/90 px-4 py-2 text-center text-sm font-semibold text-white transition-colors" onClick={() => setOpen(false)}>
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;

