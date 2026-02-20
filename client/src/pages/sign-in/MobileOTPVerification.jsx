import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../frontend/Navbar';
import { Smartphone, ArrowRight, Loader2, LogOut, Phone } from 'lucide-react';

const MobileOTPVerification = () => {
    const navigate = useNavigate();
    const { user, verifyMobileOTP, sendMobileOTP, logout } = useAuth();

    const [otp, setOtp] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);
    const [needsMobileInput, setNeedsMobileInput] = useState(false);

    const hasAutoSent = useRef(false);

    // Check user status on mount/update
    useEffect(() => {
        if (!user) return;

        if (user.isMobileVerified) {
            navigate('/');
            return;
        }

        const isPlaceholder = !user.mobile || user.mobile.startsWith('G-') || user.mobile === '0000000000';
        if (isPlaceholder) {
            setNeedsMobileInput(true);
        } else if (!otpSent && !hasAutoSent.current) {
            // If valid mobile exists and OTP not sent, send it automatically
            hasAutoSent.current = true;
            handleSendOTP();
        }
    }, [user]);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);


    const handleSendOTP = async (customMobile) => {
        if (timer > 0) return;

        setLoading(true);
        setError('');
        setMsg('');

        const result = await sendMobileOTP(customMobile); // Pass mobile if provided
        setLoading(false);

        if (result.success) {
            setMsg('OTP sent to your mobile number.');
            setOtpSent(true);
            setNeedsMobileInput(false); // Move to OTP step
            setTimer(60);
        } else {
            setError(result.message);
            // If auto-send failed, maybe ask for input?
            // If error involves "Invalid mobile", show input
            if (result.message && (result.message.toLowerCase().includes('valid mobile') || result.message.toLowerCase().includes('provide'))) {
                setNeedsMobileInput(true);
            }
        }
    };

    const handleSubmitMobile = async (e) => {
        e.preventDefault();
        if (!mobileNumber || mobileNumber.length < 10) {
            setError('Please enter a valid mobile number');
            return;
        }
        await handleSendOTP(mobileNumber);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        if (otp.length < 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        const result = await verifyMobileOTP(otp);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Invalid OTP');
        }
        setLoading(false);
    };

    const handleResend = async () => {
        await handleSendOTP(mobileNumber || undefined);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">

                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Smartphone className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                            {needsMobileInput ? 'Enter Mobile Number' : 'Verify Mobile Number'}
                        </h2>
                        <p className="text-slate-600">
                            {needsMobileInput
                                ? 'Please enter your mobile number to continue verification.'
                                : <>Please enter the code sent to your mobile number <br /><span className="font-semibold text-slate-900">{user?.mobile}</span></>
                            }
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                                {error}
                            </div>
                        )}

                        {msg && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
                                {msg}
                            </div>
                        )}

                        {needsMobileInput ? (
                            <form className="space-y-6" onSubmit={handleSubmitMobile}>
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Mobile Number *
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
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            placeholder="Enter 10-digit number"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            Send OTP <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form className="space-y-6" onSubmit={handleVerifyOTP}>
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Enter Mobile OTP *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            maxLength="6"
                                            required
                                            className="block w-full px-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-center text-lg tracking-widest font-mono"
                                            placeholder="XXXXXX"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify Mobile <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm text-slate-600">
                                        Didn't receive the code?{' '}
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={timer > 0 || loading}
                                            className={`font-medium transition-colors ${timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-green-600 hover:text-green-500'}`}
                                        >
                                            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                                        </button>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => { setNeedsMobileInput(true); setOtpSent(false); }}
                                        className="text-xs text-slate-500 hover:text-slate-700 mt-2 underline"
                                    >
                                        Change Mobile Number
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-6 text-center border-t border-slate-100 pt-4">
                            <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-600 flex items-center justify-center gap-1 mx-auto">
                                <LogOut size={14} /> Logout & Switch Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileOTPVerification;
