import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import crypto from 'crypto'

class TwoFactorAuthService {
  /**
   * Generate a new TOTP secret for a user
   * @param {string} userEmail - User's email address
   * @param {string} appName - Application name
   * @returns {Object} Secret and QR code data URL
   */
  static generateSecret(userEmail, appName = 'Digital Ganesha Admin') {
    const secret = speakeasy.generateSecret({
      name: userEmail,
      issuer: appName,
      length: 32
    })

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
      manual_entry_key: secret.base32
    }
  }

  /**
   * Generate QR code for TOTP setup
   * @param {string} otpauth_url - The TOTP URL
   * @returns {Promise<string>} QR code data URL
   */
  static async generateQRCode(otpauth_url) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauth_url)
      return qrCodeDataUrl
    } catch (error) {
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Verify a TOTP token
   * @param {string} token - 6-digit TOTP token
   * @param {string} secret - User's TOTP secret
   * @param {number} window - Time window for verification (default: 1)
   * @returns {boolean} Whether token is valid
   */
  static verifyToken(token, secret, window = 1) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: window
    })
  }

  /**
   * Generate backup codes for 2FA recovery
   * @returns {Array<string>} Array of 10 backup codes
   */
  static generateBackupCodes() {
    const backupCodes = []
    
    for (let i = 0; i < 10; i++) {
      // Generate 12-character code in format XXXXXXXX-XXXX
      const part1 = crypto.randomBytes(4).toString('hex').toUpperCase()
      const part2 = crypto.randomBytes(2).toString('hex').toUpperCase()
      const code = `${part1}-${part2}`
      backupCodes.push(code)
    }
    
    return backupCodes
  }

  /**
   * Hash backup codes for storage
   * @param {Array<string>} codes - Array of backup codes
   * @returns {Array<Object>} Array of hashed backup code objects
   */
  static hashBackupCodes(codes) {
    return codes.map(code => ({
      code: crypto.createHash('sha256').update(code).digest('hex'),
      used: false,
      usedAt: null
    }))
  }

  /**
   * Verify a backup code
   * @param {string} inputCode - Input backup code
   * @param {Array<Object>} storedCodes - Array of stored backup code objects
   * @returns {Object} Verification result
   */
  static verifyBackupCode(inputCode, storedCodes) {
    const hashedInput = crypto.createHash('sha256').update(inputCode.toUpperCase()).digest('hex')
    
    const codeIndex = storedCodes.findIndex(codeObj => 
      codeObj.code === hashedInput && !codeObj.used
    )
    
    if (codeIndex !== -1) {
      return {
        isValid: true,
        codeIndex: codeIndex
      }
    }
    
    return {
      isValid: false,
      codeIndex: -1
    }
  }

  /**
   * Generate setup data for 2FA
   * @param {string} userEmail - User's email
   * @param {string} appName - Application name
   * @returns {Promise<Object>} Setup data including secret, QR code, and backup codes
   */
  static async generateSetupData(userEmail, appName = 'Digital Ganesha Admin') {
    const secretData = this.generateSecret(userEmail, appName)
    const qrCodeDataUrl = await this.generateQRCode(secretData.otpauth_url)
    const backupCodes = this.generateBackupCodes()
    
    return {
      secret: secretData.secret,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secretData.manual_entry_key,
      backupCodes: backupCodes,
      hashedBackupCodes: this.hashBackupCodes(backupCodes)
    }
  }

  /**
   * Validate if 2FA is required for a user
   * @param {Object} user - User object
   * @returns {boolean} Whether 2FA is required
   */
  static is2FARequired(user) {
    return user.role === 'admin' && user.twoFactorAuth && user.twoFactorAuth.isEnabled
  }

  /**
   * Check if user can enable 2FA
   * @param {Object} user - User object
   * @returns {boolean} Whether user can enable 2FA
   */
  static canEnable2FA(user) {
    return user.role === 'admin'
  }

  /**
   * Get current TOTP token for testing purposes
   * @param {string} secret - TOTP secret
   * @returns {string} Current TOTP token
   */
  static getCurrentToken(secret) {
    return speakeasy.totp({
      secret: secret,
      encoding: 'base32'
    })
  }

  /**
   * Format backup codes for display
   * @param {Array<string>} codes - Raw backup codes
   * @returns {Array<string>} Formatted backup codes
   */
  static formatBackupCodes(codes) {
    return codes.map(code => {
      // Format as XXXX-XXXX
      return code.slice(0, 4) + '-' + code.slice(4)
    })
  }

  /**
   * Clean backup code input (remove formatting)
   * @param {string} code - Input backup code
   * @returns {string} Clean backup code
   */
  static cleanBackupCode(code) {
    return code.replace(/[-\s]/g, '').toUpperCase()
  }
}

export default TwoFactorAuthService
