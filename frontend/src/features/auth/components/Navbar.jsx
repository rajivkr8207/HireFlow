import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { Briefcase, User, LogOut, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              Hire<span className="text-indigo-400">Flow</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Link */}
                {user.role === 'recruiter' ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/candidate-dashboard"
                    className="flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Explore Jobs</span>
                  </Link>
                )}

                {/* Role Badge */}
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider capitalize ${
                  user.role === 'recruiter' 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {user.role}
                </span>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 rounded-lg p-1.5 hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.fullName}
                      className="h-8 w-8 rounded-full border border-gray-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="hidden text-sm font-medium text-gray-300 md:inline-block">
                    {user.fullName}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-lg border border-gray-800 px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-95 transition-all duration-150"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
