'use client';

import EmployerNav from './EmployerNav';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

const EmployerLayout = ({ children }: EmployerLayoutProps) => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <EmployerNav />
      <main className="flex-1 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default EmployerLayout;



