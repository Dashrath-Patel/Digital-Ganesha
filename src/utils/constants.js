/**
 * Constants for the Ganesh application
 * Central location for all app constants, configurations, and enums
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    MANDALS: {
      LIST: '/mandals',
      CREATE: '/mandals',
      GET: '/mandals/:id',
      UPDATE: '/mandals/:id',
      DELETE: '/mandals/:id',
      NEARBY: '/mandals/nearby',
      FEATURED: '/mandals/featured',
      SEARCH: '/mandals/search'
    },
    EVENTS: {
      LIST: '/events',
      CREATE: '/events',
      GET: '/events/:id',
      UPDATE: '/events/:id',
      DELETE: '/events/:id',
      JOIN: '/events/:id/join',
      LEAVE: '/events/:id/leave',
      UPCOMING: '/events/upcoming',
      PAST: '/events/past'
    },
    MEDIA: {
      UPLOAD: '/media/upload',
      DELETE: '/media/:id',
      GET: '/media/:id',
      LIST: '/media',
      GALLERY: '/media/gallery'
    },
    NOTIFICATIONS: {
      LIST: '/notifications',
      MARK_READ: '/notifications/:id/read',
      MARK_ALL_READ: '/notifications/read-all',
      SETTINGS: '/notifications/settings'
    }
  }
}

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
  HEARTBEAT_INTERVAL: 30000,
  
  // WebSocket Events
  EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    MESSAGE: 'message',
    NOTIFICATION: 'notification',
    LIVE_UPDATE: 'live_update',
    USER_JOINED: 'user_joined',
    USER_LEFT: 'user_left',
    TYPING: 'typing',
    STOP_TYPING: 'stop_typing'
  }
}

// Storage Keys
export const STORAGE_KEYS = {
  // Authentication
  ACCESS_TOKEN: 'ganesh_access_token',
  REFRESH_TOKEN: 'ganesh_refresh_token',
  USER_DATA: 'ganesh_user_data',
  
  // App State
  APP_SETTINGS: 'ganesh_app_settings',
  THEME: 'ganesh_theme',
  LANGUAGE: 'ganesh_language',
  
  // Cache
  MANDALS_CACHE: 'ganesh_mandals_cache',
  EVENTS_CACHE: 'ganesh_events_cache',
  MEDIA_CACHE: 'ganesh_media_cache',
  
  // Offline
  OFFLINE_QUEUE: 'ganesh_offline_queue',
  OFFLINE_DATA: 'ganesh_offline_data',
  SYNC_TIMESTAMP: 'ganesh_sync_timestamp',
  
  // Performance
  PERFORMANCE_METRICS: 'ganesh_performance_metrics',
  ERROR_LOGS: 'ganesh_error_logs'
}

// Application States
export const APP_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
  OFFLINE: 'offline',
  SYNCING: 'syncing'
}

// Authentication States
export const AUTH_STATES = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  LOADING: 'loading',
  ERROR: 'error'
}

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// Language Options
export const LANGUAGES = {
  ENGLISH: 'en',
  HINDI: 'hi',
  MARATHI: 'mr',
  GUJARATI: 'gu',
  BENGALI: 'bn',
  TAMIL: 'ta',
  TELUGU: 'te',
  KANNADA: 'kn'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  EVENT: 'event',
  REMINDER: 'reminder',
  SOCIAL: 'social'
}

// Event Types
export const EVENT_TYPES = {
  FESTIVAL: 'festival',
  CEREMONY: 'ceremony',
  CULTURAL: 'cultural',
  RELIGIOUS: 'religious',
  COMMUNITY: 'community',
  WORKSHOP: 'workshop',
  CELEBRATION: 'celebration'
}

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document'
}

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // Image constraints
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,
  IMAGE_QUALITY: 0.8
}

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 19.0760, // Mumbai coordinates
    lng: 72.8777
  },
  DEFAULT_ZOOM: 12,
  MAX_ZOOM: 18,
  MIN_ZOOM: 8,
  
  // Search radius in kilometers
  DEFAULT_SEARCH_RADIUS: 5,
  MAX_SEARCH_RADIUS: 50
}

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    GOOD: 2500,
    NEEDS_IMPROVEMENT: 4000
  },
  FID: {
    GOOD: 100,
    NEEDS_IMPROVEMENT: 300
  },
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25
  },
  TTFB: {
    GOOD: 800,
    NEEDS_IMPROVEMENT: 1800
  },
  FCP: {
    GOOD: 1800,
    NEEDS_IMPROVEMENT: 3000
  }
}

// Error Codes
export const ERROR_CODES = {
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  
  // Authentication Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business Logic Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // File Upload Errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // Geolocation Errors
  LOCATION_PERMISSION_DENIED: 'LOCATION_PERMISSION_DENIED',
  LOCATION_UNAVAILABLE: 'LOCATION_UNAVAILABLE',
  LOCATION_TIMEOUT: 'LOCATION_TIMEOUT'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGOUT_SUCCESS: 'Successfully logged out',
  REGISTRATION_SUCCESS: 'Account created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EVENT_CREATED: 'Event created successfully',
  EVENT_JOINED: 'Successfully joined event',
  EVENT_LEFT: 'Successfully left event',
  MANDAL_CREATED: 'Mandal created successfully',
  MEDIA_UPLOADED: 'Media uploaded successfully',
  NOTIFICATION_SENT: 'Notification sent successfully'
}

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size is too large.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  LOCATION_ERROR: 'Unable to get your location.',
  CAMERA_ERROR: 'Unable to access camera.',
  MICROPHONE_ERROR: 'Unable to access microphone.'
}

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[+]?[\d\s-()]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ZIPCODE: /^\d{6}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  LETTERS_ONLY: /^[a-zA-Z\s]+$/,
  NUMBERS_ONLY: /^\d+$/
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  RELATIVE: 'relative' // For "2 hours ago" format
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
}

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000
}

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
}

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
}

// Feature Flags
export const FEATURES = {
  LIVE_CHAT: import.meta.env.VITE_FEATURE_LIVE_CHAT === 'true',
  VIDEO_CALLS: import.meta.env.VITE_FEATURE_VIDEO_CALLS === 'true',
  PUSH_NOTIFICATIONS: import.meta.env.VITE_FEATURE_PUSH_NOTIFICATIONS === 'true',
  OFFLINE_MODE: import.meta.env.VITE_FEATURE_OFFLINE_MODE === 'true',
  ANALYTICS: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
  GEOLOCATION: import.meta.env.VITE_FEATURE_GEOLOCATION === 'true',
  MEDIA_UPLOAD: import.meta.env.VITE_FEATURE_MEDIA_UPLOAD === 'true',
  SOCIAL_SHARING: import.meta.env.VITE_FEATURE_SOCIAL_SHARING === 'true'
}

// Social Media URLs
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/ganeshapp',
  TWITTER: 'https://twitter.com/ganeshapp',
  INSTAGRAM: 'https://instagram.com/ganeshapp',
  YOUTUBE: 'https://youtube.com/ganeshapp',
  LINKEDIN: 'https://linkedin.com/company/ganeshapp'
}

// App Information
export const APP_INFO = {
  NAME: 'Ganesh Community',
  VERSION: '1.0.0',
  DESCRIPTION: 'Connect with Ganesh mandals and community events',
  AUTHOR: 'Ganesh Team',
  SUPPORT_EMAIL: 'support@ganeshapp.com',
  PRIVACY_POLICY_URL: '/privacy-policy',
  TERMS_OF_SERVICE_URL: '/terms-of-service'
}

export default {
  API_CONFIG,
  WEBSOCKET_CONFIG,
  STORAGE_KEYS,
  APP_STATES,
  AUTH_STATES,
  THEMES,
  LANGUAGES,
  NOTIFICATION_TYPES,
  EVENT_TYPES,
  MEDIA_TYPES,
  UPLOAD_CONFIG,
  MAP_CONFIG,
  PERFORMANCE_THRESHOLDS,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  REGEX_PATTERNS,
  DATE_FORMATS,
  PAGINATION,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  Z_INDEX,
  FEATURES,
  SOCIAL_LINKS,
  APP_INFO
}
