import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Captcha from './Captcha'
import TwoFactorAuthVerification from './TwoFactorAuthVerification'
import TwoFactorAuthService from '../services/TwoFactorAuthService'

const Login = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState('')
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [captchaError, setCaptchaError] = useState('')
  
  // 2FA related state
  const [requires2FA, setRequires2FA] = useState(false)
  const [show2FAVerification, setShow2FAVerification] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState(null)
  
  const captchaRef = useRef(null)
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value)
    setCaptchaError('')
  }

  const handleCaptchaValidate = (isValid) => {
    setIsCaptchaValid(isValid)
    // Don't show error while typing, only on submit
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setCaptchaError('')

    // Validate captcha on submit
    const isValidCaptcha = captchaRef.current && captchaRef.current.validateCaptcha()
    
    if (!isValidCaptcha || captchaValue.length !== 5) {
      setCaptchaError('Invalid captcha')
      setIsLoading(false)
      // Auto-refresh captcha after showing error
      setTimeout(() => {
        if (captchaRef.current) {
          captchaRef.current.refreshCaptcha()
        }
      }, 1500)
      return
    }

    try {
      // Use enhanced login with 2FA support
      const response = await TwoFactorAuthService.loginWithTwoFactor(
        formData.email, 
        formData.password
      )
      
      if (response.requires2FA) {
        // 2FA is required, show verification modal
        setRequires2FA(true)
        setShow2FAVerification(true)
        setLoginCredentials({ email: formData.email, password: formData.password })
      } else {
        // Normal login successful
        await login(formData.email, formData.password)
        onClose()
        resetForm()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAVerification = async (token, isBackupCode = false) => {
    if (!loginCredentials) return
    
    setIsLoading(true)
    setError('')

    try {
      const response = await TwoFactorAuthService.loginWithTwoFactor(
        loginCredentials.email,
        loginCredentials.password,
        token,
        isBackupCode
      )

      if (response.success) {
        // Store tokens and user data manually since we bypassed normal login flow
        localStorage.setItem('accessToken', response.data.tokens.accessToken)
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Trigger auth context update
        await login(loginCredentials.email, loginCredentials.password, token, isBackupCode)
        
        setShow2FAVerification(false)
        onClose()
        resetForm()
      } else {
        throw new Error(response.message || '2FA verification failed')
      }
    } catch (error) {
      throw error // Let the TwoFactorAuthVerification component handle the error
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ email: '', password: '' })
    setCaptchaValue('')
    setIsCaptchaValid(false)
    setRequires2FA(false)
    setShow2FAVerification(false)
    setLoginCredentials(null)
    setError('')
    setCaptchaError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {requires2FA && (
              <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🔐</span>
                  <span className="text-sm">Two-factor authentication required</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={requires2FA}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    requires2FA ? 'bg-gray-100 opacity-60' : ''
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  disabled={requires2FA}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    requires2FA ? 'bg-gray-100 opacity-60' : ''
                  }`}
                  placeholder="Enter your password"
                />
              </div>

              {!requires2FA && (
                <Captcha
                  ref={captchaRef}
                  onCaptchaChange={handleCaptchaChange}
                  onCaptchaValidate={handleCaptchaValidate}
                  error={captchaError}
                />
              )}

              <button
                type="submit"
                disabled={isLoading || requires2FA}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : requires2FA ? '2FA Required' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  disabled={requires2FA}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      <TwoFactorAuthVerification
        isOpen={show2FAVerification}
        onClose={() => {
          setShow2FAVerification(false)
          setRequires2FA(false)
          setLoginCredentials(null)
        }}
        onVerify={handle2FAVerification}
        userEmail={loginCredentials?.email}
        isLoading={isLoading}
      />
    </>
  )
}

export default Login
