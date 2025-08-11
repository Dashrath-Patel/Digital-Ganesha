import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and get profile from API
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const userProfile = await authAPI.getProfile()
          setUser(userProfile)
        } catch (error) {
          console.error('Failed to get user profile:', error)
          // Clear invalid tokens
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    // Listen for Google auth success events
    const handleGoogleAuthSuccess = (event) => {
      const userData = event.detail
      setUser(userData.user)
      localStorage.setItem('user', JSON.stringify(userData.user))
      localStorage.setItem('accessToken', userData.accessToken)
    }

    window.addEventListener('googleAuthSuccess', handleGoogleAuthSuccess)
    initializeAuth()

    return () => {
      window.removeEventListener('googleAuthSuccess', handleGoogleAuthSuccess)
    }
  }, [])

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const userData = await authAPI.login(email, password)
      setUser(userData)
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setIsLoading(true)
      const newUser = await authAPI.register(userData)
      setUser(newUser)
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(newUser))
      return newUser
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
    }
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem('user', JSON.stringify(updatedUserData))
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
