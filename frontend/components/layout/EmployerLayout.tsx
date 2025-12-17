'use client';

import EmployerNav from './EmployerNav';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

const EmployerLayout = ({ children }: EmployerLayoutProps) => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <EmployerNav />
      {/* Leave space for mobile bottom bar */}
      <main className="flex-1 md:ml-64 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default EmployerLayout;
















