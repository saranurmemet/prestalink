'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="px-4 pb-6 pt-10 animate-fade-in">
      <div className="page-container glass-panel flex flex-col gap-4 rounded-glass px-6 py-6 text-sm text-brandGray dark:text-slate-300 md:flex-row md:items-center md:justify-between">
        <p className="transition-colors hover:text-brandNavy dark:hover:text-slate-100">© 2026 by ME-RA</p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="transition-colors hover:text-brandBlue hover:underline">
            {t('nav.about')}
          </Link>
          <Link href="/contact" className="transition-colors hover:text-brandBlue hover:underline">
            {t('nav.contact')}
          </Link>
          <a href="mailto:hello@prestalink.com" className="transition-colors hover:text-brandBlue hover:underline">
            hello@prestalink.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

