import express from 'express'
import User from '../models/User.js'
import TwoFactorAuthService from '../services/TwoFactorAuthService.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// Rate limiting for 2FA endpoints
const twoFALimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many 2FA attempts, please try again later.',
    code: '2FA_RATE_LIMIT_EXCEEDED'
  }
})

// Middleware to check admin role
const requireAdmin = requireRole(['admin'])

// @desc    Get basic 2FA info (for any authenticated user)
// @route   GET /api/2fa/info
// @access  Private
router.get('/info', authenticateToken, async (req, res) => {
  try {
    console.log('2FA info check - User ID:', req.user?.userId)
    console.log('2FA info check - User Role:', req.user?.role)
    
    const user = await User.findById(req.user.userId)
      .select('role email')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const canEnable2FA = user.role === 'admin'

    res.json({
      success: true,
      data: {
        userRole: user.role,
        canEnable2FA: canEnable2FA,
        email: user.email
      }
    })
  } catch (error) {
    console.error('2FA info check error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get 2FA info'
    })
  }
})

// @desc    Check if user can enable 2FA
// @route   GET /api/2fa/status
// @access  Private (Admin only)
router.get('/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('2FA status check - User ID:', req.user?.userId)
    console.log('2FA status check - User Role:', req.user?.role)
    
    const user = await User.findById(req.user.userId)
      .select('twoFactorAuth role email')

    if (!user) {
      console.log('2FA status check - User not found:', req.user.userId)
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const can2FA = TwoFactorAuthService.canEnable2FA(user)
    const is2FAEnabled = user.twoFactorAuth?.isEnabled || false
    const is2FARequired = TwoFactorAuthService.is2FARequired(user)

    console.log('2FA status check - Success:', {
      can2FA,
      is2FAEnabled,
      is2FARequired
    })

    res.json({
      success: true,
      data: {
        canEnable2FA: can2FA,
        is2FAEnabled: is2FAEnabled,
        is2FARequired: is2FARequired,
        enabledAt: user.twoFactorAuth?.enabledAt || null,
        lastUsed: user.twoFactorAuth?.lastUsed || null,
        backupCodesCount: user.twoFactorAuth?.backupCodes?.filter(code => !code.used).length || 0
      }
    })
  } catch (error) {
    console.error('2FA status check error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to check 2FA status'
    })
  }
})

// @desc    Generate 2FA setup data (QR code, secret, backup codes)
// @route   POST /api/2fa/setup
// @access  Private (Admin only)
router.post('/setup', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('twoFactorAuth role email firstName lastName')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user can enable 2FA
    if (!TwoFactorAuthService.canEnable2FA(user)) {
      return res.status(403).json({
        success: false,
        message: 'Only admin users can enable 2FA'
      })
    }

    // Check if 2FA is already enabled
    if (user.twoFactorAuth?.isEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled for this account'
      })
    }

    // Generate setup data
    const setupData = await TwoFactorAuthService.generateSetupData(
      user.email,
      'Digital Ganesha Admin'
    )

    // Store the secret temporarily (not enabled yet)
    user.twoFactorAuth = {
      isEnabled: false,
      secret: setupData.secret,
      backupCodes: setupData.hashedBackupCodes,
      enabledAt: null,
      lastUsed: null
    }

    await user.save()

    // Return setup data to frontend (don't include hashed backup codes)
    res.json({
      success: true,
      message: '2FA setup data generated. Please complete setup by verifying a token.',
      data: {
        qrCode: setupData.qrCode,
        manualEntryKey: setupData.manualEntryKey,
        backupCodes: TwoFactorAuthService.formatBackupCodes(setupData.backupCodes)
      }
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate 2FA setup data'
    })
  }
})

// @desc    Verify and enable 2FA
// @route   POST /api/2fa/verify-and-enable
// @access  Private (Admin only)
router.post('/verify-and-enable', twoFALimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { token } = req.body

    if (!token || token.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit token'
      })
    }

    const user = await User.findById(req.user.userId)
      .select('+twoFactorAuth.secret')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user has a secret (setup was initiated)
    if (!user.twoFactorAuth?.secret) {
      return res.status(400).json({
        success: false,
        message: 'Please initiate 2FA setup first'
      })
    }

    // Check if 2FA is already enabled
    if (user.twoFactorAuth.isEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled'
      })
    }

    // Verify the token
    const isValid = TwoFactorAuthService.verifyToken(token, user.twoFactorAuth.secret)

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token. Please check your authenticator app and try again.'
      })
    }

    // Enable 2FA
    user.twoFactorAuth.isEnabled = true
    user.twoFactorAuth.enabledAt = new Date()
    user.twoFactorAuth.lastUsed = new Date()

    await user.save()

    res.json({
      success: true,
      message: '2FA has been successfully enabled for your account!',
      data: {
        enabledAt: user.twoFactorAuth.enabledAt
      }
    })
  } catch (error) {
    console.error('2FA verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify and enable 2FA'
    })
  }
})

