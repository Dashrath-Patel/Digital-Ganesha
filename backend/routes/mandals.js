import express from 'express'
import Mandal from '../models/Mandal.js'
import { body, validationResult } from 'express-validator'
import { authenticateToken, requireMandalAccess, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all mandals with filtering and pagination
// @route   GET /api/mandals
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      city,
      state,
      search,
      latitude,
      longitude,
      maxDistance = 50000,
      limit = 20,
      skip = 0,
      sortBy = 'averageRating'
    } = req.query

    const searchQuery = {
      isActive: true,
      status: 'active'
    }

    // Category filter
    if (category) {
      searchQuery.category = category
    }

    // Location filters
    if (city) {
      searchQuery['address.city'] = new RegExp(city, 'i')
    }

    if (state) {
      searchQuery['address.state'] = new RegExp(state, 'i')
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

    // Build sort object
    let sortObject = {}
    switch (sortBy) {
      case 'averageRating':
        sortObject = { 'stats.averageRating': -1, 'stats.totalMembers': -1 }
        break
      case 'members':
        sortObject = { 'stats.totalMembers': -1 }
        break
      case 'newest':
        sortObject = { createdAt: -1 }
        break
      case 'oldest':
        sortObject = { createdAt: 1 }
        break
      default:
        sortObject = { 'stats.averageRating': -1 }
    }

    if (search && !latitude) {
      sortObject = { score: { $meta: 'textScore' }, ...sortObject }
    }

    const mandals = await Mandal.find(searchQuery)
      .populate('createdBy', 'firstName lastName avatar')
      .select('name description tagline logo address category stats timings specialFeatures establishedYear')
      .sort(sortObject)
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Mandal.countDocuments(searchQuery)

    res.json({
      success: true,
      data: {
        mandals,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          pages: Math.ceil(total / limit)
        },
        filters: {
          category,
          city,
          state,
          search,
          location: latitude && longitude ? { latitude, longitude, maxDistance } : null
        }
      }
    })

  } catch (error) {
    console.error('Get mandals error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching mandals'
    })
  }
})

// @desc    Create new mandal
// @route   POST /api/mandals
// @access  Private
router.post('/', authenticateToken, [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Mandal name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['residential', 'community', 'cultural', 'charitable', 'educational', 'commercial', 'public', 'private'])
    .withMessage('Invalid category'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  body('contact.phone')
    .matches(/^[+]?[1-9][\d]{9,14}$/)
    .withMessage('Valid phone number is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const userId = req.user.userId
    const { latitude, longitude, ...mandalData } = req.body

    // Create mandal
    const mandal = new Mandal({
      ...mandalData,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      createdBy: userId,
      members: [{
        userId,
        role: 'admin',
        joinedAt: new Date(),
        isActive: true,
        permissions: [
          'view_events', 'create_events', 'edit_events', 'delete_events',
          'view_members', 'invite_members', 'remove_members', 'edit_member_roles',
          'upload_media', 'edit_mandal', 'view_analytics', 'manage_finances'
        ]
      }],
      moderators: [userId]
    })

    await mandal.save()

    // Populate the created mandal
    const populatedMandal = await Mandal.findById(mandal._id)
      .populate('createdBy', 'firstName lastName avatar')
      .populate('members.userId', 'firstName lastName avatar')

    res.status(201).json({
      success: true,
      message: 'Mandal created successfully',
      data: {
        mandal: populatedMandal
      }
    })

  } catch (error) {
    console.error('Create mandal error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating mandal'
    })
  }
})

