'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase,
  FileText,
  Bell,
  PlusCircle
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchNotifications } from '@/services/api';
import { useEffect, useState } from 'react';

const EmployerNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications();
        const unread = response.data.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        // Silent fail
      }
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: '/employer/dashboard', icon: LayoutDashboard, label: t('employerNav.dashboard') },
    { href: '/employer/profile', icon: Building2, label: t('employerNav.profile') },
    { href: '/employer/jobs/new', icon: PlusCircle, label: t('employerNav.createJob') },
    { href: '/employer/jobs', icon: Briefcase, label: t('employerNav.jobListings') },
    { href: '/employer/notifications', icon: Bell, label: t('employerNav.notifications'), badge: unreadCount },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/recruiter/dashboard' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-brandOrange text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive 
                      ? 'bg-white text-brandOrange' 
                      : 'bg-brandOrange text-white'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
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

export default EmployerNav;

