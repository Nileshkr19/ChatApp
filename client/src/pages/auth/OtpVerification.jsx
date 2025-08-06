import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormWrapper } from '@/components/FormWrapper';
import { OtpInput } from '@/components/OtpInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';
import { verifyOtp } from '@/features/auth/authSlice';

export const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'error' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // --- START: THE FIX ---

  // Get auth state, including the specific verificationToken for registration
  const { 
    loading: isLoading, 
    verificationToken: reduxVerificationToken, 
    user 
  } = useSelector((state) => state.auth);

  // Get data passed from the previous page's navigation state
  const locationState = location.state || {};
  const { email, type } = locationState;

  // Choose the correct token based on the flow type
  const token = type === 'register' ? reduxVerificationToken : locationState.token;

  useEffect(() => {
    // New, robust check: If we don't have a token for the current flow, redirect.
    if (!token || !email || !type) {
      const redirectPath = type === 'register' ? '/register' : '/verify-otp';
      navigate(redirectPath);
      return;
    }
    // If user is already logged in, send to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [token, email, type, user, navigate]);

  // --- END: THE FIX ---

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { otp, token, type };
    console.log("Submitting OTP:", payload);
    
    // Use the dynamically selected 'token'
    dispatch(verifyOtp({ otp, token, type }))
      .unwrap()
      .then(() => {
        // --- START: THE SECOND FIX ---
        // After success, navigate to the correct next page based on the flow type
        if (type === 'register') {
          console.log("Registration OTP verified successfully");
          setToastInfo({ show: true, message: 'Verification successful! Welcome!', type: 'success' });
          setTimeout(() => navigate('/dashboard'), 1500);
        } else if (type === 'forgot') {
          console.log("Forgot password OTP verified successfully");
          navigate('/reset-password', {
            state: { email, token ,verified: true }
          });
          setToastInfo({ show: true, message: 'OTP Verified! Please reset your password.', type: 'success' });
          
        }
        // --- END: THE SECOND FIX ---
      })
      .catch((err) => {
        setToastInfo({ show: true, message: err.message || 'OTP verification failed', type: 'error' });
      });
  };

  const handleResend = () => {
    // Navigate back to the appropriate starting point
    const resendPath = type === 'register' ? '/register' : '/forgot-password';
    navigate(resendPath);
  };

  return (
    <>
      <FormWrapper
        title="Verify Your Account"
        subtitle={`We've sent a 6-digit code to ${email || 'your email'}`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput value={otp} onChange={setOtp} />
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Time remaining: <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span>
            </p>
            {timeLeft === 0 && (
              <p className="text-sm text-gray-600">
                OTP expired?{' '}
                <button type="button" onClick={handleResend} className="text-blue-600 hover:text-blue-700 font-medium">
                  Start Over
                </button>
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
            {isLoading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
      </FormWrapper>
      {toastInfo.show && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
        />
      )}
    </>
  );
};