/**
 * Centralized API service for all HTTP requests
 * Handles authentication, error handling, and request/response interceptors
 */

class ApiServiceClass {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://api.digitalganesha.com'
    this.timeout = 10000
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('auth_token')
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem('auth_token', token)
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('auth_token')
  }

  // Build headers with authentication
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    const token = this.getAuthToken()
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    return headers
  }

  // Main request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      method: 'GET',
      headers: this.buildHeaders(options.headers),
      ...options
    }

    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      // Handle different response types
      if (!response.ok) {
        await this.handleError(response)
      }

      // Return appropriate response type
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      throw error
    }
  }

  // Error handler
  async handleError(response) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch {
      // If response is not JSON, use default error message
    }

    // Handle specific status codes
    switch (response.status) {
      case 401:
        this.removeAuthToken()
        window.dispatchEvent(new CustomEvent('auth:logout'))
        throw new Error('Authentication required')
      case 403:
        throw new Error('Access forbidden')
      case 404:
        throw new Error('Resource not found')
      case 429:
        throw new Error('Too many requests. Please try again later.')
      case 500:
        throw new Error('Server error. Please try again later.')
      default:
        throw new Error(errorMessage)
    }
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url)
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    })
  }

  // File upload
  async upload(endpoint, file, progressCallback) {
    const formData = new FormData()
    formData.append('file', file)

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      }
    })
  }

  // Download file
  async download(endpoint, filename) {
    const response = await this.request(endpoint, {
      headers: {
        'Accept': '*/*'
      }
    })

    const blob = new Blob([response])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

// Export singleton instance
export const ApiService = new ApiServiceClass()
export default ApiService
