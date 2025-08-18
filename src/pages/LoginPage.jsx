import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Captcha from '../components/Captcha'
import TwoFactorLogin from '../components/TwoFactorLogin'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState('')
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [captchaError, setCaptchaError] = useState('')
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const captchaRef = useRef(null)
  const { login } = useAuth()
  const navigate = useNavigate()

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
      const userData = await login(formData.email, formData.password)
      
      // Check if 2FA is required
      if (userData && userData.requires2FA) {
        setRequiresTwoFactor(true)
        return
      }
      
      // Login successful
      navigate('/')
      setFormData({ email: '', password: '' })
      setCaptchaValue('')
      setIsCaptchaValid(false)
    } catch (err) {
      // Handle case where backend returns requires2FA in error response
      if (err.message.includes('2FA verification required') || err.message.includes('requires2FA')) {
        setRequiresTwoFactor(true)
        return
      }
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorComplete = (userData) => {
    // 2FA login successful
    navigate('/')
    setFormData({ email: '', password: '' })
    setCaptchaValue('')
    setIsCaptchaValid(false)
    setRequiresTwoFactor(false)
  }

  const handleTwoFactorCancel = () => {
    setRequiresTwoFactor(false)
    setError('')
    setIsLoading(false)
  }

  return (
    <div className="relative">
      <Header />
      
      <div className="relative overflow-hidden pt-16">
        {/* Background inherited from App.jsx for consistency */}

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative z-10">
                    <div className="bg-red-900/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-lg border border-yellow-500/30">
            <div className="p-8">
              {requiresTwoFactor ? (
                /* Two-Factor Authentication Form */
                <TwoFactorLogin
                  email={formData.email}
                  password={formData.password}
                  onComplete={handleTwoFactorComplete}
                  onCancel={handleTwoFactorCancel}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              ) : (
                /* Regular Login Form */
                <>
                  {/* Header Section */}
                  <div className="text-center mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <div></div>
                      <Link 
                        to="/signup" 
                        className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                      >
                        Sign Up
                      </Link>
                    </div>
                    
                    <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Welcome Back</h2>
                    <p className="text-yellow-200/80">May Lord Ganesha bless your spiritual journey</p>
                  </div>

                  {/* Ganesha Symbol */}
                  <div className="text-center mb-6">
                    <div className="inline-block text-4xl mb-2">🕉️</div>
                    <p className="text-xs text-yellow-200/60 mt-1">Vakratunda Mahakaya Suryakoti Samaprabha</p>
                  </div>

              {error && (
                <div className="bg-red-800/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center backdrop-blur-sm">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="flex text-sm font-medium text-yellow-300 mb-2 items-center">
                    <span className="mr-2">📧</span>
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
                    className="w-full px-4 py-3 bg-red-900/50 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-yellow-100 placeholder-yellow-300/50 backdrop-blur-sm transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="flex text-sm font-medium text-yellow-300 mb-2 items-center">
                    <span className="mr-2">🔐</span>
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
                    className="w-full px-4 py-3 bg-red-900/50 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-yellow-100 placeholder-yellow-300/50 backdrop-blur-sm transition-all"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Captcha Component */}
                <div>
                  <Captcha
                    ref={captchaRef}
                    onCaptchaChange={handleCaptchaChange}
                    onCaptchaValidate={handleCaptchaValidate}
                    error={captchaError}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-red-900 py-4 px-4 rounded-xl hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-300 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-900 mr-2"></div>
                      Blessing in progress...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🙏</span>
                      Receive Blessings & Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="border-t border-yellow-500/30 flex-grow"></div>
                  <span className="px-4 text-yellow-300 text-sm">🌺</span>
                  <div className="border-t border-yellow-500/30 flex-grow"></div>
                </div>
                
                <p className="text-yellow-200">
                  New to our spiritual community?{' '}
                  <Link
                    to="/signup"
                    className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors underline"
                  >
                    Join the divine journey
                  </Link>
                </p>
              </div>

              {/* Footer Blessing */}
              <div className="mt-6 text-center">
                <p className="text-xs text-yellow-200/60 flex items-center justify-center">
                  <span className="mr-1">🪔</span>
                  Blessed by Lord Ganesha
                  <span className="ml-1">🪔</span>
                </p>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default LoginPage
