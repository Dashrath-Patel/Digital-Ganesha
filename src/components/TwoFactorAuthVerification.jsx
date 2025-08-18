import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import TwoFactorAuthService from '../services/TwoFactorAuthService'

const TwoFactorAuthVerification = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  userEmail,
  isLoading = false 
}) => {
  const [token, setToken] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [error, setError] = useState('')
  
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate token format
    const validation = TwoFactorAuthService.validateTokenFormat(token, useBackupCode)
    if (!validation.isValid) {
      setError(validation.message)
      return
    }

    try {
      await onVerify(token, useBackupCode)
    } catch (error) {
      setError(error.message)
      showToast(error.message, 'error')
    }
  }

  const handleTokenChange = (e) => {
    let value = e.target.value

    if (useBackupCode) {
      // For backup codes, allow letters, numbers, and hyphens
      value = value.replace(/[^A-Fa-f0-9\-]/g, '').toUpperCase()
      if (value.length <= 9) { // XXXX-XXXX format
        setToken(value)
      }
    } else {
      // For TOTP, only allow numbers
      value = value.replace(/\D/g, '').slice(0, 6)
      setToken(value)
    }
    
    setError('')
  }

  const handleToggleBackupCode = () => {
    setUseBackupCode(!useBackupCode)
    setToken('')
    setError('')
  }

  const handleClose = () => {
    if (isLoading) return
    setToken('')
    setError('')
    setUseBackupCode(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl max-w-md w-full border border-golden/40 shadow-2xl">
        <div className="p-6 border-b border-golden/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔐</div>
              <div>
                <h2 className="text-xl font-bold text-golden">
                  Two-Factor Authentication
                </h2>
                <p className="text-golden-light text-sm">
                  {userEmail}
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={handleClose}
                className="text-golden hover:text-golden-light text-xl transition-colors duration-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-golden font-semibold mb-2">
                {useBackupCode ? 'Enter backup code:' : 'Enter authenticator code:'}
              </label>
              <input
                type="text"
                value={token}
                onChange={handleTokenChange}
                placeholder={useBackupCode ? "XXXX-XXXX" : "123456"}
                className={`w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 text-center text-xl font-mono ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
                autoComplete="off"
                autoFocus
              />
              <p className="text-golden-light text-xs mt-1">
                {useBackupCode 
                  ? 'Use one of your 8-character backup codes' 
                  : 'Enter the 6-digit code from your authenticator app'
                }
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !token || (useBackupCode ? token.replace('-', '').length !== 8 : token.length !== 6)}
              className="w-full bg-gradient-to-r from-golden to-golden-light disabled:from-gray-600 disabled:to-gray-500 text-red-950 disabled:text-gray-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Verify & Login'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-golden/20">
            <button
              onClick={handleToggleBackupCode}
              disabled={isLoading}
              className="text-golden-light hover:text-golden text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {useBackupCode 
                ? '← Back to authenticator code' 
                : 'Use backup code instead'
              }
            </button>
          </div>

          {!useBackupCode && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-xs">
                💡 <strong>Tip:</strong> If you can't access your authenticator app, you can use a backup code instead.
              </p>
            </div>
          )}

          {useBackupCode && (
            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <p className="text-amber-300 text-xs">
                ⚠️ <strong>Important:</strong> Each backup code can only be used once. Make sure to save new backup codes after using this one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TwoFactorAuthVerification
