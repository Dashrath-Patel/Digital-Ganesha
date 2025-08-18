import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import TwoFactorAuthService from '../services/TwoFactorAuthService'
import TwoFactorAuthSetup from './TwoFactorAuthSetup'

const TwoFactorAuthManager = () => {
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [showDisable, setShowDisable] = useState(false)
  const [showRegenerateBackup, setShowRegenerateBackup] = useState(false)
  const [disableForm, setDisableForm] = useState({ password: '', token: '' })
  const [regenerateForm, setRegenerateForm] = useState({ password: '', token: '' })
  const [newBackupCodes, setNewBackupCodes] = useState(null)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStatus()
    }
  }, [user])

  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      const response = await TwoFactorAuthService.getStatus()
      setStatus(response)
    } catch (error) {
      console.error('Failed to fetch 2FA status:', error)
      showToast('Failed to load 2FA status', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetupComplete = () => {
    fetchStatus()
    showToast('2FA setup completed successfully!', 'success')
  }

  const handleDisable2FA = async (e) => {
    e.preventDefault()
    setError('')

    if (!disableForm.password || !disableForm.token) {
      setError('Password and 2FA token are required')
      return
    }

    try {
      await TwoFactorAuthService.disable(disableForm.password, disableForm.token)
      setShowDisable(false)
      setDisableForm({ password: '', token: '' })
      fetchStatus()
      showToast('2FA has been disabled', 'success')
    } catch (error) {
      setError(error.message)
      showToast(error.message, 'error')
    }
  }

  const handleRegenerateBackupCodes = async (e) => {
    e.preventDefault()
    setError('')

    if (!regenerateForm.password || !regenerateForm.token) {
      setError('Password and 2FA token are required')
      return
    }

    try {
      const response = await TwoFactorAuthService.regenerateBackupCodes(
        regenerateForm.password, 
        regenerateForm.token
      )
      setNewBackupCodes(response.backupCodes) // Now response has correct structure
      setRegenerateForm({ password: '', token: '' })
      showToast('New backup codes generated successfully!', 'success')
    } catch (error) {
      setError(error.message)
      showToast(error.message, 'error')
    }
  }

  const handleDownloadBackupCodes = () => {
    if (newBackupCodes) {
      TwoFactorAuthService.downloadBackupCodes(newBackupCodes, user.email)
      showToast('Backup codes downloaded', 'success')
    }
  }

  const handleCopyBackupCodes = async () => {
    if (newBackupCodes) {
      const success = await TwoFactorAuthService.copyBackupCodes(newBackupCodes)
      if (success) {
        showToast('Backup codes copied to clipboard', 'success')
      } else {
        showToast('Failed to copy backup codes', 'error')
      }
    }
  }

  if (user?.role !== 'admin') {
    return null
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
        <div className="flex items-center space-x-3">
          <div className="animate-spin text-2xl">🔄</div>
          <div>
            <h3 className="text-lg font-semibold text-golden">Loading 2FA Settings...</h3>
            <p className="text-golden-light text-sm">Please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🛡️</div>
            <div>
              <h3 className="text-xl font-semibold text-golden">Two-Factor Authentication</h3>
              <p className="text-golden-light text-sm">Enhanced security for your admin account</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status?.is2FAEnabled 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {status?.is2FAEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {!status?.is2FAEnabled ? (
          // 2FA Not Enabled
          <div className="space-y-4">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-300 font-semibold mb-2 flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                2FA Not Enabled
              </h4>
              <p className="text-amber-200 text-sm mb-4">
                For enhanced security, we strongly recommend enabling two-factor authentication on your admin account.
              </p>
              <ul className="text-amber-200 text-sm space-y-1">
                <li>• Protects against unauthorized access</li>
                <li>• Required for high-privilege operations</li>
                <li>• Uses industry-standard TOTP (Time-based One-Time Password)</li>
                <li>• Compatible with Google Authenticator, Authy, and other apps</li>
              </ul>
            </div>

            <button
              onClick={() => setShowSetup(true)}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Enable Two-Factor Authentication
            </button>
          </div>
        ) : (
          // 2FA Enabled
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                <span className="text-xl mr-2">✅</span>
                2FA is Active
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-200">
                    <strong>Enabled:</strong> {new Date(status.enabledAt).toLocaleDateString()}
                  </p>
                  <p className="text-green-200">
                    <strong>Last Used:</strong> {
                      status.lastUsed 
                        ? new Date(status.lastUsed).toLocaleDateString()
                        : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-green-200">
                    <strong>Backup Codes:</strong> {status.backupCodesCount} remaining
                  </p>
                  <p className="text-green-200">
                    <strong>Status:</strong> Fully Protected
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowRegenerateBackup(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm"
              >
                🔄 Regenerate Backup Codes
              </button>
              <button
                onClick={() => setShowDisable(true)}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm"
              >
                🚫 Disable 2FA
              </button>
            </div>

            {status.backupCodesCount < 3 && (
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-semibold mb-2 flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  Low Backup Codes
                </h4>
                <p className="text-amber-200 text-sm">
                  You have {status.backupCodesCount} backup codes remaining. 
                  Consider regenerating new codes to ensure account recovery options.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2FA Setup Modal */}
      <TwoFactorAuthSetup
        isOpen={showSetup}
        onClose={() => setShowSetup(false)}
        onComplete={handleSetupComplete}
      />

      {/* Disable 2FA Modal */}
      {showDisable && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl max-w-md w-full border border-golden/40 shadow-2xl">
            <div className="p-6 border-b border-golden/30">
              <h3 className="text-xl font-bold text-golden flex items-center">
                <span className="text-2xl mr-2">🚫</span>
                Disable Two-Factor Authentication
              </h3>
            </div>
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">
                  ⚠️ <strong>Warning:</strong> Disabling 2FA will reduce the security of your admin account. 
                  Make sure you understand the risks before proceeding.
                </p>
              </div>

              <form onSubmit={handleDisable2FA} className="space-y-4">
                <div>
                  <label className="block text-golden font-semibold mb-2">Current Password:</label>
                  <input
                    type="password"
                    value={disableForm.password}
                    onChange={(e) => setDisableForm({...disableForm, password: e.target.value})}
                    className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-golden font-semibold mb-2">2FA Code:</label>
                  <input
                    type="text"
                    value={disableForm.token}
                    onChange={(e) => setDisableForm({...disableForm, token: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 text-center font-mono"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisable(false)
                      setDisableForm({ password: '', token: '' })
                      setError('')
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Disable 2FA
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Backup Codes Modal */}
      {showRegenerateBackup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl max-w-md w-full border border-golden/40 shadow-2xl">
            <div className="p-6 border-b border-golden/30">
              <h3 className="text-xl font-bold text-golden flex items-center">
                <span className="text-2xl mr-2">🔄</span>
                Generate New Backup Codes
              </h3>
            </div>
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {!newBackupCodes ? (
                <>
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6">
                    <p className="text-amber-300 text-sm">
                      ⚠️ <strong>Important:</strong> Generating new backup codes will invalidate your current ones. 
                      Make sure to save the new codes securely.
                    </p>
                  </div>

                  <form onSubmit={handleRegenerateBackupCodes} className="space-y-4">
                    <div>
                      <label className="block text-golden font-semibold mb-2">Current Password:</label>
                      <input
                        type="password"
                        value={regenerateForm.password}
                        onChange={(e) => setRegenerateForm({...regenerateForm, password: e.target.value})}
                        className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-golden font-semibold mb-2">2FA Code:</label>
                      <input
                        type="text"
                        value={regenerateForm.token}
                        onChange={(e) => setRegenerateForm({...regenerateForm, token: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                        className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 text-center font-mono"
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRegenerateBackup(false)
                          setRegenerateForm({ password: '', token: '' })
                          setError('')
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Generate
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h4 className="text-lg font-semibold text-golden mb-2">New Backup Codes Generated!</h4>
                    <p className="text-golden-light text-sm">
                      Save these codes in a secure location. Your old backup codes are now invalid.
                    </p>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {newBackupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="bg-red-950/50 p-2 rounded text-center font-mono text-golden-light text-sm"
                        >
                          {code}
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleDownloadBackupCodes}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                      >
                        📁 Download
                      </button>
                      <button
                        onClick={handleCopyBackupCodes}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowRegenerateBackup(false)
                      setNewBackupCodes(null)
                      setError('')
                      fetchStatus()
                    }}
                    className="w-full bg-gradient-to-r from-golden to-golden-light text-red-950 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TwoFactorAuthManager
