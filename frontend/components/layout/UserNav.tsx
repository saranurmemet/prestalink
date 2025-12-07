'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  Bell 
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

const UserNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/user/dashboard', icon: LayoutDashboard, label: t('userNav.dashboard') },
    { href: '/user/profile', icon: User, label: t('userNav.profile') },
    { href: '/user/jobs', icon: Briefcase, label: t('userNav.jobListings') },
    { href: '/user/applications', icon: FileText, label: t('userNav.applications') },
    { href: '/user/notifications', icon: Bell, label: t('userNav.notifications') },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/user/dashboard' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-brandBlue text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            © 2026 ME&RA®
          </p>
        </div>
      </nav>
    </aside>
  );
};

export default UserNav;

