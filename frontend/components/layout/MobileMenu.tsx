'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';

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
            className="absolute right-4 top-4 w-64 rounded-[28px] border border-white/40 bg-white/95 p-6 shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <nav className="flex flex-col gap-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    pathname === item.href ? 'bg-brandBlue/10 text-brandBlue' : 'text-brandGray'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-slate-100 pt-4">
              {user ? (
                <button
                  type="button"
                  className="w-full rounded-full bg-brandOrange py-2 text-sm font-semibold text-white"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="rounded-full border border-brandBlue/30 px-4 py-2 text-center text-sm font-semibold text-brandBlue" onClick={() => setOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="rounded-full bg-brandBlue px-4 py-2 text-center text-sm font-semibold text-white" onClick={() => setOpen(false)}>
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

