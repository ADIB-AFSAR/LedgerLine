export const getMobileDigits = (value) => String(value || '').replace(/\D/g, '').slice(-10);

export const isValidIndianMobile = (value) => {
  const digits = getMobileDigits(value);
  if (digits.length !== 10) return false;
  if (!/^[6-9]\d{9}$/.test(digits)) return false;
  if (/^(\d)\1{9}$/.test(digits)) return false;
  return true;
};

export const getIndianMobileError = (value) => {
  const digits = getMobileDigits(value);
  if (digits.length !== 10) {
    return 'Please enter a valid 10-digit mobile number.';
  }
  if (!/^[6-9]\d{9}$/.test(digits) || /^(\d)\1{9}$/.test(digits)) {
    return 'Please enter a valid Indian mobile number.';
  }
  return null;
};

export const getPhoneAuthErrorMessage = (err) => {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  const code = err.code;
  if (code === 'auth/invalid-phone-number') {
    return 'Please enter a valid mobile number.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please try again later.';
  }
  if (code === 'auth/quota-exceeded') {
    return 'SMS service is temporarily unavailable. Please try again later.';
  }
  if (code === 'auth/captcha-check-failed') {
    return 'Verification check failed. Please refresh and try again.';
  }

  if (err.message === 'Network Error') {
    return 'Please enter a valid mobile number.';
  }

  return err.message || 'Failed to send OTP. Please check the number.';
};
