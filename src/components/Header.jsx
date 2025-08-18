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
    { name: 'Developers', href: '/developers' },
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-15 md:h-16 lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 hover:opacity-90 transition-all duration-200 group">
            {/* Ganesha Image */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden border border-yellow-400 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center">
                {/* Placeholder until actual image is added */}
                <img src="/header-logo.png" alt="ganesha" className="text-sm sm:text-base md:text-lg lg:text-xl" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-base md:text-lg lg:text-lg font-bold tracking-widest drop-shadow-lg group-hover:opacity-90 transition-all duration-200 leading-none mb-0.5 sm:mb-1" style={{ color: 'rgb(255, 215, 0)' }}>
                KTYA
              </span>
              <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-xs font-medium drop-shadow-md leading-none mb-0.5" style={{ color: 'rgb(255, 215, 0)' }}>
                Krishna Township Youth Association
              </span>
              <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[10px] font-small drop-shadow-md leading-none" style={{ color: 'rgb(255, 215, 0)' }}>
                (Regn. No: MH/890/03/Thane)
              </span>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex gap-3 lg:gap-6 items-center text-yellow-400 font-semibold">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-sm md:text-sm lg:text-base font-semibold hover:opacity-80 transition-colors duration-200 drop-shadow-lg hover:drop-shadow-xl whitespace-nowrap"
                style={{ color: 'rgb(255, 215, 0)' }}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button / Auth Section */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
                {/* Role-based Dashboard Links */}
                {user?.role === USER_ROLES.ADMIN && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-center bg-yellow-600/20 hover:bg-yellow-600/30 text-golden px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors duration-200 border border-yellow-500/30 cursor-pointer"
                  >
                    <span className="font-medium text-xs md:text-sm lg:text-base">Admin</span>
                  </Link>
                )}
                
                {(user?.role === USER_ROLES.COMMITTEE_MEMBER || user?.isCommitteeMember) && (
                  <Link
                    to="/committee"
                    className="flex items-center justify-center bg-yellow-600/20 hover:bg-yellow-600/30 text-golden px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors duration-200 border border-yellow-500/30 cursor-pointer"
                  >
                    <span className="font-medium text-xs md:text-sm lg:text-base">Committee</span>
                  </Link>
                )}

                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-1 md:space-x-2 hover:bg-white/10 rounded-lg px-2 md:px-3 py-1.5 md:py-2 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-red-900 text-xs md:text-sm font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase() || (user?.name ? user.name.charAt(0)?.toUpperCase() : 'U')}
                    </span>
                  </div>
                  <span className="font-medium text-xs md:text-sm lg:text-base hidden lg:inline" style={{ color: 'rgb(255, 215, 0)' }}>
                    Welcome, {user?.firstName || (user?.name ? user.name.split(' ')[0] : 'User')}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-yellow-500 hover:bg-yellow-400 text-red-900 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer text-xs md:text-sm lg:text-base"
                >
                  <span className="hidden lg:inline">Logout</span>
                  <span className="lg:hidden">Exit</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Link
                  to="/login"
                  className="font-semibold hover:opacity-80 transition-colors duration-200 drop-shadow-lg cursor-pointer text-sm md:text-sm lg:text-base"
                  style={{ color: 'rgb(255, 215, 0)' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-yellow-500 hover:bg-yellow-400 text-red-900 px-3 md:px-4 lg:px-6 py-1.5 md:py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold cursor-pointer text-xs md:text-sm lg:text-base"
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
              className="hover:opacity-80 transition-colors duration-200 drop-shadow-lg cursor-pointer p-1"
              style={{ color: 'rgb(255, 215, 0)' }}
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Updated for better tablet support */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-3 sm:px-4 pt-3 pb-4 space-y-2 rounded-lg mt-2 shadow-xl border border-red-300/30" style={{ backgroundColor: 'rgba(200, 70, 70, 0.9)' }}>
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2.5 sm:py-3 font-semibold hover:opacity-80 hover:bg-white/10 rounded-md transition-colors duration-200 drop-shadow-md cursor-pointer text-sm sm:text-base"
                  style={{ color: 'rgb(255, 215, 0)' }}
                >
                  {item.name}
                </button>
              ))}

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="border-t border-red-300/30 pt-4 mt-4">
                  {/* Role-based Dashboard Links for Mobile */}
                  {user?.role === USER_ROLES.ADMIN && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 w-full hover:bg-white/10 rounded-md transition-colors duration-200 mb-2 cursor-pointer"
                    >
                      <span className="text-base sm:text-lg">🛡️</span>
                      <span className="font-medium text-golden text-sm sm:text-base">Admin Dashboard</span>
                    </Link>
                  )}
                  
                  {(user?.role === USER_ROLES.COMMITTEE_MEMBER || user?.isCommitteeMember) && (
                    <Link
                      to="/committee"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 w-full hover:bg-white/10 rounded-md transition-colors duration-200 mb-2 cursor-pointer"
                    >
                      <span className="text-base sm:text-lg">🏛️</span>
                      <span className="font-medium text-golden text-sm sm:text-base">Committee Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 w-full hover:bg-white/10 rounded-md transition-colors duration-200 cursor-pointer"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-red-900 text-sm sm:text-base font-bold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm sm:text-base" style={{ color: 'rgb(255, 215, 0)' }}>
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}
                      </span>
                      <span className="text-xs sm:text-sm text-yellow-300/80">
                        {user?.role === USER_ROLES.ADMIN ? 'Admin' : 
                         (user?.role === USER_ROLES.COMMITTEE_MEMBER || user?.isCommitteeMember) ? 'Committee Member' : 'Member'}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-red-900 px-3 py-2.5 sm:py-3 rounded-md transition-colors duration-200 font-medium mt-3 shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-red-300/30 pt-4 mt-4 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2.5 sm:py-3 font-semibold hover:opacity-80 hover:bg-white/10 rounded-md transition-colors duration-200 drop-shadow-md cursor-pointer text-sm sm:text-base"
                    style={{ color: 'rgb(255, 215, 0)' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-yellow-500 hover:bg-yellow-400 text-red-900 px-3 py-2.5 sm:py-3 rounded-md transition-all duration-200 font-semibold shadow-lg text-center cursor-pointer text-sm sm:text-base"
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