import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FormWrapper } from '@/components/FormWrapper';
import { InputField } from '@/components/InputField';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    profileImage: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    await register(formData);
    
    if (!error) {
      setSuccessMessage('Registration successful! Please check your email for OTP verification.');
      setShowToast(true);
      setTimeout(() => {
        navigate('/verify-otp', { 
          state: { email: formData.email, type: 'register' } 
        });
      }, 2000);
    }
  };

  return (
    <>
      <FormWrapper 
        title="Create Account" 
        subtitle="Join us today"
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
          
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          
          <InputField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <PasswordStrengthMeter password={formData.password} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200 bg-white placeholder-gray-400 resize-none"
            />
          </div>

          <InputField
            label="Profile Image URL (Optional)"
            name="profileImage"
            type="url"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                     hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
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