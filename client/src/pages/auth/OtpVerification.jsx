import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormWrapper } from '@/components/FormWrapper';
import { OtpInput } from '@/components/OtpInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';

export const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { verifyOTP, sendOTP, isLoading, error, clearError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;
  const type = location.state?.type || 'register';

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  const handleSubmit = async (e ) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    clearError();
    await verifyOTP({ otp, email, type });
    
    if (!error) {
      setSuccessMessage('OTP verified successfully!');
      setShowToast(true);
      
      setTimeout(() => {
        if (type === 'register') {
          navigate('/dashboard');
        } else {
          navigate('/reset-password', { state: { email, verified: true } });
        }
      }, 1500);
    }
  };

  const handleResendOTP = async () => {
    clearError();
    await sendOTP(email, type);
    setTimeLeft(300);
    setSuccessMessage('OTP sent successfully!');
    setShowToast(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <FormWrapper 
        title="Verify Your Email" 
        subtitle={`We've sent a 6-digit code to ${email}`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            error={error}
          />

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Time remaining: <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span>
            </p>
            {timeLeft === 0 ? (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Resend OTP
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading || timeLeft > 240}
                className="text-gray-400 text-sm cursor-not-allowed"
              >
                Resend OTP in {formatTime(Math.max(0, 240 - (300 - timeLeft)))}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                     hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code? Check your spam folder or{' '}
            <button
              onClick={handleResendOTP}
              disabled={timeLeft > 240}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              resend
            </button>
          </p>
        </div>
      </FormWrapper>

      {showToast && (error || successMessage) && (
        <Toast
          message={error || successMessage}
          type={error ? 'error' : 'success'}
          onClose={() => {
            setShowToast(false);
            if (error) clearError();
            if (successMessage) setSuccessMessage('');
          }}
        />
      )}
    </>
  );
};