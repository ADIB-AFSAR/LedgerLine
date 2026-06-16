import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/auth/AuthContainer';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const getLoginErrorMessage = (err) => {
    const serverMessage = err.response?.data?.message;
    if (serverMessage) return serverMessage;

    const status = err.response?.status;
    if (status === 404) return 'You are a new user, please register yourself first.';
    if (status === 401) return 'Verification code expired or invalid. Please request a new code and try again.';
    if (status === 400) return 'Unable to complete login. Please check your details and try again.';
    if (!err.response) return 'Network error. Please check your connection and try again.';

    return 'Login failed. Please try again.';
  };

  const handleAuthSuccess = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();

      const response = await api.post('/auth/firebase-login', {
        idToken,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        mobile: firebaseUser.phoneNumber
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        window.location.href = '/dashboard';
        return { success: true };
      }

      return {
        success: false,
        message: response.data.message || 'Login failed. Please try again.'
      };
    } catch (err) {
      console.error("Backend auth sync failed:", err);
      return {
        success: false,
        message: getLoginErrorMessage(err)
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4 py-20">
      <AuthContainer onAuthSuccess={handleAuthSuccess} />
      
      <div className="mt-8">
        <button
          onClick={() => navigate('/')}
          className="text-blue-200/80 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
        >
          ← Back to Marketplace
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
