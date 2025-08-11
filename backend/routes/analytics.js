import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

// Analytics Schema for tracking various metrics
const analyticsSchema = new mongoose.Schema({
  // Basic Information
  type: {
    type: String,
    enum: [
      'page_view', 'user_action', 'event_registration', 'mandal_join',
      'media_upload', 'search_query', 'login', 'donation', 'api_call'
    ],
    required: [true, 'Analytics type is required']
  },
  category: {
    type: String,
    enum: [
      'user_engagement', 'content_interaction', 'platform_usage',
      'financial', 'community_growth', 'feature_adoption', 'performance'
    ],
    required: [true, 'Analytics category is required']
  },
  
  // Context Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: String,
  deviceInfo: {
    type: String,
    userAgent: String,
    platform: String,
    isMobile: Boolean
  },
  
  // Location Data
  location: {
    country: String,
    state: String,
    city: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  
  // Event Data
  event: {
    name: {
      type: String,
      required: [true, 'Event name is required']
    },
    properties: mongoose.Schema.Types.Mixed,
    value: Number, // Numeric value for the event (e.g., duration, amount)
    metadata: mongoose.Schema.Types.Mixed
  },
  
  // Related Content
  relatedContent: {
    contentType: {
      type: String,
      enum: ['event', 'mandal', 'user', 'media', 'page', 'feature']
    },
    contentId: String,
    contentTitle: String
  },
  
  // Timing
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  duration: Number, // Duration in milliseconds
  
  // Source Information
  source: {
    referrer: String,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    }
  }

}, {
  timestamps: true,
  // Optimize for time-series data
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours'
  }
})

// Indexes for efficient querying
analyticsSchema.index({ type: 1, timestamp: -1 })
analyticsSchema.index({ category: 1, timestamp: -1 })
analyticsSchema.index({ userId: 1, timestamp: -1 })
analyticsSchema.index({ 'event.name': 1, timestamp: -1 })
analyticsSchema.index({ timestamp: -1 })

const Analytics = mongoose.model('Analytics', analyticsSchema)

// Helper function to get date range
const getDateRange = (period) => {
  const now = new Date()
  let startDate, endDate = now

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'yesterday':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3
      startDate = new Date(now.getFullYear(), quarterStart, 1)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Default to last 30 days
  }

  return { startDate, endDate }
}

// @desc    Track analytics event
// @route   POST /api/analytics/track
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const {
      type,
      category,
      eventName,
      eventProperties,
      value,
      userId,
      sessionId,
      deviceInfo,
      location,
      relatedContent,
      source
    } = req.body

    // Validation
    if (!type || !category || !eventName) {
      return res.status(400).json({
        success: false,
        message: 'Type, category, and event name are required'
      })
    }

    // Create analytics entry
    const analytics = new Analytics({
      type,
      category,
      userId: userId || null,
      sessionId,
      deviceInfo,
      location,
      event: {
        name: eventName,
        properties: eventProperties,
        value
      },
      relatedContent,
      source
    })

    await analytics.save()

    res.status(201).json({
      success: true,
      message: 'Analytics event tracked successfully'
    })

  } catch (error) {
    console.error('Track analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while tracking analytics'
    })
  }
})

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const { period = 'month' } = req.query
    const { startDate, endDate } = getDateRange(period)

    // Get basic metrics
    const totalUsers = await mongoose.model('User').countDocuments()
    const totalMandals = await mongoose.model('Mandal').countDocuments()
    const totalEvents = await mongoose.model('Event').countDocuments()

    // Get period-specific metrics
    const periodUsers = await mongoose.model('User').countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    })

    const periodEvents = await mongoose.model('Event').countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    })

    // Get analytics data
    const pageViews = await Analytics.countDocuments({
      type: 'page_view',
      timestamp: { $gte: startDate, $lte: endDate }
    })

    const userActions = await Analytics.countDocuments({
      type: 'user_action',
      timestamp: { $gte: startDate, $lte: endDate }
    })

    // Get top events
    const topEvents = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$event.name',
          count: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ['$event.value', 0] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    // Get user engagement by day
    const engagementByDay = await Analytics.aggregate([
      {
        $match: {
          type: { $in: ['page_view', 'user_action'] },
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          pageViews: {
            $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] }
          },
          userActions: {
            $sum: { $cond: [{ $eq: ['$type', 'user_action'] }, 1, 0] }
          },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: { $ifNull: ['$uniqueUsers', []] } }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMandals,
          totalEvents,
          periodUsers,
          periodEvents,
          pageViews,
          userActions
        },
        topEvents,
        engagementByDay,
        period: {
          startDate,
          endDate,
          label: period
        }
      }
    })

  } catch (error) {
    console.error('Get dashboard analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard analytics'
    })
  }
})

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { period = 'month' } = req.query
    const { startDate, endDate } = getDateRange(period)

    // User registration trends
    const userRegistrations = await mongoose.model('User').aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // User activity
    const userActivity = await Analytics.aggregate([
      {
        $match: {
          userId: { $exists: true, $ne: null },
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalActions: { $sum: 1 },
          lastActivity: { $max: '$timestamp' },
          actionTypes: { $addToSet: '$type' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] }
        }
      },
      { $sort: { totalActions: -1 } },
      { $limit: 50 }
    ])

    // Geographic distribution
    const geographicData = await Analytics.aggregate([
      {
        $match: {
          'location.city': { $exists: true, $ne: null },
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            city: '$location.city',
            state: '$location.state'
          },
          uniqueUsers: { $addToSet: '$userId' },
          totalActions: { $sum: 1 }
        }
      },
      {
        $addFields: {
          uniqueUserCount: { $size: { $ifNull: ['$uniqueUsers', []] } }
        }
      },
      { $sort: { uniqueUserCount: -1 } },
      { $limit: 20 }
    ])

    res.json({
      success: true,
      data: {
        userRegistrations,
        userActivity,
        geographicData,
        period: {
          startDate,
          endDate,
          label: period
        }
      }
    })

  } catch (error) {
    console.error('Get user analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user analytics'
    })
  }
})

