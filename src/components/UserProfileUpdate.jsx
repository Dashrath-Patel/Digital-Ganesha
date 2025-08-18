import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import ProfileService from '../services/ProfileService'

const UserProfileUpdate = () => {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  
  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // Change Email Form State
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  })
  
  // Change Name Form State
  const [nameForm, setNameForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  })

  // Update name form when user data changes
  useEffect(() => {
    if (user) {
      setNameForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      }))
    }
  }, [user])

    const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      await ProfileService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      showToast('Password updated successfully!', 'success')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setActiveSection(null)
    } catch (error) {
      console.error('Password change error:', error)
      showToast(error.message || 'Failed to update password', 'error')
    } finally {
      setIsLoading(false)
    }
  }

    const handleEmailChange = async (e) => {
    e.preventDefault()
    
    if (!emailForm.newEmail || !emailForm.password) {
      showToast('Please fill in all fields', 'error')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailForm.newEmail)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      await ProfileService.changeEmail({
        newEmail: emailForm.newEmail,
        password: emailForm.password
      })
      
      // Update user data in context
      updateUser({ ...user, email: emailForm.newEmail })
      
      setEmailForm({ newEmail: '', password: '' })
      setActiveSection(null)
      showToast('Email changed successfully!', 'success')
    } catch (error) {
      console.error('Email change error:', error)
      showToast(error.message || 'Failed to change email', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = async (e) => {
    e.preventDefault()
    
    if (!nameForm.firstName.trim() || !nameForm.lastName.trim()) {
      showToast('First name and last name are required', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await ProfileService.updateProfile({
        firstName: nameForm.firstName,
        lastName: nameForm.lastName,
        phone: nameForm.phone
      })
      
      // Update user data in context
      updateUser({ 
        ...user, 
        firstName: nameForm.firstName, 
        lastName: nameForm.lastName,
        phone: nameForm.phone
      })
      
      setActiveSection(null)
      showToast('Profile updated successfully!', 'success')
    } catch (error) {
      console.error('Profile update error:', error)
      showToast(error.message || 'Failed to update profile', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Update Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Change Password */}
        <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
          <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
            🔐 Change Password
          </h4>
          <p className="text-golden-light text-xs mb-3">Update your account password</p>
          <button 
            onClick={() => setActiveSection(activeSection === 'password' ? null : 'password')}
            className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded text-xs transition-colors"
          >
            {activeSection === 'password' ? 'Cancel' : 'Change'}
          </button>
        </div>

        {/* Change Email */}
        <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
          <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
            📧 Change Email
          </h4>
          <p className="text-golden-light text-xs mb-3">Update your email address</p>
          <button 
            onClick={() => setActiveSection(activeSection === 'email' ? null : 'email')}
            className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded text-xs transition-colors"
          >
            {activeSection === 'email' ? 'Cancel' : 'Change'}
          </button>
        </div>

        {/* Update Profile */}
        <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
          <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
            👤 Update Profile
          </h4>
          <p className="text-golden-light text-xs mb-3">Change your name and phone number</p>
          <button 
            onClick={() => setActiveSection(activeSection === 'name' ? null : 'name')}
            className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded text-xs transition-colors"
          >
            {activeSection === 'name' ? 'Cancel' : 'Update'}
          </button>
        </div>
      </div>

      {/* Forms */}
      {activeSection === 'password' && (
        <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <h3 className="text-lg font-semibold text-golden mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-golden-light text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                autoComplete="current-password"
                required
              />
            </div>
            <div>
              <label className="block text-golden-light text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div>
              <label className="block text-golden-light text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}

      {activeSection === 'email' && (
        <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <h3 className="text-lg font-semibold text-golden mb-4">Change Email Address</h3>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-golden-light text-sm font-medium mb-2">
                New Email Address
              </label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter new email address"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-golden-light text-sm font-medium mb-2">
                Current Password (for verification)
              </label>
              <input
                type="password"
                value={emailForm.password}
                onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Change Email'}
            </button>
          </form>
        </div>
      )}

      {activeSection === 'name' && (
        <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <h3 className="text-lg font-semibold text-golden mb-4">Update Profile</h3>
          <form onSubmit={handleNameChange} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-golden-light text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={nameForm.firstName}
                  onChange={(e) => setNameForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label className="block text-golden-light text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={nameForm.lastName}
                  onChange={(e) => setNameForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-golden-light text-sm font-medium mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={nameForm.phone}
                onChange={(e) => setNameForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 bg-red-800/30 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default UserProfileUpdate
