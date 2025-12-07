'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomeHero from '@/components/sections/HomeHero';
import JobHighlights from '@/components/sections/JobHighlights';
import QuickFeatures from '@/components/sections/QuickFeatures';
import ProcessSection from '@/components/sections/ProcessSection';
import { useAuthStore } from '@/store/useAuthStore';
import { getDashboardRoute } from '@/utils/routing';

export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const dashboardRoute = getDashboardRoute(user.role);
      router.push(dashboardRoute);
    }
  }, [user, router]);

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="space-y-6 pb-8">
      <HomeHero />
      <ProcessSection />
      <JobHighlights />
      <QuickFeatures />
    </div>
  );
}
