import config from '../config'

class CulturalService {
  constructor() {
    this.baseURL = `${config.apiUrl}/cultural`
  }

  // Get cultural content by category
  async getContentByCategory(category, options = {}) {
    try {
      const {
        limit = 0,
        skip = 0,
        featured,
        search,
        shuffle = false
      } = options

      const params = new URLSearchParams()
      if (limit) params.append('limit', limit.toString())
      if (skip) params.append('skip', skip.toString())
      if (featured !== undefined) params.append('featured', featured.toString())
      if (search) params.append('search', search)
      if (shuffle) params.append('shuffle', 'true')

      const url = `${this.baseURL}/${category}${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching ${category} content:`, error)
      throw error
    }
  }

  // Get single content item by ID
  async getContentById(id) {
    try {
      const response = await fetch(`${this.baseURL}/item/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching content by ID:', error)
      throw error
    }
  }

  // Search cultural content
  async searchContent(searchTerm, category = null, options = {}) {
    try {
      const { limit = 20, skip = 0 } = options

      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (limit) params.append('limit', limit.toString())
      if (skip) params.append('skip', skip.toString())

      const url = `${this.baseURL}/search/${encodeURIComponent(searchTerm)}${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error searching content:', error)
      throw error
    }
  }

  // Get featured content
  async getFeaturedContent(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/featured/all?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching featured content:', error)
      throw error
    }
  }

  // Get content statistics
  async getContentStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats/overview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching content statistics:', error)
      throw error
    }
  }

  // Specific methods for each category
  async getMantras(options = {}) {
    return this.getContentByCategory('mantras', options)
  }

  async getRecipes(options = {}) {
    return this.getContentByCategory('recipes', { ...options, shuffle: true })
  }

  async getTraditions(options = {}) {
    return this.getContentByCategory('traditions', options)
  }

  async getBooks(options = {}) {
    return this.getContentByCategory('books', { ...options, shuffle: true })
  }

  async getBhajans(options = {}) {
    return this.getContentByCategory('bhajans', { ...options, shuffle: true })
  }

  // Search within specific categories
  async searchMantras(searchTerm, options = {}) {
    return this.searchContent(searchTerm, 'mantras', options)
  }

  async searchRecipes(searchTerm, options = {}) {
    return this.searchContent(searchTerm, 'recipes', options)
  }

  async searchBhajans(searchTerm, options = {}) {
    return this.searchContent(searchTerm, 'bhajans', options)
  }

  // Utility method to handle API errors
  handleApiError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 'An error occurred'
      throw new Error(message)
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Network error: Unable to connect to server')
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

export default new CulturalService()
