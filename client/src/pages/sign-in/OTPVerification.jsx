import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../frontend/Navbar';
import { ShieldCheck, Mail, ArrowRight, Loader2 } from 'lucide-react';

const OTPVerification = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { verifyOTP, resendOTP } = useAuth();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [timer, setTimer] = useState(60); // 60 seconds cooldown for resend

    // If no email in state, redirect to login
    useEffect(() => {
        if (!state?.email) {
            navigate('/login');
        }
    }, [state, navigate]);

    // Timer for Resend
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        if (otp.length < 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        const result = await verifyOTP({ email: state.email, otp });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Invalid OTP');
        }
        setLoading(false);
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setMsg('');
        setError('');
        const result = await resendOTP(state.email);
        if (result.success) {
            setMsg('OTP resent successfully. Please check your email.');
            setTimer(60);
        } else {
            setError(result.message || 'Failed to resend OTP');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">

                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                            Verify Your Email
                        </h2>
                        <p className="text-slate-600">
                            We've sent a 6-digit verification code to <br />
                            <span className="font-semibold text-slate-900">{state?.email}</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {msg && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                                    {msg}
                                </div>
                            )}

                            <div>
                                <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Enter OTP *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        maxLength="6"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg tracking-widest font-mono"
                                        placeholder="XXXXXX"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Email <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="text-center mt-4">
                                <p className="text-sm text-slate-600">
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={timer > 0}
                                        className={`font-medium transition-colors ${timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-500'}`}
                                    >
                                        {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                                    </button>
                                </p>
                            </div>

                        </form>

                        <div className="mt-6 text-center border-t border-slate-100 pt-4">
                            <Link to="/login" className="text-sm text-slate-500 hover:text-slate-700">
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OTPVerification;
