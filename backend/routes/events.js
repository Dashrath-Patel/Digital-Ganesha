import express from 'express'
import mongoose from 'mongoose'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: [
      'festival', 'ritual', 'cultural-program', 'charity', 'educational',
      'community-service', 'celebration', 'workshop', 'competition', 'other'
    ],
    required: [true, 'Event category is required']
  },
  
  // Timing
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: {
    type: String, // Format: "HH:MM"
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String, // Format: "HH:MM"
    required: [true, 'End time is required']
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  venue: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' }
    }
  },
  
  // Organization
  mandal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mandal',
    required: false // Made optional for now
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made optional for now
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Custom icon for events
  icon: {
    type: String,
    default: '🎭'
  },
  
  // Event Details
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresRegistration: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date
  },
  entryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Media
  banner: {
    url: String,
    publicId: String
  },
  gallery: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Attendees
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'not-required'],
      default: 'not-required'
    },
    paymentId: String
  }],
  
  // Event Status
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Additional Information
  tags: [String],
  requirements: [String],
  schedule: [{
    time: String,
    activity: String,
    description: String
  }],
  
  // Statistics
  stats: {
    totalAttendees: { type: Number, default: 0 },
    totalRegistrations: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 }
  },
  
  // Reviews and Feedback
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
eventSchema.index({ startDate: 1, status: 1 })
eventSchema.index({ mandal: 1, startDate: -1 })
eventSchema.index({ location: '2dsphere' })
eventSchema.index({ title: 'text', description: 'text', tags: 'text' })

// Create the model
const Event = mongoose.model('Event', eventSchema)

// @desc    Get all events with filtering
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      mandal,
      category,
      status = 'published',
      startDate,
      endDate,
      city,
      search,
      latitude,
      longitude,
      maxDistance = 50000,
      limit = 20,
      skip = 0
    } = req.query

    const searchQuery = {}

    // Status filter
    if (status !== 'all') {
      searchQuery.status = status
    }

    // Mandal filter
    if (mandal) {
      searchQuery.mandal = mandal
    }

    // Category filter
    if (category) {
      searchQuery.category = category
    }

    // Date range filter
    if (startDate || endDate) {
      searchQuery.startDate = {}
      if (startDate) {
        searchQuery.startDate.$gte = new Date(startDate)
      }
      if (endDate) {
        searchQuery.startDate.$lte = new Date(endDate)
      }
    }

    // Location filter
    if (city) {
      searchQuery['venue.address.city'] = new RegExp(city, 'i')
    }

    // Text search
    if (search) {
      searchQuery.$text = { $search: search }
    }

    // Geographic search
    if (latitude && longitude) {
      searchQuery.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }

    const events = await Event.find(searchQuery)
      .populate('mandal', 'name logo category address')
      .populate('organizer', 'firstName lastName avatar')
      .select('-attendees -reviews')
      .sort({ startDate: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Event.countDocuments(searchQuery)

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get events error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    })
  }
})

// @desc    Create new event
// @route   POST /api/events
// @access  Private (temporarily public for testing)
router.post('/', async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    
    const {
      title,
      description,
      startDate,
      endDate,
      startTime = '10:00',
      endTime = '18:00',
      location,
      icon,
      category = 'festival'
    } = req.body

    // Validate required fields
    if (!title || !description || !startDate || !endDate || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, startDate, endDate, location'
      })
    }

    // Parse and validate dates
    const parsedStartDate = new Date(startDate)
    const parsedEndDate = new Date(endDate)
    
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format.'
      })
    }

    if (parsedEndDate < parsedStartDate) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date'
      })
    }

    console.log('Parsed dates:', { parsedStartDate, parsedEndDate });

    const eventData = {
      title,
      description,
      category,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      startTime,
      endTime,
      venue: {
        name: location,
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        }
      },
      // Provide default location coordinates for Mumbai
      location: {
        type: 'Point',
        coordinates: [72.8777, 19.0760] // [longitude, latitude] for Mumbai
      },
      status: 'published', // Changed from 'active' to 'published'
      isPublic: true,
      icon // Add custom icon field
    }

    // Only add user-related fields if authentication is available
    if (req.user) {
      eventData.mandal = req.user.mandalId || null
      eventData.organizer = req.user.userId || req.user.id || null
    }

    console.log('Final event data:', eventData);

    const event = new Event(eventData)
    const savedEvent = await event.save()

    console.log('Event saved successfully:', savedEvent._id);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    })
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const event = await Event.findById(id)
      .populate('mandal', 'name logo category address contact')
      .populate('organizer', 'firstName lastName avatar')
      .populate('coOrganizers', 'firstName lastName avatar')
      .populate('attendees.userId', 'firstName lastName avatar')

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }

    res.json({
      success: true,
      data: {
        event
      }
    })

  } catch (error) {
    console.error('Get event error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    })
  }
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    console.log('Update event data received:', updateData);

    // Parse dates if provided
    if (updateData.startDate && updateData.endDate) {
      updateData.startDate = new Date(updateData.startDate)
      updateData.endDate = new Date(updateData.endDate)
    } else if (updateData.date && !updateData.startDate) {
      const currentYear = new Date().getFullYear()
      const parsedDate = new Date(`${updateData.date} ${currentYear}`)
      if (!isNaN(parsedDate.getTime())) {
        updateData.startDate = parsedDate
        updateData.endDate = parsedDate
      }
    }

    // Handle location/venue update
    if (updateData.location) {
      // Update venue information
      updateData.venue = {
        name: updateData.location,
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        }
      }
      
      // Keep the existing location coordinates or set default ones
      updateData.location = {
        type: 'Point',
        coordinates: [72.8777, 19.0760] // Default Mumbai coordinates
      }
    }

    // Remove any fields that shouldn't be updated directly
    delete updateData.id
    delete updateData._id
    delete updateData.createdAt
    delete updateData.__v

    console.log('Processed update data:', updateData);

    const event = await Event.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('mandal', 'name logo')
     .populate('organizer', 'firstName lastName')

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }

    console.log('Event updated successfully:', event._id);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    })
  } catch (error) {
    console.error('Update event error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update event',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const event = await Event.findByIdAndDelete(id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      })
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Delete event error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete event'
    })
  }
})

// @desc    Join event
// @route   POST /api/events/:id/join
// @access  Private
router.post('/:id/join', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Event join endpoint - Implementation pending'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Leave event
// @route   POST /api/events/:id/leave
// @access  Private
router.post('/:id/leave', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Event leave endpoint - Implementation pending'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router
