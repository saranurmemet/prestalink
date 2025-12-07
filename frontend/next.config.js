const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  // Note: i18n configuration is not compatible with App Router
  // Using custom client-side i18n solution via LanguageProvider instead
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);

