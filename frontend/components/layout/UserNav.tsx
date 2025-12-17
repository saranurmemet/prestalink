'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
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
  Headphones
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchNotifications } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useFloatingContactStore } from '@/store/useFloatingContactStore';

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  showBadge?: boolean;
  onClick?: () => void;
};

const UserNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const toggleContact = useFloatingContactStore((s) => s.toggle);

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

  const navItems: NavItem[] = [
    { href: '/user/dashboard', icon: LayoutDashboard, label: String(t('userNav.dashboard')) },
    { href: '/user/profile', icon: User, label: String(t('userNav.profile')) },
    { href: '/user/cv', icon: FileCheck, label: String(t('userNav.cv')) },
    { href: '/user/jobs', icon: Briefcase, label: String(t('userNav.jobListings')) },
    { href: '/user/favorites', icon: Heart, label: String(t('userNav.favorites')) },
    { href: '/user/applications', icon: FileText, label: String(t('userNav.applications')) },
    { href: '/user/messages', icon: MessageSquare, label: String(t('userNav.messages')) },
    { href: '/user/statistics', icon: BarChart3, label: String(t('userNav.statistics')) },
    { href: '/user/notifications', icon: Bell, label: String(t('userNav.notifications')), showBadge: true },
    { href: '/user/settings', icon: Settings, label: String(t('userNav.settings')) },
  ];

  // Mobile bottom bar: show the core items + a "Contact" action that opens the support panel
  const mobileItems: NavItem[] = [
    navItems[0], // dashboard
    navItems[1], // profile
    navItems[2], // cv
    navItems[3], // jobs
    navItems[4], // favorites
    { href: '#contact', icon: Headphones, label: String(t('nav.contactSupport')), onClick: toggleContact },
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
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/user/dashboard' && pathname?.startsWith(item.href));
            
            const showBadge = item.showBadge && unreadCount > 0;
            
            return (
              item.onClick ? (
                <button
                  key={item.href}
                  type="button"
                  onClick={item.onClick}
                  className={`
                    flex flex-col items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 relative min-w-[60px]
                    text-slate-600 dark:text-slate-400 hover:text-brandBlue
                  `}
                  aria-label={item.label}
                >
                  <div className="relative flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{item.label}</span>
                </button>
              ) : (
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
              )
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default UserNav;
