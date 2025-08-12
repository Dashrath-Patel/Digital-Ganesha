import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI, USER_ROLES } from '../services/AdminService'
import Header from '../components/Header'

const CommitteeDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])

  // Check if user is committee member
  const isCommitteeMember = user?.role === USER_ROLES.COMMITTEE_MEMBER || user?.isCommitteeMember

  useEffect(() => {
    if (isCommitteeMember) {
      fetchCommitteeStats()
      fetchRecentActivity()
    }
  }, [isCommitteeMember])

  const fetchCommitteeStats = async () => {
    try {
      setLoading(true)
      // You can create specific committee stats endpoint
      const data = await adminAPI.getDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      if (user?._id) {
        const data = await adminAPI.getUserActivityLogs(user._id, 1, 5)
        setRecentActivity(data.logs || [])
      }
    } catch (err) {
      console.error('Failed to fetch activity:', err)
    }
  }

  if (!isCommitteeMember) {
    return (
      <div className="relative">
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
          <div className="bg-red-900/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-yellow-500/30">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-bold text-golden mb-4">Committee Access Required</h2>
            <p className="text-golden-light">You need to be a committee member to access this dashboard.</p>
            <p className="text-golden-light text-sm mt-2">Contact an administrator to request committee membership.</p>
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
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-golden mb-2">Committee Dashboard</h1>
            <p className="text-golden-light">
              Welcome, {user?.firstName} - {user?.committeeRole?.replace('_', ' ').toUpperCase()}
              {user?.mandal && <span> at {user.mandal.name}</span>}
            </p>
          </div>

          {/* Committee Role Info */}
          <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-golden mb-2">Your Committee Role</h3>
                <p className="text-golden-light">
                  As a <span className="text-golden font-semibold">{user?.committeeRole?.replace('_', ' ')}</span>, 
                  you have access to special features and responsibilities.
                </p>
              </div>
              <div className="text-4xl">🏛️</div>
            </div>
          </div>

          {/* Committee Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Event Management */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-golden">Event Management</h3>
                <div className="text-3xl">🎪</div>
              </div>
              <p className="text-golden-light text-sm mb-4">
                Create and manage festival events, coordinate volunteers, and track attendance.
              </p>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300">
                Manage Events
              </button>
            </div>

            {/* Media Gallery */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-golden">Media Gallery</h3>
                <div className="text-3xl">📸</div>
              </div>
              <p className="text-golden-light text-sm mb-4">
                Upload and manage photos, videos, and other media content for your mandal.
              </p>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300">
                Manage Media
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-golden">Send Notifications</h3>
                <div className="text-3xl">📢</div>
              </div>
              <p className="text-golden-light text-sm mb-4">
                Send announcements and updates to devotees and community members.
              </p>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300">
                Send Notice
              </button>
            </div>

            {/* Analytics */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-golden">View Analytics</h3>
                <div className="text-3xl">📊</div>
              </div>
              <p className="text-golden-light text-sm mb-4">
                View detailed analytics about your mandal's engagement and activities.
              </p>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300">
                View Reports
              </button>
            </div>

            {/* Volunteer Management */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-golden">Volunteers</h3>
                <div className="text-3xl">🤝</div>
              </div>
              <p className="text-golden-light text-sm mb-4">
                Coordinate with volunteers and manage task assignments for events.
              </p>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300">
                Manage Team
              </button>
            </div>

            {/* Content Moderation */}
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-golden">Content Review</h3>
                <div className="text-3xl">🔍</div>
              </div>
              <p className="text-golden-light text-sm mb-4">
                Review and moderate user-generated content and community posts.
              </p>
              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-red-900 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300">
                Review Content
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center">
              <div className="text-2xl font-bold text-golden">{stats.myEvents || 0}</div>
              <div className="text-golden-light text-sm">Events Managed</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center">
              <div className="text-2xl font-bold text-golden">{stats.myAttendees || 0}</div>
              <div className="text-golden-light text-sm">Total Attendees</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center">
              <div className="text-2xl font-bold text-golden">{stats.myVolunteers || 0}</div>
              <div className="text-golden-light text-sm">Active Volunteers</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 text-center">
              <div className="text-2xl font-bold text-golden">{stats.myMediaUploads || 0}</div>
              <div className="text-golden-light text-sm">Media Uploads</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-red-900/80 to-amber-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-golden mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-yellow-500/20 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-600/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs">📝</span>
                      </div>
                      <div>
                        <div className="text-golden text-sm">{activity.action}</div>
                        <div className="text-golden-light text-xs">{new Date(activity.timestamp).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-golden-light text-xs">{activity.details}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-golden-light">
                <div className="text-4xl mb-2">📋</div>
                <p>No recent activity found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommitteeDashboard
