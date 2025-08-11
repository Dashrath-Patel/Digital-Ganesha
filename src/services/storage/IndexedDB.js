/**
 * IndexedDB service for client-side database operations
 * Provides structured data storage, transactions, and offline capabilities
 */

class IndexedDBServiceClass {
  constructor() {
    this.dbName = 'DigitalGaneshaDB'
    this.version = 1
    this.db = null
    this.isSupported = this.checkSupport()
    this.stores = {
      mandals: 'mandals',
      events: 'events',
      media: 'media',
      users: 'users',
      cache: 'cache',
      settings: 'settings',
      offline_queue: 'offline_queue'
    }
  }

  // Check IndexedDB support
  checkSupport() {
    return 'indexedDB' in window
  }

  // Initialize database
  async initialize() {
    if (!this.isSupported) {
      throw new Error('IndexedDB not supported')
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        console.log('IndexedDB initialized successfully')
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        this.createStores(db)
      }
    })
  }

  // Create object stores
  createStores(db) {
    // Mandals store
    if (!db.objectStoreNames.contains(this.stores.mandals)) {
      const mandalStore = db.createObjectStore(this.stores.mandals, { 
        keyPath: 'id' 
      })
      mandalStore.createIndex('location', ['latitude', 'longitude'])
      mandalStore.createIndex('category', 'category')
      mandalStore.createIndex('lastUpdated', 'lastUpdated')
    }

    // Events store
    if (!db.objectStoreNames.contains(this.stores.events)) {
      const eventStore = db.createObjectStore(this.stores.events, { 
        keyPath: 'id' 
      })
      eventStore.createIndex('startDate', 'startDate')
      eventStore.createIndex('mandalId', 'mandalId')
      eventStore.createIndex('category', 'category')
    }

    // Media store
    if (!db.objectStoreNames.contains(this.stores.media)) {
      const mediaStore = db.createObjectStore(this.stores.media, { 
        keyPath: 'id' 
      })
      mediaStore.createIndex('type', 'type')
      mediaStore.createIndex('mandalId', 'mandalId')
      mediaStore.createIndex('uploadDate', 'uploadDate')
    }

    // Users store
    if (!db.objectStoreNames.contains(this.stores.users)) {
      const userStore = db.createObjectStore(this.stores.users, { 
        keyPath: 'id' 
      })
      userStore.createIndex('email', 'email', { unique: true })
      userStore.createIndex('lastActive', 'lastActive')
    }

    // Cache store
    if (!db.objectStoreNames.contains(this.stores.cache)) {
      const cacheStore = db.createObjectStore(this.stores.cache, { 
        keyPath: 'key' 
      })
      cacheStore.createIndex('expiresAt', 'expiresAt')
      cacheStore.createIndex('category', 'category')
    }

    // Settings store
    if (!db.objectStoreNames.contains(this.stores.settings)) {
      db.createObjectStore(this.stores.settings, { 
        keyPath: 'key' 
      })
    }

    // Offline queue store
    if (!db.objectStoreNames.contains(this.stores.offline_queue)) {
      const queueStore = db.createObjectStore(this.stores.offline_queue, { 
        keyPath: 'id',
        autoIncrement: true 
      })
      queueStore.createIndex('timestamp', 'timestamp')
      queueStore.createIndex('type', 'type')
    }
  }

  // Generic CRUD operations

  // Add or update record
  async put(storeName, data) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      const request = store.put({
        ...data,
        lastUpdated: Date.now()
      })

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Get record by key
  async get(storeName, key) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Get all records
  async getAll(storeName, limit = null) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = limit ? store.getAll(null, limit) : store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Delete record
  async delete(storeName, key) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }

  // Count records
  async count(storeName) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Clear store
  async clear(storeName) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }

  // Query with index
  async queryByIndex(storeName, indexName, value, limit = null) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      
      const request = limit ? 
        index.getAll(value, limit) : 
        index.getAll(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Range query
  async queryRange(storeName, indexName, lowerBound, upperBound, limit = null) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      
      const range = IDBKeyRange.bound(lowerBound, upperBound)
      const request = index.getAll(range, limit)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Specialized methods for each store

  // Mandal operations
  async saveMandal(mandal) {
    return this.put(this.stores.mandals, mandal)
  }

  async getMandal(id) {
    return this.get(this.stores.mandals, id)
  }

  async getAllMandals() {
    return this.getAll(this.stores.mandals)
  }

  async getMandalsByCategory(category) {
    return this.queryByIndex(this.stores.mandals, 'category', category)
  }

  async getNearbyMandals(latitude, longitude, radius = 0.1) {
    // Simple proximity search (improve with proper geospatial indexing)
    const allMandals = await this.getAllMandals()
    return allMandals.filter(mandal => {
      const distance = Math.sqrt(
        Math.pow(mandal.latitude - latitude, 2) + 
        Math.pow(mandal.longitude - longitude, 2)
      )
      return distance <= radius
    })
  }

  // Event operations
  async saveEvent(event) {
    return this.put(this.stores.events, event)
  }

  async getEvent(id) {
    return this.get(this.stores.events, id)
  }

  async getEventsByMandal(mandalId) {
    return this.queryByIndex(this.stores.events, 'mandalId', mandalId)
  }

  async getUpcomingEvents() {
    const now = Date.now()
    return this.queryRange(this.stores.events, 'startDate', now, now + (30 * 24 * 60 * 60 * 1000)) // Next 30 days
  }

  // Media operations
  async saveMedia(media) {
    return this.put(this.stores.media, media)
  }

  async getMediaByMandal(mandalId) {
    return this.queryByIndex(this.stores.media, 'mandalId', mandalId)
  }

  async getMediaByType(type) {
    return this.queryByIndex(this.stores.media, 'type', type)
  }

  // Cache operations
  async setCache(key, value, expiresIn = 3600000) { // 1 hour default
    const cacheData = {
      key,
      value,
      expiresAt: Date.now() + expiresIn,
      category: 'general'
    }
    
    return this.put(this.stores.cache, cacheData)
  }

  async getCache(key) {
    const cacheData = await this.get(this.stores.cache, key)
    
    if (!cacheData) {
      return null
    }

    // Check expiration
    if (cacheData.expiresAt < Date.now()) {
      await this.delete(this.stores.cache, key)
      return null
    }

    return cacheData.value
  }

  async clearExpiredCache() {
    const now = Date.now()
    const allCache = await this.getAll(this.stores.cache)
    
    const expired = allCache.filter(item => item.expiresAt < now)
    
    for (const item of expired) {
      await this.delete(this.stores.cache, item.key)
    }
    
    return expired.length
  }

  // Settings operations
  async setSetting(key, value) {
    return this.put(this.stores.settings, { key, value })
  }

  async getSetting(key, defaultValue = null) {
    const setting = await this.get(this.stores.settings, key)
    return setting ? setting.value : defaultValue
  }

  // Offline queue operations
  async addToOfflineQueue(action) {
    const queueItem = {
      ...action,
      timestamp: Date.now(),
      retries: 0
    }
    
    return this.put(this.stores.offline_queue, queueItem)
  }

  async getOfflineQueue() {
    return this.getAll(this.stores.offline_queue)
  }

  async removeFromOfflineQueue(id) {
    return this.delete(this.stores.offline_queue, id)
  }

  async clearOfflineQueue() {
    return this.clear(this.stores.offline_queue)
  }

  // Batch operations
  async batchPut(storeName, records) {
    if (!this.db) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      let completed = 0
      const total = records.length
      const results = []

      if (total === 0) {
        resolve([])
        return
      }

      records.forEach((record, index) => {
        const request = store.put({
          ...record,
          lastUpdated: Date.now()
        })

        request.onsuccess = () => {
          results[index] = request.result
          completed++
          
          if (completed === total) {
            resolve(results)
          }
        }

        request.onerror = () => {
          reject(request.error)
        }
      })
    })
  }

  // Sync operations
  async syncData(storeName, serverData, keyField = 'id') {
    const localData = await this.getAll(storeName)
    const localMap = new Map(localData.map(item => [item[keyField], item]))
    
    const toUpdate = []
    const toAdd = []
    
    serverData.forEach(serverItem => {
      const localItem = localMap.get(serverItem[keyField])
      
      if (!localItem || serverItem.lastUpdated > localItem.lastUpdated) {
        if (localItem) {
          toUpdate.push(serverItem)
        } else {
          toAdd.push(serverItem)
        }
      }
    })
    
    if (toUpdate.length > 0) {
      await this.batchPut(storeName, toUpdate)
    }
    
    if (toAdd.length > 0) {
      await this.batchPut(storeName, toAdd)
    }
    
    return {
      updated: toUpdate.length,
      added: toAdd.length
    }
  }

  // Database management
  async getStorageUsage() {
    if (!this.isSupported) {
      return { usage: 0, quota: 0 }
    }

    try {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        usageInMB: Math.round((estimate.usage || 0) / (1024 * 1024) * 100) / 100,
        quotaInMB: Math.round((estimate.quota || 0) / (1024 * 1024) * 100) / 100
      }
    } catch (error) {
      console.error('Failed to get storage usage:', error)
      return { usage: 0, quota: 0 }
    }
  }

  async exportData() {
    const data = {}
    
    for (const storeName of Object.values(this.stores)) {
      data[storeName] = await this.getAll(storeName)
    }
    
    return data
  }

  async importData(data) {
    for (const [storeName, records] of Object.entries(data)) {
      if (Object.values(this.stores).includes(storeName)) {
        await this.clear(storeName)
        await this.batchPut(storeName, records)
      }
    }
  }

  // Cleanup and maintenance
  async cleanup() {
    let cleaned = 0
    
    // Clear expired cache
    cleaned += await this.clearExpiredCache()
    
    // Remove old offline queue items (older than 7 days)
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    const oldQueueItems = await this.queryRange(
      this.stores.offline_queue, 
      'timestamp', 
      0, 
      weekAgo
    )
    
    for (const item of oldQueueItems) {
      await this.removeFromOfflineQueue(item.id)
      cleaned++
    }
    
    return cleaned
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// Export singleton instance
export const IndexedDBService = new IndexedDBServiceClass()
export default IndexedDBService
