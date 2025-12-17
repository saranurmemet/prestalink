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

module.exports = nextConfig;

