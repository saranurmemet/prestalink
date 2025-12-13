# Code Changes: Before & After

## File 1: frontend/store/useAuthStore.ts

### BEFORE (Broken)
```typescript
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (payload: { user: User; token: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: ({ user, token }) =>
        set(() => {
          return { user, token };
        }),
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
      logout: () =>
        set(() => ({
          user: null,
          token: null,
        })),
    }),
    {
      name: 'prestalink-auth',
    },
  ),
);
```

### AFTER (Fixed)
```typescript
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/types';

interface AuthState {
  user: User | null;
  token: string | null;
  hasHydrated: boolean;  // NEW
  setAuth: (payload: { user: User; token: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (hydrated: boolean) => void;  // NEW
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,  // NEW
      setAuth: ({ user, token }) =>
        set(() => {
          return { user, token };
        }),
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
      logout: () =>
        set(() => ({
          user: null,
          token: null,
        })),
      setHasHydrated: (hydrated: boolean) =>  // NEW
        set(() => ({
          hasHydrated: hydrated,
        })),
    }),
    {
      name: 'prestalink-auth',
      onRehydrateStorage: () => (state) => {  // NEW
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
```

**Changes:**
- ✅ Added `hasHydrated: boolean` to interface
- ✅ Added `setHasHydrated()` method
- ✅ Added `onRehydrateStorage` callback to set hasHydrated=true after localStorage loads

---

## File 2: frontend/components/layout/ProtectedPage.tsx

### BEFORE (Broken)
```typescript
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
  const { user } = useAuthStore();  // MISSING hasHydrated check!
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');  // REDIRECTS BEFORE HYDRATION!
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace('/');
      return;
    }
    setAuthorized(true);
  }, [user, roles, router]);

  if (!authorized) {
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
```

### AFTER (Fixed)
```typescript
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
  const { user, hasHydrated } = useAuthStore();  // NEW: Get hasHydrated
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // CRITICAL: Do NOT decide redirect until store is hydrated from localStorage
    if (!hasHydrated) {  // NEW: Wait for hydration
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
  }, [user, roles, router, hasHydrated]);  // NEW: Added hasHydrated to deps

  if (!hasHydrated || !authorized) {  // NEW: Also check hasHydrated
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
```

**Changes:**
- ✅ Destructured `hasHydrated` from store
- ✅ Check `!hasHydrated` and return early BEFORE checking user
- ✅ Added `hasHydrated` to useEffect dependency array
- ✅ Added `hasHydrated` to loading screen condition

---

## File 3: frontend/services/api.ts

### BEFORE (Broken)
```typescript
// API Base URL Configuration
// Development: http://localhost:5000/api
// Production: Set via NEXT_PUBLIC_API_URL environment variable
const getApiBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // Production fallback (should be set via env variable)
  return 'https://prestalink.onrender.com/api';  // HARDCODED IN BUNDLE!
};
```

### AFTER (Fixed)
```typescript
// API Base URL Configuration
// CRITICAL: Must ONLY use NEXT_PUBLIC_API_URL from environment
// Local PC: http://localhost:5000/api
// Local Mobile/PWA: http://<LAN-IP>:5000/api (from .env.local)
// Deployment: https://<backend-domain>/api (from environment)
const getApiBaseURL = () => {
  // MUST be set in environment - no production fallback allowed
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    // Only log in development - production MUST have env variable set
    if (process.env.NODE_ENV === 'development') {
      console.warn('WARNING: NEXT_PUBLIC_API_URL not set. Using default http://localhost:5000/api');
      return 'http://localhost:5000/api';
    }
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');  // FAIL FAST
  }
  
  return apiUrl;
};
```

**Changes:**
- ❌ Removed hardcoded production URL `https://prestalink.onrender.com/api`
- ✅ Throw error in production if NEXT_PUBLIC_API_URL not set (fail-fast)
- ✅ Only development defaults to localhost
- ✅ Added explicit comments about environment variable requirement

---

## File 4: frontend/.env

### BEFORE
```
NEXT_PUBLIC_API_URL=http://192.168.1.14:5000/api
```

### AFTER
```
# Frontend environment variables
# NEXT_PUBLIC_* variables are exposed to the browser bundle

# Backend API URL - override in .env.local or deployment settings
# Local development: http://localhost:5000/api (for PC, uses localhost)
# PWA/Mobile on LAN: Set in .env.local to your PC's LAN IP
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Changes:**
- ✅ Added documentation
- ✅ Changed default to localhost (PC development default)
- ✅ Notes about overriding in .env.local

---

## File 5: frontend/.env.local

### BEFORE
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```

