import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set default header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/auth/me');

          if (data.success) {
            setUser(data.data);
            setIsLoggedIn(true);
            setIsAdmin(data.data.role === 'admin');
          } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          }

        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (userData) => {
    // Expecting userData to contain email and password
    try {
      const { data } = await api.post('/auth/login', userData);

      if (data.requireVerification) {
        return {
          success: false,
          requireVerification: true,
          email: data.email,
          message: data.message
        };
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        // Fetch full user details to ensure we have role, etc.
        const userResponse = await api.get('/auth/me');
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsLoggedIn(true);
          setIsAdmin(userResponse.data.data.role === 'admin');
          return { success: true };
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
    return { success: false, message: 'Login failed' };
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);

      if (data.requireVerification) {
        return {
          success: false,
          requireVerification: true,
          email: data.email,
          message: data.message
        };
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        // Fetch full user details
        const userResponse = await api.get('/auth/me');
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsLoggedIn(true);
          setIsAdmin(userResponse.data.data.role === 'admin');
          return { success: true };
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.requireVerification) {
        return {
          success: false,
          requireVerification: true,
          email: userData.email, // Best guess
          message: error.response.data.message
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
    return { success: false, message: 'Registration failed' };
  };

  const verifyOTP = async (otpData) => {
    try {
      const { data } = await api.post('/auth/verify-otp', otpData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        const userResponse = await api.get('/auth/me');
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsLoggedIn(true);
          setIsAdmin(userResponse.data.data.role === 'admin');
          return { success: true };
        }
      }
    } catch (error) {
      console.error("OTP Verification Error", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Verification failed'
      };
    }
    return { success: false, message: 'Verification failed' };
  };

  const resendOTP = async (email) => {
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      if (data.success) {
        return { success: true, message: data.message };
      }
    } catch (error) {
      console.error("Resend OTP Error", error);
      return { success: false, message: error.response?.data?.message || 'Failed to resend OTP' };
    }
    return { success: false, message: 'Failed to resend OTP' };
  };

  const sendMobileOTP = async (mobile) => {
    try {
      const { data } = await api.post('/auth/send-mobile-otp', { mobile });
      if (data.success) {
        return { success: true, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send Mobile OTP' };
    }
    return { success: false, message: 'Failed to send Mobile OTP' };
  };

  const verifyMobileOTP = async (otp) => {
    try {
      const { data } = await api.post('/auth/verify-mobile-otp', { otp });
      if (data.success) {
        const userResponse = await api.get('/auth/me');
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          return { success: true };
        }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Mobile verification failed' };
    }
    return { success: false, message: 'Mobile verification failed' };
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isAdmin, login, register, verifyOTP, resendOTP, sendMobileOTP, verifyMobileOTP, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
