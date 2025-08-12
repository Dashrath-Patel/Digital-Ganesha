import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

// Notification Schema
const notificationSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  
  // Type and Category
  type: {
    type: String,
    enum: [
      'event', 'mandal', 'user', 'system', 'reminder', 'announcement',
      'invitation', 'approval', 'rejection', 'welcome', 'achievement'
    ],
    required: [true, 'Notification type is required']
  },
  category: {
    type: String,
    enum: [
      'festival', 'event-update', 'member-activity', 'admin-message',
      'donation-request', 'volunteer-call', 'celebration', 'alert'
    ],
    required: [true, 'Notification category is required']
  },
  
  // Priority and Urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Recipients
  recipients: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    },
    actionTaken: {
      type: Boolean,
      default: false
    },
    actionTakenAt: {
      type: Date
    }
  }],
  
  // Targeting
  targetAudience: {
    type: String,
    enum: ['all', 'mandal-members', 'mandal-admins', 'specific-users', 'by-location', 'by-interests'],
    default: 'specific-users'
  },
  mandalTargets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mandal'
  }],
  locationTargets: [{
    city: String,
    state: String,
    radius: Number // in kilometers
  }],
  interestTargets: [String],
  
  // Sender Information
  sender: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    senderType: {
      type: String,
      enum: ['user', 'mandal', 'system', 'admin'],
      default: 'system'
    },
    senderName: String
  },
  
  // Related Content
  relatedContent: {
    contentType: {
      type: String,
      enum: ['event', 'mandal', 'user', 'media', 'announcement', 'none'],
      default: 'none'
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedContent.contentType'
    },
    contentUrl: String
  },
  
  // Action Information
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionType: {
    type: String,
    enum: ['approve', 'reject', 'join', 'view', 'respond', 'donate', 'register', 'none'],
    default: 'none'
  },
  actionUrl: String,
  actionData: mongoose.Schema.Types.Mixed,
  
  // Media
  icon: {
    type: String,
    default: 'bell'
  },
  image: {
    url: String,
    publicId: String
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'sent'
  },
  
  // Delivery Options
  channels: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  
  // Statistics
  stats: {
    totalRecipients: { type: Number, default: 0 },
    totalDelivered: { type: Number, default: 0 },
    totalRead: { type: Number, default: 0 },
    totalActioned: { type: Number, default: 0 },
    deliveryRate: { type: Number, default: 0 },
    readRate: { type: Number, default: 0 },
    actionRate: { type: Number, default: 0 }
  },
  
  // Retry and Error Handling
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  lastRetryAt: Date,
  deliveryErrors: [{
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
notificationSchema.index({ 'recipients.userId': 1, createdAt: -1 })
notificationSchema.index({ 'recipients.userId': 1, 'recipients.isRead': 1 })
notificationSchema.index({ type: 1, category: 1 })
notificationSchema.index({ scheduledFor: 1, status: 1 })
notificationSchema.index({ expiresAt: 1 })
notificationSchema.index({ 'sender.userId': 1, createdAt: -1 })

// Create the model
const Notification = mongoose.model('Notification', notificationSchema)

// @desc    Get notifications for user
// @route   GET /api/notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      isRead,
      type,
      category,
      priority,
      limit = 20,
      skip = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const userId = req.user?.id || new mongoose.Types.ObjectId() // Fallback for testing

    const matchQuery = {
      'recipients.userId': new mongoose.Types.ObjectId(userId)
    }

    // Filter by read status
    if (isRead !== undefined) {
      matchQuery['recipients.isRead'] = isRead === 'true'
    }

    // Filter by type
    if (type) {
      matchQuery.type = type
    }

    // Filter by category
    if (category) {
      matchQuery.category = category
    }

    // Filter by priority
    if (priority) {
      matchQuery.priority = priority
    }

    // Sort options
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    const notifications = await Notification.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
          userRecipient: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$recipients',
                  cond: { $eq: ['$$this.userId', new mongoose.Types.ObjectId(userId)] }
                }
              },
              0
            ]
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender.userId',
          foreignField: '_id',
          as: 'senderInfo'
        }
      },
      {
        $addFields: {
          'sender.userInfo': { $arrayElemAt: ['$senderInfo', 0] }
        }
      },
      {
        $project: {
          recipients: 0,
          senderInfo: 0
        }
      },
      { $sort: sortOptions },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) }
    ])

    // Get total count
    const totalCount = await Notification.countDocuments(matchQuery)

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          skip: parseInt(skip),
          pages: Math.ceil(totalCount / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    })
  }
})

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user?.id || new mongoose.Types.ObjectId() // Fallback for testing

    const unreadCount = await Notification.countDocuments({
      'recipients.userId': new mongoose.Types.ObjectId(userId),
      'recipients.isRead': false
    })

    res.json({
      success: true,
      data: {
        unreadCount
      }
    })

  } catch (error) {
    console.error('Get unread count error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching unread count'
    })
  }
})

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      category,
      priority = 'medium',
      recipients,
      targetAudience = 'specific-users',
      actionRequired = false,
      actionType = 'none',
      actionUrl,
      scheduledFor,
      expiresAt,
      channels = { push: true, inApp: true }
    } = req.body

    // Validation
    if (!title || !message || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, type, and category are required'
      })
    }

    // Process recipients based on target audience
    let recipientList = []

    if (targetAudience === 'specific-users' && recipients) {
      recipientList = recipients.map(userId => ({
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false,
        deliveredAt: new Date()
      }))
    }

    // Create notification
    const notification = new Notification({
      title,
      message,
      type,
      category,
      priority,
      recipients: recipientList,
      targetAudience,
      sender: {
        userId: req.user?.id || new mongoose.Types.ObjectId(),
        senderType: 'user',
        senderName: req.user?.firstName + ' ' + req.user?.lastName || 'System'
      },
      actionRequired,
      actionType,
      actionUrl,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      channels,
      stats: {
        totalRecipients: recipientList.length,
        totalDelivered: recipientList.length,
        totalRead: 0,
        totalActioned: 0
      }
    })

    await notification.save()

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: {
        notification
      }
    })

  } catch (error) {
    console.error('Create notification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating notification'
    })
  }
})

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || new mongoose.Types.ObjectId() // Fallback for testing

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        'recipients.userId': new mongoose.Types.ObjectId(userId),
        'recipients.isRead': false
      },
      {
        $set: {
          'recipients.$.isRead': true,
          'recipients.$.readAt': new Date()
        },
        $inc: {
          'stats.totalRead': 1
        }
      },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or already read'
      })
    }

    // Update read rate
    const readRate = (notification.stats.totalRead / notification.stats.totalRecipients) * 100
    notification.stats.readRate = Math.round(readRate * 100) / 100
    await notification.save()

    res.json({
      success: true,
      message: 'Notification marked as read'
    })

  } catch (error) {
    console.error('Mark as read error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while marking notification as read'
    })
  }
})

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user?.id || new mongoose.Types.ObjectId() // Fallback for testing

    await Notification.updateMany(
      {
        'recipients.userId': new mongoose.Types.ObjectId(userId),
        'recipients.isRead': false
      },
      {
        $set: {
          'recipients.$.isRead': true,
          'recipients.$.readAt': new Date()
        }
      }
    )

    res.json({
      success: true,
      message: 'All notifications marked as read'
    })

  } catch (error) {
    console.error('Mark all as read error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while marking all notifications as read'
    })
  }
})

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || new mongoose.Types.ObjectId() // Fallback for testing

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        'recipients.userId': new mongoose.Types.ObjectId(userId)
      },
      {
        $pull: {
          recipients: { userId: new mongoose.Types.ObjectId(userId) }
        }
      }
    )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    })

  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    })
  }
})

// @desc    Get notification settings
// @route   GET /api/notifications/settings
// @access  Private
router.get('/settings', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Notification settings endpoint - Implementation pending',
      data: {
        settings: {
          push: true,
          email: true,
          sms: false,
          categories: {
            events: true,
            mandal: true,
            announcements: true,
            reminders: true
          }
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Update notification settings
// @route   PUT /api/notifications/settings
// @access  Private
router.put('/settings', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update notification settings endpoint - Implementation pending'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router
