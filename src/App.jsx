import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NewSignUpPage from './pages/NewSignUpPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<div className="auth-page min-h-screen"><LoginPage /></div>} />
            <Route path="/signup" element={<div className="auth-page min-h-screen"><NewSignUpPage /></div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
