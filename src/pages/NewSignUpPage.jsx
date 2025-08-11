import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleAuthService from '../services/GoogleAuthService'

const NewSignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if Google Auth is configured and initialize it
    const initGoogle = async () => {
      const configured = GoogleAuthService.isGoogleAuthConfigured()
      setIsGoogleConfigured(configured)
      
      if (configured) {
        try {
          await GoogleAuthService.initializeGoogleAuth()
        } catch (error) {
          console.error('Failed to initialize Google Auth:', error)
          setIsGoogleConfigured(false)
        }
      }
    }

    initGoogle()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (!agreeToTerms) {
      setError('Please agree to our Terms of use and Privacy Policy')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required')
      setIsLoading(false)
      return
    }

    try {
      await signup({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      })
      navigate('/')
      setFormData({ firstName: '', lastName: '', email: '', password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      if (!isGoogleConfigured) {
        setError('Google OAuth is not configured. Please use email signup.')
        return
      }

      await GoogleAuthService.signInWithGoogle()
      // The actual authentication will be handled by the callback in GoogleAuthService
    } catch (error) {
      console.error('Google signup error:', error)
      setError('Google signup failed. Please try again or use email signup.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Spiritual Ganesha Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Om Symbols */}
          <div className="absolute top-20 left-20 text-6xl text-white/20 animate-pulse">🕉️</div>
          <div className="absolute top-40 right-20 text-4xl text-white/15 animate-bounce">🕉️</div>
          <div className="absolute bottom-40 left-10 text-5xl text-white/10">🕉️</div>
          
          {/* Floating Diyas */}
          <div className="absolute top-60 left-40 text-3xl text-yellow-200/30 animate-pulse">🪔</div>
          <div className="absolute bottom-60 right-40 text-4xl text-yellow-200/20">🪔</div>
          
          {/* Floating Flowers */}
          <div className="absolute top-80 right-10 text-3xl text-pink-200/25">🌺</div>
          <div className="absolute bottom-20 left-32 text-3xl text-pink-200/20">🌺</div>
          
          {/* Sacred Geometry */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
            <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white animate-spin-slow"/>
            <circle cx="80" cy="80" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white animate-spin-reverse"/>
            <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white"/>
            <circle cx="30" cy="70" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white"/>
          </svg>
        </div>

        {/* Main Ganesha Illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Large Ganesha Icon */}
          <div className="mb-8 relative">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
              <span className="text-8xl">🐘</span>
            </div>
            {/* Decorative elements around Ganesha */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400/80 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl">🌸</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400/80 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">🪔</span>
            </div>
            <div className="absolute top-8 -left-8 w-10 h-10 bg-orange-300/80 rounded-full flex items-center justify-center">
              <span className="text-lg">🕉️</span>
            </div>
          </div>

          {/* Sanskrit Blessing */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">गणपति बप्पा मोरया</h1>
            <p className="text-xl mb-2">Welcome to Digital Ganesha</p>
            <p className="text-white/80 text-lg">श्री गणेशाय नमः</p>
          </div>

          {/* Sacred Mantra */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <p className="text-lg font-medium mb-2">
              "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ"
            </p>
            <p className="text-white/80 text-sm">
              Vakratunda Mahakaya Suryakoti Samaprabha
            </p>
            <p className="text-white/70 text-xs mt-2">
              May Lord Ganesha remove all obstacles from your path
            </p>
          </div>

          {/* Animated Lotus Petals */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🪷</span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🪷</span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🪷</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <div></div>
              <Link 
                to="/login" 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Log in
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-600">
              <Link to="/login" className="text-orange-600 hover:text-orange-700 underline">
                log in instead?
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your last name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
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
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                By creating an account, I agree to our{' '}
                <Link to="/terms" className="text-orange-600 hover:text-orange-700 underline">
                  Terms of use
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create an account'
              )}
            </button>
          </form>

          {/* Divider - Only show if Google is configured */}
          {isGoogleConfigured && (
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">OR</span>
                </div>
              </div>
            </div>
          )}

          {/* Google Sign Up - Only show if configured */}
          {isGoogleConfigured && (
            <>
              <div id="google-signin-button"></div>
              <button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewSignUpPage
