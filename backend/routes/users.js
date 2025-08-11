import express from 'express'
import User from '../models/User.js'
import { body, validationResult } from 'express-validator'
import { authenticateToken, requireOwnershipOrAdmin } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('mandals.mandalId', 'name logo category address')
      .select('-refreshTokens -passwordResetToken -passwordResetExpires')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: {
        user
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    })
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[+]?[1-9][\d]{9,14}$/)
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
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
    const updates = req.body

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.email
    delete updates.password
    delete updates.role
    delete updates.permissions
    delete updates.isActive
    delete updates.isVerified

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-refreshTokens -passwordResetToken -passwordResetExpires')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    })
  }
})

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
router.get('/search', async (req, res) => {
  try {
    const { q, city, state, interests, limit = 20, skip = 0 } = req.query

    const searchQuery = {
      isActive: true,
      isVerified: true
    }

    // Text search
    if (q) {
      searchQuery.$or = [
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { username: new RegExp(q, 'i') }
      ]
    }

    // Location filters
    if (city) {
      searchQuery['address.city'] = new RegExp(city, 'i')
    }

    if (state) {
      searchQuery['address.state'] = new RegExp(state, 'i')
    }

    // Interests filter
    if (interests) {
      const interestArray = interests.split(',').map(i => i.trim())
      searchQuery.interests = { $in: interestArray }
    }

    const users = await User.find(searchQuery)
      .select('firstName lastName username avatar address.city address.state interests stats')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(searchQuery)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Search users error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while searching users'
    })
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
      .populate('mandals.mandalId', 'name logo category')
      .select('firstName lastName username avatar address interests stats mandals preferences.privacy')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check privacy settings
    const isOwnProfile = req.user.userId.toString() === id
    const privacyLevel = user.preferences?.privacy?.profileVisibility || 'public'

    if (!isOwnProfile && privacyLevel === 'private') {
      return res.status(403).json({
        success: false,
        message: 'This profile is private'
      })
    }

    // Filter out sensitive information based on privacy settings
    const userResponse = user.toObject()
    
    if (!isOwnProfile) {
      if (!user.preferences?.privacy?.showPhone) {
        delete userResponse.phone
      }
      if (!user.preferences?.privacy?.showLocation) {
        delete userResponse.address
        delete userResponse.location
      }
    }

    res.json({
      success: true,
      data: {
        user: userResponse
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    })
  }
})

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', async (req, res) => {
  try {
    const userId = req.user.userId
    const { preferences } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true, runValidators: true }
    ).select('preferences')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    })

  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    })
  }
})

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
router.put('/location', [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object')
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
    const { latitude, longitude, address } = req.body

    const updateData = {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    }

    if (address) {
      updateData.address = address
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('location address')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: user.location,
        address: user.address
      }
    })

  } catch (error) {
    console.error('Update location error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating location'
    })
  }
})

// @desc    Get nearby users
// @route   GET /api/users/nearby
// @access  Private
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000, limit = 20 } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      })
    }

    const users = await User.findNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance)
    )
    .select('firstName lastName username avatar address.city address.state')
    .limit(parseInt(limit))

    res.json({
      success: true,
      data: {
        users,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          maxDistance: parseInt(maxDistance)
        }
      }
    })

  } catch (error) {
    console.error('Get nearby users error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while finding nearby users'
    })
  }
})

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user.userId
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      })
    }

    // Verify password before deletion
    const user = await User.findById(userId).select('+password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      })
    }

    // Instead of hard delete, deactivate the account
    await User.findByIdAndUpdate(userId, {
      $set: {
        isActive: false,
        email: `deleted_${userId}@deleted.com`, // Prevent email conflicts
        username: `deleted_${userId}`,
        refreshTokens: [] // Clear all sessions
      }
    })

    res.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    })
  }
})

export default router
