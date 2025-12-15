/**
 * Get API base URL without /api suffix
 * Used for static file URLs (uploads, etc.)
 * CRITICAL: Must use NEXT_PUBLIC_API_URL from environment
 */
export const getApiBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    // Remove /api suffix if present
    return apiUrl.replace(/\/api\/?$/, '');
  }
  
  // Development fallback for stability
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn('⚠️ NEXT_PUBLIC_API_URL not set, using development fallback: http://localhost:5000');
      return 'http://localhost:5000';
    }
  }
  
  // Production or server-side: MUST fail if API URL not set
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required. Set it in .env.local for development or environment variables for production');
};

/**
 * Get full API URL for static files (CVs, certificates, etc.)
 */
export const getStaticFileUrl = (path: string): string => {
  // If path is already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${getApiBaseUrl()}${normalizedPath}`;
};

/**
 * Get profile photo URL - handles both relative paths and full URLs
 */
export const getProfilePhotoUrl = (profilePhoto?: string | null): string => {
  if (!profilePhoto) {
    return 'https://i.pravatar.cc/150?img=12';
  }
  
  // If already a full URL, return as is
  if (profilePhoto.startsWith('http://') || profilePhoto.startsWith('https://')) {
    return profilePhoto;
  }
  
  // Relative path - prepend API base URL
  const normalizedPath = profilePhoto.startsWith('/') ? profilePhoto : `/${profilePhoto}`;
  const apiBaseUrl = getApiBaseUrl();
  const fullUrl = `${apiBaseUrl}${normalizedPath}`;
  
  // Debug log in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Profile Photo URL:', { profilePhoto, apiBaseUrl, fullUrl });
  }
  
  return fullUrl;
};






