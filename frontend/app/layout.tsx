import type { Metadata } from 'next';
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
  title: 'PrestaLink | منصة التوظيف الأوروبي للمواطنين الجزائريين',
  description: 'منصة التوظيف والبحث عن عمل في أوروبا للمواطنين الجزائريين. ساعدنا آلاف المواطنين الجزائريين للعثور على وظائف في ألمانيا، فرنسا، إسبانيا وأكثر.',
  manifest: '/manifest.json',
  themeColor: '#1D6EEA',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
