import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CulturalLearningPage from './pages/CulturalLearningPage';
import CommunityPage from './pages/CommunityPage';
import VirtualDarshanPage from './pages/VirtualDarshanPage';
import MandalLocatorPage from './pages/MandalLocatorPage';
import AdminDashboard from './pages/AdminDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen relative" style={{ backgroundColor: 'rgb(21, 21, 21)' }}>
            {/* Enhanced Spiritual Background - Without Circles */}
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(160, 40, 40, 0.3)' }}>
              {/* Floating Petals */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-60 left-10 text-4xl animate-float" style={{ color: 'rgb(255, 215, 0)' }}>🌺</div>
                <div className="absolute top-60 right-10 text-3xl animate-float-delay" style={{ color: 'rgb(255, 215, 0)' }}>🌸</div>
              </div>
            </div>

            {/* Enhanced Floating Spiritual Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-5 text-6xl opacity-20 animate-pulse" style={{ color: 'rgb(255, 215, 0)' }}>🕉️</div>
              <div className="absolute top-20 right-5 text-6xl opacity-20 animate-pulse" style={{ color: 'rgb(255, 215, 0)' }}>🕉️</div>
              <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-pulse delay-700" style={{ color: 'rgb(255, 215, 0)' }}>📿</div>
              <div className="absolute bottom-10 right-5 text-5xl opacity-25 animate-bounce delay-500" style={{ color: 'rgb(255, 215, 0)' }}>🌺</div>
              <div className="absolute top-1/2 left-5 text-3xl opacity-20 animate-pulse delay-1000" style={{ color: 'rgb(255, 215, 0)' }}>🔱</div>
              <div className="absolute top-1/2 right-5 text-3xl opacity-20 animate-bounce delay-1200" style={{ color: 'rgb(255, 215, 0)' }}>🐚</div>
            </div>
            
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/cultural-learning" element={<CulturalLearningPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/mandal-locator" element={<MandalLocatorPage />} />
                <Route path="/virtual-darshan" element={<VirtualDarshanPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/committee" element={
                  <ProtectedRoute>
                    <CommitteeDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
