import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { Phone, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import {
    formatIndianMobile,
    getPhoneAuthErrorMessage,
    isValidIndianMobile,
    normalizeIndianMobile,
} from '../../utils/phoneValidation';

const RESEND_COOLDOWN_SEC = 30;
const RECAPTCHA_CONTAINER_ID = 'recaptcha-container-login';

const PhoneOTPLogin = ({ onAuthSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('+91');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [step, setStep] = useState('phone');
    const [resendTimer, setResendTimer] = useState(0);
    const [verifiedMobile, setVerifiedMobile] = useState('');

    const recaptchaVerifierRef = useRef(null);

    const clearRecaptcha = useCallback(() => {
        if (recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current.clear();
            } catch {
                // ignore cleanup errors
            }
            recaptchaVerifierRef.current = null;
        }

        const container = document.getElementById(RECAPTCHA_CONTAINER_ID);
        if (container) container.innerHTML = '';
    }, []);

    const setupRecaptcha = useCallback(async () => {
        clearRecaptcha();

        const verifier = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, {
            size: 'invisible',
        });

        await verifier.render();
        recaptchaVerifierRef.current = verifier;
        return verifier;
    }, [clearRecaptcha]);

    useEffect(() => {
        if (resendTimer <= 0) return undefined;

        const interval = setInterval(() => {
            setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => () => clearRecaptcha(), [clearRecaptcha]);

    const sendOTP = async ({ isResend = false } = {}) => {
        if (loading) return;
        if (isResend && resendTimer > 0) return;

        setError('');
        setSuccessMsg('');

        const cleanNumber = normalizeIndianMobile(phoneNumber);
        if (!isValidIndianMobile(cleanNumber)) {
            setError('Please enter a valid 10-digit Indian mobile number.');
            return;
        }

        const finalFormattedNumber = formatIndianMobile(cleanNumber);
        setLoading(true);

        try {
            const checkRes = await api.post('/auth/check-user', { identifier: cleanNumber });

            if (!checkRes.data?.exists) {
                setError(checkRes.data?.message || 'You are a new user, please register yourself first.');
                return;
            }

            const verifier = await setupRecaptcha();
            const result = await signInWithPhoneNumber(auth, finalFormattedNumber, verifier);

            setConfirmationResult(result);
            setVerifiedMobile(cleanNumber);
            setStep('otp');
            setOtp('');
            setResendTimer(RESEND_COOLDOWN_SEC);
            setSuccessMsg(
                isResend
                    ? `A new OTP has been sent to +91 ${cleanNumber}.`
                    : `OTP sent to +91 ${cleanNumber}.`
            );
        } catch (err) {
            console.error('Error sending OTP:', err);
            clearRecaptcha();
            setError(getPhoneAuthErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        await sendOTP();
    };

    const handleResendOTP = async () => {
        await sendOTP({ isResend: true });
    };

    const handleChangeNumber = () => {
        setStep('phone');
        setOtp('');
        setConfirmationResult(null);
        setError('');
        setSuccessMsg('');
        setResendTimer(0);
        clearRecaptcha();
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        const sanitizedOtp = otp.replace(/\D/g, '');
        if (sanitizedOtp.length !== 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }

        if (!confirmationResult) {
            setError('Please request an OTP first.');
            return;
        }

        setLoading(true);

        try {
            const result = await confirmationResult.confirm(sanitizedOtp);
            if (onAuthSuccess) {
                await onAuthSuccess(result.user);
            }
        } catch (err) {
            console.error('Error verifying OTP:', err);
            setError(getPhoneAuthErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div id={RECAPTCHA_CONTAINER_ID} />

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {successMsg && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                    <CheckCircle2 size={20} className="flex-shrink-0" />
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {step === 'phone' ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Mobile Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.startsWith('+91')) {
                                        const digits = val.slice(3).replace(/\D/g, '');
                                        if (digits.length <= 10) {
                                            setPhoneNumber(`+91${digits}`);
                                        }
                                    } else if (val.length < 3) {
                                        setPhoneNumber('+91');
                                    }
                                }}
                                placeholder="+919876543210"
                                required
                                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                            We&apos;ll send a 6-digit code via SMS to verify your number.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Send OTP
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={verifyOTP} className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Enter Verification Code
                            </label>
                            <button
                                type="button"
                                onClick={handleChangeNumber}
                                className="text-xs font-bold text-blue-600 hover:underline"
                            >
                                Change Number
                            </button>
                        </div>
                        {verifiedMobile && (
                            <p className="text-xs text-slate-500 mb-2">
                                Code sent to +91 {verifiedMobile}
                            </p>
                        )}
                        <div className="relative">
                            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Ex: 123456"
                                required
                                maxLength={6}
                                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono tracking-[0.5em] text-lg text-center"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Verify OTP
                                <CheckCircle2 className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading || resendTimer > 0}
                            className={resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:underline font-semibold'}
                        >
                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PhoneOTPLogin;
