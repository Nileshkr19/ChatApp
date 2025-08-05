import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormWrapper } from '@/components/FormWrapper';
import { InputField } from '@/components/InputField';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';

export const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;
  const verified = location.state?.verified;

  useEffect(() => {
    if (!email || !verified) {
      navigate('/forgot-password');
    }
  }, [email, verified, navigate]);

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e ) => {
    e.preventDefault();
    clearError();
    
    if (!validatePasswords()) {
      return;
    }
    
    await resetPassword(formData);
    
    if (!error) {
      setSuccessMessage('Password reset successfully!');
      setShowToast(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <>
      <FormWrapper 
        title="Reset Password" 
        subtitle="Create a new secure password"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="New Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={validationError && validationError.includes('Password') ? validationError : ''}
            required
          />

          <PasswordStrengthMeter password={formData.password} />
          
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            error={validationError && validationError.includes('match') ? validationError : ''}
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
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
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