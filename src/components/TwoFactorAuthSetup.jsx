import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import TwoFactorAuthService from '../services/TwoFactorAuthService'

const TwoFactorAuthSetup = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1) // 1: Setup, 2: Verify, 3: Backup Codes
  const [setupData, setSetupData] = useState(null)
  const [verificationToken, setVerificationToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [backupCodesSaved, setBackupCodesSaved] = useState(false)
  
  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && step === 1) {
      initializeSetup()
    }
  }, [isOpen, step])

  const initializeSetup = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await TwoFactorAuthService.setupTwoFactorAuth()
      setSetupData(response)
      setStep(2)
    } catch (error) {
      console.error('2FA Setup Error:', error) // Debug log
      setError(error.message)
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyToken = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await TwoFactorAuthService.verifyAndEnable(verificationToken)
      showToast('2FA has been successfully enabled!', 'success')
      setStep(3)
    } catch (error) {
      setError(error.message)
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadBackupCodes = () => {
    if (setupData?.backupCodes) {
      TwoFactorAuthService.downloadBackupCodes(setupData.backupCodes, user.email)
      setBackupCodesSaved(true)
      showToast('Backup codes downloaded successfully', 'success')
    }
  }

  const handleCopyBackupCodes = async () => {
    if (setupData?.backupCodes) {
      const success = await TwoFactorAuthService.copyBackupCodes(setupData.backupCodes)
      if (success) {
        setBackupCodesSaved(true)
        showToast('Backup codes copied to clipboard', 'success')
      } else {
        showToast('Failed to copy backup codes', 'error')
      }
    }
  }

  const handleComplete = () => {
    if (backupCodesSaved) {
      onComplete?.()
      onClose()
      setStep(1)
      setSetupData(null)
      setVerificationToken('')
      setBackupCodesSaved(false)
    } else {
      setError('Please save your backup codes before continuing')
    }
  }

  const handleClose = () => {
    if (step === 3 && !backupCodesSaved) {
      if (!window.confirm('Are you sure you want to close without saving your backup codes? You won\'t be able to access them again.')) {
        return
      }
    }
    onClose()
    setStep(1)
    setSetupData(null)
    setVerificationToken('')
    setError('')
    setBackupCodesSaved(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-golden/40 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-red-950/90 to-amber-900/90 backdrop-blur-sm p-6 border-b border-golden/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🛡️</div>
              <div>
                <h2 className="text-2xl font-bold text-golden">
                  {step === 1 ? 'Setting up 2FA...' : 
                   step === 2 ? 'Verify Your Authenticator' : 
                   'Save Your Backup Codes'}
                </h2>
                <p className="text-golden-light text-sm">
                  Step {step} of 3 - Enhanced security for admin accounts
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-golden hover:text-golden-light text-2xl transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Loading Setup */}
          {step === 1 && (
            <div className="text-center py-8">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-golden mb-2">Initializing 2FA Setup</h3>
              <p className="text-golden-light">Please wait while we generate your security keys...</p>
            </div>
          )}

          {/* Step 2: QR Code & Verification */}
          {step === 2 && setupData && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-golden mb-4">Scan QR Code</h3>
                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                  {setupData.qrCode ? (
                    <img 
                      src={setupData.qrCode} 
                      alt="2FA QR Code" 
                      className="w-48 h-48"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">⚠️</div>
                        <div className="text-sm">QR Code not available</div>
                        <div className="text-xs">Use manual entry below</div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-golden-light text-sm mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>

              {/* Manual Entry Option */}
              <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
                <h4 className="text-golden font-semibold mb-2">Can't scan? Enter manually:</h4>
                <div className="bg-black/30 p-3 rounded font-mono text-sm text-golden-light break-all">
                  {setupData.manualEntryKey}
                </div>
              </div>

              {/* Verification Input */}
              <div>
                <label className="block text-golden font-semibold mb-2">
                  Enter 6-digit code from your authenticator app:
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={verificationToken}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setVerificationToken(value)
                      setError('')
                    }}
                    placeholder="123456"
                    className="flex-1 px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50 text-center text-xl font-mono"
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyToken}
                    disabled={isLoading || verificationToken.length !== 6}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                <p className="text-golden-light text-xs mt-2">
                  The code refreshes every 30 seconds
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Backup Codes */}
          {step === 3 && setupData && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-golden mb-2">2FA Successfully Enabled!</h3>
                <p className="text-golden-light">
                  Save these backup codes in a secure location. You can use them to access your account if you lose your phone.
                </p>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-semibold mb-3 flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  Important: Save Your Backup Codes
                </h4>
                <ul className="text-amber-200 text-sm space-y-1">
                  <li>• Each code can only be used once</li>
                  <li>• Keep them in a safe, secure location</li>
                  <li>• You won't be able to see them again</li>
                  <li>• Use them if you lose access to your authenticator app</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {setupData.backupCodes.map((code, index) => (
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
                    📁 Download as File
                  </button>
                  <button
                    onClick={handleCopyBackupCodes}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              </div>

              {backupCodesSaved && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-300 text-sm flex items-center">
                    <span className="text-lg mr-2">✅</span>
                    Great! You can now complete the setup.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleComplete}
                  disabled={!backupCodesSaved}
                  className="flex-1 bg-gradient-to-r from-golden to-golden-light disabled:from-gray-600 disabled:to-gray-500 text-red-950 disabled:text-gray-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TwoFactorAuthSetup
