'use client';

import UserNav from './UserNav';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <UserNav />
      <main className="flex-1 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;

