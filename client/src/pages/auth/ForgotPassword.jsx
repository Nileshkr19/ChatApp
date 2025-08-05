import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormWrapper } from '@/components/FormWrapper';
import { InputField } from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { sendOTP, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    await sendOTP(email, 'forgot-password');
    
    if (!error) {
      setSuccessMessage('OTP sent to your email successfully!');
      setShowToast(true);
      setTimeout(() => {
        navigate('/verify-otp', { 
          state: { email, type: 'forgot-password' } 
        });
      }, 2000);
    }
  };

  return (
    <>
      <FormWrapper 
        title="Forgot Password" 
        subtitle="Enter your email to receive a reset code"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                     hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
            {isLoading ? 'Sending OTP...' : 'Send Reset Code'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
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