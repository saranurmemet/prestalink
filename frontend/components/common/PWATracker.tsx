'use client';

import { useEffect } from 'react';
import { markPWAInstalled } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function PWATracker() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (typeof window === 'undefined' || !token) return;

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    if (isStandalone || isIOSStandalone) {
      // App is installed, mark it
      markPWAInstalled().catch(() => {
        // Silently fail if not authenticated or API error
      });
    }

    // Listen for appinstalled event (when user installs the app)
    const handleAppInstalled = () => {
      markPWAInstalled().catch(() => {
        // Silently fail if not authenticated or API error
      });
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [token]);

  return null;
}















