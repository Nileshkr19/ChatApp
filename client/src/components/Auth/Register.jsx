import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, MessageSquare, Eye, EyeOff, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    isValid: false
  });

  // Password strength checker function
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      feedback.push({ text: 'At least 8 characters', met: true });
      score += 1;
    } else {
      feedback.push({ text: 'At least 8 characters', met: false });
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      feedback.push({ text: 'At least one uppercase letter', met: true });
      score += 1;
    } else {
      feedback.push({ text: 'At least one uppercase letter', met: false });
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      feedback.push({ text: 'At least one lowercase letter', met: true });
      score += 1;
    } else {
      feedback.push({ text: 'At least one lowercase letter', met: false });
    }

    // Number check
    if (/\d/.test(password)) {
      feedback.push({ text: 'At least one number', met: true });
      score += 1;
    } else {
      feedback.push({ text: 'At least one number', met: false });
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push({ text: 'At least one special character', met: true });
      score += 1;
    } else {
      feedback.push({ text: 'At least one special character', met: false });
    }

    return {
      score,
      feedback,
      isValid: score >= 4 // Require at least 4 out of 5 criteria
    };
  };

  // Update password strength when password changes
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength({ score: 0, feedback: [], isValid: false });
    }
  }, [formData.password]);

  // Get password strength color and text
  const getPasswordStrengthInfo = (score) => {
    if (score === 0) return { color: 'text-gray-400', bg: 'bg-gray-200', text: '' };
    if (score <= 2) return { color: 'text-red-600', bg: 'bg-red-500', text: 'Weak' };
    if (score <= 3) return { color: 'text-yellow-600', bg: 'bg-yellow-500', text: 'Fair' };
    if (score <= 4) return { color: 'text-blue-600', bg: 'bg-blue-500', text: 'Good' };
    return { color: 'text-green-600', bg: 'bg-green-500', text: 'Strong' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!passwordStrength.isValid) {
      setError("Please choose a stronger password");
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      console.log("Registration successful:", response);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }

  const strengthInfo = getPasswordStrengthInfo(passwordStrength.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-600 text-lg">Join our community and start chatting</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 pr-12 w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-3">
                  {/* Strength Bar */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.bg}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </span>
                  </div>

                  {/* Requirements List */}
                  <div className="grid grid-cols-1 gap-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {item.met ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-xs ${item.met ? 'text-green-600' : 'text-gray-500'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`pl-12 pr-12 w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center space-x-2 mt-2">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordStrength.isValid || formData.password !== formData.confirmPassword}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                loading ? 'animate-pulse' : 'hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <User className="h-5 w-5 mr-2" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;