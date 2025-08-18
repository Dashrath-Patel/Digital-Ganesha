import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI, COMMITTEE_ROLES, USER_ROLES } from '../services/AdminService'
import MessageService from '../services/MessageService'
import { EventService } from '../services/api/EventService'
import PhotoUploadService from '../services/PhotoUploadService'
import { useToast } from '../contexts/ToastContext'
import Header from '../components/Header'
import TwoFactorAuthManager from '../components/TwoFactorAuthManager'
import UserProfileUpdate from '../components/UserProfileUpdate'

const AdminDashboard = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [messages, setMessages] = useState([])
  const [events, setEvents] = useState([])
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [galleryRefreshTrigger, setGalleryRefreshTrigger] = useState(0)
  const [galleryLastRefresh, setGalleryLastRefresh] = useState(Date.now())
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [show2FASection, setShow2FASection] = useState(false)
  // Removed: showAwardModal state (Awards feature removed)

  useEffect(() => {
    fetchUsers()
    fetchStats()
    fetchMessages()
    fetchEvents()
    fetchGalleryPhotos()
  }, [currentPage, searchTerm])

  // Update current time every second for accurate "time ago" display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm
      })
      setUsers(response.users || [])
      setTotalPages(response.totalPages || 1)
      setError('')
    } catch (err) {
      console.error('Failed to fetch users:', err)
      
      // If it's an authentication error, don't set error state as it might cause logout
      if (err.message && err.message.includes('401')) {
        console.error('Authentication failed - user might need to login again')
      } else {
        setError(err.message || 'Failed to fetch users')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats()
      setStats(response)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await EventService.getAllEvents(1, 50)
      // Extract events from response data
      const eventsData = response?.data?.events || response?.events || response?.data || []
      setEvents(Array.isArray(eventsData) ? eventsData : [])
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setEvents([])
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await MessageService.getAdminMessages({
        page: currentPage,
        limit: 10,
        search: searchTerm
      })
      // MessageService now returns the array directly
      setMessages(Array.isArray(response) ? response : [])
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      setMessages([])
    }
  }

  const fetchGalleryPhotos = async () => {
    try {
      setGalleryLoading(true)
      const response = await PhotoUploadService.getMediaList({
        page: 1,
        limit: 50,
        type: 'image',
        isPublic: true
      })
      
      if (response.success) {
        setGalleryPhotos(response.data.media || [])
        setGalleryLastRefresh(Date.now())
      } else {
        console.error('Failed to fetch gallery photos:', response.error)
        setGalleryPhotos([])
      }
    } catch (err) {
      console.error('Failed to fetch gallery photos:', err)
      setGalleryPhotos([])
    } finally {
      setGalleryLoading(false)
    }
  }

  // Manual refresh for gallery
  const handleGalleryRefresh = () => {
    setGalleryRefreshTrigger(prev => prev + 1)
    fetchGalleryPhotos()
  }

  // Format last refresh time for gallery
  const formatGalleryLastRefresh = () => {
    const diff = currentTime - galleryLastRefresh
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return `${seconds}s ago`
    }
  }

  const handleSaveMessage = async (messageData) => {
    try {
      console.log('Current user:', user);
      console.log('Token in localStorage:', localStorage.getItem('accessToken') ? 'Present' : 'Not found');
      
      if (editingItem) {
        // Update existing message
        await MessageService.updateMessage(editingItem.id || editingItem._id, {
          ...messageData,
          author: messageData.author || user?.name || `${user?.firstName} ${user?.lastName}` || 'Admin'
        })
      } else {
        // Create new message
        const messagePayload = {
          ...messageData,
          author: messageData.author || user?.name || `${user?.firstName} ${user?.lastName}` || 'Admin'
        };
        console.log('Creating message with payload:', messagePayload);
        await MessageService.createMessage(messagePayload)
      }
      fetchMessages()
      setShowMessageModal(false)
      setEditingItem(null)
    } catch (err) {
      console.error('Failed to save message:', err)
      setError(err.message || 'Failed to save message')
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await MessageService.deleteMessage(messageId)
        fetchMessages()
      } catch (err) {
        console.error('Failed to delete message:', err)
        setError(err.message || 'Failed to delete message')
      }
    }
  }

  // Function to handle tab changes with scroll to top
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Scroll to top of the page smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleToggleMessageStatus = async (messageId) => {
    try {
      await MessageService.toggleMessageStatus(messageId)
      fetchMessages()
    } catch (err) {
      console.error('Failed to toggle message status:', err)
      setError(err.message || 'Failed to toggle message status')
    }
  }

  // Gallery photo functions
  const handleSaveGalleryPhoto = async (photoData) => {
    try {
      if (editingItem) {
        // Check if user wants to replace the image
        if (photoData.imageFile) {
          // Delete the old photo and upload a new one
          showToast('Replacing photo...', 'info')
          
          // Delete the old photo
          const deleteResult = await PhotoUploadService.deleteMedia(editingItem._id || editingItem.id)
          
          if (deleteResult.success) {
            // Upload the new photo with the same metadata
            const uploadResult = await PhotoUploadService.uploadPhoto(photoData.imageFile, {
              title: photoData.title,
              category: photoData.category,
              description: photoData.description || `Photo uploaded: ${photoData.title}`,
              folder: 'community-gallery',
              tags: [photoData.category, 'community'],
              isPublic: true
            })

            if (uploadResult.success) {
              showToast('Photo replaced successfully!', 'success')
              // Refresh the gallery photos list
              await fetchGalleryPhotos()
              // Reset editing state
              setEditingItem(null)
            } else {
              showToast(uploadResult.error || 'Failed to upload new photo', 'error')
            }
          } else {
            showToast(deleteResult.error || 'Failed to delete old photo', 'error')
          }
        } else {
          // Update existing photo metadata only
          const updateResult = await PhotoUploadService.updateMedia(editingItem._id || editingItem.id, {
            title: photoData.title,
            category: photoData.category,
            description: photoData.description || ''
          })

          if (updateResult.success) {
            showToast('Photo updated successfully!', 'success')
            // Refresh the gallery photos list
            await fetchGalleryPhotos()
            // Reset editing state
            setEditingItem(null)
          } else {
            showToast(updateResult.error || 'Failed to update photo', 'error')
          }
        }
      } else {
        // New photo upload
        if (!photoData.imageFile) {
          showToast('Please select an image file', 'error')
          return
        }

        showToast('Uploading photo...', 'info')

        const uploadResult = await PhotoUploadService.uploadPhoto(photoData.imageFile, {
          title: photoData.title,
          category: photoData.category,
          description: photoData.description || `Photo uploaded: ${photoData.title}`,
          folder: 'community-gallery',
          tags: [photoData.category, 'community'],
          isPublic: true
        })

        if (uploadResult.success) {
          showToast('Photo uploaded successfully!', 'success')
          // Refresh the gallery photos list
          await fetchGalleryPhotos()
        } else {
          showToast(uploadResult.error || 'Failed to upload photo', 'error')
        }
      }
    } catch (error) {
      console.error('Gallery photo save error:', error)
      showToast('An error occurred while saving the photo', 'error')
    }
  }

  const handleDeleteGalleryPhoto = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        const deleteResult = await PhotoUploadService.deleteMedia(photoId)
        
        if (deleteResult.success) {
          showToast('Photo deleted successfully!', 'success')
          fetchGalleryPhotos()
        } else {
          showToast(deleteResult.error || 'Failed to delete photo', 'error')
        }
      } catch (error) {
        console.error('Failed to delete photo:', error)
        showToast('An error occurred while deleting the photo', 'error')
      }
    }
  }

  // Event handler functions
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await EventService.deleteEvent(eventId)
        fetchEvents()
      } catch (err) {
        console.error('Failed to delete event:', err)
        setError(err.message || 'Failed to delete event')
      }
    }
  }

  const handleToggleEventStatus = async (eventId) => {
    try {
      // First get the current event
      const currentEvent = events.find(e => e._id === eventId || e.id === eventId)
      if (!currentEvent) {
        setError('Event not found')
        return
      }

      // Toggle the status between published and cancelled
      const updatedEventData = {
        ...currentEvent,
        status: (currentEvent.status === 'published' || currentEvent.status === 'ongoing') ? 'cancelled' : 'published'
      }

      await EventService.updateEvent(eventId, updatedEventData)
      fetchEvents()
    } catch (err) {
      console.error('Failed to toggle event status:', err)
      setError(err.message || 'Failed to toggle event status')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole)
      fetchUsers()
      setShowModal(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.message || 'Failed to update user role')
    }
  }

  const handleCommitteeAssignment = async (userId, committeeRole, notes) => {
    try {
      await adminAPI.assignToCommittee(userId, committeeRole, notes)
      fetchUsers()
      setShowModal(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.message || 'Failed to assign committee role')
    }
  }

  const handleRemoveFromCommittee = async (userId) => {
    try {
      await adminAPI.removeFromCommittee(userId)
      fetchUsers()
      setShowModal(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.message || 'Failed to remove from committee')
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(userId, !currentStatus)
      fetchUsers()
    } catch (err) {
      setError(err.message || 'Failed to update user status')
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-300">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <Header />
      
      {/* Enhanced Background with Better Visual Appeal */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-950/20 to-amber-950/30" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-golden/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen pt-16 pb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Modern Header Section */}
          <div className="mb-4">
            <div className="text-center">
              <div className="max-w-xl mx-auto">
                {/* Main Title Section */}
                <div className="bg-gradient-to-br from-red-950/60 to-amber-900/40 backdrop-blur-xl rounded-lg p-3 border border-golden/20 shadow-xl mb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-golden/30 to-amber-600/30 rounded-lg border border-golden/40 shadow-lg">
                      <span className="text-lg">🛡️</span>
                    </div>
                    <div className="text-center">
                      <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-golden via-amber-300 to-golden-light bg-clip-text text-transparent leading-tight">
                        Admin Dashboard
                      </h1>
                      <p className="text-golden-light/90 text-xs font-medium">Welcome back, {user?.firstName}</p>
                    </div>
                  </div>
                  <p className="text-golden-light/80 text-center text-xs max-w-sm mx-auto">
                    Manage your community platform
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation - Available for all sections */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-red-950/80 via-red-900/70 to-amber-900/80 backdrop-blur-xl rounded-xl p-2 border border-golden/30 shadow-lg">
                {/* Mobile Dropdown */}
                <div className="sm:hidden">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full bg-red-950/50 border border-golden/30 rounded-lg px-3 py-2 text-golden focus:ring-2 focus:ring-golden/50 focus:border-golden text-sm"
                  >
                    <option value="users">👥 Users</option>
                    <option value="messages">📢 Messages</option>
                    <option value="events">📅 Events</option>
                    <option value="gallery">📸 Gallery</option>
                    <option value="settings">⚙️ Settings</option>
                  </select>
                </div>
                
                {/* Desktop Tab Navigation - Smaller & Separated Buttons */}
                <div className="hidden sm:flex justify-center gap-3">
                  {[
                    { id: 'users', label: 'Users', icon: '👥', count: stats.totalUsers },
                    { id: 'messages', label: 'Messages', icon: '📢', count: messages.length },
                    { id: 'events', label: 'Events', icon: '📅', count: events.length },
                    { id: 'gallery', label: 'Gallery', icon: '📸', count: galleryPhotos.length },
                    { id: 'settings', label: 'Settings', icon: '⚙️' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 min-w-[100px] justify-center ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-golden to-amber-500 text-red-950 shadow-md border border-golden/60'
                          : 'text-golden hover:bg-red-800/30 hover:border-golden/30 border border-transparent backdrop-blur-sm'
                      }`}
                    >
                      <span className="text-base group-hover:scale-110 transition-transform duration-200">{tab.icon}</span>
                      <span className="font-semibold">{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                          activeTab === tab.id ? 'bg-red-950/30 text-red-950' : 'bg-golden/25 text-golden'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'users' && (
              <div className="space-y-6">

                {/* Enhanced Search Section */}
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-red-950/70 to-amber-900/50 backdrop-blur-xl rounded-2xl p-6 border border-golden/30 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex-1 w-full sm:max-w-md">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-red-950/40 border border-golden/40 rounded-xl focus:ring-2 focus:ring-golden/50 focus:border-golden text-golden placeholder-golden/70 text-sm transition-all duration-200 shadow-inner"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden/70 text-lg">
                            🔍
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => fetchUsers()}
                          className="flex-1 sm:flex-none bg-gradient-to-r from-golden to-amber-500 text-red-950 px-6 py-3 rounded-xl font-semibold hover:from-amber-500 hover:to-golden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <span className="hidden sm:inline">Search Users</span>
                          <span className="sm:hidden">🔍 Search</span>
                        </button>
                        <button
                          onClick={() => {
                            setSearchTerm('')
                            fetchUsers()
                          }}
                          className="px-4 py-3 bg-red-800/50 border border-golden/40 rounded-xl text-golden hover:bg-red-700/50 transition-all duration-300 hover:scale-105 shadow-lg"
                          title="Clear search"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message with Better Design */}
                {error && (
                  <div className="bg-gradient-to-r from-red-800/50 to-red-900/50 backdrop-blur-sm border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Modern Users Display - Cards for Mobile, Table for Desktop */}
                <div className="bg-gradient-to-br from-red-950/80 to-amber-900/60 backdrop-blur-xl rounded-lg border border-golden/20 shadow-lg overflow-hidden max-w-5xl mx-auto">
                  {/* Mobile Card View */}
                  <div className="block lg:hidden">
                    {loading ? (
                      <div className="p-6 text-center">
                        <div className="flex items-center justify-center gap-3 text-golden-light">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-golden"></div>
                          <span>Loading users...</span>
                        </div>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="p-6 text-center">
                        <div className="text-3xl mb-3">👥</div>
                        <p className="text-golden-light text-base">No users found</p>
                        <p className="text-golden-light/60 text-sm mt-1">
                          {searchTerm ? 'Try adjusting your search terms' : 'Users will appear here when they register'}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 space-y-3">
                        {users.map((user) => (
                          <div 
                            key={user._id} 
                            className="bg-gradient-to-r from-red-900/40 to-amber-900/40 backdrop-blur-sm rounded-lg p-3 border border-golden/20 hover:border-golden/40 transition-all duration-300"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-golden to-amber-500 rounded-full flex items-center justify-center text-red-950 font-bold flex-shrink-0 text-sm">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0">
                                    <h3 className="text-golden font-semibold text-sm truncate">
                                      {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-golden-light text-xs truncate">{user.email}</p>
                                  </div>
                                  
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setShowModal(true)
                                    }}
                                    className="ml-2 p-1.5 bg-golden/20 rounded-md text-golden hover:bg-golden/30 transition-colors duration-200 flex-shrink-0"
                                  >
                                    ⚙️
                                  </button>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                    user.role === USER_ROLES.ADMIN
                                      ? 'bg-purple-900/50 text-purple-300'
                                      : user.role === USER_ROLES.COMMITTEE_MEMBER
                                      ? 'bg-blue-900/50 text-blue-300'
                                      : 'bg-gray-900/50 text-gray-300'
                                  }`}>
                                    {user.role?.replace('_', ' ').toUpperCase()}
                                  </span>
                                  
                                  {user.isCommitteeMember && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-amber-900/50 text-amber-300">
                                      {user.committeeRole?.replace('_', ' ').toUpperCase()}
                                    </span>
                                  )}
                                  
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                    user.isActive ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                                  }`}>
                                    {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-red-950/60 border-b border-golden/30">
                        <tr>
                          <th className="px-6 py-4 text-left text-golden font-semibold text-sm">User</th>
                          <th className="px-6 py-4 text-left text-golden font-semibold text-sm">Role</th>
                          <th className="px-6 py-4 text-left text-golden font-semibold text-sm">Committee</th>
                          <th className="px-6 py-4 text-left text-golden font-semibold text-sm">Status</th>
                          <th className="px-6 py-4 text-left text-golden font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-golden-light">
                              <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden"></div>
                                <span className="text-lg">Loading users...</span>
                              </div>
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center">
                              <div className="text-5xl mb-4">👥</div>
                              <p className="text-golden-light text-lg">No users found</p>
                              <p className="text-golden-light/60 text-sm mt-1">
                                {searchTerm ? 'Try adjusting your search terms' : 'Users will appear here when they register'}
                              </p>
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user._id} className="border-b border-golden/10 hover:bg-red-950/30 transition-colors duration-200">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-golden to-amber-500 rounded-full flex items-center justify-center text-red-950 font-bold flex-shrink-0">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-golden font-semibold">{user.firstName} {user.lastName}</div>
                                    <div className="text-golden-light text-sm truncate">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                                  user.role === USER_ROLES.ADMIN
                                    ? 'bg-purple-900/50 text-purple-300'
                                    : user.role === USER_ROLES.COMMITTEE_MEMBER
                                    ? 'bg-blue-900/50 text-blue-300'
                                    : 'bg-gray-900/50 text-gray-300'
                                }`}>
                                  {user.role?.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {user.isCommitteeMember ? (
                                  <div>
                                    <div className="text-golden font-medium">
                                      {user.committeeRole?.replace('_', ' ').toUpperCase()}
                                    </div>
                                    {user.isCommitteeMember && (
                                      <div className="text-golden-light text-sm font-medium">Committee Member</div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-golden-light">Not a member</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                                  user.isActive
                                    ? 'bg-green-900/50 text-green-300'
                                    : 'bg-red-900/50 text-red-300'
                                }`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setShowModal(true)
                                    }}
                                    className="bg-golden/20 hover:bg-golden/30 text-golden px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                    title="Edit User"
                                  >
                                    ⚙️ Edit
                                  </button>
                                  <button
                                    onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                                      user.isActive
                                        ? 'bg-red-800/40 hover:bg-red-700/50 text-red-300'
                                        : 'bg-green-800/40 hover:bg-green-700/50 text-green-300'
                                    }`}
                                    title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                  >
                                    {user.isActive ? '🚫' : '✅'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gradient-to-br from-red-950/80 to-amber-900/60 backdrop-blur-xl rounded-xl p-4 border border-golden/20">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-golden-light text-sm">
                        Showing page <span className="text-golden font-semibold">{currentPage}</span> of{' '}
                        <span className="text-golden font-semibold">{totalPages}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2 px-4 py-2 bg-golden/20 border border-golden/30 rounded-lg text-golden hover:bg-golden/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                          ← Previous
                        </button>
                        
                        {/* Page numbers for larger screens */}
                        <div className="hidden sm:flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                                  page === currentPage
                                    ? 'bg-golden text-red-950 shadow-lg'
                                    : 'bg-golden/20 text-golden hover:bg-golden/30'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2 px-4 py-2 bg-golden/20 border border-golden/30 rounded-lg text-golden hover:bg-golden/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analytics tab removed */}

            {/* Messages Management Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                {/* Mobile-responsive header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h3 className="text-xl font-bold text-golden">Admin Messages</h3>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 cursor-pointer w-full sm:w-auto"
                  >
                    + Create Message
                  </button>
                </div>
                
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message._id || message.id} 
                      className="group bg-gradient-to-r from-red-950/80 to-amber-950/80 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-golden/20 hover:border-golden/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {/* Mobile-responsive layout */}
                      <div className="flex flex-col space-y-3">
                        {/* Top section - Status and Title */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                message.isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                              }`}></div>
                              <h4 className="text-base sm:text-lg font-semibold text-golden truncate">
                                {message.title}
                              </h4>
                            </div>
                          </div>
                          
                          {/* Action Buttons - Always visible on mobile */}
                          <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
                            <button
                              onClick={() => {setEditingItem(message); setShowMessageModal(true);}}
                              className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/60 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
                              title="Edit Message"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            
                            <button
                              onClick={() => handleToggleMessageStatus(message._id || message.id)}
                              className={`flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 border rounded-lg transition-all duration-200 ${
                                message.isActive 
                                  ? 'bg-orange-500/30 hover:bg-orange-500/50 border-orange-400/60 text-orange-300 hover:text-orange-200'
                                  : 'bg-green-500/30 hover:bg-green-500/50 border-green-400/60 text-green-300 hover:text-green-200'
                              }`}
                              title={message.isActive ? 'Deactivate Message' : 'Activate Message'}
                            >
                              {message.isActive ? (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteMessage(message._id || message.id)}
                              className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 bg-red-500/30 hover:bg-red-500/50 border border-red-400/60 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
                              title="Delete Message"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Tags section - Mobile responsive wrap */}
                        <div className="flex flex-wrap gap-2">
                          {/* Author Tag */}
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="truncate max-w-20 sm:max-w-none">{message.author}</span>
                          </span>
                          
                          {/* Category Tag */}
                          {message.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span className="truncate max-w-20 sm:max-w-none">{message.category}</span>
                            </span>
                          )}

                          {/* Status Tag */}
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            message.isActive 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {message.isActive ? 'Active' : 'Inactive'}
                          </span>
                          
                          {/* Priority Tag */}
                          {message.priority && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              message.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              message.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              message.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {message.priority.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Content section */}
                        <div>
                          <p className="text-golden-light/80 text-sm mb-2 line-clamp-2 sm:line-clamp-1">
                            {message.content}
                          </p>
                          
                          {/* Meta information */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-golden-light/60">
                            <span className="flex items-center space-x-1">
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(message.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </span>
                            {message.expiryDate && (
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Expires {new Date(message.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-8 sm:py-12 px-4">
                      <div className="mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-golden/20 to-amber-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-golden/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-golden mb-2">No Messages Yet</h3>
                      <p className="text-golden-light/80 mb-4 text-sm max-w-md mx-auto">
                        Create your first community message to get started.
                      </p>
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-golden to-golden-light text-red-950 font-medium rounded-lg hover:from-golden-light hover:to-golden transition-all duration-300 text-sm w-full sm:w-auto justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create First Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events Management Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-golden">Community Events</h3>
                  <button
                    onClick={() => setShowEventModal(true)}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 cursor-pointer"
                  >
                    + Create Event
                  </button>
                </div>
                
                <div className="space-y-3">
                  {events.map((event) => (
                    <div 
                      key={event.id} 
                      className="group bg-gradient-to-r from-red-950/80 to-amber-950/80 backdrop-blur-lg rounded-xl p-4 border border-golden/20 hover:border-golden/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        {/* Left Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title with Tags */}
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="text-xl flex-shrink-0">{event.icon}</div>
                            <h4 className="text-lg font-semibold text-golden truncate">
                              {event.title}
                            </h4>
                            
                            {/* Event Type Tag */}
                            {event.type && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 flex-shrink-0">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {event.type}
                              </span>
                            )}
                            
                            {/* Category Tag */}
                            {event.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                {event.category}
                              </span>
                            )}

                            {/* Status Tag */}
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                              event.status === 'published' || event.status === 'ongoing' || event.isActive !== false
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {event.status === 'published' || event.status === 'ongoing' || event.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                            
                            {/* Priority/Importance Tag */}
                            {event.priority && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                                event.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                event.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {event.priority.toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Content and Meta */}
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-golden-light/80 text-sm truncate pr-4">
                                {event.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-golden-light/60">
                                <span className="flex items-center space-x-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>
                                    {event.startDate && event.endDate ? (
                                      new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString() 
                                        ? new Date(event.startDate).toLocaleDateString()
                                        : `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`
                                    ) : (
                                      event.date || 'No date set'
                                    )}
                                  </span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>{event.venue?.name || event.location}</span>
                                </span>
                                {(event.startTime || event.endTime) && (
                                  <span className="flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{event.startTime}{event.endTime && ` - ${event.endTime}`}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {setEditingItem(event); setShowEventModal(true);}}
                            className="flex items-center justify-center w-8 h-8 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/60 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
                            title="Edit Event"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleToggleEventStatus && handleToggleEventStatus(event.id)}
                            className={`flex items-center justify-center w-8 h-8 border rounded-lg transition-all duration-200 ${
                              event.status === 'published' || event.status === 'ongoing' || event.isActive !== false
                                ? 'bg-orange-500/30 hover:bg-orange-500/50 border-orange-400/60 text-orange-300 hover:text-orange-200'
                                : 'bg-green-500/30 hover:bg-green-500/50 border-green-400/60 text-green-300 hover:text-green-200'
                            }`}
                            title={event.status === 'published' || event.status === 'ongoing' || event.isActive !== false ? 'Deactivate Event' : 'Activate Event'}
                          >
                            {event.status === 'published' || event.status === 'ongoing' || event.isActive !== false ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteEvent && handleDeleteEvent(event.id)}
                            className="flex items-center justify-center w-8 h-8 bg-red-500/30 hover:bg-red-500/50 border border-red-400/60 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
                            title="Delete Event"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {events.length === 0 && (
                    <div className="text-center py-12">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-golden/20 to-amber-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-golden/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-golden mb-2">No Events Yet</h3>
                      <p className="text-golden-light/80 mb-4 text-sm max-w-md mx-auto">
                        Create your first community event to get started.
                      </p>
                      <button
                        onClick={() => setShowEventModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-golden to-golden-light text-red-950 font-medium rounded-lg hover:from-golden-light hover:to-golden transition-all duration-300 text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create First Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Gallery Management Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                {/* Gallery Header with Better Mobile Layout */}
                <div className="bg-gradient-to-br from-red-950/80 to-amber-900/60 backdrop-blur-xl rounded-xl p-6 border border-golden/20 shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-golden/20 rounded-xl border border-golden/30">
                        <span className="text-2xl">📸</span>
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-golden">Community Gallery</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-golden-light text-sm">
                            {galleryPhotos.length} {galleryPhotos.length === 1 ? 'photo' : 'photos'} uploaded
                          </span>
                          {galleryPhotos.length > 0 && (
                            <span className="px-2 py-1 bg-golden/20 text-golden text-xs rounded-full font-medium">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Enhanced Refresh Button */}
                      <button
                        onClick={handleGalleryRefresh}
                        disabled={galleryLoading}
                        className="group flex items-center justify-center gap-3 px-4 py-3 bg-golden/20 border border-golden/40 rounded-xl text-golden hover:bg-golden/30 hover:border-golden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        title={`Refresh gallery to see latest changes. Last updated: ${formatGalleryLastRefresh()}`}
                      >
                        <span className={`text-lg ${galleryLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
                          🔄
                        </span>
                        <div className="text-left">
                          <div className="text-sm font-medium">Refresh</div>
                          <div className="text-xs text-golden/70">{formatGalleryLastRefresh()}</div>
                        </div>
                      </button>
                      
                      {/* Enhanced Upload Button */}
                      <button
                        onClick={() => {
                          setEditingItem(null)
                          setShowGalleryModal(true)
                        }}
                        className="group flex items-center justify-center gap-3 bg-gradient-to-r from-golden to-amber-500 text-red-950 px-6 py-3 rounded-xl font-semibold hover:from-amber-500 hover:to-golden transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">📤</span>
                        <span>Upload Photos</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Gallery Content with Loading Overlay */}
                <div className="relative">
                  {galleryLoading && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
                      <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-sm border border-golden/40 rounded-xl p-6 text-center shadow-2xl">
                        <div className="text-golden text-2xl mb-3 animate-spin">🔄</div>
                        <p className="text-golden font-medium">Refreshing gallery...</p>
                        <p className="text-golden-light text-sm mt-1">Please wait</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Gallery Grid */}
                  <div className="bg-gradient-to-br from-red-950/80 to-amber-900/60 backdrop-blur-xl rounded-xl border border-golden/20 shadow-lg overflow-hidden">
                    {galleryPhotos.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                          <div className="w-24 h-24 mx-auto mb-6 bg-golden/10 rounded-full flex items-center justify-center">
                            <span className="text-4xl">📸</span>
                          </div>
                          <h4 className="text-xl font-semibold text-golden mb-3">No Photos Yet</h4>
                          <p className="text-golden-light mb-6 text-sm leading-relaxed">
                            Share your community moments by uploading photos to the gallery. 
                            Members will be able to view and enjoy these memories.
                          </p>
                          <button
                            onClick={() => {
                              setEditingItem(null)
                              setShowGalleryModal(true)
                            }}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-golden to-amber-500 text-red-950 px-6 py-3 rounded-xl font-semibold hover:from-amber-500 hover:to-golden transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            <span className="text-lg">📤</span>
                            Upload First Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        {/* Mobile Horizontal Scrolling - Only for mobile screens */}
                        <div className="block sm:hidden">
                          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" 
                               style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                            {galleryPhotos.map((photo) => (
                              <div 
                                key={photo._id || photo.id} 
                                className="flex-none w-72 snap-center group bg-gradient-to-br from-red-900/40 to-amber-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-golden/20 hover:border-golden/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                              >
                                {/* Photo Container */}
                                <div className="relative aspect-square overflow-hidden bg-red-800/20">
                                  {photo.url ? (
                                    <img 
                                      src={photo.url} 
                                      alt={photo.title || 'Gallery photo'}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div 
                                    className="w-full h-full flex items-center justify-center text-6xl text-golden/40" 
                                    style={{display: photo.url ? 'none' : 'flex'}}
                                  >
                                    📸
                                  </div>
                                  
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingItem(photo)
                                          setShowGalleryModal(true)
                                        }}
                                        className="p-2 bg-golden/90 text-red-950 rounded-lg hover:bg-golden transition-colors duration-200 font-semibold"
                                        title="Edit Photo"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGalleryPhoto(photo._id || photo.id)}
                                        className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-500 transition-colors duration-200 font-semibold"
                                        title="Delete Photo"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Photo Info */}
                                <div className="p-4">
                                  <h5 className="text-golden font-semibold text-sm mb-1 truncate" title={photo.title || 'Untitled'}>
                                    {photo.title || 'Untitled'}
                                  </h5>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-golden-light capitalize">
                                      {PhotoUploadService.mapCategoryToFrontend(photo.category) || 'General'}
                                    </span>
                                    <span className="text-golden-light/60">
                                      {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Unknown'}
                                    </span>
                                  </div>
                                  
                                  {/* Photo Stats */}
                                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-golden/10">
                                    <div className="flex items-center gap-1 text-xs text-golden-light">
                                      <span>👁️</span>
                                      <span>{photo.views || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-golden-light">
                                      <span>💾</span>
                                      <span>{photo.size ? `${(photo.size / 1024 / 1024).toFixed(1)}MB` : '0MB'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Desktop Grid Layout - Hidden on mobile */}
                        <div className="hidden sm:block">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {galleryPhotos.map((photo) => (
                              <div 
                                key={photo._id || photo.id} 
                                className="group bg-gradient-to-br from-red-900/40 to-amber-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-golden/20 hover:border-golden/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                              >
                                {/* Photo Container */}
                                <div className="relative aspect-square overflow-hidden bg-red-800/20">
                                  {photo.url ? (
                                    <img 
                                      src={photo.url} 
                                      alt={photo.title || 'Gallery photo'}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div 
                                    className="w-full h-full flex items-center justify-center text-6xl text-golden/40" 
                                    style={{display: photo.url ? 'none' : 'flex'}}
                                  >
                                    📸
                                  </div>
                                  
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingItem(photo)
                                          setShowGalleryModal(true)
                                        }}
                                        className="p-2 bg-golden/90 text-red-950 rounded-lg hover:bg-golden transition-colors duration-200 font-semibold"
                                        title="Edit Photo"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGalleryPhoto(photo._id || photo.id)}
                                        className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-500 transition-colors duration-200 font-semibold"
                                        title="Delete Photo"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Photo Info */}
                                <div className="p-4">
                                  <h5 className="text-golden font-semibold text-sm mb-1 truncate" title={photo.title || 'Untitled'}>
                                    {photo.title || 'Untitled'}
                                  </h5>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-golden-light capitalize">
                                      {PhotoUploadService.mapCategoryToFrontend(photo.category) || 'General'}
                                    </span>
                                    <span className="text-golden-light/60">
                                      {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Unknown'}
                                    </span>
                                  </div>
                                  
                                  {/* Photo Stats */}
                                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-golden/10">
                                    <div className="flex items-center gap-1 text-xs text-golden-light">
                                      <span>👁️</span>
                                      <span>{photo.views || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-golden-light">
                                      <span>💾</span>
                                      <span>{photo.size ? `${(photo.size / 1024 / 1024).toFixed(1)}MB` : '0MB'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Awards tab removed */}

            {/* Enhanced Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Settings Header */}
                <div className="bg-gradient-to-br from-red-900/90 to-amber-900/90 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/40 shadow-xl">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-yellow-500/20 rounded-full border-2 border-yellow-500/30">
                      <div className="text-5xl">⚙️</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-golden text-center mb-2">System Settings</h3>
                  <p className="text-golden-light text-center max-w-md mx-auto">
                    Configure your admin account settings and security preferences
                  </p>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Security Settings Card */}
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30 flex-shrink-0">
                        <div className="text-2xl">🔐</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-golden mb-2">Security & Authentication</h4>
                        <p className="text-golden-light text-sm mb-4">
                          Manage your account security settings and two-factor authentication
                        </p>
                        
                        {/* 2FA Status Indicator */}
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-xs font-medium">2FA Enabled</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setShow2FASection(!show2FASection)}
                          className="w-full bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 hover:from-yellow-500 hover:to-yellow-400 text-red-900 px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                        >
                          <span>{show2FASection ? '🔒 Hide 2FA Settings' : '🛡️ Manage 2FA'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30 flex-shrink-0">
                        <div className="text-2xl">👤</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-golden mb-2">Profile Management</h4>
                        <p className="text-golden-light text-sm mb-4">
                          Update your personal information, password, and contact details
                        </p>
                        
                        {/* User Info Display */}
                        <div className="bg-red-800/30 rounded-lg p-3 mb-4 border border-yellow-500/20">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center text-red-900 font-bold">
                              {user?.firstName?.charAt(0)?.toUpperCase()}{user?.lastName?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-golden font-medium">{user?.firstName} {user?.lastName}</div>
                              <div className="text-golden-light text-sm">{user?.email}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-golden-light text-xs opacity-80">
                          Configure password, email, and name settings below
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Update Section */}
                <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <div className="text-xl">✏️</div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-golden">Account Settings</h4>
                      <p className="text-golden-light text-sm">Update your account information and preferences</p>
                    </div>
                  </div>
                  <UserProfileUpdate />
                </div>
                
                {/* Two-Factor Authentication Management */}
                {show2FASection && (
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-lg">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                        <div className="text-xl">🔐</div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-golden">Two-Factor Authentication</h4>
                        <p className="text-golden-light text-sm">Enhanced security for your admin account</p>
                      </div>
                    </div>
                    <TwoFactorAuthManager />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
          onRoleChange={handleRoleChange}
          onCommitteeAssignment={handleCommitteeAssignment}
          onRemoveFromCommittee={handleRemoveFromCommittee}
        />
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          message={editingItem}
          onClose={() => {
            setShowMessageModal(false)
            setEditingItem(null)
          }}
          onSave={(messageData) => {
            // Use the proper handleSaveMessage function
            handleSaveMessage(messageData)
          }}
        />
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={editingItem}
          onClose={() => {
            setShowEventModal(false)
            setEditingItem(null)
          }}
          onSave={async (eventData) => {
            try {
              console.log('Saving event:', eventData)
              
              if (editingItem) {
                // Update existing event
                const response = await EventService.updateEvent(editingItem.id, eventData)
                console.log('Event updated:', response)
                fetchEvents() // Refresh the events list
              } else {
                // Create new event
                const response = await EventService.createEvent(eventData)
                console.log('Event created:', response)
                fetchEvents() // Refresh the events list
              }
              
              setShowEventModal(false)
              setEditingItem(null)
            } catch (error) {
              console.error('Error saving event:', error)
              setError('Failed to save event. Please try again.')
            }
          }}
        />
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <GalleryModal
          photo={editingItem}
          onClose={() => {
            setShowGalleryModal(false)
            setEditingItem(null)
          }}
          onSave={async (photoData) => {
            await handleSaveGalleryPhoto(photoData)
            setShowGalleryModal(false)
            setEditingItem(null)
          }}
        />
      )}

  {/* Award Modal removed (Awards feature removed) */}
    </div>
  )
}

// Enhanced User Edit Modal Component
const UserEditModal = ({ user, onClose, onRoleChange, onCommitteeAssignment, onRemoveFromCommittee }) => {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [selectedCommitteeRole, setSelectedCommitteeRole] = useState(user.committeeRole || '')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isCommitteeMember, setIsCommitteeMember] = useState(user.isCommitteeMember || false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Update role first
    if (selectedRole !== user.role) {
      onRoleChange(user._id, selectedRole)
    }
    
    // Handle committee assignment
    if (isCommitteeMember && selectedCommitteeRole) {
      onCommitteeAssignment(user._id, selectedCommitteeRole, additionalNotes)
    } else if (!isCommitteeMember && user.isCommitteeMember) {
      onRemoveFromCommittee(user._id)
    }
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-900/95 to-amber-900/95 backdrop-blur-lg rounded-2xl w-full max-w-xl border border-yellow-500/40 shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✨</div>
              <div>
                <h3 className="text-lg font-bold text-golden">Edit User</h3>
                <p className="text-golden-light text-sm">Manage roles & permissions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-golden-light hover:text-golden transition-colors text-xl"
            >
              ❌
            </button>
          </div>

          <div className="space-y-4">
            {/* Compact User Info */}
            <div className="bg-red-800/30 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mr-3 text-red-900 font-bold text-sm">
                  {user.firstName?.charAt(0)?.toUpperCase()}{user.lastName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-golden">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-golden-light text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-golden font-semibold mb-3">User Role</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.values(USER_ROLES).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedRole === role
                          ? 'border-yellow-500 bg-yellow-500/20 text-golden'
                          : 'border-yellow-500/30 bg-red-800/30 text-golden-light hover:border-yellow-500/60'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {role === 'admin' ? '🛡️' : role === 'committee_member' ? '🏛️' : '👤'}
                      </div>
                      <div className="font-medium">{role.replace('_', ' ').toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Committee Assignment */}
              <div>
                <label className="block text-golden font-semibold mb-3">Committee Assignment</label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="isCommitteeMember"
                      checked={isCommitteeMember}
                      onChange={(e) => {
                        setIsCommitteeMember(e.target.checked)
                        if (!e.target.checked) {
                          setSelectedCommitteeRole('')
                          setAdditionalNotes('')
                        }
                      }}
                      className="w-5 h-5 text-yellow-600 border-yellow-500/30 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="isCommitteeMember" className="text-golden">
                      Assign as Committee Member
                    </label>
                  </div>

                  {isCommitteeMember && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-golden font-medium mb-2">Committee Role</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.values(COMMITTEE_ROLES).map(role => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setSelectedCommitteeRole(role)}
                              className={`p-3 rounded-lg border transition-all duration-300 ${
                                selectedCommitteeRole === role
                                  ? 'border-yellow-500 bg-yellow-500/20 text-golden'
                                  : 'border-yellow-500/30 bg-red-800/30 text-golden-light hover:border-yellow-500/60'
                              }`}
                            >
                              {role.replace('_', ' ').toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-golden font-medium mb-2">Additional Details (Optional)</label>
                        <textarea
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          placeholder="Add any additional notes or details for this committee member..."
                          className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 text-golden placeholder-golden-light/50 resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ✅ Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Message Modal Component
const MessageModal = ({ message, onClose, onSave }) => {
  const [title, setTitle] = useState(message?.title || '')
  const [content, setContent] = useState(message?.content || '')
  const [author, setAuthor] = useState(message?.author || '')
  const [category, setCategory] = useState(message?.category || 'general')
  const [priority, setPriority] = useState(message?.priority || 'medium')
  const [expiryDate, setExpiryDate] = useState(message?.expiryDate || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: message?.id || Date.now(),
      title,
      content,
      author,
      category,
      priority,
      expiryDate: expiryDate || null
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl border border-golden/40 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-golden">
            {message ? 'Edit Message' : 'Create New Message'}
          </h3>
          <button
            onClick={onClose}
            className="text-golden hover:text-golden-light cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Message Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
              placeholder="Enter message title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
              placeholder="Enter author name..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
              >
                <option value="general">General</option>
                <option value="announcement">Announcement</option>
                <option value="festival">Festival</option>
                <option value="community">Community</option>
                <option value="important">Important</option>
              </select>
            </div>
            
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Expiry Date (Optional)</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Message Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none resize-none"
              placeholder="Write your message content here..."
              required
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-golden to-golden-light text-red-950 py-3 rounded-lg font-bold hover:from-golden-light hover:to-golden transition-all duration-300 cursor-pointer"
            >
              {message ? 'Update Message' : 'Create Message'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red-900/60 text-golden-light py-3 rounded-lg font-bold hover:bg-red-800/60 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Event Modal Component
const EventModal = ({ event, onClose, onSave }) => {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [startDate, setStartDate] = useState(event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '')
  const [endDate, setEndDate] = useState(event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '')
  const [startTime, setStartTime] = useState(event?.startTime || '10:00')
  const [endTime, setEndTime] = useState(event?.endTime || '18:00')
  const [location, setLocation] = useState(event?.venue?.name || event?.location || '')
  const [icon, setIcon] = useState(event?.icon || '🎭')
  const [category, setCategory] = useState(event?.category || 'festival')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate dates
    if (!startDate || !endDate) {
      alert('Please select both start and end dates')
      return
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date cannot be earlier than start date')
      return
    }

    onSave({
      id: event?.id || event?._id || Date.now(),
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      icon,
      category
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl border border-golden/40 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-golden">
            {event ? 'Edit Event' : 'Create New Event'}
          </h3>
          <button
            onClick={onClose}
            className="text-golden hover:text-golden-light cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
                placeholder="Enter event title..."
                required
              />
            </div>
            
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
                required
              >
                <option value="festival">Festival</option>
                <option value="ritual">Ritual</option>
                <option value="cultural-program">Cultural Program</option>
                <option value="charity">Charity</option>
                <option value="educational">Educational</option>
                <option value="community-service">Community Service</option>
                <option value="celebration">Celebration</option>
                <option value="workshop">Workshop</option>
                <option value="competition">Competition</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Icon</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
                placeholder="🎭"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
              placeholder="KTYA Community Hall"
              required
            />
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none resize-none"
              placeholder="Describe the event..."
              required
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-golden to-golden-light text-red-950 py-3 rounded-lg font-bold hover:from-golden-light hover:to-golden transition-all duration-300 cursor-pointer"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red-900/60 text-golden-light py-3 rounded-lg font-bold hover:bg-red-800/60 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Gallery Modal Component
const GalleryModal = ({ photo, onClose, onSave }) => {
  const [title, setTitle] = useState(photo?.title || '')
  const [category, setCategory] = useState(photo?.category ? PhotoUploadService.mapCategoryToFrontend(photo.category) : 'Festivals')
  const [description, setDescription] = useState(photo?.description || '')
  const [imageFile, setImageFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: photo?._id || photo?.id || Date.now(),
      title,
      category,
      description,
      imageFile
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl border border-golden/40 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-golden">
            {photo ? 'Edit Photo' : 'Upload New Photo'}
          </h3>
          <button
            onClick={onClose}
            className="text-golden hover:text-golden-light cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Photo Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
              placeholder="Enter photo title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light focus:border-golden focus:outline-none"
              required
            >
              <option value="Festivals">Festivals</option>
              <option value="Community Events">Community Events</option>
              <option value="Volunteers">Volunteers</option>
              <option value="Behind the Scenes">Behind the Scenes</option>
              <option value="Cultural Activities">Cultural Activities</option>
              <option value="Worship">Worship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
              placeholder="Enter photo description..."
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-golden/20 file:text-golden hover:file:bg-golden/30 focus:border-golden focus:outline-none"
              required={!photo}
            />
            {photo && (
              <div className="mt-2 text-golden-light text-sm">
                Leave empty to keep current photo, select new file to replace
              </div>
            )}
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-golden to-golden-light text-red-950 py-3 rounded-lg font-bold hover:from-golden-light hover:to-golden transition-all duration-300 cursor-pointer"
            >
              {photo ? 'Update Photo' : 'Upload Photo'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red-900/60 text-golden-light py-3 rounded-lg font-bold hover:bg-red-800/60 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Award Modal Component
const AwardModal = ({ award, onClose, onSave }) => {
  const [title, setTitle] = useState(award?.title || '')
  const [category, setCategory] = useState(award?.category || '')
  const [recipient, setRecipient] = useState(award?.recipient || '')
  const [year, setYear] = useState(award?.year || new Date().getFullYear().toString())
  const [description, setDescription] = useState(award?.description || '')
  const [icon, setIcon] = useState(award?.icon || '🏆')
  const [photo, setPhoto] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: award?.id || Date.now(),
      title,
      category,
      recipient,
      year,
      description,
      icon,
      photo
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-950/95 to-amber-900/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl border border-golden/40 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-golden">
            {award ? 'Edit Award' : 'Create New Award'}
          </h3>
          <button
            onClick={onClose}
            className="text-golden hover:text-golden-light cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Award Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
                placeholder="Seva Ratna Award"
                required
              />
            </div>
            
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Icon</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
                placeholder="🏆"
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
                placeholder="Community Service"
                required
              />
            </div>
            
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
                placeholder="2024"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Recipient Name</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none"
              placeholder="Rajesh Patel"
              required
            />
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light placeholder-golden/50 focus:border-golden focus:outline-none resize-none"
              placeholder="For exceptional service to the community..."
              required
            />
          </div>
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Award Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-golden/20 file:text-golden hover:file:bg-golden/30 focus:border-golden focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-golden to-golden-light text-red-950 py-3 rounded-lg font-bold hover:from-golden-light hover:to-golden transition-all duration-300 cursor-pointer"
            >
              {award ? 'Update Award' : 'Create Award'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red-900/60 text-golden-light py-3 rounded-lg font-bold hover:bg-red-800/60 transition-all duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard
