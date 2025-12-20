/**
 * Environment Variable Validation
 * Validates critical environment variables at build time and runtime
 */

export const validateEnvVars = () => {
  const errors: string[] = [];

  // Check NEXT_PUBLIC_API_URL in production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      errors.push('NEXT_PUBLIC_API_URL is required in production');
    } else {
      // Validate URL format
      try {
        const url = new URL(process.env.NEXT_PUBLIC_API_URL);
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.push('NEXT_PUBLIC_API_URL must use http:// or https://');
        }
        if (!url.pathname.endsWith('/api')) {
          console.warn('⚠️ NEXT_PUBLIC_API_URL should end with /api');
        }
      } catch (e) {
        errors.push('NEXT_PUBLIC_API_URL is not a valid URL');
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Environment Variable Validation Errors:');
    errors.forEach((error) => console.error(`   - ${error}`));
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Environment validation failed: ${errors.join(', ')}`);
    }
  }

  return errors.length === 0;
};

// Run validation on module load (server-side only)
if (typeof window === 'undefined') {
  validateEnvVars();
}

