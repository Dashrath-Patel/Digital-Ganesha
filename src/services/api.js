// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  
  return data
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password
      })
    })
    
    const data = await handleResponse(response)
    
    // Store tokens in localStorage
    if (data.data.tokens) {
      localStorage.setItem('accessToken', data.data.tokens.accessToken)
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken)
    }
    
    return data.data.user
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await handleResponse(response)
    
    // Store tokens in localStorage
    if (data.data.tokens) {
      localStorage.setItem('accessToken', data.data.tokens.accessToken)
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken)
    }
    
    return data.data.user
  },

  // Logout user
  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })
    
    const data = await handleResponse(response)
    
    if (data.data.tokens) {
      localStorage.setItem('accessToken', data.data.tokens.accessToken)
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken)
    }
    
    return data.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    
    return await handleResponse(response)
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    
    return await handleResponse(response)
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    })
    
    return await handleResponse(response)
  }
}

// Users API
export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Search users
  searchUsers: async (query, filters = {}) => {
    const searchParams = new URLSearchParams({
      search: query,
      ...filters
    })
    
    const response = await fetch(`${API_BASE_URL}/users/search?${searchParams}`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data
  }
}

// Mandals API
export const mandalsAPI = {
  // Get all mandals
  getAllMandals: async (filters = {}) => {
    const searchParams = new URLSearchParams(filters)
    
    const response = await fetch(`${API_BASE_URL}/mandals?${searchParams}`)
    
    const data = await handleResponse(response)
    return data.data
  },

  // Get mandal by ID
  getMandal: async (id) => {
    const response = await fetch(`${API_BASE_URL}/mandals/${id}`)
    
    const data = await handleResponse(response)
    return data.data.mandal
  },

  // Create new mandal
  createMandal: async (mandalData) => {
    const response = await fetch(`${API_BASE_URL}/mandals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(mandalData)
    })
    
    const data = await handleResponse(response)
    return data.data.mandal
  },

  // Search nearby mandals
  searchNearby: async (latitude, longitude, radius = 10) => {
    const searchParams = new URLSearchParams({
      latitude,
      longitude,
      radius
    })
    
    const response = await fetch(`${API_BASE_URL}/mandals/nearby?${searchParams}`)
    
    const data = await handleResponse(response)
    return data.data
  }
}

// Events API
export const eventsAPI = {
  // Get all events
  getAllEvents: async (filters = {}) => {
    const searchParams = new URLSearchParams(filters)
    
    const response = await fetch(`${API_BASE_URL}/events?${searchParams}`)
    
    const data = await handleResponse(response)
    return data.data
  },

  // Get event by ID
  getEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`)
    
    const data = await handleResponse(response)
    return data.data.event
  },

  // Create new event
  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    })
    
    const data = await handleResponse(response)
    return data.data.event
  },

  // Join event
  joinEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/join`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data
  }
}

// Media API
export const mediaAPI = {
  // Upload media files
  uploadFiles: async (files, metadata = {}) => {
    const formData = new FormData()
    
    // Add files to form data
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }
    
    // Add metadata
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key])
    })
    
    const token = localStorage.getItem('accessToken')
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Get media by ID
  getMedia: async (id) => {
    const response = await fetch(`${API_BASE_URL}/media/${id}`)
    
    const data = await handleResponse(response)
    return data.data.media
  }
}

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getNotifications: async (filters = {}) => {
    const searchParams = new URLSearchParams(filters)
    
    const response = await fetch(`${API_BASE_URL}/notifications?${searchParams}`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data.unreadCount
  }
}

// API interceptor for automatic token refresh
const originalFetch = window.fetch
window.fetch = async (...args) => {
  let response = await originalFetch(...args)
  
  // If token expired, try to refresh
  if (response.status === 401 && localStorage.getItem('refreshToken')) {
    try {
      await authAPI.refreshToken()
      
      // Retry the original request with new token
      const [url, options] = args
      if (options && options.headers) {
        const token = localStorage.getItem('accessToken')
        if (token) {
          options.headers['Authorization'] = `Bearer ${token}`
        }
      }
      
      response = await originalFetch(...args)
    } catch (refreshError) {
      // Refresh failed, redirect to login
      localStorage.clear()
      window.location.href = '/login'
    }
  }
  
  return response
}

export default {
  auth: authAPI,
  users: usersAPI,
  mandals: mandalsAPI,
  events: eventsAPI,
  media: mediaAPI,
  notifications: notificationsAPI
}
