import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      navigate('/')
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Spiritual Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 text-6xl text-orange-500 animate-pulse">🕉️</div>
        <div className="absolute top-20 left-20 text-4xl text-red-500 animate-bounce">🪔</div>
        <div className="absolute bottom-20 right-20 text-5xl text-amber-500">🌺</div>
        <div className="absolute bottom-10 left-10 text-4xl text-orange-600">🙏</div>
        <div className="absolute top-1/2 right-1/4 text-3xl text-red-400">📿</div>
        <div className="absolute top-1/3 left-1/3 text-3xl text-orange-400">🔱</div>
        <div className="absolute top-3/4 left-1/2 text-2xl text-amber-600">🐚</div>
        <div className="absolute top-1/4 right-1/2 text-2xl text-red-600">🎺</div>
      </div>

      {/* Lotus Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <g className="text-orange-500">
            <path d="M50 20 C40 30, 40 40, 50 50 C60 40, 60 30, 50 20" fill="currentColor"/>
            <path d="M50 80 C40 70, 40 60, 50 50 C60 60, 60 70, 50 80" fill="currentColor"/>
            <path d="M20 50 C30 40, 40 40, 50 50 C40 60, 30 60, 20 50" fill="currentColor"/>
            <path d="M80 50 C70 40, 60 40, 50 50 C60 60, 70 60, 80 50" fill="currentColor"/>
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-lg border border-orange-100/50">
          <div className="p-10">
            {/* Header with Ganesha */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-white text-4xl">🐘</span>
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌺</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-400 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🪔</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent mb-2">
                श्री गणेशाय नमः
              </h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Join Our Spiritual Community</h2>
              <p className="text-gray-600">Begin your divine journey with Lord Ganesha's blessings</p>
              
              {/* Sanskrit Mantra */}
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <p className="text-sm text-orange-700 font-medium">
                  "गजाननं भूतगणादि सेवितं कपित्थ जम्बूफलसार भक्षितम्"
                </p>
                <p className="text-xs text-gray-600 mt-1">Gajananam Bhutaganaadi Sevitam</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">👤</span>
                  Full Name (नाम)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-orange-50/30"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">📧</span>
                  Email Address (ईमेल)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-orange-50/30"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">🔐</span>
                  Password (पासवर्ड)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-orange-50/30"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">🔒</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-orange-50/30"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 text-white py-4 px-4 rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-amber-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Seeking divine blessings...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🙏</span>
                    Join the Divine Community
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="border-t border-orange-200 flex-grow"></div>
                <span className="px-4 text-orange-600 text-sm">🕉️</span>
                <div className="border-t border-orange-200 flex-grow"></div>
              </div>
              
              <p className="text-gray-600">
                Already blessed with an account?{' '}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Footer Blessing */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <span className="mr-1">🪔</span>
                May Lord Ganesha remove all obstacles
                <span className="ml-1">🪔</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
