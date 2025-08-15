import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI, COMMITTEE_ROLES, USER_ROLES } from '../services/AdminService'
import MessageService from '../services/MessageService'
import { EventService } from '../services/api/EventService'
import ImageKitService from '../services/ImageKitService'
import Header from '../components/Header'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [mandals, setMandals] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [messages, setMessages] = useState([])
  const [events, setEvents] = useState([])
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [awards, setAwards] = useState([])
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [showAwardModal, setShowAwardModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetchUsers()
    fetchStats()
    fetchMandals()
    fetchMessages()
    fetchEvents()
    fetchGalleryPhotos()
  }, [currentPage, searchTerm])

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

  const fetchMandals = async () => {
    try {
      // Assuming we have an API to fetch mandals
      setMandals([])
    } catch (err) {
      console.error('Failed to fetch mandals:', err)
    }
  }

  const fetchGalleryPhotos = async () => {
    try {
      const categories = ['ganesh-chaturthi', 'community-volunteers', 'cultural-programs'];
      const categoryMap = {
        'ganesh-chaturthi': 'Ganesh Chaturthi',
        'community-volunteers': 'Community Volunteers',
        'cultural-programs': 'Cultural Programs'
      };
      
      const allPhotos = [];
      for (const category of categories) {
        try {
          const data = await ImageKitService.getGalleryPhotos(category);
          const photos = data.photos.map(photo => ({
            id: photo._id || photo.fileId,
            title: photo.title || 'Untitled',
            category: categoryMap[category],
            date: photo.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
            url: photo.url || photo.thumbnailUrl,
            fileId: photo.fileId
          }));
          allPhotos.push(...photos);
        } catch (err) {
          console.error(`Failed to fetch ${category} photos:`, err);
        }
      }
      setGalleryPhotos(allPhotos);
    } catch (err) {
      console.error('Failed to fetch gallery photos:', err)
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

  const handleToggleMessageStatus = async (messageId) => {
    try {
      await MessageService.toggleMessageStatus(messageId)
      fetchMessages()
    } catch (err) {
      console.error('Failed to toggle message status:', err)
      setError(err.message || 'Failed to toggle message status')
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

  const handleDeleteGalleryPhoto = async (photo) => {
    if (window.confirm(`Are you sure you want to delete "${photo.title}"?`)) {
      try {
        await ImageKitService.deleteGalleryPhoto(photo.fileId);
        // Remove from local state
        setGalleryPhotos(prev => prev.filter(p => p.id !== photo.id));
        alert('Photo deleted successfully!');
      } catch (error) {
        console.error('Gallery delete error:', error);
        alert('Failed to delete photo: ' + error.message);
      }
    }
  };

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
    <div className="relative">
      <Header />
      
      <div className="min-h-screen pt-16 px-4" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
        {/* Subtle Spiritual Background */}
        <div className="absolute inset-0 z-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.2)' }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-32 left-10 text-2xl text-golden animate-float">🌺</div>
            <div className="absolute top-32 right-10 text-2xl text-golden-light animate-float-delay">🌸</div>
            <div className="absolute bottom-20 right-10 text-2xl text-golden-light opacity-30 animate-bounce delay-1000">🪔</div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Compact Header */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="text-4xl mr-3">🛡️</div>
              <h1 className="text-3xl font-bold text-golden bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-golden-light">Manage users and committee assignments</p>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="bg-gradient-to-br from-red-950/90 to-amber-900/90 backdrop-blur-sm rounded-xl p-1 border border-yellow-500/40 mb-6 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-1">
              {[
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'messages', label: 'Messages', icon: '📢' },
                { id: 'events', label: 'Events', icon: '📅' },
                { id: 'gallery', label: 'Gallery', icon: '📸' },
                { id: 'awards', label: 'Awards', icon: '🏆' },
                { id: 'analytics', label: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 shadow-md'
                      : 'text-golden hover:bg-red-800/40'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-xs">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'users' && (
              <div className="space-y-4">
                {/* Compact Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-golden-light text-xs">Total Users</p>
                        <p className="text-lg font-bold text-golden">{stats.totalUsers || 0}</p>
                      </div>
                      <div className="text-2xl">👥</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-golden-light text-xs">Committee</p>
                        <p className="text-lg font-bold text-golden">{stats.committeeMembers || 0}</p>
                      </div>
                      <div className="text-2xl">🏛️</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-golden-light text-xs">Mandals</p>
                        <p className="text-lg font-bold text-golden">{stats.activeMandals || 0}</p>
                      </div>
                      <div className="text-2xl">🏺</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-golden-light text-xs">New Users</p>
                        <p className="text-lg font-bold text-golden">{stats.newUsersThisMonth || 0}</p>
                      </div>
                      <div className="text-2xl">📈</div>
                    </div>
                  </div>
                </div>

                {/* Compact Search Section */}
                <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/40">
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-3 py-2 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 text-golden placeholder-golden/50 text-sm"
                    />
                    <button
                      onClick={() => fetchUsers()}
                      className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 text-sm"
                    >
                      🔍
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-800/50 border border-red-500/50 text-red-300 px-3 py-2 rounded-lg text-sm">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                )}

                {/* Compact Users Table */}
                <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg border border-yellow-500/30 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-red-950/50 border-b border-yellow-500/30">
                        <tr>
                          <th className="px-4 py-2 text-left text-golden font-medium">User</th>
                          <th className="px-4 py-2 text-left text-golden font-medium">Role</th>
                          <th className="px-4 py-2 text-left text-golden font-medium">Committee</th>
                          <th className="px-4 py-2 text-left text-golden font-medium">Status</th>
                          <th className="px-4 py-2 text-left text-golden font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-golden-light">
                              <div className="flex items-center justify-center text-sm">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-golden"></div>
                                <span className="ml-2">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-golden-light text-sm">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user._id} className="border-b border-yellow-500/20 hover:bg-red-950/30">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center text-red-900 font-bold text-xs mr-2">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </div>
                                  <div>
                                    <div className="text-golden font-medium text-sm">{user.firstName} {user.lastName}</div>
                                    <div className="text-golden-light text-xs">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                  user.role === USER_ROLES.ADMIN
                                    ? 'bg-purple-900/50 text-purple-300'
                                    : user.role === USER_ROLES.COMMITTEE_MEMBER
                                    ? 'bg-blue-900/50 text-blue-300'
                                    : 'bg-gray-900/50 text-gray-300'
                                }`}>
                                  {user.role?.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {user.isCommitteeMember ? (
                                  <div>
                                    <div className="text-golden text-xs font-medium">
                                      {user.committeeRole?.replace('_', ' ').toUpperCase()}
                                    </div>
                                    {user.mandal && (
                                      <div className="text-golden-light text-xs">{user.mandal.name}</div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-golden-light text-xs">Not a member</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                                  user.isActive
                                    ? 'bg-green-900/50 text-green-300'
                                    : 'bg-red-900/50 text-red-300'
                                }`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setShowModal(true)
                                    }}
                                    className="bg-blue-600/20 hover:bg-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs transition-colors"
                                    title="Edit User"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                    className={`px-2 py-1 rounded text-xs transition-colors ${
                                      user.isActive
                                        ? 'bg-red-600/20 hover:bg-red-500/30 text-red-300'
                                        : 'bg-green-600/20 hover:bg-green-500/30 text-green-300'
                                    }`}
                                    title={user.isActive ? 'Block User' : 'Activate User'}
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

                  {/* Compact Pagination */}
                  {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-yellow-500/30">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-golden-light">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-2 py-1 bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ← Prev
                          </button>
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-2 py-1 bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compact Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30 text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="text-lg font-bold text-golden mb-1">Analytics Dashboard</h3>
                  <p className="text-golden-light text-sm">Advanced analytics coming soon...</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
                      📈 User Growth
                    </h4>
                    <p className="text-golden-light text-xs">Track user registration trends</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
                      🏛️ Committee Activity
                    </h4>
                    <p className="text-golden-light text-xs">Monitor member engagement</p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Management Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-golden">Admin Messages</h3>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 cursor-pointer"
                  >
                    + Create Message
                  </button>
                </div>
                
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message._id || message.id} 
                      className="group bg-gradient-to-r from-red-950/80 to-amber-950/80 backdrop-blur-lg rounded-xl p-4 border border-golden/20 hover:border-golden/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        {/* Left Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title with Tags */}
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              message.isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}></div>
                            <h4 className="text-lg font-semibold text-golden truncate">
                              {message.title}
                            </h4>
                            
                            {/* Author Tag */}
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 flex-shrink-0">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {message.author}
                            </span>
                            
                            {/* Category Tag */}
                            {message.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {message.category}
                              </span>
                            )}

                            {/* Status Tag */}
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                              message.isActive 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {message.isActive ? 'Active' : 'Inactive'}
                            </span>
                            
                            {/* Priority Tag */}
                            {message.priority && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                                message.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                message.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                message.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {message.priority.toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Content and Meta */}
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-golden-light/80 text-sm truncate pr-4">
                                {message.content}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-golden-light/60">
                                <span className="flex items-center space-x-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{new Date(message.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}</span>
                                </span>
                                {message.expiryDate && (
                                  <span className="flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Expires {new Date(message.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {setEditingItem(message); setShowMessageModal(true);}}
                            className="flex items-center justify-center w-8 h-8 bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/60 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
                            title="Edit Message"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleToggleMessageStatus(message._id || message.id)}
                            className={`flex items-center justify-center w-8 h-8 border rounded-lg transition-all duration-200 ${
                              message.isActive 
                                ? 'bg-orange-500/30 hover:bg-orange-500/50 border-orange-400/60 text-orange-300 hover:text-orange-200'
                                : 'bg-green-500/30 hover:bg-green-500/50 border-green-400/60 text-green-300 hover:text-green-200'
                            }`}
                            title={message.isActive ? 'Deactivate Message' : 'Activate Message'}
                          >
                            {message.isActive ? (
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
                            onClick={() => handleDeleteMessage(message._id || message.id)}
                            className="flex items-center justify-center w-8 h-8 bg-red-500/30 hover:bg-red-500/50 border border-red-400/60 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
                            title="Delete Message"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-golden/20 to-amber-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-golden/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-golden mb-2">No Messages Yet</h3>
                      <p className="text-golden-light/80 mb-4 text-sm max-w-md mx-auto">
                        Create your first community message to get started.
                      </p>
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-golden to-golden-light text-red-950 font-medium rounded-lg hover:from-golden-light hover:to-golden transition-all duration-300 text-sm"
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

            {/* Gallery Management Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-golden">Community Gallery</h3>
                  <button
                    onClick={() => setShowGalleryModal(true)}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 cursor-pointer"
                  >
                    + Upload Photos
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryPhotos.map((photo) => (
                    <div key={photo.id} className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30">
                      <div className="aspect-square bg-red-800/40 rounded-lg mb-3 overflow-hidden">
                        {photo.url ? (
                          <img 
                            src={photo.url} 
                            alt={photo.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center" style={{ display: photo.url ? 'none' : 'flex' }}>
                          <span className="text-4xl">📸</span>
                        </div>
                      </div>
                      <h5 className="text-golden text-sm font-semibold truncate">{photo.title}</h5>
                      <p className="text-golden-light text-xs">{photo.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-golden-light text-xs">{new Date(photo.date).toLocaleDateString()}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {setEditingItem(photo); setShowGalleryModal(true);}}
                            className="text-yellow-400 hover:text-yellow-300 cursor-pointer text-sm"
                            title="Edit photo"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteGalleryPhoto(photo)}
                            className="text-red-400 hover:text-red-300 cursor-pointer text-sm"
                            title="Delete photo"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards Management Tab */}
            {activeTab === 'awards' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-golden">Community Awards</h3>
                  <button
                    onClick={() => setShowAwardModal(true)}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 cursor-pointer"
                  >
                    + Create Award
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {awards.map((award) => (
                    <div key={award.id} className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">{award.icon}</span>
                            <h4 className="text-golden font-semibold">{award.title}</h4>
                          </div>
                          <p className="text-golden-light text-sm">🏆 {award.category}</p>
                          <p className="text-golden-light text-sm">👤 {award.recipient}</p>
                          <p className="text-golden-light text-sm">📅 {award.year}</p>
                          <p className="text-golden-light/80 text-xs mt-2 line-clamp-2">{award.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {setEditingItem(award); setShowAwardModal(true);}}
                            className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                          >
                            ✏️
                          </button>
                          <button className="text-red-400 hover:text-red-300 cursor-pointer">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30 text-center">
                  <div className="text-4xl mb-2">⚙️</div>
                  <h3 className="text-lg font-bold text-golden mb-1">System Settings</h3>
                  <p className="text-golden-light text-sm">Configure system preferences</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
                      🔒 Security
                    </h4>
                    <p className="text-golden-light text-xs mb-3">Authentication & access controls</p>
                    <button className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded text-xs">
                      Configure
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
                      📧 Email
                    </h4>
                    <p className="text-golden-light text-xs mb-3">Notifications & templates</p>
                    <button className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded text-xs">
                      Configure
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
                    <h4 className="text-sm font-semibold text-golden mb-2 flex items-center">
                      🏛️ Mandals
                    </h4>
                    <p className="text-golden-light text-xs mb-3">Manage organizations</p>
                    <button className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded text-xs">
                      Manage
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                    <h4 className="text-lg font-semibold text-golden mb-4 flex items-center">
                      🎨 Theme Settings
                    </h4>
                    <p className="text-golden-light mb-4">Customize the application appearance</p>
                    <button className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded">
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          mandals={mandals}
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
            try {
              if (!photoData.imageFile) {
                alert('Please select an image file');
                return;
              }

              // Map categories to backend format
              const categoryMap = {
                'Ganesh Chaturthi': 'ganesh-chaturthi',
                'Community Volunteers': 'community-volunteers',
                'Cultural Programs': 'cultural-programs'
              };

              const mappedCategory = categoryMap[photoData.category];
              if (!mappedCategory) {
                alert('Invalid category selected');
                return;
              }

              // Upload to ImageKit using the gallery service
              const result = await ImageKitService.uploadGalleryPhotos([photoData.imageFile], mappedCategory);
              
              alert('Photo uploaded successfully!');
              
              // Refresh gallery photos
              fetchGalleryPhotos();
            } catch (error) {
              console.error('Gallery upload error:', error);
              alert('Failed to upload photo: ' + error.message);
            }
            setShowGalleryModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Award Modal */}
      {showAwardModal && (
        <AwardModal
          award={editingItem}
          onClose={() => {
            setShowAwardModal(false)
            setEditingItem(null)
          }}
          onSave={(awardData) => {
            // Handle save logic
            console.log('Saving award:', awardData)
            setShowAwardModal(false)
            setEditingItem(null)
          }}
        />
      )}
    </div>
  )
}

// Enhanced User Edit Modal Component
const UserEditModal = ({ user, mandals, onClose, onRoleChange, onCommitteeAssignment, onRemoveFromCommittee }) => {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [selectedCommitteeRole, setSelectedCommitteeRole] = useState(user.committeeRole || '')
  const [selectedMandal, setSelectedMandal] = useState(user.mandal?._id || '')
  const [isCommitteeMember, setIsCommitteeMember] = useState(user.isCommitteeMember || false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Update role first
    if (selectedRole !== user.role) {
      onRoleChange(user._id, selectedRole)
    }
    
    // Handle committee assignment
    if (isCommitteeMember && selectedCommitteeRole) {
      onCommitteeAssignment(user._id, selectedCommitteeRole, selectedMandal)
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
                          setSelectedMandal('')
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
                        <label className="block text-golden font-medium mb-2">Mandal Assignment (Optional)</label>
                        <select
                          value={selectedMandal}
                          onChange={(e) => setSelectedMandal(e.target.value)}
                          className="w-full px-4 py-3 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 text-golden"
                        >
                          <option value="">No specific mandal</option>
                          {mandals.map((mandal) => (
                            <option key={mandal._id} value={mandal._id}>
                              {mandal.name}
                            </option>
                          ))}
                        </select>
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
  const [category, setCategory] = useState(photo?.category || 'Ganesh Chaturthi')
  const [imageFile, setImageFile] = useState(null)
  const [fileError, setFileError] = useState('')

  // Get current date for display
  const uploadDate = photo?.date || new Date().toISOString().split('T')[0]
  const formattedDate = new Date(uploadDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, JPG, and PNG formats are allowed';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        setImageFile(null);
        e.target.value = ''; // Clear the input
      } else {
        setFileError('');
        setImageFile(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (fileError) {
      alert('Please fix file validation errors before submitting');
      return;
    }
    onSave({
      id: photo?.id || Date.now(),
      title,
      category,
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
              <option value="Ganesh Chaturthi">Ganesh Chaturthi</option>
              <option value="Community Volunteers">Community Volunteers</option>
              <option value="Cultural Programs">Cultural Programs</option>
            </select>
          </div>

          {photo && (
            <div>
              <label className="block text-golden text-sm font-semibold mb-2">Upload Date</label>
              <div className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light">
                {formattedDate}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-golden text-sm font-semibold mb-2">Upload Photo</label>
            <input
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleFileChange}
              className="w-full bg-red-900/40 border border-golden/30 rounded-lg px-4 py-3 text-golden-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-golden/20 file:text-golden hover:file:bg-golden/30 focus:border-golden focus:outline-none"
              required={!photo}
            />
            {fileError && (
              <p className="text-red-400 text-sm mt-1">{fileError}</p>
            )}
            <p className="text-golden-light text-xs mt-1">
              Supported formats: JPEG, JPG, PNG • Max size: 5MB
            </p>
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
