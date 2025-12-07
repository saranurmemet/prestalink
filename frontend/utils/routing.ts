import type { UserRole } from '@/services/types';

/**
 * Get dashboard route based on user role
 */
export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'user':
      return '/user/dashboard';
    case 'recruiter':
      return '/employer/dashboard';
    case 'admin':
    case 'superadmin':
      return '/admin/dashboard';
    default:
      return '/user/dashboard';
  }
};


