export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    google: '/auth/google',
    me: '/auth/me',
  },
  jobs: {
    base: '/jobs',
    detail: (id: string) => `/jobs/${id}`,
  },
  applications: {
    base: '/applications',
    byUser: (id: string) => `/applications/user/${id}`,
    byJob: (id: string) => `/applications/job/${id}`,
    updateStatus: (id: string) => `/applications/${id}/status`,
  },
  notifications: {
    base: '/notifications',
    markRead: '/notifications/mark-read',
  },
};

