// Environment configuration for the application
const config = {
  // Google OAuth
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Digital Ganesha',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
