'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomeHero from '@/components/sections/HomeHero';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import ProcessSteps from '@/components/ProcessSteps';
import JobHighlights from '@/components/sections/JobHighlights';
import BenefitsGrid from '@/components/BenefitsGrid';
import TrustIndicators from '@/components/TrustIndicators';
import CTAFinal from '@/components/CTAFinal';
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
    <div className="space-y-0">
      <HomeHero />
      <LiveActivityFeed />
      <ProcessSteps />
      <JobHighlights />
      <BenefitsGrid />
      <TrustIndicators />
      <CTAFinal />
    </div>
  );
}
