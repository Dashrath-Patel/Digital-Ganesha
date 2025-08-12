import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI, COMMITTEE_ROLES, USER_ROLES } from '../services/AdminService'
import Header from '../components/Header'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [mandals, setMandals] = useState([])
  const [activeTab, setActiveTab] = useState('users')

  // Check if user is admin
  const isAdmin = user?.role === USER_ROLES.ADMIN

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
      fetchStats()
      fetchMandals()
    }
  }, [currentPage, searchTerm, isAdmin])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getAllUsers(currentPage, 10, searchTerm)
      setUsers(data.users)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const fetchMandals = async () => {
    try {
      const data = await adminAPI.getAllMandals()
      setMandals(data)
    } catch (err) {
      console.error('Failed to fetch mandals:', err)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole)
      fetchUsers() // Refresh the list
      setShowModal(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCommitteeAssignment = async (userId, committeeRole, mandal) => {
    try {
      await adminAPI.assignToCommittee(userId, committeeRole, mandal)
      fetchUsers() // Refresh the list
      setShowModal(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRemoveFromCommittee = async (userId) => {
    try {
      await adminAPI.removeFromCommittee(userId)
      fetchUsers() // Refresh the list
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(userId, !currentStatus)
      fetchUsers() // Refresh the list
    } catch (err) {
      setError(err.message)
    }
  }

  if (!isAdmin) {
    return (
      <div className="relative">
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
          <div className="bg-red-900/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-yellow-500/30">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-golden mb-4">Access Denied</h2>
            <p className="text-golden-light">You don't have permission to access the admin dashboard.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Header />
      
      <div className="min-h-screen pt-20 px-4" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
        {/* Enhanced Spiritual Background */}
        <div className="absolute inset-0 z-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-60 left-10 text-4xl text-golden animate-float">🌺</div>
            <div className="absolute top-60 right-10 text-3xl text-golden-light animate-float-delay">🌸</div>
            <div className="absolute top-1/2 left-5 text-3xl text-golden opacity-20 animate-pulse delay-700">🕉️</div>
            <div className="absolute bottom-20 right-10 text-4xl text-golden-light opacity-30 animate-bounce delay-1000">🪔</div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl mr-4">🛡️</div>
              <div>
                <h1 className="text-5xl font-bold text-golden mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-golden-light text-lg">Manage users and committee assignments with divine authority</p>
              </div>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full mx-auto"></div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-900/90 to-amber-900/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/40 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-golden-light text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-golden animate-pulse">{stats.totalUsers || 0}</p>
                  <p className="text-xs text-golden-light mt-1">Registered devotees</p>
                </div>
                <div className="text-4xl animate-bounce">👥</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/90 to-amber-900/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/40 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-golden-light text-sm font-medium">Committee Members</p>
                  <p className="text-3xl font-bold text-golden animate-pulse">{stats.committeeMembers || 0}</p>
                  <p className="text-xs text-golden-light mt-1">Active coordinators</p>
                </div>
                <div className="text-4xl animate-bounce">🏛️</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/90 to-amber-900/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/40 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-golden-light text-sm font-medium">Active Mandals</p>
                  <p className="text-3xl font-bold text-golden animate-pulse">{stats.totalMandals || 0}</p>
                  <p className="text-xs text-golden-light mt-1">Community centers</p>
                </div>
                <div className="text-4xl animate-bounce">🏮</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/90 to-amber-900/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/40 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-golden-light text-sm font-medium">New This Month</p>
                  <p className="text-3xl font-bold text-golden animate-pulse">{stats.newThisMonth || 0}</p>
                  <p className="text-xs text-golden-light mt-1">Recent registrations</p>
                </div>
                <div className="text-4xl animate-bounce">📈</div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-900/60 to-amber-900/60 backdrop-blur-sm rounded-2xl p-2 border border-yellow-500/30">
              <div className="flex space-x-2">
                {[
                  { id: 'users', label: 'User Management', icon: '👥' },
                  { id: 'analytics', label: 'Analytics', icon: '📊' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 shadow-lg transform scale-105'
                        : 'text-golden hover:bg-yellow-600/20 hover:text-golden-light'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeTab === 'users' && (
            <>
              {/* Enhanced Search Section */}
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/40 mb-8 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-red-800/50 border border-yellow-500/30 rounded-xl px-4 py-3 pl-12 text-golden placeholder-golden-light focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden-light">
                      🔍
                    </div>
                  </div>
                  <button
                    onClick={() => fetchUsers()}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>🔍</span>
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Enhanced Users Table */}
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-2xl border border-yellow-500/40 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-yellow-500/30">
                  <h3 className="text-2xl font-bold text-golden flex items-center">
                    <span className="text-3xl mr-3">👥</span>
                    User Management
                  </h3>
                  <p className="text-golden-light mt-1">Manage user roles and committee assignments</p>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin text-6xl text-golden mb-4">⚡</div>
                    <p className="text-golden-light text-lg">Loading divine data...</p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-red-400 text-lg">{error}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-red-800/60 to-amber-800/60">
                        <tr>
                          <th className="text-left px-6 py-4 text-golden font-semibold">User</th>
                          <th className="text-left px-6 py-4 text-golden font-semibold">Role</th>
                          <th className="text-left px-6 py-4 text-golden font-semibold">Committee</th>
                          <th className="text-left px-6 py-4 text-golden font-semibold">Status</th>
                          <th className="text-left px-6 py-4 text-golden font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((userData, index) => (
                          <tr 
                            key={userData._id} 
                            className={`border-b border-yellow-500/20 hover:bg-yellow-600/10 transition-all duration-300 ${
                              index % 2 === 0 ? 'bg-red-900/20' : 'bg-amber-900/20'
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mr-4 text-red-900 font-bold text-lg shadow-lg">
                                  {userData.firstName?.charAt(0)?.toUpperCase()}{userData.lastName?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-golden text-lg">
                                    {userData.firstName} {userData.lastName}
                                  </div>
                                  <div className="text-golden-light text-sm">{userData.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                userData.role === 'admin' 
                                  ? 'bg-red-600/80 text-white' 
                                  : userData.role === 'committee_member'
                                  ? 'bg-purple-600/80 text-white'
                                  : 'bg-blue-600/80 text-white'
                              }`}>
                                {userData.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-golden-light">
                                {userData.isCommitteeMember ? (
                                  <span className="flex items-center">
                                    <span className="text-lg mr-2">🏛️</span>
                                    {userData.committeeRole?.replace('_', ' ').toUpperCase() || 'Member'}
                                  </span>
                                ) : (
                                  <span className="text-golden-light/60">Not a member</span>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`flex items-center ${
                                userData.isActive ? 'text-green-400' : 'text-red-400'
                              }`}>
                                <span className="text-lg mr-2">
                                  {userData.isActive ? '✅' : '❌'}
                                </span>
                                {userData.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openEditModal(userData)}
                                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(userData._id, !userData.isActive)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                                    userData.isActive
                                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white'
                                      : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white'
                                  }`}
                                >
                                  {userData.isActive ? 'Block' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t border-yellow-500/30">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-500 text-red-900 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 shadow-lg'
                                : 'bg-red-800/50 text-golden hover:bg-yellow-600/20'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-500 text-red-900 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-golden-light text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-golden">{stats.totalUsers || 0}</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-golden-light text-sm">Committee Members</p>
                    <p className="text-2xl font-bold text-golden">{stats.committeeMembers || 0}</p>
                  </div>
                  <div className="text-3xl">🏛️</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-golden-light text-sm">Active Mandals</p>
                    <p className="text-2xl font-bold text-golden">{stats.activeMandals || 0}</p>
                  </div>
                  <div className="text-3xl">🏺</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-golden-light text-sm">New This Month</p>
                    <p className="text-2xl font-bold text-golden">{stats.newUsersThisMonth || 0}</p>
                  </div>
                  <div className="text-3xl">📈</div>
                </div>
              </div>
            </div>

            {/* Enhanced Search Section */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/40 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-red-950/50 border border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-golden placeholder-golden/50"
                  />
                </div>
                <button
                  onClick={() => fetchUsers()}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
                >
                  🔍 Search
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-800/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}

            {/* Users Table */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl border border-yellow-500/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-red-950/50 border-b border-yellow-500/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-golden">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-golden">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-golden">Committee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-golden">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-golden">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-golden-light">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden"></div>
                          <span className="ml-2">Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-golden-light">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="border-b border-yellow-500/20 hover:bg-red-950/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center text-red-900 font-bold text-sm mr-3">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div>
                              <div className="text-golden font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-golden-light text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN
                              ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                              : user.role === USER_ROLES.COMMITTEE_MEMBER
                              ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
                              : 'bg-gray-900/50 text-gray-300 border border-gray-500/30'
                          }`}>
                            {user.role?.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isCommitteeMember ? (
                            <div>
                              <div className="text-golden text-sm font-medium">
                                {user.committeeRole?.replace('_', ' ').toUpperCase()}
                              </div>
                              {user.mandal && (
                                <div className="text-golden-light text-xs">{user.mandal.name}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-golden-light text-sm">Not a member</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                              : 'bg-red-900/50 text-red-300 border border-red-500/30'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowModal(true)
                              }}
                              className="bg-blue-600/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                user.isActive
                                  ? 'bg-red-600/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                                  : 'bg-green-600/20 hover:bg-green-500/30 text-green-300 border border-green-500/30'
                              }`}
                            >
                              {user.isActive ? 'Block' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-golden-light">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-yellow-600/20 text-yellow-300 border border-yellow-500/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-golden mb-2">Analytics Dashboard</h3>
                <p className="text-golden-light">Advanced analytics and reporting features coming soon...</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                <h4 className="text-lg font-semibold text-golden mb-4 flex items-center">
                  📈 User Growth
                </h4>
                <p className="text-golden-light">Track user registration trends over time</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                <h4 className="text-lg font-semibold text-golden mb-4 flex items-center">
                  🏛️ Committee Activity
                </h4>
                <p className="text-golden-light">Monitor committee member engagement</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30">
              <div className="text-center">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-2xl font-bold text-golden mb-2">System Settings</h3>
                <p className="text-golden-light">Configure system preferences and permissions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                <h4 className="text-lg font-semibold text-golden mb-4 flex items-center">
                  🔒 Security Settings
                </h4>
                <p className="text-golden-light mb-4">Manage authentication and access controls</p>
                <button className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded">
                  Configure
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                <h4 className="text-lg font-semibold text-golden mb-4 flex items-center">
                  📧 Email Settings
                </h4>
                <p className="text-golden-light mb-4">Configure email notifications and templates</p>
                <button className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded">
                  Configure
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                <h4 className="text-lg font-semibold text-golden mb-4 flex items-center">
                  🏛️ Mandal Management
                </h4>
                <p className="text-golden-light mb-4">Add, edit, or remove mandal organizations</p>
                <button className="bg-yellow-600/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded">
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
      <div className="bg-gradient-to-br from-red-900/95 to-amber-900/95 backdrop-blur-lg rounded-3xl w-full max-w-2xl border border-yellow-500/40 shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="text-4xl mr-4">✨</div>
              <div>
                <h3 className="text-2xl font-bold text-golden">Edit User</h3>
                <p className="text-golden-light">Manage user roles and permissions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-golden-light hover:text-golden transition-colors duration-300 text-2xl"
            >
              ❌
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-red-800/30 rounded-2xl p-6 border border-yellow-500/20">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mr-4 text-red-900 font-bold text-xl shadow-lg">
                  {user.firstName?.charAt(0)?.toUpperCase()}{user.lastName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-golden">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-golden-light">{user.email}</p>
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

export default AdminDashboard