// @desc    Verify 2FA token during login
// @route   POST /api/2fa/verify
// @access  Private (Admin only)
router.post('/verify', twoFALimiter, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { token, isBackupCode = false } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      })
    }

    const user = await User.findById(req.user.userId)
      .select('+twoFactorAuth.secret +twoFactorAuth.backupCodes')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (!user.twoFactorAuth?.isEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled for this account'
      })
    }

    let isValid = false

    if (isBackupCode) {
      // Verify backup code
      const cleanedCode = TwoFactorAuthService.cleanBackupCode(token)
      const verificationResult = TwoFactorAuthService.verifyBackupCode(
        cleanedCode, 
        user.twoFactorAuth.backupCodes
      )

      if (verificationResult.isValid) {
        // Mark backup code as used
        user.twoFactorAuth.backupCodes[verificationResult.codeIndex].used = true
        user.twoFactorAuth.backupCodes[verificationResult.codeIndex].usedAt = new Date()
        user.twoFactorAuth.lastUsed = new Date()
        await user.save()
        isValid = true
      }
    } else {
      // Verify TOTP token
      if (token.length !== 6) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 6-digit token'
        })
      }

      isValid = TwoFactorAuthService.verifyToken(token, user.twoFactorAuth.secret)
      
      if (isValid) {
        user.twoFactorAuth.lastUsed = new Date()
        await user.save()
      }
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token or backup code'
      })
    }

    res.json({
      success: true,
      message: '2FA verification successful',
      data: {
        verifiedAt: new Date(),
        usedBackupCode: isBackupCode
      }
    })
  } catch (error) {
    console.error('2FA token verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA token'
    })
  }
})

// @desc    Disable 2FA
// @route   POST /api/2fa/disable
// @access  Private (Admin only)
router.post('/disable', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { password, token } = req.body

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required to disable 2FA'
      })
    }

    const user = await User.findById(req.user.userId)
      .select('+password +twoFactorAuth.secret')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      })
    }

    // If 2FA is enabled, require token verification
    if (user.twoFactorAuth?.isEnabled) {
      if (!token) {
        return res.status(400).json({
          success: false,
          message: '2FA token is required to disable 2FA'
        })
      }

      const isTokenValid = TwoFactorAuthService.verifyToken(token, user.twoFactorAuth.secret)
      if (!isTokenValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid 2FA token'
        })
      }
    }

    // Disable 2FA
    user.twoFactorAuth = {
      isEnabled: false,
      secret: null,
      backupCodes: [],
      enabledAt: null,
      lastUsed: null
    }

    await user.save()

    res.json({
      success: true,
      message: '2FA has been successfully disabled',
      data: {
        disabledAt: new Date()
      }
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA'
    })
  }
})

// @desc    Generate new backup codes
// @route   POST /api/2fa/backup-codes/regenerate
// @access  Private (Admin only)
router.post('/backup-codes/regenerate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { password, token } = req.body

    if (!password || !token) {
      return res.status(400).json({
        success: false,
        message: 'Password and 2FA token are required'
      })
    }

    const user = await User.findById(req.user.userId)
      .select('+password +twoFactorAuth.secret')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (!user.twoFactorAuth?.isEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled'
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      })
    }

    // Verify 2FA token
    const isTokenValid = TwoFactorAuthService.verifyToken(token, user.twoFactorAuth.secret)
    if (!isTokenValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token'
      })
    }

    // Generate new backup codes
    const newBackupCodes = TwoFactorAuthService.generateBackupCodes()
    const hashedBackupCodes = TwoFactorAuthService.hashBackupCodes(newBackupCodes)

    // Update user with new backup codes
    user.twoFactorAuth.backupCodes = hashedBackupCodes
    await user.save()

    res.json({
      success: true,
      message: 'New backup codes generated successfully',
      data: {
        backupCodes: TwoFactorAuthService.formatBackupCodes(newBackupCodes),
        generatedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Backup codes regeneration error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate new backup codes'
    })
  }
})

export default router
