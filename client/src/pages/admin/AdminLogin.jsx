import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AdminLogin = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google Login Callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('admin_token', token);
      
      // Remove token from URL for security and clean UI
      const url = new URL(window.location);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname + url.search);

      // Verify user role before redirecting
      const checkRoleAndRedirect = async () => {
        try {
          const { data } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (data.success) {
            const user = data.data;
            if (user.role === 'admin' || (user.role === 'ca' && user.adminStatus === 'approved')) {
              window.location.href = '/admin/dashboard';
            } else if (user.adminStatus === 'pending') {
              window.location.href = '/admin/request-status';
            } else if (user.adminStatus === 'rejected') {
              window.location.href = '/admin/rejected';
            } else {
              window.location.href = '/admin/request-access';
            }
          } else {
            window.location.href = '/admin/login';
          }
        } catch (error) {
          console.error("Role check error:", error);
          window.location.href = '/admin/login';
        }
      };
      checkRoleAndRedirect();
    }
  }, [location]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-blue-200">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form - Google Auth Only */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => window.location.href = 'https://taxproject-api.vercel.app/api/v1/auth/google?state=admin'}
              className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-3 shadow-md border-opacity-60"
            >
              <Chrome className="w-5 h-5 text-blue-600" />
              Sign in with Google
            </button>
            
            <p className="text-center text-xs text-slate-500">
              Only authorized administrators can access this portal via Google authentication.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
