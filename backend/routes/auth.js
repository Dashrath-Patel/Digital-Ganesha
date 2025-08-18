import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { sendEmail } from '../utils/email.js'
import { authenticateToken } from '../middleware/auth.js'
import TwoFactorAuthService from '../services/TwoFactorAuthService.js'

const router = express.Router()

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // allow more login attempts
  message: {
    error: 'Too many login attempts, please try again later.',
    code: 'LOGIN_RATE_LIMIT_EXCEEDED'
  }
})

// Validation middleware
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('phone')
    .optional()
    .matches(/^[+]?[1-9][\d]{9,14}$/)
    .withMessage('Please provide a valid phone number')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  )
  
  return { accessToken, refreshToken }
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authLimiter, registerValidation, async (req, res) => {
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

    const { firstName, lastName, email, password, phone, dateOfBirth } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      verificationToken,
      isVerified: false
    })

    await user.save()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id)
    
    // Add refresh token to user
    await user.addRefreshToken(refreshToken)

    // Send verification email
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      await sendEmail({
        to: email,
        subject: 'Welcome to Ganesh Community - Verify Your Email',
        template: 'verification',
        context: {
          firstName,
          verificationUrl
        }
      })
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails
    }

    // Remove sensitive data from response
    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.verificationToken
    delete userResponse.refreshTokens

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken
        }
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginLimiter, loginValidation, async (req, res) => {
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

    const { email, password, twoFactorToken, isBackupCode = false, rememberMe = false } = req.body

    // Find user and check password
    const user = await User.findByCredentials(email, password)

    // Check if 2FA is required for this user (admin only)
    const requires2FA = TwoFactorAuthService.is2FARequired(user)

    if (requires2FA) {
      // 2FA is required, check if token is provided
      if (!twoFactorToken) {
        return res.status(200).json({
          success: false,
          requires2FA: true,
          message: '2FA verification required',
          data: {
            userId: user._id,
            email: user.email,
            requires2FA: true
          }
        })
      }

      // Verify 2FA token
      let is2FAValid = false

      if (isBackupCode) {
        // Verify backup code - need to get user with backup codes
        const userWithBackupCodes = await User.findById(user._id).select('+twoFactorAuth.backupCodes')
        const cleanedCode = TwoFactorAuthService.cleanBackupCode(twoFactorToken)
        const verificationResult = TwoFactorAuthService.verifyBackupCode(
          cleanedCode, 
          userWithBackupCodes.twoFactorAuth.backupCodes
        )

        if (verificationResult.isValid) {
          // Mark backup code as used
          userWithBackupCodes.twoFactorAuth.backupCodes[verificationResult.codeIndex].used = true
          userWithBackupCodes.twoFactorAuth.backupCodes[verificationResult.codeIndex].usedAt = new Date()
          userWithBackupCodes.twoFactorAuth.lastUsed = new Date()
          await userWithBackupCodes.save()
          is2FAValid = true
        }
      } else {
        // Verify TOTP token
        if (twoFactorToken.length !== 6) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid 6-digit 2FA token'
          })
        }

        // Get the secret for verification
        const userWithSecret = await User.findById(user._id).select('+twoFactorAuth.secret')
        is2FAValid = TwoFactorAuthService.verifyToken(twoFactorToken, userWithSecret.twoFactorAuth.secret)
        
        if (is2FAValid) {
          userWithSecret.twoFactorAuth.lastUsed = new Date()
          await userWithSecret.save()
        }
      }

      if (!is2FAValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid 2FA token or backup code',
          requires2FA: true
        })
      }
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id)
    
    // Add refresh token to user
    await user.addRefreshToken(refreshToken)

    // Remove sensitive data from response
    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.verificationToken
    delete userResponse.refreshTokens
    delete userResponse.passwordResetToken
    delete userResponse.passwordResetExpires
    delete userResponse.twoFactorAuth

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken
        },
        twoFactorVerified: requires2FA
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid login credentials'
    })
  }
})

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      })
    }

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId)
    if (!user || !user.refreshTokens.some(token => token.token === refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id)
    
    // Replace old refresh token with new one
    await user.removeRefreshToken(refreshToken)
    await user.addRefreshToken(newRefreshToken)

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      }
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    })
  }
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body
    const userId = req.user.userId

    const user = await User.findById(userId)
    if (user && refreshToken) {
      await user.removeRefreshToken(refreshToken)
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    })
  }
})

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      })
    }

    const user = await User.findOne({ verificationToken: token })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      })
    }

    // Update user verification status
    user.isVerified = true
    user.emailVerifiedAt = new Date()
    user.verificationToken = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Email verified successfully'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    })
  }
})

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal whether user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    user.passwordResetToken = resetToken
    user.passwordResetExpires = resetExpires
    await user.save()

    // Send reset email
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      await sendEmail({
        to: email,
        subject: 'Password Reset Request - Ganesh Community',
        template: 'passwordReset',
        context: {
          firstName: user.firstName,
          resetUrl
        }
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save()
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      })
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    })
  }
})

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      })
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      })
    }

    // Update password
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    
    // Clear all refresh tokens (force re-login)
    user.refreshTokens = []
    
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    })
  }
})

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.userId

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      })
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      })
    }

    const user = await User.findById(userId).select('+password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    })
  }
})

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('mandals.mandalId', 'name logo category')
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
    console.error('Get current user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    })
  }
})

export default router
