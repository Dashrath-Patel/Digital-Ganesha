/**
 * Utility helper functions for the Ganesh application
 * Common utility functions used across the application
 */

import { REGEX_PATTERNS, DATE_FORMATS, ERROR_MESSAGES } from './constants.js'

// Date and Time Utilities
export const dateUtils = {
  /**
   * Format date according to specified format
   * @param {Date|string|number} date - Date to format
   * @param {string} format - Format string
   * @returns {string} Formatted date string
   */
  format: (date, format = DATE_FORMATS.DISPLAY) => {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    if (format === DATE_FORMATS.RELATIVE) {
      return dateUtils.getRelativeTime(d)
    }

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    const formatMap = {
      'DD': day,
      'MM': month,
      'YYYY': year,
      'HH': hours,
      'mm': minutes,
      'ss': seconds
    }

    return format.replace(/DD|MM|YYYY|HH|mm|ss/g, match => formatMap[match])
  },

  /**
   * Get relative time string (e.g., "2 hours ago")
   * @param {Date} date - Date to compare
   * @returns {string} Relative time string
   */
  getRelativeTime: (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  },

  /**
   * Check if date is today
   * @param {Date} date - Date to check
   * @returns {boolean} True if date is today
   */
  isToday: (date) => {
    const today = new Date()
    const d = new Date(date)
    return d.toDateString() === today.toDateString()
  },

  /**
   * Check if date is within specified days from now
   * @param {Date} date - Date to check
   * @param {number} days - Number of days
   * @returns {boolean} True if date is within range
   */
  isWithinDays: (date, days) => {
    const now = new Date()
    const diffInDays = Math.abs(new Date(date) - now) / (1000 * 60 * 60 * 24)
    return diffInDays <= days
  },

  /**
   * Add days to a date
   * @param {Date} date - Base date
   * @param {number} days - Days to add
   * @returns {Date} New date
   */
  addDays: (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },

  /**
   * Get start of day
   * @param {Date} date - Date
   * @returns {Date} Start of day
   */
  startOfDay: (date) => {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  },

  /**
   * Get end of day
   * @param {Date} date - Date
   * @returns {Date} End of day
   */
  endOfDay: (date) => {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  }
}

