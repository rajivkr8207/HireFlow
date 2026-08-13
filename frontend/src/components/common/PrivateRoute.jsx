import { Navigate } from 'react-router';
import { useAuth } from '../../features/auth/hook/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
