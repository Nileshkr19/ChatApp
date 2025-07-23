import React, { useState } from 'react';
import { Mail, Lock, MessageSquare, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email: formData.email, password: formData.password });
      console.log("Login successful:", response);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

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
            Welcome back
          </h2>
          <p className="text-gray-600 text-lg">Sign in to your account to continue</p>
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
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <a 
                href="#" 
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-200"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                loading ? 'animate-pulse' : 'hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Sign in
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
