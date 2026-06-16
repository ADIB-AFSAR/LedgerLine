import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/auth/AuthContainer';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleAuthSuccess = async (firebaseUser) => {
    setAuthError("");
    try {
      // Get ID Token from Firebase
      const idToken = await firebaseUser.getIdToken();
      
      // Send to backend to verify and get JWT
      const response = await api.post('/auth/firebase-login', {
        idToken,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        mobile: firebaseUser.phoneNumber
      });

      if (response.data.success) {
        // Sync with our existing AuthContext
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Use the context's login or just refresh window to trigger AuthContext useEffect
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error("Backend auth sync failed:", err);
      const message = err.response?.data?.message || "Authentication successful but failed to sync. Please try again.";
      setAuthError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4 py-20">
      <AuthContainer onAuthSuccess={handleAuthSuccess} externalError={authError} />
      
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
