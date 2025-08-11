// Google OAuth Service
class GoogleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    this.redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin
    this.isConfigured = this.clientId && this.clientId !== 'YOUR_GOOGLE_CLIENT_ID' && this.clientId.length > 0
  }

  // Check if Google OAuth is properly configured
  isGoogleAuthConfigured() {
    return this.isConfigured
  }

  // Initialize Google OAuth (to be called when component mounts)
  async initializeGoogleAuth() {
    if (!this.isConfigured) {
      console.warn('Google OAuth is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.')
      return false
    }

    return new Promise((resolve) => {
      // Load Google API script
      if (!window.google) {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => {
          if (window.google && this.isConfigured) {
            try {
              window.google.accounts.id.initialize({
                client_id: this.clientId,
                callback: this.handleGoogleResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
              })
              resolve(true)
            } catch (error) {
              console.error('Error initializing Google OAuth:', error)
              resolve(false)
            }
          } else {
            resolve(false)
          }
        }
        script.onerror = () => {
          console.error('Failed to load Google OAuth script')
          resolve(false)
        }
        document.head.appendChild(script)
      } else if (this.isConfigured) {
        try {
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleGoogleResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true
          })
          resolve(true)
        } catch (error) {
          console.error('Error initializing Google OAuth:', error)
          resolve(false)
        }
      } else {
        resolve(false)
      }
    })
  }

  // Handle Google OAuth response
  async handleGoogleResponse(response) {
    try {
      // Decode the JWT token to get user information
      const userInfo = this.parseJwt(response.credential)
      
      // Send to your backend for verification and user creation/login
      const result = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for refresh token
        body: JSON.stringify({
          credential: response.credential,
          userInfo: userInfo
        })
      })

      if (result.ok) {
        const data = await result.json()
        // Store the access token
        localStorage.setItem('accessToken', data.data.accessToken)
        // Trigger a custom event to notify the auth context
        window.dispatchEvent(new CustomEvent('googleAuthSuccess', { detail: data.data }))
        return data
      } else {
        const errorData = await result.json()
        throw new Error(errorData.message || 'Google authentication failed')
      }
    } catch (error) {
      console.error('Google authentication error:', error)
      throw error
    }
  }

  // Parse JWT token to extract user information
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error parsing JWT:', error)
      return null
    }
  }

  // Trigger Google Sign In
  async signInWithGoogle() {
    if (!this.isConfigured) {
      throw new Error('Google OAuth is not configured')
    }

    if (!window.google) {
      const initialized = await this.initializeGoogleAuth()
      if (!initialized) {
        throw new Error('Failed to initialize Google OAuth')
      }
    }

    return new Promise((resolve, reject) => {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // User dismissed the prompt or it wasn't shown
            reject(new Error('Google sign-in was cancelled or not available'))
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // Sign out from Google
  async signOut() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
  }
}

export default new GoogleAuthService()
