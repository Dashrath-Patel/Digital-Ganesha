/**
 * Authentication service for user management
 * Handles login, registration, token management, and user profile
 */

import { ApiService } from './ApiService.js'

class AuthServiceClass {
  constructor() {
    this.endpoints = {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      verifyEmail: '/auth/verify-email'
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await ApiService.post(this.endpoints.login, credentials)
      
      if (response.token) {
        ApiService.setAuthToken(response.token)
        
        // Store user data
        if (response.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user))
        }
        
        // Dispatch login event
        window.dispatchEvent(new CustomEvent('auth:login', { 
          detail: response.user 
        }))
        
        return response
      }
      
      throw new Error('Invalid login response')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await ApiService.post(this.endpoints.register, userData)
      
      // If registration includes immediate login
      if (response.token) {
        ApiService.setAuthToken(response.token)
        localStorage.setItem('user_data', JSON.stringify(response.user))
        
        window.dispatchEvent(new CustomEvent('auth:login', { 
          detail: response.user 
        }))
      }
      
      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout endpoint if token exists
      if (this.isAuthenticated()) {
        await ApiService.post(this.endpoints.logout)
      }
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API fails
    } finally {
      // Clear local storage
      ApiService.removeAuthToken()
      localStorage.removeItem('user_data')
      
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await ApiService.get(this.endpoints.profile)
      
      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(response))
      
      return response
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await ApiService.put(this.endpoints.profile, profileData)
      
      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(response))
      
      // Dispatch profile update event
      window.dispatchEvent(new CustomEvent('auth:profile-updated', { 
        detail: response 
      }))
      
      return response
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // Refresh authentication token
  async refreshToken() {
    try {
      const response = await ApiService.post(this.endpoints.refresh)
      
      if (response.token) {
        ApiService.setAuthToken(response.token)
        return response.token
      }
      
      throw new Error('Invalid refresh response')
    } catch (error) {
      console.error('Token refresh error:', error)
      // If refresh fails, logout user
      this.logout()
      throw error
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      return await ApiService.post(this.endpoints.forgotPassword, { email })
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      return await ApiService.post(this.endpoints.resetPassword, {
        token,
        password: newPassword
      })
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      return await ApiService.post(this.endpoints.verifyEmail, { token })
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = ApiService.getAuthToken()
    if (!token) return false
    
    try {
      // Check if token is expired (basic JWT check)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      return payload.exp > currentTime
    } catch {
      return false
    }
  }

  // Get current user data from localStorage
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser()
    return user?.role || 'user'
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const user = this.getCurrentUser()
    return user?.permissions?.includes(permission) || false
  }

  // Social login (Google, Facebook, etc.)
  async socialLogin(provider, token) {
    try {
      const response = await ApiService.post(`/auth/social/${provider}`, { token })
      
      if (response.token) {
        ApiService.setAuthToken(response.token)
        localStorage.setItem('user_data', JSON.stringify(response.user))
        
        window.dispatchEvent(new CustomEvent('auth:login', { 
          detail: response.user 
        }))
      }
      
      return response
    } catch (error) {
      console.error('Social login error:', error)
      throw error
    }
  }

  // Initialize auth state on app load
  async initializeAuth() {
    if (this.isAuthenticated()) {
      try {
        // Verify token is still valid by fetching profile
        await this.getProfile()
        return true
      } catch {
        // Token is invalid, logout
        this.logout()
        return false
      }
    }
    
    return false
  }
}

// Export singleton instance
export const AuthService = new AuthServiceClass()
export default AuthService
