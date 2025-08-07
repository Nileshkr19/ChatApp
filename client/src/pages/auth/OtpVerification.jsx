import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '@/features/auth/authSlice';
import { Toast } from '@/components/Toast'; // Assuming you have this component

export const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'error' });
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  
  // FIX 1: Initialize useRef with an empty array
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { 
    loading: isLoading, 
    verificationToken: reduxVerificationToken, 
    user 
  } = useSelector((state) => state.auth);

  const locationState = location.state || {};
  const { email, type } = locationState;

  const token = type === 'register' ? reduxVerificationToken : locationState.token;

  useEffect(() => {
    // FIX 2: Correct redirect path for forgot password flow
    if (!token || !email || !type) {
      const redirectPath = type === 'register' ? '/register' : '/forgot-password';
      navigate(redirectPath);
      return;
    }
    if (user) {
      navigate('/dashboard');
    }
  }, [token, email, type, user, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // FIX 3: Enable the resend button when the timer runs out
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = /^\d$/.test(pastedData[i]) ? pastedData[i] : '';
    }
    setOtp(newOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // FIX 4: Join the OTP array into a single string
    const otpString = otp.join('');
    
    dispatch(verifyOtp({ otp: otpString, token, type }))
      .unwrap()
      .then(() => {
        if (type === 'register') {
          setToastInfo({ show: true, message: 'Verification successful! Welcome!', type: 'success' });
          setTimeout(() => navigate('/dashboard'), 1500);
        } else if (type === 'forgot') {
          // Navigate immediately and pass state to the next page
          navigate('/reset-password', {
            state: { email, token }
          });
        }
      })
      .catch((err) => {
        setToastInfo({ show: true, message: err.message || 'OTP verification failed', type: 'error' });
      });
  };

  const handleResend = () => {
    const resendPath = type === 'register' ? '/register' : '/forgot-password';
    navigate(resendPath);
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Verify your email</h2>
        <p className="text-gray-300 mb-2">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-blue-400 font-medium">{email || 'your email'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Verification Code</label>
          <div className="flex justify-center space-x-2 sm:space-x-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="tel" // Use 'tel' for better mobile numeric keyboard experience
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Start Over & Resend</span>
            </button>
          ) : (
            <p className="text-gray-400 text-sm">
              Resend code in {timeLeft}s
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isOtpComplete || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Verify Code</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="text-center mt-8">
        {/* FIX 5: Corrected link path */}
        <Link to="/login" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </Link>
      </div>
      
      {toastInfo.show && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
        />
      )}
    </div>
  );
};