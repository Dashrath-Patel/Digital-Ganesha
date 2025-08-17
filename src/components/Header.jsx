import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../services/AdminService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show Home, About, Features, Contact for admin compact header
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    // Check if it's a hash link (internal section) or a route
    if (href.startsWith('#')) {
      const sectionId = href.substring(1); // Remove the # symbol
      
      // If we're not on the home page, navigate to home page first
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
        // Wait a bit for navigation to complete, then scroll
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      } else {
        // If we're already on home page, just scroll
        scrollToSection(sectionId);
      }
    } else {
      // It's a route, navigate directly
      navigate(href);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-md border-b border-red-200/30 shadow-sm bg-gradient-to-br from-red-950 via-red-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-all duration-200 group">
            {/* Ganesha Image */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-yellow-400 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center">
                {/* Placeholder until actual image is added */}
                <img src="/header-logo.png" alt="ganesha" className="text-lg md:text-xl" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base md:text-lg font-bold tracking-widest drop-shadow-lg group-hover:opacity-90 transition-all duration-200 leading-none mb-1" style={{ color: 'rgb(255, 215, 0)' }}>
                KTYA
              </span>
              <span className="text-[10px] md:text-xs font-medium drop-shadow-md leading-none mb-0.5" style={{ color: 'rgb(255, 215, 0)' }}>
                Krishna Township Youth Association
              </span>
              <span className="text-[9px] md:text-[10px] font-small drop-shadow-md leading-none" style={{ color: 'rgb(255, 215, 0)' }}>
                (Regn. No: MH/890/03/Thane)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center text-yellow-400 font-semibold text-base">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-base font-semibold hover:opacity-80 transition-colors duration-200 drop-shadow-lg hover:drop-shadow-xl"
                style={{ color: 'rgb(255, 215, 0)' }}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button / Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Role-based Dashboard Links */}
                {user?.role === USER_ROLES.ADMIN && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-golden px-3 py-2 rounded-lg transition-colors duration-200 border border-yellow-500/30 cursor-pointer"
                  >
                    <span className="text-sm">🛡️</span>
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
                
                {(user?.role === USER_ROLES.COMMITTEE_MEMBER || user?.isCommitteeMember) && (
                  <Link
                    to="/committee"
                    className="flex items-center space-x-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-golden px-3 py-2 rounded-lg transition-colors duration-200 border border-yellow-500/30 cursor-pointer"
                  >
                    <span className="text-sm">🏛️</span>
                    <span className="font-medium">Committee</span>
                  </Link>
                )}

                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-red-900 text-sm font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase() || (user?.name ? user.name.charAt(0)?.toUpperCase() : 'U')}
                    </span>
                  </div>
                  <span className="font-medium" style={{ color: 'rgb(255, 215, 0)' }}>
                    Welcome, {user?.firstName || (user?.name ? user.name.split(' ')[0] : 'User')}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-yellow-500 hover:bg-yellow-400 text-red-900 px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="font-semibold hover:opacity-80 transition-colors duration-200 drop-shadow-lg cursor-pointer"
                  style={{ color: 'rgb(255, 215, 0)' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-yellow-500 hover:bg-yellow-400 text-red-900 px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:opacity-80 transition-colors duration-200 drop-shadow-lg cursor-pointer"
              style={{ color: 'rgb(255, 215, 0)' }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2 shadow-xl border border-red-300/30" style={{ backgroundColor: 'rgba(200, 70, 70, 0.9)' }}>
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 font-semibold hover:opacity-80 hover:bg-white/10 rounded-md transition-colors duration-200 drop-shadow-md cursor-pointer"
                  style={{ color: 'rgb(255, 215, 0)' }}
                >
                  {item.name}
                </button>
              ))}

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="border-t border-red-300/30 pt-3 mt-3">
                  {/* Role-based Dashboard Links for Mobile */}
                  {user?.role === USER_ROLES.ADMIN && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 w-full hover:bg-white/10 rounded-md transition-colors duration-200 mb-2 cursor-pointer"
                    >
                      <span className="text-sm">🛡️</span>
                      <span className="font-medium text-golden">Admin Dashboard</span>
                    </Link>
                  )}
                  
                  {(user?.role === USER_ROLES.COMMITTEE_MEMBER || user?.isCommitteeMember) && (
                    <Link
                      to="/committee"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 w-full hover:bg-white/10 rounded-md transition-colors duration-200 mb-2 cursor-pointer"
                    >
                      <span className="text-sm">🏛️</span>
                      <span className="font-medium text-golden">Committee Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2 w-full hover:bg-white/10 rounded-md transition-colors duration-200 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-red-900 text-sm font-bold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-medium" style={{ color: 'rgb(255, 215, 0)' }}>
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-red-900 px-3 py-2 rounded-md transition-colors duration-200 font-medium mt-2 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-red-300/30 pt-3 mt-3 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 font-semibold hover:opacity-80 hover:bg-white/10 rounded-md transition-colors duration-200 drop-shadow-md cursor-pointer"
                    style={{ color: 'rgb(255, 215, 0)' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-yellow-500 hover:bg-yellow-400 text-red-900 px-3 py-2 rounded-md transition-all duration-200 font-semibold shadow-lg text-center cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;