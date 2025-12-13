'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/services/types';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedPageProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

const ProtectedPage = ({ children, roles }: ProtectedPageProps) => {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // CRITICAL: Do NOT decide redirect until store is hydrated from localStorage
    if (!hasHydrated) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (roles && !roles.includes(user.role)) {
      router.replace('/');
      return;
    }

    setAuthorized(true);
  }, [user, roles, router, hasHydrated]);

  if (!hasHydrated || !authorized) {
    return (
      <div className="page-container flex min-h-[40vh] items-center justify-center py-20 text-brandGray">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-brandBlue border-t-transparent" />
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;

