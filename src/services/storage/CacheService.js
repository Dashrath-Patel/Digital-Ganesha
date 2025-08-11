/**
 * Cache service that combines multiple storage mechanisms
 * Provides intelligent caching with fallbacks and cache strategies
 */

import { LocalStorageService } from './LocalStorage.js'
import { IndexedDBService } from './IndexedDB.js'

class CacheServiceClass {
  constructor() {
    this.strategies = {
      CACHE_FIRST: 'cache-first',
      NETWORK_FIRST: 'network-first',
      CACHE_ONLY: 'cache-only',
      NETWORK_ONLY: 'network-only',
      STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
    }
    
    this.defaultTTL = 3600000 // 1 hour
    this.isInitialized = false
  }

  // Initialize cache service
  async initialize() {
    try {
      if (IndexedDBService.isSupported) {
        await IndexedDBService.initialize()
      }
      
      this.isInitialized = true
      console.log('Cache service initialized')
    } catch (error) {
      console.error('Failed to initialize cache service:', error)
      this.isInitialized = true // Continue with localStorage only
    }
  }

  // Get cache key with namespace
  getCacheKey(key, namespace = 'default') {
    return `${namespace}:${key}`
  }

  // Set cache with strategy
  async set(key, value, options = {}) {
    const {
      ttl = this.defaultTTL,
      namespace = 'default',
      storage = 'auto'
    } = options

    const cacheKey = this.getCacheKey(key, namespace)
    const cacheData = {
      value,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      namespace
    }

    try {
      // Determine storage mechanism
      if (storage === 'auto') {
        // Use IndexedDB for large objects, localStorage for small ones
        const dataSize = JSON.stringify(value).length
        
        if (dataSize > 50000 && IndexedDBService.isSupported) { // > 50KB
          await IndexedDBService.setCache(cacheKey, cacheData, ttl)
        } else {
          LocalStorageService.setCacheData(cacheKey, cacheData, ttl)
        }
      } else if (storage === 'indexeddb' && IndexedDBService.isSupported) {
        await IndexedDBService.setCache(cacheKey, cacheData, ttl)
      } else {
        LocalStorageService.setCacheData(cacheKey, cacheData, ttl)
      }

      return true
    } catch (error) {
      console.error('Failed to set cache:', error)
      
      // Fallback to localStorage
      try {
        LocalStorageService.setCacheData(cacheKey, cacheData, ttl)
        return true
      } catch (fallbackError) {
        console.error('Cache fallback failed:', fallbackError)
        return false
      }
    }
  }

  // Get cache value
  async get(key, options = {}) {
    const {
      namespace = 'default',
      storage = 'auto'
    } = options

    const cacheKey = this.getCacheKey(key, namespace)

    try {
      let cacheData = null

      // Try IndexedDB first if auto or explicitly requested
      if ((storage === 'auto' || storage === 'indexeddb') && IndexedDBService.isSupported) {
        cacheData = await IndexedDBService.getCache(cacheKey)
      }

      // Fallback to localStorage if not found
      if (!cacheData && (storage === 'auto' || storage === 'localstorage')) {
        cacheData = LocalStorageService.getCacheData(cacheKey)
      }

      return cacheData
    } catch (error) {
      console.error('Failed to get cache:', error)
      return null
    }
  }

  // Remove cache entry
  async remove(key, options = {}) {
    const {
      namespace = 'default'
    } = options

    const cacheKey = this.getCacheKey(key, namespace)

    try {
      // Remove from both storage mechanisms
      if (IndexedDBService.isSupported) {
        await IndexedDBService.delete('cache', cacheKey)
      }
      
      LocalStorageService.remove(`cache_${cacheKey}`)
      
      return true
    } catch (error) {
      console.error('Failed to remove cache:', error)
      return false
    }
  }

  // Cache with fetch strategy
  async fetchWithCache(url, options = {}) {
    const {
      strategy = this.strategies.CACHE_FIRST,
      ttl = this.defaultTTL,
      namespace = 'api',
      cacheKey = url
    } = options

    switch (strategy) {
      case this.strategies.CACHE_FIRST:
        return this.cacheFirstStrategy(url, cacheKey, options)
      
      case this.strategies.NETWORK_FIRST:
        return this.networkFirstStrategy(url, cacheKey, options)
      
      case this.strategies.CACHE_ONLY:
        return this.cacheOnlyStrategy(cacheKey, options)
      
      case this.strategies.NETWORK_ONLY:
        return this.networkOnlyStrategy(url, options)
      
      case this.strategies.STALE_WHILE_REVALIDATE:
        return this.staleWhileRevalidateStrategy(url, cacheKey, options)
      
      default:
        return this.cacheFirstStrategy(url, cacheKey, options)
    }
  }

  // Cache-first strategy
  async cacheFirstStrategy(url, cacheKey, options) {
    try {
      // Try cache first
      const cachedData = await this.get(cacheKey, options)
      if (cachedData) {
        return cachedData
      }

      // Fetch from network
      const response = await fetch(url, options.fetchOptions)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      // Cache the result
      await this.set(cacheKey, data, options)
      
      return data
    } catch (error) {
      console.error('Cache-first strategy failed:', error)
      throw error
    }
  }

  // Network-first strategy
  async networkFirstStrategy(url, cacheKey, options) {
    try {
      // Try network first
      const response = await fetch(url, options.fetchOptions)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      // Cache the result
      await this.set(cacheKey, data, options)
      
      return data
    } catch (error) {
      // Fallback to cache
      console.warn('Network failed, trying cache:', error)
      
      const cachedData = await this.get(cacheKey, options)
      if (cachedData) {
        return cachedData
      }
      
      throw error
    }
  }

