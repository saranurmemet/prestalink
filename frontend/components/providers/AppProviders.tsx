'use client';

import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import PWATracker from '@/components/common/PWATracker';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>
      <PWATracker />
      {children}
    </LanguageProvider>
  </ThemeProvider>
);

export default AppProviders;

