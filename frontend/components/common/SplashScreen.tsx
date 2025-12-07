'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Minimum splash screen duration (2 seconds)
    const minDuration = 2000;
    const startTime = Date.now();

    // Check if page is loaded
    const checkLoaded = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setIsVisible(false);
        // Remove from DOM after fade-out animation
        setTimeout(() => {
          setIsMounted(false);
        }, 500); // Match fade-out duration
      }, remaining);
    };

    if (document.readyState === 'complete') {
      checkLoaded();
    } else {
      window.addEventListener('load', checkLoaded);
      return () => window.removeEventListener('load', checkLoaded);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-brandBlue transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        {/* Logo with animation - larger size to show full letters */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl animate-pulse" />
          <div className="relative">
            <Image
              src="/assets/logo.jpeg"
              alt="PrestaLink"
              width={180}
              height={180}
              priority
              className="object-contain rounded-2xl shadow-2xl animate-bounce-slow"
              style={{ width: '180px', height: '180px' }}
            />
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
            Presta<span className="text-brandOrange">Link</span>
          </h1>
          <p className="text-white/80 text-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
            منصة التوظيف الأوروبي
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center gap-2 mt-4">
          <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* "by ME-RA 2026" text in bottom corner */}
      <div className="absolute bottom-6 right-6 text-white/70 text-sm font-medium animate-fade-in" style={{ animationDelay: '0.3s' }}>
        by ME-RA 2026
      </div>
    </div>
  );
};

export default SplashScreen;