// String Utilities
export const stringUtils = {
  /**
   * Capitalize first letter of string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize: (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  /**
   * Convert string to title case
   * @param {string} str - String to convert
   * @returns {string} Title case string
   */
  toTitleCase: (str) => {
    if (!str) return ''
    return str.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  },

  /**
   * Truncate string to specified length
   * @param {string} str - String to truncate
   * @param {number} length - Maximum length
   * @param {string} suffix - Suffix to add (default: '...')
   * @returns {string} Truncated string
   */
  truncate: (str, length, suffix = '...') => {
    if (!str || str.length <= length) return str
    return str.substring(0, length - suffix.length) + suffix
  },

  /**
   * Generate slug from string
   * @param {string} str - String to convert to slug
   * @returns {string} Slug string
   */
  slugify: (str) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  /**
   * Remove HTML tags from string
   * @param {string} str - String with HTML
   * @returns {string} Plain text string
   */
  stripHtml: (str) => {
    if (!str) return ''
    return str.replace(/<[^>]*>/g, '')
  },

  /**
   * Generate random string
   * @param {number} length - Length of string
   * @param {string} chars - Characters to use
   * @returns {string} Random string
   */
  generateRandomString: (length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

// Number Utilities
export const numberUtils = {
  /**
   * Format number with thousand separators
   * @param {number} num - Number to format
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted number
   */
  formatWithCommas: (num, locale = 'en-IN') => {
    if (typeof num !== 'number') return '0'
    return num.toLocaleString(locale)
  },

  /**
   * Format number as currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted currency
   */
  formatCurrency: (amount, currency = 'INR', locale = 'en-IN') => {
    if (typeof amount !== 'number') return '₹0'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  /**
   * Format file size
   * @param {number} bytes - Size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted file size
   */
  formatFileSize: (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  },

  /**
   * Generate random number within range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  randomBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /**
   * Clamp number within range
   * @param {number} num - Number to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped number
   */
  clamp: (num, min, max) => {
    return Math.min(Math.max(num, min), max)
  }
}

// Array Utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   * @param {Array} arr - Array with duplicates
   * @param {string} key - Key for object arrays
   * @returns {Array} Array without duplicates
   */
  removeDuplicates: (arr, key = null) => {
    if (!Array.isArray(arr)) return []
    
    if (key) {
      const seen = new Set()
      return arr.filter(item => {
        const value = item[key]
        if (seen.has(value)) return false
        seen.add(value)
        return true
      })
    }
    
    return [...new Set(arr)]
  },

  /**
   * Shuffle array
   * @param {Array} arr - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffle: (arr) => {
    if (!Array.isArray(arr)) return []
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  /**
   * Group array by key
   * @param {Array} arr - Array to group
   * @param {string|Function} key - Key or function to group by
   * @returns {Object} Grouped object
   */
  groupBy: (arr, key) => {
    if (!Array.isArray(arr)) return {}
    
    return arr.reduce((groups, item) => {
      const group = typeof key === 'function' ? key(item) : item[key]
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  },

  /**
   * Sort array by key
   * @param {Array} arr - Array to sort
   * @param {string} key - Key to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} Sorted array
   */
  sortBy: (arr, key, order = 'asc') => {
    if (!Array.isArray(arr)) return []
    
    return [...arr].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  },

  /**
   * Paginate array
   * @param {Array} arr - Array to paginate
   * @param {number} page - Page number (1-based)
   * @param {number} size - Page size
   * @returns {Object} Pagination result
   */
  paginate: (arr, page = 1, size = 10) => {
    if (!Array.isArray(arr)) return { data: [], total: 0, page: 1, pages: 0 }
    
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size
    const data = arr.slice(startIndex, endIndex)
    const total = arr.length
    const pages = Math.ceil(total / size)
    
    return { data, total, page, pages, size }
  }
}

// Validation Utilities
export const validationUtils = {
  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  isValidEmail: (email) => {
    return REGEX_PATTERNS.EMAIL.test(email)
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid
   */
  isValidPhone: (phone) => {
    return REGEX_PATTERNS.PHONE.test(phone)
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with score and feedback
   */
  validatePassword: (password) => {
    const result = {
      isValid: false,
      score: 0,
      feedback: []
    }

    if (!password) {
      result.feedback.push('Password is required')
      return result
    }

    if (password.length < 8) {
      result.feedback.push('Password must be at least 8 characters long')
    } else {
      result.score += 1
    }

    if (!/[a-z]/.test(password)) {
      result.feedback.push('Password must contain at least one lowercase letter')
    } else {
      result.score += 1
    }

    if (!/[A-Z]/.test(password)) {
      result.feedback.push('Password must contain at least one uppercase letter')
    } else {
      result.score += 1
    }

    if (!/\d/.test(password)) {
      result.feedback.push('Password must contain at least one number')
    } else {
      result.score += 1
    }

    if (!/[@$!%*?&]/.test(password)) {
      result.feedback.push('Password must contain at least one special character')
    } else {
      result.score += 1
    }

    result.isValid = result.score === 5
    return result
  },

  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid
   */
  isValidUrl: (url) => {
    return REGEX_PATTERNS.URL.test(url)
  },

  /**
   * Validate required field
   * @param {any} value - Value to validate
   * @returns {boolean} True if not empty
   */
  isRequired: (value) => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
  }
}

// Object Utilities
export const objectUtils = {
  /**
   * Deep clone object
   * @param {any} obj - Object to clone
   * @returns {any} Cloned object
   */
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item))
    if (typeof obj === 'object') {
      const cloned = {}
      Object.keys(obj).forEach(key => {
        cloned[key] = objectUtils.deepClone(obj[key])
      })
      return cloned
    }
    return obj
  },

  /**
   * Deep merge objects
   * @param {Object} target - Target object
   * @param {...Object} sources - Source objects
   * @returns {Object} Merged object
   */
  deepMerge: (target, ...sources) => {
    if (!sources.length) return target
    const source = sources.shift()

    if (objectUtils.isObject(target) && objectUtils.isObject(source)) {
      for (const key in source) {
        if (objectUtils.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          objectUtils.deepMerge(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }

    return objectUtils.deepMerge(target, ...sources)
  },

  /**
   * Check if value is object
   * @param {any} item - Item to check
   * @returns {boolean} True if object
   */
  isObject: (item) => {
    return item && typeof item === 'object' && !Array.isArray(item)
  },

  /**
   * Get nested property value
   * @param {Object} obj - Object to search
   * @param {string} path - Property path (e.g., 'user.profile.name')
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Property value
   */
  getNestedValue: (obj, path, defaultValue = null) => {
    const keys = path.split('.')
    let current = obj

    for (let key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue
      }
      current = current[key]
    }

    return current
  },

  /**
   * Set nested property value
   * @param {Object} obj - Object to modify
   * @param {string} path - Property path
   * @param {any} value - Value to set
   */
  setNestedValue: (obj, path, value) => {
    const keys = path.split('.')
    let current = obj

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in current) || !objectUtils.isObject(current[key])) {
        current[key] = {}
      }
      current = current[key]
    }

    current[keys[keys.length - 1]] = value
  }
}

// URL Utilities
export const urlUtils = {
  /**
   * Get query parameters from URL
   * @param {string} url - URL to parse (optional, uses current URL)
   * @returns {Object} Query parameters object
   */
  getQueryParams: (url = window.location.search) => {
    const params = new URLSearchParams(url)
    const result = {}
    for (let [key, value] of params.entries()) {
      result[key] = value
    }
    return result
  },

  /**
   * Build URL with query parameters
   * @param {string} baseUrl - Base URL
   * @param {Object} params - Parameters object
   * @returns {string} URL with parameters
   */
  buildUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl, window.location.origin)
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.set(key, params[key])
      }
    })
    return url.toString()
  },

  /**
   * Remove query parameters from URL
   * @param {string} url - URL to clean
   * @param {Array} paramsToRemove - Parameters to remove
   * @returns {string} Clean URL
   */
  removeQueryParams: (url, paramsToRemove = []) => {
    const urlObj = new URL(url, window.location.origin)
    paramsToRemove.forEach(param => {
      urlObj.searchParams.delete(param)
    })
    return urlObj.toString()
  }
}

// Error Handling Utilities
export const errorUtils = {
  /**
   * Create standardized error object
   * @param {string} code - Error code
   * @param {string} message - Error message
   * @param {any} details - Additional details
   * @returns {Object} Error object
   */
  createError: (code, message = ERROR_MESSAGES.GENERIC_ERROR, details = null) => {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  },

  /**
   * Parse API error response
   * @param {Object} error - Error object from API
   * @returns {Object} Parsed error
   */
  parseApiError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      return {
        code: data.code || `HTTP_${status}`,
        message: data.message || ERROR_MESSAGES.SERVER_ERROR,
        details: data.details || null,
        status
      }
    } else if (error.request) {
      // Network error
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR,
        details: error.message
      }
    } else {
      // Other error
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || ERROR_MESSAGES.GENERIC_ERROR,
        details: null
      }
    }
  }
}

// Export all utilities
export default {
  dateUtils,
  stringUtils,
  numberUtils,
  arrayUtils,
  validationUtils,
  objectUtils,
  urlUtils,
  errorUtils
}
