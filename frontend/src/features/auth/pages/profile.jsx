import { useState, useEffect } from 'react';
import { useAuth } from '../hook/useAuth';
import InputField from '../../../components/common/InputField';
import Button from '../../../components/common/Button';
import { 
  User, Mail, Phone, Shield, Edit2, Check, Lock, ShieldAlert, KeyRound, Award
} from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuth();

  // Edit profile state
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Change password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (profileData.fullName.length < 2 || profileData.fullName.length > 60) {
      errors.fullName = 'Full name must be between 2 and 60 characters';
    }

    const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
    if (!profileData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!usernameRegex.test(profileData.username)) {
      errors.username = 'Username must be 3-30 alphanumeric characters';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    const passwordNumberRegex = /\d/;

    if (!passwordData.oldPassword) {
      errors.oldPassword = 'Old password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    } else if (!passwordNumberRegex.test(passwordData.newPassword)) {
      errors.newPassword = 'New password must contain at least one number';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to change password');
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-gray-950 text-white min-h-[calc(100-4rem)]">
      <h1 className="mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
        User Profile
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: User Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-xl shadow-xl h-fit">
          <div className="flex flex-col items-center text-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.fullName}
                className="h-28 w-28 rounded-full border-2 border-indigo-500 object-cover shadow-lg shadow-indigo-500/20"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-800 text-gray-500">
                <User className="h-14 w-14" />
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-gray-400">@{user.username}</p>

            <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider capitalize ${
              user.role === 'recruiter' 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <Award className="mr-1.5 h-3.5 w-3.5" />
              {user.role}
            </span>
          </div>

          <div className="mt-8 space-y-4 border-t border-gray-800 pt-6">
            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <Mail className="h-4 w-4 text-gray-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="truncate font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <Phone className="h-4 w-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Mobile Number</p>
                <p className="font-medium">{user.mobile || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <Shield className="h-4 w-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Account Status</p>
                <p className="font-medium text-emerald-400">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Info & Security */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Profile Panel */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <User className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold">Personal Details</h3>
              </div>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center space-x-1.5 rounded-lg border border-gray-800 bg-gray-900/50 px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-150"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="rounded-lg border border-gray-800 bg-gray-900/50 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-150"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                  <InputField
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile || isLoading}
                    className={`bg-gray-900/60 border-gray-800 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 ${
                      !isEditingProfile && 'opacity-65 cursor-not-allowed bg-gray-900/30'
                    }`}
                  />
                  {profileErrors.fullName && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> {profileErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
                  <InputField
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile || isLoading}
                    className={`bg-gray-900/60 border-gray-800 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 ${
                      !isEditingProfile && 'opacity-65 cursor-not-allowed bg-gray-900/30'
                    }`}
                  />
                  {profileErrors.username && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> {profileErrors.username}
                    </p>
                  )}
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span>Save Changes</span>
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password Panel */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <KeyRound className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold">Security</h3>
              </div>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center space-x-1.5 rounded-lg border border-gray-800 bg-gray-900/50 px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-150"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Change Password</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordErrors({});
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="rounded-lg border border-gray-800 bg-gray-900/50 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-150"
                >
                  Cancel
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Old Password</label>
                    <InputField
                      type="password"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••"
                      disabled={isLoading}
                      className="bg-gray-900/60 border-gray-800 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                    {passwordErrors.oldPassword && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> {passwordErrors.oldPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">New Password</label>
                    <InputField
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••"
                      disabled={isLoading}
                      className="bg-gray-900/60 border-gray-800 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm New Password</label>
                    <InputField
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••"
                      disabled={isLoading}
                      className="bg-gray-900/60 border-gray-800 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span>Update Password</span>
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-500">
                Update your account password regularly to keep your credentials secure.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
