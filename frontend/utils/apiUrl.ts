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
  
  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    console.warn('WARNING: NEXT_PUBLIC_API_URL not set in development. Using localhost:5000');
    return 'http://localhost:5000';
  }
  
  // Production: MUST fail if API URL not set
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required in production');
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


