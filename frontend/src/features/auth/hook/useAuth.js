import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  setInitialized,
  clearAuthError
} from '../auth.slice';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, isInitialized } = useSelector((state) => state.auth);

  const login = useCallback(async (credentials) => {
    try {
      dispatch(authStart());
      const data = await authService.login(credentials);
      const userData = data.data.user;
      const token = data.data.accessToken;
      dispatch(authSuccess({ user: userData, token }));
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      dispatch(authFailure(errMsg));
      throw err;
    }
  }, [dispatch]);

  const register = useCallback(async (userData) => {
    try {
      dispatch(authStart());
      const data = await authService.register(userData);
      const userDataRes = data.data.user;
      dispatch(authSuccess({ user: userDataRes, token: null }));
      return userDataRes;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      dispatch(authFailure(errMsg));
      throw err;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      dispatch(authStart());
      await authService.logout();
      dispatch(logoutSuccess());
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Logout failed';
      dispatch(authFailure(errMsg));
      throw err;
    }
  }, [dispatch]);

  const fetchProfile = useCallback(async () => {
    try {
      dispatch(authStart());
      const data = await authService.getProfile();
      const userData = data.data;
      dispatch(authSuccess({ user: userData, token: null }));
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch profile';
      dispatch(authFailure(errMsg));
      throw err;
    }
  }, [dispatch]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      dispatch(authStart());
      const data = await authService.updateProfile(profileData);
      const userData = data.data;
      dispatch(authSuccess({ user: userData, token: null }));
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Profile update failed';
      dispatch(authFailure(errMsg));
      throw err;
    }
  }, [dispatch]);

  const changePassword = useCallback(async (passwordData) => {
    try {
      dispatch(authStart());
      const response = await authService.changePassword(passwordData);
      dispatch(authSuccess({ user, token: null }));
      return response;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Password change failed';
      dispatch(authFailure(errMsg));
      throw err;
    }
  }, [dispatch, user]);

  const initializeAuth = useCallback(async () => {
    try {
      const data = await authService.getProfile();
      const userData = data.data;
      dispatch(setInitialized({ user: userData, token: null }));
      return userData;
    } catch (err) {
      dispatch(setInitialized(null));
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    isLoading,
    error,
    isInitialized,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    initializeAuth,
    clearError
  };
};
