const withPWA = require('next-pwa')({
  dest: 'public',
  // Disable PWA only in development to avoid stale cache issues while iterating.
  // In production we keep PWA enabled so installed apps can receive updates.
  disable: process.env.NODE_ENV === 'development',
  
  // Do NOT cache auth-related endpoints
  // Auto-apply updates for installed PWAs (no manual prompt)
  skipWaiting: true,
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
  // Note: i18n configuration is not compatible with App Router
  // Using custom client-side i18n solution via LanguageProvider instead
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

