import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../frontend/Navbar';
import { Mail, Smartphone, CheckCircle, ArrowRight, Loader2, Lock, AlertCircle, Phone, RefreshCcw, LogOut } from 'lucide-react';

const UnifiedVerification = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user, verifyOTP, resendOTP, verifyMobileOTP, sendMobileOTP, logout } = useAuth();

    // Identify user/email based on Login vs Register state
    const emailAddress = user?.email || state?.email;
    const isEmailVerified = user?.isEmailVerified;
    const isMobileVerified = user?.isMobileVerified;

    // --- Email State ---
    const [emailOtp, setEmailOtp] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailMsg, setEmailMsg] = useState(''); // "OTP sent"
    const [resendEmailTimer, setResendEmailTimer] = useState(60);

    // --- Mobile State ---
    const [mobileOtp, setMobileOtp] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [mobileLoading, setMobileLoading] = useState(false);
    const [mobileError, setMobileError] = useState('');
    const [mobileMsg, setMobileMsg] = useState('');
    const [resendMobileTimer, setResendMobileTimer] = useState(0);
    const [mobileOtpSent, setMobileOtpSent] = useState(state?.verificationType === 'mobile');
    const [needsMobileInput, setNeedsMobileInput] = useState(false); // If placeholder or user wants to edit

    const mobileAutoSent = useRef(false);

    // --- Redirect Logic ---
    useEffect(() => {
        if (isEmailVerified && isMobileVerified) {
            const t = setTimeout(() => navigate('/dashboard'), 1500);
            return () => clearTimeout(t);
        }
    }, [isEmailVerified, isMobileVerified, navigate]);

    // --- Initialize Mobile Step ---
    useEffect(() => {
        if (isEmailVerified && !isMobileVerified && user) {
            const isPlaceholder = !user.mobile || user.mobile.startsWith('G-') || user.mobile === '0000000000';

            if (isPlaceholder) {
                setNeedsMobileInput(true);
            } else if (!mobileOtpSent && !mobileAutoSent.current) {
                mobileAutoSent.current = true;
                handleSendMobileOTP();
            }
        }
    }, [isEmailVerified, isMobileVerified, user, mobileOtpSent]);

    // --- Timers ---
    useEffect(() => {
        let interval = null;
        if (resendEmailTimer > 0) {
            interval = setInterval(() => setResendEmailTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendEmailTimer]);

    useEffect(() => {
        let interval = null;
        if (resendMobileTimer > 0) {
            interval = setInterval(() => setResendMobileTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendMobileTimer]);


    // --- Email Handlers ---
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setEmailLoading(true);
        setEmailError('');

        const res = await verifyOTP({ email: emailAddress, otp: emailOtp });
        if (!res.success) {
            setEmailError(res.message || 'Updated OTP failed');
        }
        // Success handled by context update
        setEmailLoading(false);
    };

    const handleResendEmail = async () => {
        if (resendEmailTimer > 0) return;
        setEmailError('');
        setEmailMsg('');
        const res = await resendOTP(emailAddress);
        if (res.success) {
            setEmailMsg('Email OTP resent!');
            setResendEmailTimer(60);
        } else {
            setEmailError(res.message);
        }
    };

    // --- Mobile Handlers ---
    const handleSendMobileOTP = async (customMobile) => {
        if (resendMobileTimer > 0) return;
        setMobileLoading(true);
        setMobileError('');
        setMobileMsg('');

        const res = await sendMobileOTP(customMobile);
        setMobileLoading(false);

        if (res.success) {
            setMobileMsg('Mobile OTP sent!');
            setMobileOtpSent(true);
            setNeedsMobileInput(false);
            setResendMobileTimer(60);
        } else {
            setMobileError(res.message);
            if (res.message && (res.message.toLowerCase().includes('valid mobile') || res.message.toLowerCase().includes('provide'))) {
                setNeedsMobileInput(true);
            }
        }
    };

    const handleSubmitMobile = async (e) => {
        e.preventDefault();
        if (!mobileNumber || mobileNumber.length < 10) {
            setMobileError('Enter valid mobile number');
            return;
        }
        await handleSendMobileOTP(mobileNumber);
    };

    const handleVerifyMobile = async (e) => {
        e.preventDefault();
        setMobileLoading(true);
        setMobileError('');

        if (mobileOtp.length < 6) {
            setMobileError('Enter valid 6-digit OTP');
            setMobileLoading(false);
            return;
        }

        const res = await verifyMobileOTP(mobileOtp);
        if (!res.success) {
            setMobileError(res.message);
        }
        setMobileLoading(false);
    };


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Account Verification
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Please verify your contact details to secure your account.
                    </p>
                </div>

                <div className="max-w-md w-full space-y-6">

                    {/* --- EMAIL SECTION --- */}
                    <div className={`bg-white rounded-2xl shadow-md border ${isEmailVerified ? 'border-green-200' : 'border-slate-200'} overflow-hidden transition-all`}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isEmailVerified ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {isEmailVerified ? <CheckCircle size={24} /> : <Mail size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Email Verification</h3>
                                        <p className="text-sm text-slate-500">{emailAddress || 'Checking...'}</p>
                                    </div>
                                </div>
                                {isEmailVerified && <span className="text-green-600 font-medium text-sm">Verified</span>}
                            </div>

                            {!isEmailVerified && (
                                <form onSubmit={handleVerifyEmail} className="mt-4 space-y-4">
                                    {emailError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{emailError}</div>}
                                    {emailMsg && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{emailMsg}</div>}

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP sent to email</label>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest font-mono"
                                            placeholder="XXXXXX"
                                            value={emailOtp}
                                            onChange={(e) => setEmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={emailLoading}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2"
                                    >
                                        {emailLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Email'}
                                    </button>

                                    <div className="text-center text-sm">
                                        <button type="button" onClick={handleResendEmail} disabled={resendEmailTimer > 0} className={resendEmailTimer > 0 ? "text-slate-400" : "text-blue-600 hover:underline"}>
                                            {resendEmailTimer > 0 ? `Resend in ${resendEmailTimer}s` : "Resend OTP"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>


                    {/* --- MOBILE SECTION --- */}
                    <div className={`bg-white rounded-2xl shadow-md border ${isMobileVerified ? 'border-green-200' : 'border-slate-200'} overflow-hidden transition-all relative`}>

                        {/* Overlay if Email not verified */}
                        {/* Overlay removed to allow parallel verification */}

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isMobileVerified ? 'bg-green-100 text-green-600' : 'bg-green-100 text-green-600'}`}>
                                        {isMobileVerified ? <CheckCircle size={24} /> : <Smartphone size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Mobile Verification</h3>
                                        <p className="text-sm text-slate-500">
                                            {isMobileVerified ? (user?.mobile) : (needsMobileInput ? 'Enter number' : (user?.mobile || 'Pending...'))}
                                        </p>
                                    </div>
                                </div>
                                {isMobileVerified && <span className="text-green-600 font-medium text-sm">Verified</span>}
                            </div>

                            {!isMobileVerified && (
                                <div className="mt-4 space-y-4">
                                    {mobileError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{mobileError}</div>}
                                    {mobileMsg && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{mobileMsg}</div>}

                                    {needsMobileInput ? (
                                        <form onSubmit={handleSubmitMobile}>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="tel"
                                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="Enter 10-digit number"
                                                    value={mobileNumber}
                                                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={mobileLoading}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 flex items-center justify-center"
                                                >
                                                    {mobileLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleVerifyMobile} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Enter Mobile OTP</label>
                                                <input
                                                    type="text"
                                                    maxLength="6"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-center tracking-widest font-mono"
                                                    placeholder="XXXXXX"
                                                    value={mobileOtp}
                                                    onChange={(e) => setMobileOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={mobileLoading}
                                                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 flex justify-center items-center gap-2"
                                            >
                                                {mobileLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Mobile'}
                                            </button>

                                            <div className="text-center text-sm flex justify-center gap-4">
                                                <button type="button" onClick={() => handleSendMobileOTP(undefined)} disabled={resendMobileTimer > 0} className={resendMobileTimer > 0 ? "text-slate-400" : "text-green-600 hover:underline"}>
                                                    {resendMobileTimer > 0 ? `Resend in ${resendMobileTimer}s` : "Resend OTP"}
                                                </button>
                                                <button type="button" onClick={() => { setNeedsMobileInput(true); setMobileOtpSent(false); }} className="text-slate-500 hover:text-slate-700 underline">
                                                    Change Number
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-500 hover:text-red-600 text-sm flex items-center justify-center gap-1 mx-auto">
                            <LogOut size={14} /> Cancel & Logout
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default UnifiedVerification;
