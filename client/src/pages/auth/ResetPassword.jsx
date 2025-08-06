import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormWrapper } from '@/components/FormWrapper';
import { InputField } from '@/components/InputField';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '@/features/auth/authSlice';

export const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'error' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading: isLoading, error: apiError } = useSelector((state) => state.auth);

  const email = location.state?.email;
  const token = location.state?.token;

  // This hook ensures the user can't be on this page without a valid email and token
  useEffect(() => {
    if (!email || !token) {
      navigate('/forgot-password');
    }
  }, [email, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        setToastInfo({ show: true, message: "Passwords do not match.", type: 'error' });
        return;
    }
    
    const payload = { email, token, password: formData.password };
    
    try {
      await dispatch(resetPassword(payload)).unwrap();
      
      setToastInfo({ show: true, message: 'Password reset successful! You can now log in.', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setToastInfo({ show: true, message: apiError?.message || err.message, type: 'error' });
      console.error("Reset password failed:", err);
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
            // Toggles between 'text' and 'password' type
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            // Props to control the toggle icon in your InputField component
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <PasswordStrengthMeter password={formData.password} />
          
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            // Toggles between 'text' and 'password' type
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            // Props to control the toggle icon
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
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