'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  Bell,
  FileCheck,
  Heart,
  BarChart3,
  Settings,
  MessageSquare,
  Star
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchNotifications } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

const UserNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications();
        const notifications = response.data || [];
        const unread = notifications.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setUnreadCount(0);
      }
    };

    loadNotifications();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  const navItems = [
    { href: '/user/dashboard', icon: LayoutDashboard, label: t('userNav.dashboard') },
    { href: '/user/profile', icon: User, label: t('userNav.profile') },
    { href: '/user/cv', icon: FileCheck, label: t('userNav.cv') },
    { href: '/user/jobs', icon: Briefcase, label: t('userNav.jobListings') },
    { href: '/user/favorites', icon: Heart, label: t('userNav.favorites') },
    { href: '/user/applications', icon: FileText, label: t('userNav.applications') },
    { href: '/user/messages', icon: MessageSquare, label: t('userNav.messages') },
    { href: '/user/statistics', icon: BarChart3, label: t('userNav.statistics') },
    { href: '/user/notifications', icon: Bell, label: t('userNav.notifications'), showBadge: true },
    { href: '/user/settings', icon: Settings, label: t('userNav.settings') },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
        <nav className="flex flex-col h-full p-4">
          <div className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/user/dashboard' && pathname?.startsWith(item.href));
              
              const showBadge = item.showBadge && unreadCount > 0;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-brandBlue text-white shadow-md' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <Icon className="w-5 h-5" />
                    {showBadge && (
                      <span className={`
                        absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[11px] font-bold shadow-lg
                        ${isActive 
                          ? 'bg-red-500 text-white border-2 border-white' 
                          : 'bg-red-500 text-white border-2 border-white dark:border-slate-900'
                        }
                        animate-pulse
                      `}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium flex-1">{item.label}</span>
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

      {/* Mobile Horizontal Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 overflow-x-auto scrollbar-hide">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/user/dashboard' && pathname?.startsWith(item.href));
            
            const showBadge = item.showBadge && unreadCount > 0;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 relative min-w-[60px]
                  ${isActive 
                    ? 'text-brandBlue' 
                    : 'text-slate-600 dark:text-slate-400'
                  }
                `}
              >
                <div className="relative flex-shrink-0">
                  <Icon className="w-5 h-5" />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold bg-red-500 text-white border-2 border-white dark:border-slate-900 animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default UserNav;
