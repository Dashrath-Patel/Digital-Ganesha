import { api } from './api.js'

class TwoFactorAuthService {
  /**
   * Check 2FA status for the current user
   * @returns {Promise<Object>} 2FA status information
   */
  static async getStatus() {
    try {
      const response = await api.get('/2fa/status')
      // Check if response.data.data exists, otherwise use response.data
      const statusData = response.data.data || response.data
      return statusData
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get 2FA status')
    }
  }

  /**
   * Initialize 2FA setup - generates QR code and backup codes
   * @returns {Promise<Object>} Setup data including QR code and backup codes
   */
  static async setupTwoFactorAuth() {
    try {
      const response = await api.post('/2fa/setup')
      return response.data.data || response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to setup 2FA')
    }
  }

  /**
   * Verify and enable 2FA
   * @param {string} token - 6-digit TOTP token
   * @returns {Promise<Object>} Verification result
   */
  static async verifyAndEnable(token) {
    try {
      const response = await api.post('/2fa/verify-and-enable', { token })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify and enable 2FA')
    }
  }

  /**
   * Verify 2FA token during login or other operations
   * @param {string} token - 6-digit TOTP token or backup code
   * @param {boolean} isBackupCode - Whether the token is a backup code
   * @returns {Promise<Object>} Verification result
   */
  static async verifyToken(token, isBackupCode = false) {
    try {
      const response = await api.post('/2fa/verify', { 
        token, 
        isBackupCode 
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify 2FA token')
    }
  }

  /**
   * Disable 2FA
   * @param {string} password - Current password
   * @param {string} token - 2FA token
   * @returns {Promise<Object>} Disable result
   */
  static async disable(password, token) {
    try {
      const response = await api.post('/2fa/disable', { 
        password, 
        token 
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to disable 2FA')
    }
  }

  /**
   * Regenerate backup codes
   * @param {string} password - Current password
   * @param {string} token - 2FA token
   * @returns {Promise<Object>} New backup codes
   */
  static async regenerateBackupCodes(password, token) {
    try {
      const response = await api.post('/2fa/backup-codes/regenerate', { 
        password, 
        token 
      })
      return response.data.data // Return the nested data object
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to regenerate backup codes')
    }
  }

  /**
   * Enhanced login with 2FA support
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} twoFactorToken - Optional 2FA token
   * @param {boolean} isBackupCode - Whether using backup code
   * @param {boolean} rememberMe - Remember user preference
   * @returns {Promise<Object>} Login result
   */
  static async loginWithTwoFactor(email, password, twoFactorToken = null, isBackupCode = false, rememberMe = false) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        twoFactorToken,
        isBackupCode,
        rememberMe
      })
      return response.data
    } catch (error) {
      if (error.response?.data?.requires2FA) {
        // Return the 2FA requirement response
        return error.response.data
      }
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  /**
   * Validate 2FA token format
   * @param {string} token - Token to validate
   * @param {boolean} isBackupCode - Whether it's a backup code
   * @returns {Object} Validation result
   */
  static validateTokenFormat(token, isBackupCode = false) {
    if (!token) {
      return { isValid: false, message: 'Token is required' }
    }

    if (isBackupCode) {
      // Backup codes are 8 characters (XXXX-XXXX format or XXXXXXXX)
      const cleanToken = token.replace(/[-\s]/g, '')
      if (!/^[A-F0-9]{8}$/i.test(cleanToken)) {
        return { 
          isValid: false, 
          message: 'Backup code must be 8 characters (letters and numbers)' 
        }
      }
    } else {
      // TOTP tokens are 6 digits
      if (!/^\d{6}$/.test(token)) {
        return { 
          isValid: false, 
          message: '2FA token must be exactly 6 digits' 
        }
      }
    }

    return { isValid: true, message: 'Token format is valid' }
  }

  /**
   * Format backup code for display
   * @param {string} code - Raw backup code
   * @returns {string} Formatted backup code
   */
  static formatBackupCode(code) {
    const cleanCode = code.replace(/[-\s]/g, '').toUpperCase()
    return cleanCode.slice(0, 4) + '-' + cleanCode.slice(4)
  }

  /**
   * Clean backup code for submission
   * @param {string} code - Formatted backup code
   * @returns {string} Clean backup code
   */
  static cleanBackupCode(code) {
    return code.replace(/[-\s]/g, '').toUpperCase()
  }

  /**
   * Check if user needs 2FA setup
   * @param {Object} user - User object
   * @returns {boolean} Whether user needs 2FA setup
   */
  static shouldSetup2FA(user) {
    return user?.role === 'admin' && (!user?.twoFactorAuth?.isEnabled)
  }

  /**
   * Generate download content for backup codes
   * @param {Array<string>} backupCodes - Array of backup codes
   * @param {string} userEmail - User's email
   * @returns {string} Download content
   */
  static generateBackupCodesDownload(backupCodes, userEmail) {
    const timestamp = new Date().toLocaleString()
    const content = `Digital Ganesha - Two-Factor Authentication Backup Codes

Generated for: ${userEmail}
Generated on: ${timestamp}

IMPORTANT: Save these backup codes in a safe place. Each code can only be used once.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Instructions:
- Keep these codes secure and private
- Use them only when you cannot access your authenticator app
- Each code can only be used once
- Generate new codes if you run out

For security questions, contact: support@digitalganesha.com`

    return content
  }

  /**
   * Download backup codes as text file
   * @param {Array<string>} backupCodes - Array of backup codes
   * @param {string} userEmail - User's email
   */
  static downloadBackupCodes(backupCodes, userEmail) {
    const content = this.generateBackupCodesDownload(backupCodes, userEmail)
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `digital-ganesha-backup-codes-${new Date().toISOString().split('T')[0]}.txt`
    
    document.body.appendChild(a)
    a.click()
    
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  /**
   * Copy backup codes to clipboard
   * @param {Array<string>} backupCodes - Array of backup codes
   * @returns {Promise<boolean>} Whether copy was successful
   */
  static async copyBackupCodes(backupCodes) {
    try {
      const codesText = backupCodes.join('\n')
      await navigator.clipboard.writeText(codesText)
      return true
    } catch (error) {
      console.error('Failed to copy backup codes:', error)
      return false
    }
  }
}

export default TwoFactorAuthService
