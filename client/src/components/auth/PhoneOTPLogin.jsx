import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Phone, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { getIndianMobileError, getMobileDigits, getPhoneAuthErrorMessage } from '../../utils/phoneValidation';

const PhoneOTPLogin = ({ onAuthSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log("Invisible reCAPTCHA verified successfully");
        }
      });
    }
  };

  const sendFirebaseOtp = async () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);
    const finalFormattedNumber = cleanNumber.length === 10 ? `+91${cleanNumber}` : phoneNumber;

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const result = await signInWithPhoneNumber(auth, finalFormattedNumber, appVerifier);
    setConfirmationResult(result);
    setStep('otp');
    setTimer(30);
    return finalFormattedNumber;
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    
    const cleanNumber = getMobileDigits(phoneNumber);
    const mobileError = getIndianMobileError(cleanNumber);
    if (mobileError) {
      setError(mobileError);
      return;
    }
    
    setLoading(true);

    try {
      const checkRes = await api.post('/auth/check-user', { identifier: cleanNumber });
      
      if (!checkRes.data.exists) {
        setError(checkRes.data.message || "You are a new user, please register yourself first.");
        setLoading(false);
        return;
      }

      await sendFirebaseOtp();
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(getPhoneAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || loading) return;

    setError("");
    setMsg("");
    setLoading(true);

    try {
      await sendFirebaseOtp();
      setMsg("Verification code resent successfully.");
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError(getPhoneAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    const cleanOtp = otp.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      setLoading(false);
      return;
    }

    try {
      const result = await confirmationResult.confirm(cleanOtp);
      const firebaseUser = result.user;

      if (onAuthSuccess) {
        const authResult = await onAuthSuccess(firebaseUser);
        if (authResult && !authResult.success) {
          setError(authResult.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      if (err.code === 'auth/code-expired') {
        setError('Verification code expired. Please resend a new code.');
      } else if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code. Please try again.');
      } else {
        setError('Unable to verify code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="recaptcha-container"></div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {msg && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">{msg}</span>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={sendOTP} className="space-y-6">
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
                  // Always keep +91, and only allow 10 digits after it
                  if (val.startsWith('+91')) {
                    const digits = val.slice(3).replace(/\D/g, '');
                    if (digits.length <= 10) {
                      setPhoneNumber('+91' + digits);
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
              We'll send a 6-digit code via SMS to verify your number.
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
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setTimer(0);
                  setMsg('');
                  setError('');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Change Number
              </button>
            </div>
            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
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

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || loading}
                className={`font-semibold transition-colors ${
                  timer > 0 || loading
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-blue-600 hover:text-blue-500 hover:underline'
                }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Resend Verification Code'}
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneOTPLogin;
