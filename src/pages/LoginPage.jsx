import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
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

    try {
      await login(formData.email, formData.password)
      navigate('/')
      setFormData({ email: '', password: '' })
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
        <div className="absolute top-10 left-10 text-6xl text-orange-500 animate-pulse">🕉️</div>
        <div className="absolute top-20 right-20 text-4xl text-red-500 animate-bounce">🪔</div>
        <div className="absolute bottom-20 left-20 text-5xl text-amber-500">🌺</div>
        <div className="absolute bottom-10 right-10 text-4xl text-orange-600">🙏</div>
        <div className="absolute top-1/2 left-1/4 text-3xl text-red-400">📿</div>
        <div className="absolute top-1/3 right-1/3 text-3xl text-orange-400">🔱</div>
      </div>

      {/* Mandala Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-red-500"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-amber-500"/>
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-600"/>
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
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🕉️</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent mb-2">
                गणपति बप्पा मोरया
              </h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome Back</h2>
              <p className="text-gray-600">May Lord Ganesha bless your spiritual journey</p>
              
              {/* Sanskrit Mantra */}
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <p className="text-sm text-orange-700 font-medium">
                  "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ"
                </p>
                <p className="text-xs text-gray-600 mt-1">Vakratunda Mahakaya Suryakoti Samaprabha</p>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-orange-50/30"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                  className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gradient-to-r from-white to-orange-50/30"
                  placeholder="Enter your password"
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
                <div className="border-t border-orange-200 flex-grow"></div>
                <span className="px-4 text-orange-600 text-sm">🌺</span>
                <div className="border-t border-orange-200 flex-grow"></div>
              </div>
              
              <p className="text-gray-600">
                New to our spiritual community?{' '}
                <Link
                  to="/signup"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Join the divine journey
                </Link>
              </p>
            </div>

            {/* Footer Blessing */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <span className="mr-1">🪔</span>
                Blessed by Lord Ganesha
                <span className="ml-1">🪔</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
