/**
 * Custom hook for WebSocket connections
 * Provides easy WebSocket integration with React components
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { SocketService } from '../services/realtime/SocketService.js'

export const useWebSocket = (url, options = {}) => {
  const {
    autoConnect = true,
    reconnectOnClose = true,
    heartbeatInterval = 30000,
    maxReconnectAttempts = 5,
    onOpen,
    onClose,
    onError,
    onMessage
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState('disconnected')
  const [lastMessage, setLastMessage] = useState(null)
  const [connectionError, setConnectionError] = useState(null)
  
  const socketRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef(null)
  const heartbeatIntervalRef = useRef(null)

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current && isConnected) {
      console.warn('WebSocket already connected')
      return
    }

    try {
      setConnectionState('connecting')
      setConnectionError(null)
      
      socketRef.current = SocketService.connect(url, options)
      
      // Setup event listeners
      const unsubscribeOpen = SocketService.on('connection:open', (event) => {
        setIsConnected(true)
        setConnectionState('connected')
        reconnectAttemptsRef.current = 0
        
        // Start heartbeat
        if (heartbeatInterval > 0) {
          startHeartbeat()
        }
        
        if (onOpen) onOpen(event)
      })

      const unsubscribeClose = SocketService.on('connection:close', (event) => {
        setIsConnected(false)
        setConnectionState('disconnected')
        stopHeartbeat()
        
        if (onClose) onClose(event)
        
        // Attempt reconnection
        if (reconnectOnClose && shouldReconnect()) {
          attemptReconnect()
        }
      })

      const unsubscribeError = SocketService.on('error', (error) => {
        setConnectionError(error)
        setConnectionState('error')
        
        if (onError) onError(error)
      })

      // Generic message handler
      const unsubscribeMessage = SocketService.on('*', (type, payload, meta) => {
        const message = { type, payload, meta, timestamp: Date.now() }
        setLastMessage(message)
        
        if (onMessage) onMessage(message)
      })

      // Store unsubscribe functions
      socketRef.current.unsubscribeFunctions = [
        unsubscribeOpen,
        unsubscribeClose,
        unsubscribeError,
        unsubscribeMessage
      ]

    } catch (error) {
      setConnectionError(error)
      setConnectionState('error')
      console.error('WebSocket connection failed:', error)
    }
  }, [url, options, isConnected, onOpen, onClose, onError, onMessage])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Cleanup event listeners
      if (socketRef.current.unsubscribeFunctions) {
        socketRef.current.unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
      }
      
      SocketService.disconnect()
      socketRef.current = null
    }
    
    stopHeartbeat()
    clearReconnectTimeout()
    
    setIsConnected(false)
    setConnectionState('disconnected')
  }, [])

  // Send message
  const sendMessage = useCallback((type, payload = {}) => {
    if (!isConnected) {
      console.warn('WebSocket not connected. Message will be queued.')
    }
    
    SocketService.send(type, payload)
  }, [isConnected])

  // Join room
  const joinRoom = useCallback((roomName) => {
    SocketService.joinRoom(roomName)
  }, [])

  // Leave room
  const leaveRoom = useCallback((roomName) => {
    SocketService.leaveRoom(roomName)
  }, [])

  // Send chat message
  const sendChatMessage = useCallback((message, roomName = null) => {
    SocketService.sendChatMessage(message, roomName)
  }, [])

  // Send typing indicator
  const sendTyping = useCallback((isTyping, roomName = null) => {
    SocketService.sendTyping(isTyping, roomName)
  }, [])

  // Check if should reconnect
  const shouldReconnect = useCallback(() => {
    return reconnectAttemptsRef.current < maxReconnectAttempts
  }, [maxReconnectAttempts])

  // Attempt reconnection
  const attemptReconnect = useCallback(() => {
    if (!shouldReconnect()) {
      console.error('Max reconnection attempts reached')
      setConnectionState('failed')
      return
    }

    reconnectAttemptsRef.current++
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
    
    setConnectionState('reconnecting')
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`)
      connect()
    }, delay)
  }, [connect, shouldReconnect, maxReconnectAttempts])

  // Clear reconnect timeout
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (isConnected) {
        SocketService.sendHeartbeat()
      }
    }, heartbeatInterval)
  }, [isConnected, heartbeatInterval])

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

  // Get connection status
  const getStatus = useCallback(() => {
    return {
      isConnected,
      connectionState,
      reconnectAttempts: reconnectAttemptsRef.current,
      maxReconnectAttempts,
      error: connectionError
    }
  }, [isConnected, connectionState, maxReconnectAttempts, connectionError])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearReconnectTimeout()
      stopHeartbeat()
    }
  }, [clearReconnectTimeout, stopHeartbeat])

  // Subscribe to specific event types
  const useSocketEvent = useCallback((eventType, callback) => {
    useEffect(() => {
      const unsubscribe = SocketService.on(eventType, callback)
      return unsubscribe
    }, [eventType, callback])
  }, [])

  return {
    // Connection state
    isConnected,
    connectionState,
    connectionError,
    lastMessage,
    
    // Connection methods
    connect,
    disconnect,
    
    // Messaging methods
    sendMessage,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    sendTyping,
    
    // Utility methods
    getStatus,
    useSocketEvent,
    
    // Raw socket reference (use with caution)
    socket: socketRef.current
  }
}

// Hook for specific chat functionality
export const useChatSocket = (roomName, options = {}) => {
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  
  const {
    isConnected,
    connectionState,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    sendTyping,
    useSocketEvent
  } = useWebSocket(options.url, options)

  // Join room on connection
  useEffect(() => {
    if (isConnected && roomName) {
      joinRoom(roomName)
    }
  }, [isConnected, roomName, joinRoom])

  // Leave room on unmount
  useEffect(() => {
    return () => {
      if (roomName) {
        leaveRoom(roomName)
      }
    }
  }, [roomName, leaveRoom])

  // Handle chat messages
  useSocketEvent('chat:new-message', useCallback((message) => {
    setMessages(prev => [...prev, message])
  }, []))

  // Handle typing indicators
  useSocketEvent('chat:typing', useCallback((data) => {
    if (data.typing) {
      setTypingUsers(prev => [...prev.filter(u => u !== data.user), data.user])
    } else {
      setTypingUsers(prev => prev.filter(u => u !== data.user))
    }
  }, []))

  // Handle user status updates
  useSocketEvent('user:status-change', useCallback((data) => {
    if (data.status === 'online') {
      setOnlineUsers(prev => [...prev.filter(u => u.id !== data.user.id), data.user])
    } else {
      setOnlineUsers(prev => prev.filter(u => u.id !== data.user.id))
    }
  }, []))

  // Send chat message
  const sendChatMessageToRoom = useCallback((message) => {
    sendChatMessage(message, roomName)
  }, [sendChatMessage, roomName])

  // Send typing indicator
  const sendTypingToRoom = useCallback((isTyping) => {
    sendTyping(isTyping, roomName)
  }, [sendTyping, roomName])

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    // Connection state
    isConnected,
    connectionState,
    
    // Chat data
    messages,
    typingUsers,
    onlineUsers,
    
    // Chat methods
    sendMessage: sendChatMessageToRoom,
    sendTyping: sendTypingToRoom,
    clearMessages,
    
    // Room methods
    joinRoom,
    leaveRoom
  }
}

// Hook for live updates
export const useLiveUpdates = (dataTypes = [], options = {}) => {
  const [liveData, setLiveData] = useState({})
  const [lastUpdate, setLastUpdate] = useState(null)
  
  const {
    isConnected,
    sendMessage,
    useSocketEvent
  } = useWebSocket(options.url, options)

  // Request live data on connection
  useEffect(() => {
    if (isConnected && dataTypes.length > 0) {
      dataTypes.forEach(dataType => {
        sendMessage('live:request', { type: dataType })
      })
    }
  }, [isConnected, dataTypes, sendMessage])

  // Handle live data updates
  useSocketEvent('live:data-update', useCallback((data) => {
    setLiveData(prev => ({
      ...prev,
      [data.type]: data.payload
    }))
    setLastUpdate(Date.now())
  }, []))

  return {
    isConnected,
    liveData,
    lastUpdate
  }
}

export default useWebSocket