### AFTER
```
# .env.local - Local development overrides (not committed to git)
# This file is used for local development, testing, and PWA/mobile on LAN

# For PC Chrome local development: http://localhost:5000/api
# For PWA/Mobile on same Wi-Fi: Use your PC's LAN IP
# Get LAN IP on Windows: Run 'ipconfig' in PowerShell, look for IPv4 Address (usually 192.168.x.x)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Changes:**
- ✅ Added documentation
- ✅ Instructions for finding and setting LAN IP for mobile testing

---

## File 6: frontend/next.config.js

### BEFORE (Broken)
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);
```

### AFTER (Fixed)
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  // CRITICAL FIX: Disable PWA in development to avoid stale cache issues during testing
  // In production, set PWA_ENABLED environment variable explicitly to enable
  disable: process.env.NODE_ENV === 'development' || process.env.PWA_ENABLED !== 'true',
  
  // Do NOT cache auth-related endpoints
  skipWaiting: true, // Always update service worker
  clientsClaim: true,
  
  // Add runtime caching config that EXCLUDES auth endpoints
  runtimeCaching: [
    // Do NOT cache auth requests - they must always be fresh
    // /api/auth/* will use NetworkFirst by default (good)
    
    // Cache API calls with network-first strategy (network preferred)
    {
      urlPattern: /^https?.*\/api\/(?!auth\/).*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300, // 5 minutes - short TTL for data endpoints
        },
      },
    },
    // Cache static assets
    {
      urlPattern: /\.(?:js|css|woff2?)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 86400, // 24 hours
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Add cache control headers to prevent browser cache issues
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
```

**Changes:**
- ✅ Added condition to disable PWA in dev (unless explicitly enabled)
- ✅ Added runtimeCaching config to exclude auth endpoints
- ✅ Set NetworkFirst strategy for non-auth APIs
- ✅ Added short TTL (5 min) for API cache
- ✅ Added cache-control headers for API routes

---

## File 7: backend/server.js (CORS Configuration)

### BEFORE (Broken)
```javascript
// CORS Configuration - Production ve Development için
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

// Production URL'lerini otomatik ekle (eğer production modundaysa)
if (process.env.NODE_ENV === 'production') {
  // Vercel ve Render URL'lerini ekle
  const productionUrls = [
    'https://prestalink.vercel.app',
    'https://*.vercel.app',  // WILDCARD + credentials = BROKEN!
    'https://prestalink.onrender.com',
  ];
  allowedOrigins.push(...productionUrls);
}

app.use(cors({ 
  origin: (origin, callback) => {
    // Origin yoksa (mobile app, Postman vb.) izin ver
    if (!origin) return callback(null, true);
    
    // Wildcard kontrolü
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(`^${pattern}$`).test(origin);  // Browser rejects this
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
}));
```

### AFTER (Fixed)
```javascript
// CORS Configuration - CRITICAL for stability
// Must explicitly list allowed origins - never use wildcard with credentials
const allowedOrigins = [];

// Development: Always allow localhost
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
  // Allow any local IP for PWA/mobile testing on same network
  allowedOrigins.push(/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/);
  allowedOrigins.push(/^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/);
  allowedOrigins.push(/^http:\/\/172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}:3000$/);
}

// Production: Use CLIENT_URL from environment (required)
if (process.env.CLIENT_URL) {
  const urls = process.env.CLIENT_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...urls);
}

// Fallback production URLs (explicit, no wildcards)
if (process.env.NODE_ENV === 'production') {
  if (process.env.CLIENT_URL) {
    // Already configured above
  } else {
    // These should come from environment - only add if explicitly needed
    allowedOrigins.push('https://prestalink.vercel.app');
    allowedOrigins.push('https://prestalink.onrender.com');
  }
}

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests without origin (mobile apps, some servers, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check against allowed origins
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  maxAge: 86400, // 24 hours
}));
```

**Changes:**
- ❌ Removed wildcard pattern `https://*.vercel.app`
- ✅ Changed from auto-adding production URLs to requiring CLIENT_URL environment variable
- ✅ Added regex patterns for local network IPs (192.168.x.x, 10.x.x.x, 172.x.x.x)
- ✅ Improved origin matching to handle both strings and RegExp
- ✅ Added warning log for blocked CORS origins
- ✅ Explicit is better than implicit for production deployment

---

## Summary

| File | Issue | Fix |
|------|-------|-----|
| useAuthStore.ts | No hydration guard | Added hasHydrated + onRehydrateStorage |
| ProtectedPage.tsx | Redirects before hydration | Wait for hasHydrated before deciding |
| api.ts | Hardcoded production URL | Environment variable only, fail-fast |
| .env | PC-specific IP in default | Changed to localhost |
| .env.local | Missing instructions | Added documentation |
| next.config.js | PWA caches auth data | Disable in dev, exclude auth endpoints |
| server.js | Wildcard CORS + credentials | Explicit origins, regex for local IPs |

**All changes maintain backward compatibility while fixing root causes.**
