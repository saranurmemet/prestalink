'use client';

import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import PWATracker from '@/components/common/PWATracker';
import PWAUpdatePrompt from '@/components/common/PWAUpdatePrompt';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>
      <PWATracker />
      <PWAUpdatePrompt />
      {children}
    </LanguageProvider>
  </ThemeProvider>
);

export default AppProviders;

