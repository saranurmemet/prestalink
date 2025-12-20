/**
 * Environment Variable Validation
 * Validates critical environment variables on app load
 */

if (typeof window === 'undefined') {
  // Server-side validation
  const requiredEnvVars = ['NEXT_PUBLIC_API_URL'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ [ENV] Missing required environment variable: ${envVar}`);
      console.error(`❌ [ENV] Set it in .env.local for development or environment variables for production`);
    } else {
      console.log(`✅ [ENV] ${envVar} is set: ${process.env[envVar].substring(0, 30)}...`);
    }
  }
} else {
  // Client-side validation
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.warn('⚠️ [ENV] NEXT_PUBLIC_API_URL is not set. Using fallback.');
    
    // Check if we're in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment && isLocalHost) {
      console.warn('⚠️ [ENV] Development mode detected. Using localhost:5000/api as fallback.');
    } else {
      console.error('❌ [ENV] NEXT_PUBLIC_API_URL is required in production!');
      console.error('❌ [ENV] Set it in Vercel environment variables.');
    }
  } else {
    console.log(`✅ [ENV] NEXT_PUBLIC_API_URL is set: ${apiUrl.substring(0, 30)}...`);
    
    // Validate URL format
    try {
      const url = new URL(apiUrl);
      if (!url.protocol.startsWith('http')) {
        console.error('❌ [ENV] NEXT_PUBLIC_API_URL must start with http:// or https://');
      }
    } catch (error) {
      console.error('❌ [ENV] NEXT_PUBLIC_API_URL is not a valid URL:', apiUrl);
    }
  }
}

export {};
