import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from './features/auth/hook/useAuth';
import Navbar from './features/auth/components/Navbar';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Profile from './features/auth/pages/profile';
import RecruiterDashboard from './features/jobposting/pages/RecruiterDashboard';
import CandidateDashboard from './features/applicant/pages/CandidateDashboard';
import CreateJob from './features/jobposting/pages/CreateJob';
import JobDetail from './features/jobposting/pages/JobDetail';
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { isInitialized, initializeAuth, user } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <RecruiterDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/create"
              element={
                <PrivateRoute>
                  <CreateJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <PrivateRoute>
                  <JobDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/candidate-dashboard"
              element={
                <PrivateRoute>
                  <CandidateDashboard />
                </PrivateRoute>
              }
            />

            {/* Smart default redirect */}
            <Route
              path="*"
              element={
                user?.role === 'recruiter'
                  ? <Navigate to="/dashboard" replace />
                  : user?.role === 'candidate'
                  ? <Navigate to="/candidate-dashboard" replace />
                  : <Navigate to="/profile" replace />
              }
            />
          </Routes>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;