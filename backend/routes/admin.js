import express from 'express'
import User from '../models/User.js'
import Mandal from '../models/Mandal.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Middleware to check admin permissions
const requireAdmin = requireRole(['admin'])

// Get all users with pagination and filters
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Build filter object
    const filter = {}
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    if (role) {
      filter.role = role
    }

    if (status) {
      filter.isActive = status === 'active'
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    const users = await User.find(filter)
      .populate('mandal', 'name location')
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)

    const total = await User.countDocuments(filter)
    const totalPages = Math.ceil(total / limitNum)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalUsers: total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
})

// Get dashboard statistics
router.get('/dashboard-stats', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      committeeMembers,
      totalMandals,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isCommitteeMember: true }),
      Mandal.countDocuments(),
      User.find()
        .select('firstName lastName email createdAt role')
        .sort({ createdAt: -1 })
        .limit(5)
    ])

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])

    const roleStats = {}
    usersByRole.forEach(item => {
      roleStats[item._id] = item.count
    })

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        committeeMembers,
        totalMandals,
        recentUsers,
        usersByRole: roleStats,
        inactiveUsers: totalUsers - activeUsers
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    })
  }
})

// Update user role
router.put('/users/:userId/role', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    const validRoles = ['user', 'committee_member', 'admin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    })
  }
})

// Assign user to committee
router.put('/users/:userId/committee', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    const { isCommitteeMember, committeeRole, mandalId } = req.body

    const updateData = {
      isCommitteeMember,
      committeeRole: isCommitteeMember ? committeeRole : null,
      mandal: isCommitteeMember && mandalId ? mandalId : null
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('mandal', 'name location')
      .select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: `User ${isCommitteeMember ? 'assigned to' : 'removed from'} committee successfully`,
      data: user
    })
  } catch (error) {
    console.error('Update committee assignment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update committee assignment',
      error: error.message
    })
  }
})

// Toggle user active status
router.put('/users/:userId/status', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    const { isActive } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    })
  } catch (error) {
    console.error('Update user status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    })
  }
})

// Bulk update user roles
router.put('/users/bulk/roles', requireAdmin, async (req, res) => {
  try {
    const { userIds, role } = req.body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      })
    }

    const validRoles = ['user', 'committee_member', 'admin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      })
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { role }
    )

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} users successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    })
  } catch (error) {
    console.error('Bulk update roles error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user roles',
      error: error.message
    })
  }
})

// Get user activity logs (placeholder - implement based on your logging system)
router.get('/users/:userId/activity', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    // This is a placeholder - implement based on your activity logging system
    const mockLogs = [
      {
        action: 'Profile Updated',
        timestamp: new Date(),
        details: 'Updated profile information'
      },
      {
        action: 'Login',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        details: 'Logged in from mobile device'
      }
    ]

    res.json({
      success: true,
      data: {
        logs: mockLogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: 1,
          totalLogs: mockLogs.length
        }
      }
    })
  } catch (error) {
    console.error('Get user activity error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error.message
    })
  }
})

// Create initial admin user (only if no admin exists)
router.post('/create-initial-admin', async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists. This endpoint can only be used once.'
      })
    }

    const { firstName, lastName, email, password } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (firstName, lastName, email, password) are required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Create initial admin
    const adminUser = new User({
      firstName,
      lastName,
      email,
      password, // Will be hashed by the pre-save middleware
      role: 'admin',
      isActive: true,
      isVerified: true,
      emailVerifiedAt: new Date()
    })

    await adminUser.save()

    // Remove password from response
    const userResponse = adminUser.toObject()
    delete userResponse.password

    res.status(201).json({
      success: true,
      message: 'Initial admin created successfully',
      data: userResponse
    })
  } catch (error) {
    console.error('Create initial admin error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create initial admin',
      error: error.message
    })
  }
})

// Export users data
router.get('/users/export', requireAdmin, async (req, res) => {
  try {
    const { format = 'json' } = req.query

    const users = await User.find()
      .populate('mandal', 'name location')
      .select('-password')
      .sort({ createdAt: -1 })

    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Committee Member', 'Created At']
      const csvData = users.map(user => [
        user._id,
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        user.isCommitteeMember ? 'Yes' : 'No',
        user.createdAt.toISOString()
      ])

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv')
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')
      
      res.send(csvContent)
    } else {
      res.json({
        success: true,
        data: users,
        exportedAt: new Date().toISOString(),
        totalRecords: users.length
      })
    }
  } catch (error) {
    console.error('Export users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to export users',
      error: error.message
    })
  }
})

export default router
