/**
 * Service Worker for Progressive Web App functionality
 * Handles caching, offline support, and background sync
 */

const CACHE_NAME = 'ganesh-app-v1'
const STATIC_CACHE = 'ganesh-static-v1'
const DYNAMIC_CACHE = 'ganesh-dynamic-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  // Add other critical static files
]

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  new RegExp('/api/mandals'),
  new RegExp('/api/events'),
  new RegExp('/api/media')
]

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
}

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-http requests
  if (!request.url.startsWith('http')) return

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML pages - network first
    event.respondWith(handleDocumentRequest(request))
  } else if (isStaticAsset(request)) {
    // Static assets - cache first
    event.respondWith(handleStaticAssetRequest(request))
  } else if (isApiRequest(request)) {
    // API requests - custom strategy based on endpoint
    event.respondWith(handleApiRequest(request))
  } else {
    // Other requests - network first with cache fallback
    event.respondWith(handleGenericRequest(request))
  }
})

// Handle document requests (HTML pages)
async function handleDocumentRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful response
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page if available
    const offlinePage = await caches.match('/offline.html')
    if (offlinePage) {
      return offlinePage
    }
    
    // Return basic offline response
    return new Response(
      '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

// Handle static asset requests
async function handleStaticAssetRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request)
    
    // Cache successful response
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Failed to fetch static asset:', request.url, error)
    throw error
  }
}

// Handle API requests
async function handleApiRequest(request) {
  const url = new URL(request.url)
  
  // Determine cache strategy based on endpoint
  let strategy = CACHE_STRATEGIES.NETWORK_FIRST
  
  if (request.method === 'GET') {
    if (url.pathname.includes('/mandals') || url.pathname.includes('/events')) {
      strategy = CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
    }
  }
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return handleCacheFirst(request)
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return handleNetworkFirst(request)
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return handleStaleWhileRevalidate(request)
    
    default:
      return handleNetworkFirst(request)
  }
}

// Handle generic requests
async function handleGenericRequest(request) {
  return handleNetworkFirst(request)
}

// Cache first strategy
async function handleCacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Network first strategy
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Stale while revalidate strategy
async function handleStaleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request)
  
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE)
          .then((cache) => cache.put(request, networkResponse.clone()))
      }
      return networkResponse
    })
    .catch((error) => {
      console.error('Network request failed:', error)
      return null
    })
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Otherwise wait for network response
  return networkPromise
}

// Helper function to check if request is for static asset
function isStaticAsset(request) {
  const url = new URL(request.url)
  const extension = url.pathname.split('.').pop()
  const staticExtensions = ['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf']
  return staticExtensions.includes(extension)
}

// Helper function to check if request is for API
function isApiRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/')
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

// Handle background sync
async function handleBackgroundSync() {
  try {
    console.log('Service Worker: Performing background sync')
    
    // Get pending sync data from IndexedDB
    const pendingData = await getPendingSyncData()
    
    if (pendingData.length > 0) {
      console.log('Service Worker: Processing', pendingData.length, 'pending sync items')
      
      for (const item of pendingData) {
        try {
          await processSyncItem(item)
          await removeSyncItem(item.id)
        } catch (error) {
          console.error('Service Worker: Failed to sync item', item.id, error)
        }
      }
    }
    
    // Notify clients about sync completion
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now()
      })
    })
    
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Process individual sync item
async function processSyncItem(item) {
  const { type, data, url, method, headers } = item
  
  const response = await fetch(url, {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status} ${response.statusText}`)
  }
  
  return response
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  let notificationData = {
    title: 'Ganesh Community',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default'
  }
  
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = { ...notificationData, ...data }
    } catch (error) {
      console.error('Service Worker: Failed to parse push data', error)
      notificationData.body = event.data.text()
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction || false,
      actions: notificationData.actions || [],
      data: notificationData.data || {}
    })
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.notification.tag)
  
  event.notification.close()
  
  const notificationData = event.notification.data || {}
  const urlToOpen = notificationData.url || '/'
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Check if app is already open
        for (const client of clients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen)
        }
      })
  )
})

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)
  
  const { type, data } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'CACHE_URLS':
      event.waitUntil(cacheUrls(data.urls))
      break
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(data.cacheName))
      break
      
    case 'GET_CACHE_STATUS':
      event.waitUntil(getCacheStatus().then(status => {
        event.ports[0].postMessage(status)
      }))
      break
  }
})

// Cache URLs on demand
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE)
  return cache.addAll(urls)
}

// Clear specific cache
async function clearCache(cacheName) {
  return caches.delete(cacheName || DYNAMIC_CACHE)
}

// Get cache status
async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = keys.length
  }
  
  return status
}

// IndexedDB helper functions for background sync
async function getPendingSyncData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GaneshSyncDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['syncQueue'], 'readonly')
      const store = transaction.objectStore('syncQueue')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }
    
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

async function removeSyncItem(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('GaneshSyncDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}