// @desc    Get content analytics
// @route   GET /api/analytics/content
// @access  Private (Admin)
router.get('/content', async (req, res) => {
  try {
    const { period = 'month' } = req.query
    const { startDate, endDate } = getDateRange(period)

    // Most viewed content
    const popularContent = await Analytics.aggregate([
      {
        $match: {
          type: 'page_view',
          'relatedContent.contentType': { $exists: true },
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            contentType: '$relatedContent.contentType',
            contentId: '$relatedContent.contentId',
            contentTitle: '$relatedContent.contentTitle'
          },
          viewCount: { $sum: 1 },
          uniqueViewers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueViewerCount: { $size: { $ifNull: ['$uniqueViewers', []] } }
        }
      },
      { $sort: { viewCount: -1 } },
      { $limit: 20 }
    ])

    // Content creation trends
    const contentCreation = await Analytics.aggregate([
      {
        $match: {
          type: { $in: ['event_registration', 'media_upload'] },
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            type: '$type'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ])

    res.json({
      success: true,
      data: {
        popularContent,
        contentCreation,
        period: {
          startDate,
          endDate,
          label: period
        }
      }
    })

  } catch (error) {
    console.error('Get content analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching content analytics'
    })
  }
})

// @desc    Get performance analytics
// @route   GET /api/analytics/performance
// @access  Private (Admin)
router.get('/performance', async (req, res) => {
  try {
    const { period = 'week' } = req.query
    const { startDate, endDate } = getDateRange(period)

    // API performance
    const apiPerformance = await Analytics.aggregate([
      {
        $match: {
          type: 'api_call',
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$event.name',
          totalCalls: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          maxDuration: { $max: '$duration' },
          minDuration: { $min: '$duration' }
        }
      },
      { $sort: { totalCalls: -1 } }
    ])

    // Error tracking
    const errorStats = await Analytics.aggregate([
      {
        $match: {
          'event.name': /error|failure|exception/i,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$event.name',
          count: { $sum: 1 },
          lastOccurred: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } }
    ])

    res.json({
      success: true,
      data: {
        apiPerformance,
        errorStats,
        period: {
          startDate,
          endDate,
          label: period
        }
      }
    })

  } catch (error) {
    console.error('Get performance analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching performance analytics'
    })
  }
})

// @desc    Export analytics data
// @route   GET /api/analytics/export
// @access  Private (Admin)
router.get('/export', async (req, res) => {
  try {
    const { period = 'month', format = 'json' } = req.query
    const { startDate, endDate } = getDateRange(period)

    const analyticsData = await Analytics.find({
      timestamp: { $gte: startDate, $lte: endDate }
    })
    .populate('userId', 'firstName lastName email')
    .sort({ timestamp: -1 })
    .limit(10000) // Limit to prevent overwhelming response

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = analyticsData.map(item => ({
        timestamp: item.timestamp,
        type: item.type,
        category: item.category,
        eventName: item.event.name,
        userId: item.userId?._id,
        userEmail: item.userId?.email,
        value: item.event.value
      }))

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${period}.csv`)
      
      // Simple CSV conversion
      const csvHeaders = Object.keys(csvData[0] || {}).join(',')
      const csvRows = csvData.map(row => Object.values(row).join(','))
      const csvContent = [csvHeaders, ...csvRows].join('\n')
      
      res.send(csvContent)
    } else {
      res.json({
        success: true,
        data: {
          analytics: analyticsData,
          count: analyticsData.length,
          period: {
            startDate,
            endDate,
            label: period
          }
        }
      })
    }

  } catch (error) {
    console.error('Export analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while exporting analytics'
    })
  }
})

export default router
