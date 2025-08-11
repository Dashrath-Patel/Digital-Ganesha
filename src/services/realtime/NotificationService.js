/**
 * Notification service for browser notifications, push notifications, and real-time alerts
 * Handles permission management, notification display, and service worker communication
 */

class NotificationServiceClass {
  constructor() {
    this.permission = Notification.permission
    this.isServiceWorkerRegistered = false
    this.pushSubscription = null
    this.notificationQueue = []
    this.maxQueueSize = 50
  }

  // Initialize notification service
  async initialize() {
    try {
      // Check browser support
      if (!this.isSupported()) {
        console.warn('Notifications not supported in this browser')
        return false
      }

      // Request permission if not already granted
      await this.requestPermission()

      // Register service worker if supported
      if ('serviceWorker' in navigator) {
        await this.registerServiceWorker()
      }

      return true
    } catch (error) {
      console.error('Failed to initialize notification service:', error)
      return false
    }
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window
  }

  // Check if push notifications are supported
  isPushSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported()) {
      throw new Error('Notifications not supported')
    }

    if (this.permission === 'granted') {
      return 'granted'
    }

    if (this.permission === 'denied') {
      throw new Error('Notifications are blocked. Please enable them in browser settings.')
    }

    try {
      this.permission = await Notification.requestPermission()
      return this.permission
    } catch (error) {
      // Fallback for older browsers
      return new Promise((resolve) => {
        Notification.requestPermission((permission) => {
          this.permission = permission
          resolve(permission)
        })
      })
    }
  }

  // Show browser notification
  async showNotification(title, options = {}) {
    try {
      if (this.permission !== 'granted') {
        await this.requestPermission()
      }

      if (this.permission !== 'granted') {
        console.warn('Notification permission not granted')
        return null
      }

      const defaultOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
        requireInteraction: false
      }

      const notificationOptions = { ...defaultOptions, ...options }

      // Use service worker notification if available
      if (this.isServiceWorkerRegistered) {
        const registration = await navigator.serviceWorker.ready
        return await registration.showNotification(title, notificationOptions)
      }

      // Fallback to browser notification
      const notification = new Notification(title, notificationOptions)
      
      // Setup event handlers
      this.setupNotificationHandlers(notification, options)
      
      return notification
    } catch (error) {
      console.error('Failed to show notification:', error)
      
      // Add to queue for retry
      this.addToQueue({ title, options })
      
      throw error
    }
  }

  // Setup notification event handlers
  setupNotificationHandlers(notification, options) {
    notification.onclick = (event) => {
      event.preventDefault()
      
      // Focus window
      if (window.focus) {
        window.focus()
      }
      
      // Handle custom click action
      if (options.onClick) {
        options.onClick(event)
      }
      
      // Navigate to URL if provided
      if (options.url) {
        window.open(options.url, '_blank')
      }
      
      notification.close()
    }

    notification.onclose = (event) => {
      if (options.onClose) {
        options.onClose(event)
      }
    }

    notification.onerror = (event) => {
      console.error('Notification error:', event)
      if (options.onError) {
        options.onError(event)
      }
    }

    // Auto-close after specified time
    if (options.autoClose && typeof options.autoClose === 'number') {
      setTimeout(() => {
        notification.close()
      }, options.autoClose)
    }
  }

  // Register service worker for push notifications
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      this.isServiceWorkerRegistered = true
      
      console.log('Service worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service worker registration failed:', error)
      throw error
    }
  }

  // Subscribe to push notifications
  async subscribeToPush(vapidKey) {
    try {
      if (!this.isPushSupported()) {
        throw new Error('Push notifications not supported')
      }

      const registration = await navigator.serviceWorker.ready
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
      })

      this.pushSubscription = subscription
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription)
      
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush() {
    try {
      if (!this.pushSubscription) {
        return true
      }

      const success = await this.pushSubscription.unsubscribe()
      
      if (success) {
        // Notify server of unsubscription
        await this.removeSubscriptionFromServer(this.pushSubscription)
        this.pushSubscription = null
      }
      
      return success
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      throw error
    }
  }

  // Send subscription to server
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save subscription on server')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
      throw error
    }
  }

  // Remove subscription from server
  async removeSubscriptionFromServer(subscription) {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      })

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to remove subscription from server:', error)
      throw error
    }
  }

  // Show different types of notifications
  async showChatNotification(message) {
    return this.showNotification(`New message from ${message.sender}`, {
      body: message.text,
      icon: message.senderAvatar || '/icons/chat.png',
      tag: 'chat-message',
      actions: [
        { action: 'reply', title: 'Reply' },
        { action: 'view', title: 'View Chat' }
      ]
    })
  }

  async showEventNotification(event) {
    return this.showNotification(`Event Starting: ${event.title}`, {
      body: `${event.description} - Starting in ${event.timeUntilStart}`,
      icon: '/icons/event.png',
      tag: 'event-reminder',
      actions: [
        { action: 'join', title: 'Join Event' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  }

  async showLiveStreamNotification(stream) {
    return this.showNotification(`Live Stream Started`, {
      body: `${stream.title} is now live`,
      icon: '/icons/live.png',
      tag: 'live-stream',
      actions: [
        { action: 'watch', title: 'Watch Now' },
        { action: 'later', title: 'Watch Later' }
      ]
    })
  }

  async showSystemNotification(message, type = 'info') {
    const icons = {
      info: '/icons/info.png',
      warning: '/icons/warning.png',
      error: '/icons/error.png',
      success: '/icons/success.png'
    }

    return this.showNotification('System Notification', {
      body: message,
      icon: icons[type] || icons.info,
      tag: `system-${type}`,
      requireInteraction: type === 'error'
    })
  }

  // Add notification to queue
  addToQueue(notification) {
    if (this.notificationQueue.length >= this.maxQueueSize) {
      this.notificationQueue.shift() // Remove oldest
    }
    
    this.notificationQueue.push({
      ...notification,
      timestamp: Date.now()
    })
  }

  // Process notification queue
  async processQueue() {
    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift()
      
      try {
        await this.showNotification(notification.title, notification.options)
        
        // Add delay between notifications
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Failed to process queued notification:', error)
        break
      }
    }
  }

  // Clear all notifications
  clearAllNotifications() {
    if (this.isServiceWorkerRegistered) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => notification.close())
        })
      })
    }
  }

  // Get notification settings
  getSettings() {
    return {
      permission: this.permission,
      pushSupported: this.isPushSupported(),
      serviceWorkerRegistered: this.isServiceWorkerRegistered,
      hasSubscription: !!this.pushSubscription,
      queueSize: this.notificationQueue.length
    }
  }

  // Utility function to convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }

  // Test notification
  async testNotification() {
    return this.showNotification('Test Notification', {
      body: 'This is a test notification from Digital Ganesha',
      icon: '/favicon.ico',
      autoClose: 5000
    })
  }
}

// Export singleton instance
export const NotificationService = new NotificationServiceClass()
export default NotificationService
