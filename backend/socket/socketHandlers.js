// Initialize Socket.IO handlers
export const initializeSocket = (io) => {
  console.log('🔌 Socket.IO server initialized')

  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      // Verify token (you can import jwt and User model here)
      // For now, we'll skip authentication in development
      if (process.env.NODE_ENV === 'development') {
        socket.userId = socket.handshake.auth.userId || 'anonymous'
        return next()
      }

      // In production, implement proper JWT verification
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  // Handle connection
  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`)

    // Join user to their personal room
    if (socket.userId) {
      socket.join(`user_${socket.userId}`)
      console.log(`📍 User ${socket.userId} joined personal room`)
    }

    // Handle joining mandal rooms
    socket.on('join_mandal', (mandalId) => {
      socket.join(`mandal_${mandalId}`)
      socket.emit('joined_mandal', { mandalId })
      console.log(`🏛️ User ${socket.userId} joined mandal ${mandalId}`)
    })

    // Handle leaving mandal rooms
    socket.on('leave_mandal', (mandalId) => {
      socket.leave(`mandal_${mandalId}`)
      socket.emit('left_mandal', { mandalId })
      console.log(`🚪 User ${socket.userId} left mandal ${mandalId}`)
    })

    // Handle chat messages
    socket.on('send_message', (data) => {
      const { mandalId, message, type = 'text' } = data
      
      const messageData = {
        id: generateMessageId(),
        userId: socket.userId,
        mandalId,
        message,
        type,
        timestamp: new Date().toISOString()
      }

      // Broadcast to mandal room
      socket.to(`mandal_${mandalId}`).emit('new_message', messageData)
      
      // Send confirmation to sender
      socket.emit('message_sent', { messageId: messageData.id })
      
      console.log(`💬 Message sent to mandal ${mandalId}`)
    })

    // Handle live event updates
    socket.on('join_event', (eventId) => {
      socket.join(`event_${eventId}`)
      socket.emit('joined_event', { eventId })
      console.log(`🎉 User ${socket.userId} joined event ${eventId}`)
    })

    socket.on('leave_event', (eventId) => {
      socket.leave(`event_${eventId}`)
      socket.emit('left_event', { eventId })
      console.log(`🎉 User ${socket.userId} left event ${eventId}`)
    })

    // Handle event live updates
    socket.on('event_update', (data) => {
      const { eventId, update } = data
      
      const updateData = {
        eventId,
        update,
        timestamp: new Date().toISOString(),
        userId: socket.userId
      }

      // Broadcast to event room
      io.to(`event_${eventId}`).emit('live_event_update', updateData)
      
      console.log(`📡 Live update sent for event ${eventId}`)
    })

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { mandalId } = data
      socket.to(`mandal_${mandalId}`).emit('user_typing', {
        userId: socket.userId,
        mandalId
      })
    })

    socket.on('typing_stop', (data) => {
      const { mandalId } = data
      socket.to(`mandal_${mandalId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        mandalId
      })
    })

    // Handle donation notifications
    socket.on('donation_made', (data) => {
      const { mandalId, amount, donorName } = data
      
      const donationData = {
        mandalId,
        amount,
        donorName,
        timestamp: new Date().toISOString()
      }

      // Notify mandal members
      io.to(`mandal_${mandalId}`).emit('new_donation', donationData)
      
      console.log(`💰 Donation notification sent for mandal ${mandalId}`)
    })

    // Handle user status updates
    socket.on('update_status', (status) => {
      socket.status = status
      
      // Notify all connected users in user's mandals
      // This would require fetching user's mandals from database
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        status,
        timestamp: new Date().toISOString()
      })
    })

    // Handle WebRTC signaling for video calls
    socket.on('video_call_offer', (data) => {
      const { targetUserId, offer, callId } = data
      
      io.to(`user_${targetUserId}`).emit('incoming_video_call', {
        fromUserId: socket.userId,
        offer,
        callId
      })
    })

    socket.on('video_call_answer', (data) => {
      const { targetUserId, answer, callId } = data
      
      io.to(`user_${targetUserId}`).emit('video_call_answered', {
        fromUserId: socket.userId,
        answer,
        callId
      })
    })

    socket.on('video_call_ice_candidate', (data) => {
      const { targetUserId, candidate, callId } = data
      
      io.to(`user_${targetUserId}`).emit('video_call_ice_candidate', {
        fromUserId: socket.userId,
        candidate,
        callId
      })
    })

    socket.on('video_call_end', (data) => {
      const { targetUserId, callId } = data
      
      io.to(`user_${targetUserId}`).emit('video_call_ended', {
        fromUserId: socket.userId,
        callId
      })
    })

    // Handle location sharing
    socket.on('share_location', (data) => {
      const { mandalId, latitude, longitude } = data
      
      const locationData = {
        userId: socket.userId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      }

      // Share with mandal members
      socket.to(`mandal_${mandalId}`).emit('user_location_shared', locationData)
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`👋 User disconnected: ${socket.id}, reason: ${reason}`)
      
      // Notify mandals about user going offline
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      })
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error(`🚨 Socket error for user ${socket.userId}:`, error)
    })
  })

  // Utility functions for emitting from external services
  const socketUtils = {
    // Notify user about new notification
    notifyUser: (userId, notification) => {
      io.to(`user_${userId}`).emit('new_notification', notification)
    },

    // Notify mandal about new member
    notifyMandalNewMember: (mandalId, memberData) => {
      io.to(`mandal_${mandalId}`).emit('new_member_joined', memberData)
    },

    // Notify mandal about new event
    notifyMandalNewEvent: (mandalId, eventData) => {
      io.to(`mandal_${mandalId}`).emit('new_event_created', eventData)
    },

    // Broadcast system announcement
    broadcastAnnouncement: (announcement) => {
      io.emit('system_announcement', announcement)
    },

    // Get online users count
    getOnlineUsersCount: () => {
      return io.engine.clientsCount
    },

    // Get users in specific room
    getUsersInRoom: async (roomName) => {
      const sockets = await io.in(roomName).fetchSockets()
      return sockets.map(socket => ({
        userId: socket.userId,
        socketId: socket.id,
        status: socket.status || 'online'
      }))
    }
  }

  // Attach utility functions to io instance
  io.socketUtils = socketUtils

  return io
}

// Helper function to generate unique message IDs
const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export default initializeSocket
