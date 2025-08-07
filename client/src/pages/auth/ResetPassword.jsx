import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '@/features/auth/authSlice';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'; // Corrected import name
import { Toast } from '@/components/Toast';

export const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'error' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading: isLoading } = useSelector((state) => state.auth);

  const email = location.state?.email;
  const token = location.state?.token;

  // This hook protects the page from being accessed directly
  useEffect(() => {
    // FIX 1: Removed the redundant 'verified' check
    if (!email || !token) {
      navigate("/forgot-password");
    }
  }, [email, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIX 2: Integrated validation directly into the handler for simplicity
    if (formData.password.length < 8) {
      setToastInfo({ show: true, message: "Password must be at least 8 characters.", type: "error" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setToastInfo({ show: true, message: "Passwords do not match.", type: "error" });
      return;
    }

    const payload = { email, token, password: formData.password };

    try {
      await dispatch(resetPassword(payload)).unwrap();
      // FIX 3: Set success state to show the success screen
      setIsSuccess(true);
    } catch (err) {
      setToastInfo({
        show: true,
        message: err.message || "An unknown error occurred.",
        type: "error",
      });
      console.error("Reset password failed:", err);
    }
  };

  // The success screen is now shown based on the `isSuccess` state
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Password Reset!</h2>
          <p className="text-gray-300">
            You can now sign in with your new password.
          </p>
        </div>
        <div className="space-y-4">
          {/* FIX 4: Corrected link path */}
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all flex items-center justify-center space-x-2"
          >
            <span>Continue to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Reset Your Password</h2>
        <p className="text-gray-300">
          Enter your new password below. Make sure it's strong and secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your new password"
              className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.password && <PasswordStrengthMeter password={formData.password} />}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="text-center mt-8">
        {/* FIX 5: Corrected link path */}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
          Back to sign in
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