/**
 * WebSocket service for real-time communication
 * Handles live chat, notifications, and real-time updates
 */

class SocketServiceClass {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.eventListeners = new Map()
    this.messageQueue = []
  }

  // Connect to WebSocket server
  connect(url, options = {}) {
    try {
      if (this.socket && this.isConnected) {
        console.warn('WebSocket already connected')
        return this.socket
      }

      const wsUrl = this.buildWebSocketUrl(url, options)
      this.socket = new WebSocket(wsUrl)
      
      this.setupEventHandlers()
      
      return this.socket
    } catch (error) {
      console.error('WebSocket connection error:', error)
      throw error
    }
  }

  // Build WebSocket URL with authentication and parameters
  buildWebSocketUrl(baseUrl, options) {
    const url = new URL(baseUrl)
    
    // Add authentication token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      url.searchParams.append('token', token)
    }
    
    // Add additional parameters
    if (options.room) {
      url.searchParams.append('room', options.room)
    }
    
    if (options.userId) {
      url.searchParams.append('userId', options.userId)
    }
    
    return url.toString()
  }

  // Setup WebSocket event handlers
  setupEventHandlers() {
    if (!this.socket) return

    this.socket.onopen = (event) => {
      console.log('WebSocket connected')
      this.isConnected = true
      this.reconnectAttempts = 0
      
      // Process queued messages
      this.processMessageQueue()
      
      // Trigger custom open event
      this.emit('connection:open', event)
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
        this.emit('error', { type: 'parse_error', error })
      }
    }

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason)
      this.isConnected = false
      
      this.emit('connection:close', event)
      
      // Attempt reconnection if not manually closed
      if (event.code !== 1000 && this.shouldReconnect()) {
        this.attemptReconnection()
      }
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.emit('error', { type: 'connection_error', error })
    }
  }

  // Handle incoming messages
  handleMessage(data) {
    const { type, payload, timestamp, id } = data
    
    // Emit event based on message type
    this.emit(type, payload, { timestamp, id })
    
    // Handle specific message types
    switch (type) {
      case 'chat:message':
        this.handleChatMessage(payload)
        break
      case 'notification':
        this.handleNotification(payload)
        break
      case 'live:update':
        this.handleLiveUpdate(payload)
        break
      case 'user:status':
        this.handleUserStatus(payload)
        break
      default:
        // Generic message handling
        break
    }
  }

  // Handle chat messages
  handleChatMessage(payload) {
    this.emit('chat:new-message', payload)
  }

  // Handle notifications
  handleNotification(payload) {
    this.emit('notification:received', payload)
  }

  // Handle live updates
  handleLiveUpdate(payload) {
    this.emit('live:data-update', payload)
  }

  // Handle user status changes
  handleUserStatus(payload) {
    this.emit('user:status-change', payload)
  }

  // Send message to server
  send(type, payload = {}) {
    const message = {
      type,
      payload,
      timestamp: Date.now(),
      id: this.generateMessageId()
    }

    if (this.isConnected) {
      this.socket.send(JSON.stringify(message))
    } else {
      // Queue message for later sending
      this.messageQueue.push(message)
    }
  }

  // Process queued messages
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.socket.send(JSON.stringify(message))
    }
  }

  // Add event listener
  on(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    
    this.eventListeners.get(eventType).push(callback)
    
    // Return unsubscribe function
    return () => this.off(eventType, callback)
  }

  // Remove event listener
  off(eventType, callback) {
    if (!this.eventListeners.has(eventType)) return
    
    const listeners = this.eventListeners.get(eventType)
    const index = listeners.indexOf(callback)
    
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  // Emit event to listeners
  emit(eventType, ...args) {
    if (!this.eventListeners.has(eventType)) return
    
    const listeners = this.eventListeners.get(eventType)
    listeners.forEach(callback => {
      try {
        callback(...args)
      } catch (error) {
        console.error('Error in event listener:', error)
      }
    })
  }

  // Join a room
  joinRoom(roomName) {
    this.send('room:join', { room: roomName })
  }

  // Leave a room
  leaveRoom(roomName) {
    this.send('room:leave', { room: roomName })
  }

  // Send chat message
  sendChatMessage(message, roomName = null) {
    this.send('chat:send', {
      message,
      room: roomName,
      timestamp: Date.now()
    })
  }

  // Send typing indicator
  sendTyping(isTyping, roomName = null) {
    this.send('chat:typing', {
      typing: isTyping,
      room: roomName
    })
  }

  // Request live data
  requestLiveData(dataType, params = {}) {
    this.send('live:request', {
      type: dataType,
      params
    })
  }

  // Update user status
  updateStatus(status) {
    this.send('user:status', { status })
  }

  // Check if should attempt reconnection
  shouldReconnect() {
    return this.reconnectAttempts < this.maxReconnectAttempts
  }

  // Attempt to reconnect
  attemptReconnection() {
    if (!this.shouldReconnect()) {
      console.error('Max reconnection attempts reached')
      this.emit('connection:failed')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect(this.socket.url.replace('ws', 'http').replace('wss', 'https'))
      }
    }, delay)
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Manual disconnect')
      this.socket = null
      this.isConnected = false
      this.reconnectAttempts = 0
    }
  }

  // Generate unique message ID
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      readyState: this.socket?.readyState,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    }
  }

  // Send heartbeat/ping
  sendHeartbeat() {
    if (this.isConnected) {
      this.send('heartbeat', { timestamp: Date.now() })
    }
  }

  // Start heartbeat interval
  startHeartbeat(interval = 30000) {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat()
    }, interval)
  }

  // Stop heartbeat interval
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Cleanup
  destroy() {
    this.stopHeartbeat()
    this.disconnect()
    this.eventListeners.clear()
    this.messageQueue = []
  }
}

// Export singleton instance
export const SocketService = new SocketServiceClass()
export default SocketService
