'use client';

import { LanguageProvider } from './LanguageProvider';
import { ThemeProvider } from './ThemeProvider';
import ServiceWorkerUpdater from '@/components/common/ServiceWorkerUpdater';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>
      <ServiceWorkerUpdater />
      {children}
    </LanguageProvider>
  </ThemeProvider>
);

export default AppProviders;

