'use client';

import { LanguageProvider } from './LanguageProvider';
import { ThemeProvider } from './ThemeProvider';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>{children}</LanguageProvider>
  </ThemeProvider>
);

export default AppProviders;

