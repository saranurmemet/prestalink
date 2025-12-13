import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingContact from '@/components/common/FloatingContact';
import SplashScreen from '@/components/common/SplashScreen';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PrestaLink | Professional Europe Process Management for Algerian Citizens',
  description: 'Turn your European work dreams into reality. We professionally manage the entire process from CV preparation to visa processes, settlement to job applications. Your European career journey starts with Prestalink.',
  keywords: 'European jobs, Algerian citizens, work in Europe, Europass CV, visa support, job placement, process management, work abroad, Europe career',
  authors: [{ name: 'PrestaLink' }],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'ar_DZ', 'tr_TR'],
    url: 'https://prestalink.app',
    siteName: 'PrestaLink',
    title: 'PrestaLink | Professional Europe Process Management',
    description: 'Your European career journey starts here. Comprehensive process management from CV preparation to settlement.',
    images: [
      {
        url: '/assets/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'PrestaLink - European Career Process Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrestaLink | Professional Europe Process Management',
    description: 'Your European career journey starts here.',
    images: ['/assets/logo.jpeg'],
  },
  icons: {
    icon: '/assets/logo.jpeg',
    apple: '/assets/logo.jpeg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PrestaLink',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1D6EEA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('prestalink-theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} text-brandNavy dark:text-slate-100 antialiased`}>
        <AppProviders>
          <SplashScreen />
          <Header />
          <main className="pt-20 pb-16">{children}</main>
          <Footer />
          <FloatingContact />
        </AppProviders>
      </body>
    </html>
  );
}
