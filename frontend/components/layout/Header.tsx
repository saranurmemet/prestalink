'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import Logo from '@/components/common/Logo';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { labelKey: 'nav.home', href: '/' },
  { labelKey: 'nav.about', href: '/about' },
  { labelKey: 'nav.contact', href: '/contact' },
  { labelKey: 'nav.jobs', href: '/jobs' },
];

const Header = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-2xl transition-all duration-300 hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/70 dark:hover:bg-slate-900/80">
      <div className="page-container flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex-shrink-0">
          <Logo />
        </div>
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1 justify-center overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs sm:text-sm font-semibold transition-all duration-200 relative whitespace-nowrap ${
                pathname === item.href 
                  ? 'text-brandBlue' 
                  : 'text-brandGray hover:text-brandBlue dark:text-slate-300 dark:hover:text-brandBlue'
              }`}
            >
              {t(item.labelKey)}
              {pathname === item.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brandBlue rounded-full animate-scale-in" />
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          {user ? (
            <>
              <button
                type="button"
                className="rounded-full border border-white/60 bg-white/70 px-2 sm:px-4 md:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-semibold text-brandBlue shadow-soft transition-all duration-300 hover:bg-brandBlue hover:text-white hover:scale-105 hover:shadow-md active:scale-100 dark:border-slate-600/60 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-brandBlue whitespace-nowrap"
                onClick={logout}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/login" className="text-[10px] sm:text-xs md:text-sm font-semibold text-brandGray hover:text-brandBlue transition-colors dark:text-slate-300 dark:hover:text-brandBlue whitespace-nowrap">
                {t('nav.login')}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brandOrange px-2 sm:px-4 md:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brandOrange/30 active:scale-100 whitespace-nowrap"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

