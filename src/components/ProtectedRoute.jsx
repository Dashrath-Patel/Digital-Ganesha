import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-red-950">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-golden to-golden-light rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <span className="text-4xl">🕉️</span>
          </div>
          <div className="text-golden text-xl font-semibold mb-4 drop-shadow-lg">
            Verifying Authentication...
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required and user is not admin, redirect to home
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
