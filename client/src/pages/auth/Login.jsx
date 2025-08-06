import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormWrapper } from '@/components/FormWrapper';
import { InputField } from '@/components/InputField';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/auth/authSlice';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();
  const { loading: isLoading, error } = useSelector((state) => state.auth);


  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login successful");
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (err) {
      setShowToast(true);
      console.error("Login failed:", err);
    }
  };

  return (
    <>
      <FormWrapper 
        title="Welcome Back" 
        subtitle="Sign in to your account"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          
          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                     hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </FormWrapper>

      {showToast && error && (
        <Toast
          message={error}
          type="error"
          onClose={() => {
            setShowToast(false);
           
          }}
        />
      )}
    </>
  );
};