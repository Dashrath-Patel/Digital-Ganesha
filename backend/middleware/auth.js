import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    console.log('Auth header:', authHeader);
    console.log('Extracted token:', token ? 'Token present' : 'No token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
        code: 'NO_TOKEN'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      })
    }

    // Check if user exists and is active
    const user = await User.findById(decoded.userId).select('-password -refreshTokens')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      })
    }

    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked',
        code: 'ACCOUNT_LOCKED'
      })
    }

    // Add user info to request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      })
    }

    console.error('Authentication error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      code: 'AUTH_SERVER_ERROR'
    })
  }
}

// Middleware to check if user has specific role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      })
    }

    const userRole = req.user.role
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      })
    }

    next()
  }
}

// Middleware to check if user has specific permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      })
    }

    const userPermissions = req.user.permissions || []
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`,
        code: 'PERMISSION_DENIED',
        required: permission,
        current: userPermissions
      })
    }

    next()
  }
}

// Middleware to check if user is admin or owner of resource
export const requireOwnershipOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      })
    }

    const { userId, role } = req.user

    // Allow admins
    if (role === 'admin') {
      return next()
    }

    try {
      // Get the resource owner ID
      const resourceUserId = await getResourceUserId(req)
      
      if (!resourceUserId) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND'
        })
      }

      // Check if user owns the resource
      if (userId.toString() !== resourceUserId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only access your own resources',
          code: 'OWNERSHIP_REQUIRED'
        })
      }

      next()
    } catch (error) {
      console.error('Ownership check error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error during ownership verification',
        code: 'OWNERSHIP_CHECK_ERROR'
      })
    }
  }
}

// Middleware to check if user is verified
export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    })
  }

  // Get user verification status from database
  User.findById(req.user.userId)
    .select('isVerified')
    .then(user => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        })
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Email verification required',
          code: 'VERIFICATION_REQUIRED'
        })
      }

      next()
    })
    .catch(error => {
      console.error('Verification check error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error during verification check',
        code: 'VERIFICATION_CHECK_ERROR'
      })
    })
}

// Middleware to check if user has access to mandal
export const requireMandalAccess = (requiredRole = 'member') => {
  return async (req, res, next) => {
    try {
      const { mandalId } = req.params
      const { userId } = req.user

      if (!mandalId) {
        return res.status(400).json({
          success: false,
          message: 'Mandal ID is required',
          code: 'MANDAL_ID_REQUIRED'
        })
      }

      // Import Mandal model here to avoid circular dependencies
      const { default: Mandal } = await import('../models/Mandal.js')
      
      const mandal = await Mandal.findById(mandalId)
      if (!mandal) {
        return res.status(404).json({
          success: false,
          message: 'Mandal not found',
          code: 'MANDAL_NOT_FOUND'
        })
      }

      // Check if user is a member of the mandal
      const member = mandal.members.find(
        m => m.userId.toString() === userId.toString() && m.isActive
      )

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this mandal',
          code: 'NOT_MANDAL_MEMBER'
        })
      }

      // Define role hierarchy
      const roleHierarchy = {
        'member': 1,
        'volunteer': 2,
        'coordinator': 3,
        'secretary': 4,
        'treasurer': 4,
        'president': 5,
        'admin': 6
      }

      const requiredLevel = roleHierarchy[requiredRole] || 1
      const userLevel = roleHierarchy[member.role] || 1

      if (userLevel < requiredLevel) {
        return res.status(403).json({
          success: false,
          message: `${requiredRole} role or higher required`,
          code: 'INSUFFICIENT_MANDAL_PERMISSIONS',
          required: requiredRole,
          current: member.role
        })
      }

      // Add mandal and member info to request
      req.mandal = mandal
      req.mandalMember = member

      next()
    } catch (error) {
      console.error('Mandal access check error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error during mandal access verification',
        code: 'MANDAL_ACCESS_CHECK_ERROR'
      })
    }
  }
}

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return next() // Continue without authentication
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if (decoded.type === 'access') {
      const user = await User.findById(decoded.userId).select('-password -refreshTokens')
      
      if (user && user.isActive && !user.isLocked) {
        req.user = {
          userId: user._id,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        }
      }
    }

    next()
  } catch (error) {
    // Continue without authentication on token errors
    next()
  }
}

export default {
  authenticateToken,
  requireRole,
  requirePermission,
  requireOwnershipOrAdmin,
  requireVerification,
  requireMandalAccess,
  optionalAuth
}
