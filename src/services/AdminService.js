// Admin API Service
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

export const adminAPI = {
  // Get all users with pagination
  getAllUsers: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    })
    
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Update user role
  updateUserRole: async (userId, role, permissions = []) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role, permissions })
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Assign user to committee
  assignToCommittee: async (userId, committeeRole, mandal = null) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/committee`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        isCommitteeMember: true, 
        committeeRole,
        mandal 
      })
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Remove user from committee
  removeFromCommittee: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/committee`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        isCommitteeMember: false, 
        committeeRole: null,
        mandalId: null 
      })
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Block/Unblock user
  toggleUserStatus: async (userId, isActive) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive })
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Get admin dashboard statistics
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Alias for getDashboardStats for backward compatibility
  getStats: async () => {
    return adminAPI.getDashboardStats()
  },

  // Get user activity logs
  getUserActivityLogs: async (userId, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/activity?${params}`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Create admin user (super admin only)
  createAdminUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/create-admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    
    const data = await handleResponse(response)
    return data.data.user
  },

  // Get all mandals for assignment
  getAllMandals: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/mandals`, {
      headers: getAuthHeaders()
    })
    
    const data = await handleResponse(response)
    return data.data.mandals
  },

  // Bulk operations
  bulkUpdateUserRoles: async (userIds, role) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/bulk/roles`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userIds, role })
    })
    
    const data = await handleResponse(response)
    return data.data
  },

  // Export users data
  exportUsersData: async (format = 'csv') => {
    const response = await fetch(`${API_BASE_URL}/admin/users/export?format=${format}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Export failed')
    }
    
    return response.blob()
  },

  // Create initial admin user (no auth required)
  createInitialAdmin: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/create-initial-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    
    const data = await handleResponse(response)
    return data.data
  }
}

// Committee roles and permissions
export const COMMITTEE_ROLES = {
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice_president',
  SECRETARY: 'secretary',
  TREASURER: 'treasurer',
  COORDINATOR: 'coordinator',
  MEMBER: 'member'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  COMMITTEE_MEMBER: 'committee_member',
  USER: 'user'
}

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_MANDALS: 'manage_mandals',
  MANAGE_EVENTS: 'manage_events',
  VIEW_ANALYTICS: 'view_analytics',
  MODERATE_CONTENT: 'moderate_content',
  MANAGE_MEDIA: 'manage_media',
  SEND_NOTIFICATIONS: 'send_notifications'
}
