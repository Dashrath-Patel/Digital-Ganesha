import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI, COMMITTEE_ROLES, USER_ROLES } from '../services/AdminService'
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

  useEffect(() => {
    fetchUsers()
    fetchStats()
    fetchMandals()
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
      setError(err.message || 'Failed to fetch users')
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

  const fetchMandals = async () => {
    try {
      // Assuming we have an API to fetch mandals
      setMandals([])
    } catch (err) {
      console.error('Failed to fetch mandals:', err)
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

  const handleCommitteeAssignment = async (userId, committeeRole, mandalId) => {
    try {
      await adminAPI.assignToCommittee(userId, committeeRole, mandalId)
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

          {/* Compact Tab Navigation */}
          <div className="bg-gradient-to-br from-red-900/90 to-amber-900/90 backdrop-blur-sm rounded-xl p-1 border border-yellow-500/40 mb-6 shadow-lg">
            <div className="flex space-x-1">
              {[
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'analytics', label: 'Analytics', icon: '📊' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 shadow-md'
                      : 'text-golden hover:bg-red-800/40'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
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

export default AdminDashboard
