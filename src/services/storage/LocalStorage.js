/**
 * LocalStorage service with enhanced functionality
 * Provides type-safe storage, encryption, expiration, and data validation
 */

class LocalStorageServiceClass {
  constructor() {
    this.prefix = 'digital_ganesha_'
    this.isAvailable = this.checkAvailability()
    this.encryptionKey = null
  }

  // Check if localStorage is available
  checkAvailability() {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  // Generate prefixed key
  getKey(key) {
    return `${this.prefix}${key}`
  }

  // Set item with optional expiration and encryption
  set(key, value, options = {}) {
    if (!this.isAvailable) {
      console.warn('localStorage not available')
      return false
    }

    try {
      const data = {
        value,
        timestamp: Date.now(),
        encrypted: false
      }

      // Add expiration if specified
      if (options.expiresIn) {
        data.expiresAt = Date.now() + options.expiresIn
      }

      // Encrypt if encryption key is set and requested
      if (this.encryptionKey && options.encrypt) {
        data.value = this.encrypt(JSON.stringify(value))
        data.encrypted = true
      }

      const serialized = JSON.stringify(data)
      localStorage.setItem(this.getKey(key), serialized)
      
      return true
    } catch (error) {
      console.error('Failed to set localStorage item:', error)
      return false
    }
  }

  // Get item with automatic expiration check and decryption
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue
    }

    try {
      const item = localStorage.getItem(this.getKey(key))
      
      if (!item) {
        return defaultValue
      }

      const data = JSON.parse(item)

      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.remove(key)
        return defaultValue
      }

      // Decrypt if needed
      if (data.encrypted && this.encryptionKey) {
        try {
          const decrypted = this.decrypt(data.value)
          return JSON.parse(decrypted)
        } catch (error) {
          console.error('Failed to decrypt localStorage item:', error)
          this.remove(key) // Remove corrupted item
          return defaultValue
        }
      }

      return data.value
    } catch (error) {
      console.error('Failed to get localStorage item:', error)
      return defaultValue
    }
  }

  // Remove item
  remove(key) {
    if (!this.isAvailable) {
      return false
    }

    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error('Failed to remove localStorage item:', error)
      return false
    }
  }

  // Check if key exists and is not expired
  has(key) {
    if (!this.isAvailable) {
      return false
    }

    try {
      const item = localStorage.getItem(this.getKey(key))
      
      if (!item) {
        return false
      }

      const data = JSON.parse(item)

      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.remove(key)
        return false
      }

      return true
    } catch {
      return false
    }
  }

  // Get all keys with prefix
  getAllKeys() {
    if (!this.isAvailable) {
      return []
    }

    const keys = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length))
      }
    }

    return keys
  }

  // Get all items
  getAll() {
    const items = {}
    const keys = this.getAllKeys()

    keys.forEach(key => {
      items[key] = this.get(key)
    })

    return items
  }

  // Clear all items with prefix
  clear() {
    if (!this.isAvailable) {
      return false
    }

    try {
      const keys = this.getAllKeys()
      keys.forEach(key => this.remove(key))
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  // Get storage usage
  getStorageInfo() {
    if (!this.isAvailable) {
      return { used: 0, available: 0, total: 0 }
    }

    try {
      const testKey = '__storage_test__'
      let total = 0
      let used = 0

      // Calculate current usage
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Estimate total available space
      try {
        const maxSize = 10 * 1024 * 1024 // 10MB estimate
        let testData = 'x'
        
        while (testData.length < maxSize) {
          localStorage.setItem(testKey, testData)
          testData += testData
        }
      } catch {
        // Storage full
      } finally {
        localStorage.removeItem(testKey)
      }

      // Rough estimates (browser-dependent)
      total = 5 * 1024 * 1024 // 5MB estimate
      const available = total - used

      return {
        used: Math.round(used / 1024), // KB
        available: Math.round(available / 1024), // KB
        total: Math.round(total / 1024), // KB
        percentage: Math.round((used / total) * 100)
      }
    } catch (error) {
      console.error('Failed to get storage info:', error)
      return { used: 0, available: 0, total: 0, percentage: 0 }
    }
  }

  // Clean up expired items
  cleanup() {
    if (!this.isAvailable) {
      return 0
    }

    let cleaned = 0
    const keys = this.getAllKeys()

    keys.forEach(key => {
      try {
        const item = localStorage.getItem(this.getKey(key))
        if (item) {
          const data = JSON.parse(item)
          
          if (data.expiresAt && Date.now() > data.expiresAt) {
            this.remove(key)
            cleaned++
          }
        }
      } catch {
        // Remove corrupted items
        this.remove(key)
        cleaned++
      }
    })

    return cleaned
  }

  // Set encryption key for secure storage
  setEncryptionKey(key) {
    this.encryptionKey = key
  }

  // Simple encryption (use proper encryption library in production)
  encrypt(text) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set')
    }

    // Simple XOR encryption (replace with proper encryption)
    let result = ''
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
      )
    }
    
    return btoa(result)
  }

  // Simple decryption
  decrypt(encryptedText) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set')
    }

    try {
      const text = atob(encryptedText)
      let result = ''
      
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
          text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        )
      }
      
      return result
    } catch (error) {
      throw new Error('Failed to decrypt data')
    }
  }

  // Specialized methods for common data types
  
  // Store user preferences
  setUserPreference(key, value) {
    return this.set(`user_pref_${key}`, value, { encrypt: true })
  }

  getUserPreference(key, defaultValue = null) {
    return this.get(`user_pref_${key}`, defaultValue)
  }

  // Store session data
  setSessionData(key, value, expiresIn = 24 * 60 * 60 * 1000) { // 24 hours
    return this.set(`session_${key}`, value, { expiresIn })
  }

  getSessionData(key, defaultValue = null) {
    return this.get(`session_${key}`, defaultValue)
  }

  // Store cache data
  setCacheData(key, value, expiresIn = 60 * 60 * 1000) { // 1 hour
    return this.set(`cache_${key}`, value, { expiresIn })
  }

  getCacheData(key, defaultValue = null) {
    return this.get(`cache_${key}`, defaultValue)
  }

  // Store form data for recovery
  setFormData(formId, data) {
    return this.set(`form_${formId}`, data, { expiresIn: 7 * 24 * 60 * 60 * 1000 }) // 7 days
  }

  getFormData(formId, defaultValue = {}) {
    return this.get(`form_${formId}`, defaultValue)
  }

  clearFormData(formId) {
    return this.remove(`form_${formId}`)
  }

  // Store app settings
  setAppSetting(key, value) {
    return this.set(`app_setting_${key}`, value)
  }

  getAppSetting(key, defaultValue = null) {
    return this.get(`app_setting_${key}`, defaultValue)
  }

  // Migration helper for updating data structure
  migrate(migrations) {
    if (!Array.isArray(migrations)) {
      return false
    }

    const currentVersion = this.get('__data_version__', 0)
    
    migrations.forEach((migration, index) => {
      const version = index + 1
      
      if (version > currentVersion) {
        try {
          migration()
          console.log(`Applied migration version ${version}`)
        } catch (error) {
          console.error(`Failed to apply migration version ${version}:`, error)
        }
      }
    })

    this.set('__data_version__', migrations.length)
    return true
  }
}

// Export singleton instance
export const LocalStorageService = new LocalStorageServiceClass()
export default LocalStorageService
