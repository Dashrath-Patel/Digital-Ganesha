import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">🕉️</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Digital Ganesha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button / Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-2 hover:bg-orange-50 rounded-lg px-3 py-2 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.firstName || user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <button
                    onClick={() => {
                      setIsProfileOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 w-full hover:bg-orange-50 rounded-md transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-colors duration-200 font-medium mt-2 shadow-sm hover:shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
