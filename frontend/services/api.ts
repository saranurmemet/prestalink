import axios from 'axios';
import { API_ROUTES } from './endpoints';
import type { User, Job, Application, Notification } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://prestalink.onrender.com/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const persisted = localStorage.getItem('prestalink-auth');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Token parse error', error);
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response?.status === 401) {
        // Clear auth state
        localStorage.removeItem('prestalink-auth');
        // Redirect to login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
      // Handle 403 Forbidden - Insufficient permissions
      if (error.response?.status === 403) {
        // Optionally redirect or show error message
        console.error('Access forbidden:', error.response?.data?.message || 'You do not have permission to access this resource');
      }
    }
    return Promise.reject(error);
  },
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
  api.get<{ hasCV: boolean; cvUrl?: string }>(`/auth/users/${userId}/cv`);

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

export default api;