// @desc    Get mandal by ID
// @route   GET /api/mandals/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params

    const mandal = await Mandal.findById(id)
      .populate('createdBy', 'firstName lastName avatar')
      .populate('members.userId', 'firstName lastName avatar')
      .populate('events')

    if (!mandal) {
      return res.status(404).json({
        success: false,
        message: 'Mandal not found'
      })
    }

    if (!mandal.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Mandal is not available'
      })
    }

    // Check if user has access based on visibility
    const userId = req.user?.userId
    const isMember = mandal.members.some(member => 
      member.userId._id.toString() === userId?.toString() && member.isActive
    )

    if (mandal.visibility === 'private' && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'This mandal is private'
      })
    }

    if (mandal.visibility === 'members-only' && !isMember) {
      // Return limited information for non-members
      const limitedMandal = {
        _id: mandal._id,
        name: mandal.name,
        description: mandal.description,
        logo: mandal.logo,
        address: mandal.address,
        category: mandal.category,
        visibility: mandal.visibility,
        stats: {
          totalMembers: mandal.stats.totalMembers,
          averageRating: mandal.stats.averageRating
        }
      }

      return res.json({
        success: true,
        data: {
          mandal: limitedMandal,
          membershipRequired: true
        }
      })
    }

    res.json({
      success: true,
      data: {
        mandal,
        isMember,
        userRole: isMember ? mandal.members.find(m => m.userId._id.toString() === userId?.toString())?.role : null
      }
    })

  } catch (error) {
    console.error('Get mandal error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching mandal'
    })
  }
})

// @desc    Update mandal
// @route   PUT /api/mandals/:id
// @access  Private (Admin/Moderator)
router.put('/:id', authenticateToken, requireMandalAccess('coordinator'), async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Remove fields that shouldn't be updated via this endpoint
    delete updates.createdBy
    delete updates.members
    delete updates.stats
    delete updates._id

    // Handle location update
    if (updates.latitude && updates.longitude) {
      updates.location = {
        type: 'Point',
        coordinates: [updates.longitude, updates.latitude]
      }
      delete updates.latitude
      delete updates.longitude
    }

    const mandal = await Mandal.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName avatar')

    if (!mandal) {
      return res.status(404).json({
        success: false,
        message: 'Mandal not found'
      })
    }

    res.json({
      success: true,
      message: 'Mandal updated successfully',
      data: {
        mandal
      }
    })

  } catch (error) {
    console.error('Update mandal error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating mandal'
    })
  }
})

// @desc    Delete mandal
// @route   DELETE /api/mandals/:id
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireMandalAccess('admin'), async (req, res) => {
  try {
    const { id } = req.params

    // Soft delete - deactivate instead of removing
    const mandal = await Mandal.findByIdAndUpdate(
      id,
      { 
        $set: { 
          isActive: false,
          status: 'inactive'
        }
      },
      { new: true }
    )

    if (!mandal) {
      return res.status(404).json({
        success: false,
        message: 'Mandal not found'
      })
    }

    res.json({
      success: true,
      message: 'Mandal deleted successfully'
    })

  } catch (error) {
    console.error('Delete mandal error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting mandal'
    })
  }
})

// @desc    Join mandal
// @route   POST /api/mandals/:id/join
// @access  Private
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const mandal = await Mandal.findById(id)
    if (!mandal || !mandal.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Mandal not found'
      })
    }

    // Check if user is already a member
    const existingMember = mandal.members.find(member => 
      member.userId.toString() === userId.toString()
    )

    if (existingMember && existingMember.isActive) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this mandal'
      })
    }

    // Add or reactivate membership
    await mandal.addMember(userId, 'member')

    res.json({
      success: true,
      message: 'Successfully joined the mandal'
    })

  } catch (error) {
    console.error('Join mandal error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while joining mandal'
    })
  }
})

// @desc    Leave mandal
// @route   POST /api/mandals/:id/leave
// @access  Private
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const mandal = await Mandal.findById(id)
    if (!mandal) {
      return res.status(404).json({
        success: false,
        message: 'Mandal not found'
      })
    }

    // Check if user is the creator/admin
    if (mandal.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Mandal creator cannot leave. Please transfer ownership first.'
      })
    }

    // Remove membership
    await mandal.removeMember(userId)

    res.json({
      success: true,
      message: 'Successfully left the mandal'
    })

  } catch (error) {
    console.error('Leave mandal error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while leaving mandal'
    })
  }
})

// @desc    Get nearby mandals
// @route   GET /api/mandals/nearby
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000, limit = 20 } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      })
    }

    const mandals = await Mandal.findNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance)
    )
    .populate('createdBy', 'firstName lastName avatar')
    .select('name description logo address category stats')
    .limit(parseInt(limit))

    res.json({
      success: true,
      data: {
        mandals,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          maxDistance: parseInt(maxDistance)
        }
      }
    })

  } catch (error) {
    console.error('Get nearby mandals error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while finding nearby mandals'
    })
  }
})

export default router
