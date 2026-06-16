export const getGoogleAuthErrorMessage = (err) => {
  const code = err?.code;

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Google sign-in was cancelled. Please try again.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network error. Please check your connection and try again.';
  }

  return 'Failed to sign in with Google. Please try again.';
};

export const getRegistrationErrorMessage = (error) => {
  const data = error?.response?.data;
  if (data?.message) return data.message;

  const status = error?.response?.status;
  if (status === 400) return 'Email or mobile number may already be registered.';
  if (!error?.response) return 'Network error. Please check your connection and try again.';

  return 'Registration failed. Email or mobile may already be registered.';
};