  // Cache-only strategy
  async cacheOnlyStrategy(cacheKey, options) {
    const cachedData = await this.get(cacheKey, options)
    if (!cachedData) {
      throw new Error('No cached data available')
    }
    
    return cachedData
  }

  // Network-only strategy
  async networkOnlyStrategy(url, options) {
    const response = await fetch(url, options.fetchOptions)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return response.json()
  }

  // Stale-while-revalidate strategy
  async staleWhileRevalidateStrategy(url, cacheKey, options) {
    // Return cached data immediately if available
    const cachedData = await this.get(cacheKey, options)
    
    // Revalidate in background
    this.revalidateInBackground(url, cacheKey, options)
    
    if (cachedData) {
      return cachedData
    }
    
    // If no cache, wait for network
    return this.networkFirstStrategy(url, cacheKey, options)
  }

  // Background revalidation
  async revalidateInBackground(url, cacheKey, options) {
    try {
      const response = await fetch(url, options.fetchOptions)
      if (response.ok) {
        const data = await response.json()
        await this.set(cacheKey, data, options)
      }
    } catch (error) {
      console.warn('Background revalidation failed:', error)
    }
  }

  // Bulk operations
  async setMultiple(entries, options = {}) {
    const results = []
    
    for (const { key, value, ...entryOptions } of entries) {
      const result = await this.set(key, value, { ...options, ...entryOptions })
      results.push({ key, success: result })
    }
    
    return results
  }

  async getMultiple(keys, options = {}) {
    const results = {}
    
    for (const key of keys) {
      results[key] = await this.get(key, options)
    }
    
    return results
  }

  // Cache management
  async clear(namespace = null) {
    try {
      if (namespace) {
        // Clear specific namespace
        if (IndexedDBService.isSupported) {
          const allCache = await IndexedDBService.getAll('cache')
          const namespacedCache = allCache.filter(item => 
            item.key.startsWith(`${namespace}:`)
          )
          
          for (const item of namespacedCache) {
            await IndexedDBService.delete('cache', item.key)
          }
        }
        
        // Clear from localStorage
        const keys = LocalStorageService.getAllKeys()
        const namespacedKeys = keys.filter(key => 
          key.startsWith(`cache_${namespace}:`)
        )
        
        namespacedKeys.forEach(key => {
          LocalStorageService.remove(key)
        })
      } else {
        // Clear all cache
        if (IndexedDBService.isSupported) {
          await IndexedDBService.clear('cache')
        }
        
        const keys = LocalStorageService.getAllKeys()
        const cacheKeys = keys.filter(key => key.startsWith('cache_'))
        
        cacheKeys.forEach(key => {
          LocalStorageService.remove(key)
        })
      }
      
      return true
    } catch (error) {
      console.error('Failed to clear cache:', error)
      return false
    }
  }

  async cleanup() {
    let cleaned = 0
    
    try {
      // Cleanup IndexedDB
      if (IndexedDBService.isSupported) {
        cleaned += await IndexedDBService.clearExpiredCache()
      }
      
      // Cleanup localStorage
      cleaned += LocalStorageService.cleanup()
      
      return cleaned
    } catch (error) {
      console.error('Cache cleanup failed:', error)
      return 0
    }
  }

  // Cache statistics
  async getStats() {
    const stats = {
      localStorage: {
        count: 0,
        size: 0
      },
      indexedDB: {
        count: 0,
        size: 0
      },
      total: {
        count: 0,
        size: 0
      }
    }

    try {
      // localStorage stats
      const lsKeys = LocalStorageService.getAllKeys()
      const cacheKeys = lsKeys.filter(key => key.startsWith('cache_'))
      stats.localStorage.count = cacheKeys.length
      
      cacheKeys.forEach(key => {
        const value = LocalStorageService.get(key.substring(6)) // Remove 'cache_' prefix
        if (value) {
          stats.localStorage.size += JSON.stringify(value).length
        }
      })

      // IndexedDB stats
      if (IndexedDBService.isSupported) {
        const idbCache = await IndexedDBService.getAll('cache')
        stats.indexedDB.count = idbCache.length
        
        idbCache.forEach(item => {
          stats.indexedDB.size += JSON.stringify(item).length
        })
      }

      // Total stats
      stats.total.count = stats.localStorage.count + stats.indexedDB.count
      stats.total.size = stats.localStorage.size + stats.indexedDB.size

      return stats
    } catch (error) {
      console.error('Failed to get cache stats:', error)
      return stats
    }
  }

  // Preload cache
  async preload(urls, options = {}) {
    const {
      strategy = this.strategies.CACHE_FIRST,
      concurrency = 3
    } = options

    const results = []
    
    // Process URLs in batches
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency)
      
      const batchPromises = batch.map(async (url) => {
        try {
          const data = await this.fetchWithCache(url, {
            ...options,
            strategy,
            cacheKey: url
          })
          return { url, success: true, data }
        } catch (error) {
          return { url, success: false, error: error.message }
        }
      })
      
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }
    
    return results
  }

  // Cache warming
  async warmCache(entries) {
    const results = []
    
    for (const { key, url, ...options } of entries) {
      try {
        const data = await this.fetchWithCache(url, {
          ...options,
          cacheKey: key
        })
        results.push({ key, success: true })
      } catch (error) {
        results.push({ key, success: false, error: error.message })
      }
    }
    
    return results
  }
}

// Export singleton instance
export const CacheService = new CacheServiceClass()
export default CacheService
