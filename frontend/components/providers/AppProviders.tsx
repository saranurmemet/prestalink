'use client';

import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import PWATracker from '@/components/common/PWATracker';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Google OAuth Provider sadece client ID varsa ekle
  const content = (
    <ThemeProvider>
      <LanguageProvider>
        <PWATracker />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );

  // Google OAuth Provider ile sarmala (eğer client ID varsa)
  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        {content}
      </GoogleOAuthProvider>
    );
  }

  return content;
};

export default AppProviders;

