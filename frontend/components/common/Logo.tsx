'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeProvider';

interface LogoProps {
  withText?: boolean;
  size?: number;
}

const Logo = ({ withText = true, size = 44 }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <Link href="/" className="flex items-center gap-3 font-semibold">
      <Image 
        src="/assets/logo.jpeg" 
        alt="PrestaLink" 
        width={size} 
        height={size} 
        priority 
        className="rounded-lg" 
      />
      {withText && (
        <div className="leading-none">
          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-brandBlue'}`}>
            Presta
          </p>
          <p className="text-lg font-semibold text-brandOrange -mt-1">Link</p>
        </div>
      )}
    </Link>
  );
};

export default Logo;

