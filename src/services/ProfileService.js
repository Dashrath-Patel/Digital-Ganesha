import { API_BASE_URL } from '../config'

class ProfileService {
  async changePassword(passwordData) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password')
    }

    return data
  }

  async changeEmail(emailData) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/profile/change-email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(emailData)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to change email')
    }

    return data
  }

  async updateProfile(profileData) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/profile/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile')
    }

    return data
  }

  async getProfile() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/profile/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile')
    }

    return data
  }
}

export default new ProfileService()
