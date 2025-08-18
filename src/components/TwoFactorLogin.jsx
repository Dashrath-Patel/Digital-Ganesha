import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const TwoFactorLogin = ({ 
  email, 
  password, 
  onComplete, 
  onCancel, 
  isLoading, 
  setIsLoading, 
  setError 
}) => {
  const [twoFactorToken, setTwoFactorToken] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [backupCode, setBackupCode] = useState('')
  const { login } = useAuth()

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let token = useBackupCode ? backupCode.replace(/\s/g, '') : twoFactorToken
      
      if (!useBackupCode && (!token || token.length !== 6)) {
        setError('Please enter a valid 6-digit code')
        return
      }

      if (useBackupCode && (!token || token.length !== 8)) {
        setError('Please enter a valid 8-character backup code')
        return
      }

      const userData = await login(email, password, token, useBackupCode)
      onComplete(userData)
    } catch (err) {
      console.error('2FA login error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setTwoFactorToken(value)
    }
  }

  const handleBackupCodeChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '') // Allow alphanumeric
    if (value.length <= 8) {
      setBackupCode(value)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-xl font-semibold text-golden mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-golden-light text-sm">
          Please enter your authentication code to continue
        </p>
      </div>

      {/* Toggle between TOTP and Backup Code */}
      <div className="flex justify-center">
        <div className="bg-red-800/30 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setUseBackupCode(false)
              setTwoFactorToken('')
              setBackupCode('')
              setError('')
            }}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              !useBackupCode 
                ? 'bg-golden text-red-900' 
                : 'text-golden-light hover:text-golden'
            }`}
          >
            Authenticator App
          </button>
          <button
            type="button"
            onClick={() => {
              setUseBackupCode(true)
              setTwoFactorToken('')
              setBackupCode('')
              setError('')
            }}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              useBackupCode 
                ? 'bg-golden text-red-900' 
                : 'text-golden-light hover:text-golden'
            }`}
          >
            Backup Code
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
        {!useBackupCode ? (
          /* Authenticator App Code Input */
          <div>
            <label 
              htmlFor="twoFactorToken" 
              className="block text-golden-light text-sm font-medium mb-2"
            >
              6-Digit Code from Authenticator App
            </label>
            <input
              type="text"
              id="twoFactorToken"
              value={twoFactorToken}
              onChange={handleTokenChange}
              placeholder="000000"
              className="w-full px-4 py-3 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 text-center text-2xl tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              required
            />
            <p className="text-golden-light text-xs mt-1">
              Enter the 6-digit code from Google Authenticator, Authy, or similar app
            </p>
          </div>
        ) : (
          /* Backup Code Input */
          <div>
            <label 
              htmlFor="backupCode" 
              className="block text-golden-light text-sm font-medium mb-2"
            >
              8-Character Backup Code
            </label>
            <input
              type="text"
              id="backupCode"
              value={backupCode}
              onChange={handleBackupCodeChange}
              placeholder="ABCD1234"
              className="w-full px-4 py-3 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 text-center text-xl tracking-widest uppercase"
              maxLength={8}
              autoComplete="one-time-code"
              required
            />
            <p className="text-golden-light text-xs mt-1">
              Enter one of your 8-character backup codes (this will be consumed after use)
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-red-600/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 py-3 px-4 rounded-lg font-medium transition-colors backdrop-blur-sm"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || (!useBackupCode && twoFactorToken.length !== 6) || (useBackupCode && backupCode.length !== 8)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-red-900 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-900"></div>
                <span className="ml-2">Verifying...</span>
              </div>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-golden-light text-xs">
          Lost your device? Use a backup code to log in and then reconfigure 2FA in settings.
        </p>
      </div>
    </div>
  )
}

export default TwoFactorLogin
