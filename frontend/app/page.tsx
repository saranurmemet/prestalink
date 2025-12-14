'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getDashboardRoute } from '@/utils/routing';
import HeroSection from '@/components/sections/HeroSection';
import ProcessSection from '@/components/sections/ProcessSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import FeatureGrid from '@/components/sections/FeatureGrid';
import QuickStats from '@/components/sections/QuickStats';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import JobHighlights from '@/components/sections/JobHighlights';

export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Kısa bir süre bekle, sonra kontrol et
    const timer = setTimeout(() => {
      setIsChecking(false);
      
      // SADECE URL'de ?dashboard=true parametresi varsa dashboard'a yönlendir
      // Normal durumda her zaman ana sayfada kal
      if (user && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const shouldRedirectToDashboard = urlParams.get('dashboard') === 'true';
        
        if (shouldRedirectToDashboard) {
          const dashboardRoute = getDashboardRoute(user.role);
          router.push(dashboardRoute);
          return;
        }
        // Eğer dashboard parametresi yoksa, ana sayfada kal (hiçbir yönlendirme yapma)
      }
      // Kullanıcı giriş yapmamışsa da ana sayfada kal
    }, 100);

    return () => clearTimeout(timer);
  }, [user, router]);

  // Loading state - çok kısa süreli
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandBlue mx-auto"></div>
        </div>
      </div>
    );
  }

  // Ana sayfa içeriği - Landing page
  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickStats />
      <ProcessSection />
      <BenefitsSection />
      <FeatureGrid />
      <JobHighlights />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
