export const isValidIndianMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

export const normalizeIndianMobile = (value) => {
    const digits = String(value || '').replace(/\D/g, '').slice(-10);
    return digits.length === 10 ? digits : '';
};

export const formatIndianMobile = (value) => {
    const digits = normalizeIndianMobile(value);
    return digits ? `+91${digits}` : '';
};

export const getPhoneAuthErrorMessage = (error) => {
    const code = error?.code || '';

    switch (code) {
        case 'auth/invalid-phone-number':
            return 'Invalid phone number. Please enter a valid 10-digit Indian mobile number.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please wait a few minutes before trying again.';
        case 'auth/captcha-check-failed':
            return 'Security verification failed. Please try again in a moment.';
        case 'auth/code-expired':
            return 'OTP has expired. Please request a new code.';
        case 'auth/invalid-verification-code':
            return 'Invalid OTP. Please check the code and try again.';
        case 'auth/session-expired':
            return 'OTP session expired. Please request a new code.';
        case 'auth/missing-verification-code':
            return 'Please enter the 6-digit OTP.';
        case 'auth/quota-exceeded':
            return 'SMS limit reached. Please try again later.';
        default:
            if (error?.message?.includes('network')) {
                return 'Network error. Please check your connection and try again.';
            }
            return error?.message || 'Something went wrong. Please try again.';
    }
};
