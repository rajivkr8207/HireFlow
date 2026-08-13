import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import InputField from '../../../components/common/InputField';
import Button from '../../../components/common/Button';
import { User, Mail, Lock, Phone, UserCheck, ShieldAlert, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    role: 'candidate',
    image: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (PNG, JPG, WEBP)');
        return;
      }
      // 2MB size limit
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const tempErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2 || formData.fullName.length > 60) {
      tempErrors.fullName = 'Full name must be between 2 and 60 characters';
    }

    // Username
    const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
    if (!formData.username.trim()) {
      tempErrors.username = 'Username is required';
    } else if (!usernameRegex.test(formData.username)) {
      tempErrors.username = 'Username must be 3-30 alphanumeric characters (no spaces/symbols)';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    // Password
    const passwordNumberRegex = /\d/;
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    } else if (!passwordNumberRegex.test(formData.password)) {
      tempErrors.password = 'Password must contain at least one number';
    }

    // Mobile (Required, unique validation is handled by backend)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      tempErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      tempErrors.mobile = 'Mobile must be a valid 10-digit Indian number (starts with 6-9)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex min-h-[calc(100-4rem)] items-center justify-center bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900/40 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-extrabold text-transparent">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join HireFlow to find jobs or hire talent. Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Login here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar upload */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile Preview"
                  className="h-24 w-24 rounded-full border-2 border-indigo-500 object-cover shadow-lg shadow-indigo-500/25"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-800 text-gray-500 group-hover:border-indigo-400 group-hover:text-indigo-400 transition-colors">
                  <User className="h-10 w-10" />
                </div>
              )}
              <label
                htmlFor="image-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-xs text-gray-500">Upload profile image (optional, max 2MB)</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="h-4 w-4 text-gray-500" /> Full Name <span className="text-red-500">*</span>
              </label>
              <InputField
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-gray-900/60 border-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-600"
              />
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-gray-500" /> Username <span className="text-red-500">*</span>
              </label>
              <InputField
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe12"
                className="bg-gray-900/60 border-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-600"
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-gray-500" /> Email Address <span className="text-red-500">*</span>
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

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-gray-500" /> Mobile Number <span className="text-red-500">*</span>
              </label>
              <InputField
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="bg-gray-900/60 border-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-gray-600"
              />
              {errors.mobile && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {errors.mobile}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-gray-500" /> Password <span className="text-red-500">*</span>
              </label>
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

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                I want to register as
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="candidate" className="bg-gray-900 text-white">Candidate (Looking for jobs)</option>
                <option value="recruiter" className="bg-gray-900 text-white">Recruiter (Hiring talent)</option>
              </select>
            </div>
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
                Registering...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
