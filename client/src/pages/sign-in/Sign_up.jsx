import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Chrome,
  Instagram,
  Facebook,
  Youtube,
  Linkedin
} from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import Navbar from '../frontend/Navbar';

const Sign_up = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/');
      } else if (result.requireVerification) {
        navigate('/verification', { state: { email: result.email || formData.email } });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred during registration.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">

              {/* Left Side - Welcome Section */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-12 flex flex-col justify-center items-center text-center">
                <Link to="/" className="flex items-center gap-2 mb-8">
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <FileText className="text-white w-8 h-8" />
                  </div>
                  <span className="text-3xl font-bold text-blue-900 tracking-tight">
                    FirstFiling
                  </span>
                </Link>

                <h2 className="text-2xl font-bold text-blue-900 mb-2">
                  Welcome to FirstFiling
                </h2>
                <p className="text-slate-600 mb-8">
                  Taxation at your Fingertips
                </p>

                {/* Illustration/Chart */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-blue-600 rounded-2xl flex items-center justify-center relative">
                    <FileText className="text-white w-16 h-16" />
                    {/* Chart elements */}
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="text-center">
                  <p className="text-slate-600 font-medium mb-4">Also Follow Us On</p>
                  <div className="flex justify-center gap-4">
                    <a href="#" className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors">
                      <Instagram size={20} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-red-600 transition-colors">
                      <Youtube size={20} />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">Register</h2>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Mobile Field */}
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 mb-2">
                      Mobile No. *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter Your Mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    Submit
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Registration */}
                  <button
                    type="button"
                    onClick={() => window.location.href = 'http://localhost:5000/api/v1/auth/google'}
                    className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-xl font-semibold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
                  >
                    
                    <FcGoogle className="w-5 h-5" />
                    Register with Google
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      Already Registered?{' '}
                      <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        Log in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mt-8">
            <div className="flex items-center gap-1">
              <ShieldCheck size={16} />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <UserCheck size={16} />
              <span>Trusted Platform</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-500 mt-6">
            <p>
              By signing up, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sign_up;