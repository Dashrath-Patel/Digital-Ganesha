import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Captcha from './Captcha'

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
      await login(formData.email, formData.password)
      onClose()
      setFormData({ email: '', password: '' })
      setCaptchaValue('')
      setIsCaptchaValid(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <button
              onClick={onClose}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <Captcha
              ref={captchaRef}
              onCaptchaChange={handleCaptchaChange}
              onCaptchaValidate={handleCaptchaValidate}
              error={captchaError}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
