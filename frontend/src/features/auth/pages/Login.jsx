import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import InputField from '../../../components/common/InputField';
import Button from '../../../components/common/Button';
import { Mail, Lock, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      toast.success('Welcome back to HireFlow!');
      navigate('/profile');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex min-h-[calc(100-4rem)] items-center justify-center bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/40 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-extrabold text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage your profile or jobs. Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Register here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-gray-500" /> Email Address
            </label>
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="bg-gray-900/60 border-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-600"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-300 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-gray-500" /> Password
              </label>
            </div>
            <InputField
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className="bg-gray-900/60 border-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-600"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 py-3 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-transform duration-100"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
