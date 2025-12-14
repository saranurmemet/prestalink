import axios from 'axios';
import { API_ROUTES } from './endpoints';
import type { User, Job, Application, Notification } from './types';

// API Base URL Configuration
// CRITICAL: Must ONLY use NEXT_PUBLIC_API_URL from environment
// Local PC: http://localhost:5000/api
// Local Mobile/PWA: http://<LAN-IP>:5000/api (from .env.local)
// Deployment: https://<backend-domain>/api (from environment)
const getApiBaseURL = () => {
  // Development fallback for stability
  if (typeof window !== 'undefined') {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (apiUrl) {
      return apiUrl;
    }
    
    // Development fallback - only in browser
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn('⚠️ NEXT_PUBLIC_API_URL not set, using development fallback: http://localhost:5000/api');
      return 'http://localhost:5000/api';
    }
  }
  
  // Server-side or production: MUST be set
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required. Set it in .env.local for development or environment variables for production');
  }
  
  return apiUrl;
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true,
  timeout: 30000, // 30 saniye timeout
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        // Add Authorization token
        const persisted = localStorage.getItem('prestalink-auth');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        
        // Add Accept-Language header for i18n error messages
        const langStore = localStorage.getItem('prestalink-language');
        if (langStore) {
          const parsed = JSON.parse(langStore);
          const lang = parsed?.state?.language || 'en';
          config.headers['Accept-Language'] = `${lang}-${lang.toUpperCase()},${lang};q=0.9,en;q=0.8`;
        } else {
          config.headers['Accept-Language'] = 'en-US,en;q=0.9';
        }
      } catch (error) {
        console.error('Token parse error', error);
        // Continue without token if parse fails
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      try {
        // Handle network errors
        if (!error.response) {
          console.error('Network error:', error.message);
          // Don't redirect on network errors - let components handle it
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
          // Clear auth state
          try {
            localStorage.removeItem('prestalink-auth');
          } catch (e) {
            console.error('Failed to clear auth:', e);
          }
          
          // Redirect to login page ONLY if not on public pages
          const publicPaths = ['/', '/login', '/register', '/jobs', '/about', '/contact'];
          const currentPath = window.location.pathname;
          const isPublicPath = publicPaths.some(path => 
            currentPath === path || currentPath.startsWith(path + '/')
          );
          
          if (!isPublicPath) {
            window.location.href = '/login';
          }
        }
        
        // Handle 403 Forbidden - Insufficient permissions
        if (error.response?.status === 403) {
          console.error('Access forbidden:', error.response?.data?.message || 'You do not have permission to access this resource');
        }
        
        // Handle 500+ Server errors
        if (error.response?.status >= 500) {
          console.error('Server error:', error.response?.data?.message || 'Internal server error');
        }
      } catch (e) {
        console.error('Error in response interceptor:', e);
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = (payload: Partial<User> & { password: string }) =>
  api.post<{ user: User; token: string }>(API_ROUTES.auth.register, payload);

export const loginUser = (payload: { email: string; password: string }, role?: 'user' | 'recruiter' | 'admin' | 'superadmin') => {
  // Use role-specific endpoint if role is provided
  if (role) {
    const roleEndpoint = role === 'superadmin' ? 'superadmin/login' : `${role}/login`;
    return api.post<{ user: User; token: string }>(`/auth/${roleEndpoint}`, payload);
  }
  return api.post<{ user: User; token: string }>(API_ROUTES.auth.login, payload);
};

export const fetchProfile = () =>
  api.get<{ user: User }>(API_ROUTES.auth.me);

export const updateProfile = (data: FormData) =>
  api.put<{ user: User }>(API_ROUTES.auth.me, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const checkUserCV = (userId: string) =>
  api.get<{ hasCV: boolean; cvUrl?: string }>(`/users/${userId}/cv`);

export const fetchJobs = () =>
  api.get<Job[]>(API_ROUTES.jobs.base);

export const fetchJob = (id: string) =>
  api.get<Job>(API_ROUTES.jobs.detail(id));

export const createJob = (payload: Partial<Job>) =>
  api.post<Job>(API_ROUTES.jobs.base, payload);

export const updateJob = (id: string, payload: Partial<Job>) =>
  api.put<Job>(API_ROUTES.jobs.detail(id), payload);

export const deleteJob = (id: string) =>
  api.delete(API_ROUTES.jobs.detail(id));

export const submitApplication = (data: FormData) =>
  api.post<Application>(API_ROUTES.applications.base, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchApplicationsByUser = (userId: string) =>
  api.get<Application[]>(API_ROUTES.applications.byUser(userId));

export const fetchApplicationsByJob = (jobId: string) =>
  api.get<Application[]>(API_ROUTES.applications.byJob(jobId));

export const updateApplicationStatus = (applicationId: string, payload: { status: string; message?: string }) =>
  api.put<Application>(API_ROUTES.applications.updateStatus(applicationId), payload);

export const fetchNotifications = () =>
  api.get<Notification[]>(API_ROUTES.notifications.base);

export const markNotificationsRead = () =>
  api.put(API_ROUTES.notifications.markRead, {});

// Admin API
export const getAdminStats = () =>
  api.get<{
    totalUsers: number;
    activeUsers: number;
    pwaInstalledUsers: number;
    totalJobs: number;
    totalRecruiters: number;
    totalApplications: number;
    usersByRole: Record<string, number>;
    recentRegistrations: number;
    recentJobs: number;
  }>('/admin/stats');

export const getAdminUsers = (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
  api.get<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>('/admin/users', { params });

export const updateUserRole = (userId: string, role: string) =>
  api.put<User>(`/admin/users/${userId}/role`, { role });

export const markPWAInstalled = () =>
  api.post<{ message: string; pwaInstalled: boolean }>('/admin/pwa-install');

export default api;

