import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { API_ROUTES } from './endpoints';
import type { User, Job, Application, Notification } from './types';
import '@/utils/envValidation'; // Validate environment variables on load

// API Base URL Configuration
// CRITICAL: Must ONLY use NEXT_PUBLIC_API_URL from environment
// Local PC: http://localhost:5000/api
// Local Mobile/PWA: http://<LAN-IP>:5000/api (from .env.local)
// Deployment: https://<backend-domain>/api (from environment)
const getApiBaseURL = () => {
  // Browser-side:
  // - If NEXT_PUBLIC_API_URL is set, use it (allows local frontend -> deployed backend).
  // - Otherwise, fall back to local/LAN backend for development convenience.
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';
    const isLanHost =
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}$/.test(host);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) return apiUrl;

    if (process.env.NODE_ENV === 'development' && (isLocalHost || isLanHost)) {
      return `http://${host}:5000/api`;
    }
  }
  
  // Server-side or production: MUST be set
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required. Set it in .env.local for development or environment variables for production');
  }
  
  return apiUrl;
};

// Determine timeout based on environment
// Free tier: 60s (cold start), Paid tier: 10s (always on)
const getTimeout = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  // If using Render free tier (detect by URL pattern or env var)
  const isFreeTier = apiUrl.includes('onrender.com') && !process.env.RENDER_PAID_TIER;
  return isFreeTier ? 60000 : 10000; // 60s for free, 10s for paid
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true,
  timeout: getTimeout(),
  // Connection pooling settings
  httpAgent: typeof window === 'undefined' ? undefined : undefined, // Browser handles this
  httpsAgent: typeof window === 'undefined' ? undefined : undefined,
  // Keep-alive headers
  headers: {
    'Connection': 'keep-alive',
  },
});

// Configure retry mechanism
axiosRetry(api, {
  retries: 3, // Retry 3 times
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff: 100ms, 200ms, 400ms
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return (
      !error.response || // Network error
      (error.response.status >= 500 && error.response.status < 600) || // Server error
      error.code === 'ECONNABORTED' || // Timeout
      error.code === 'ERR_NETWORK' // Network error
    );
  },
  onRetry: (retryCount, error) => {
    console.log(`🔄 Retrying request (${retryCount}/3):`, error.message);
  },
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
        // Handle network errors (timeout, connection refused, etc.)
        if (!error.response) {
          console.error('Network error:', error.message);
          // Render free tier cold start can take 50+ seconds
          // Show user-friendly message for timeout errors
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            error.userMessage = 'Sunucu yanıt vermiyor. Lütfen birkaç saniye bekleyip tekrar deneyin. (Otomatik yeniden deneme yapılıyor...)';
          } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
            error.userMessage = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin veya birkaç saniye bekleyip tekrar deneyin. (Otomatik yeniden deneme yapılıyor...)';
          } else {
            error.userMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin. (Otomatik yeniden deneme yapılıyor...)';
          }
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

export const googleAuth = (idToken: string, role?: 'user' | 'recruiter' | 'admin' | 'superadmin') =>
  api.post<{ user: User; token: string; availableRoles?: string[] }>(API_ROUTES.auth.google, { idToken, role });

export const fetchProfile = () =>
  api.get<{ user: User }>(API_ROUTES.auth.me);

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.post<{ message: string }>(API_ROUTES.auth.changePassword, { currentPassword, newPassword });

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

export const submitContact = (payload: { name: string; email: string; message: string }) =>
  api.post<{ message: string; contact: { id: string; name: string; email: string; status: string; createdAt: string } }>(
    API_ROUTES.contact.base,
    payload
  );

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const baseURL = getApiBaseURL();
    const healthUrl = baseURL.replace('/api', '') + '/api/health';
    const response = await axios.get(healthUrl, {
      timeout: 5000, // 5 second timeout for health check
      validateStatus: (status) => status < 500, // Accept 2xx, 3xx, 4xx
    });
    return response.status === 200 && response.data?.status === 'ok';
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

// Connection status checker
let connectionStatus: 'online' | 'offline' | 'checking' = 'checking';
let lastHealthCheck: number = 0;
const HEALTH_CHECK_INTERVAL = 30000; // Check every 30 seconds

export const getConnectionStatus = async (): Promise<'online' | 'offline'> => {
  const now = Date.now();
  
  // Cache health check for 30 seconds
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL && connectionStatus !== 'checking') {
    return connectionStatus;
  }
  
  connectionStatus = 'checking';
  lastHealthCheck = now;
  
  const isHealthy = await checkBackendHealth();
  connectionStatus = isHealthy ? 'online' : 'offline';
  
  return connectionStatus;
};

// Initialize connection status on load
if (typeof window !== 'undefined') {
  // Check immediately
  getConnectionStatus();
  
  // Check periodically
  setInterval(() => {
    getConnectionStatus();
  }, HEALTH_CHECK_INTERVAL);
  
  // Check on online/offline events
  window.addEventListener('online', () => {
    getConnectionStatus();
  });
  
  window.addEventListener('offline', () => {
    connectionStatus = 'offline';
  });
}

export default api;

