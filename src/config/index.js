// Environment configuration for the application
const config = {
  // Google OAuth
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // API Configuration - Should be set via environment variables
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Digital Ganesha',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

// Validation in development
if (config.isDevelopment && !import.meta.env.VITE_API_URL) {
  console.warn('⚠️  VITE_API_URL not set, using default localhost')
}

if (config.isProduction && !import.meta.env.VITE_API_URL) {
  console.error('❌ VITE_API_URL must be set in production!')
}

// Export both default config and named export for backward compatibility
export default config;
export const API_BASE_URL = config.apiUrl;
