'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import PWATracker from '@/components/common/PWATracker';
import PWAUpdatePrompt from '@/components/common/PWAUpdatePrompt';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <PWATracker />
          <PWAUpdatePrompt />
          {children}
        </GoogleOAuthProvider>
      ) : (
        <>
          <PWATracker />
          <PWAUpdatePrompt />
          {children}
        </>
      )}
    </LanguageProvider>
  </ThemeProvider>
);

export default AppProviders;

