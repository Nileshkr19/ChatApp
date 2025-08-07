import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/auth/authSlice';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const dispatch = useDispatch();

  const { loading: isLoading, error } = useSelector((state) => state.auth);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pass the 'rememberMe' state to your login action
      await dispatch(loginUser({ email, password, rememberMe })).unwrap();
      
      console.log("Login successful");
 
    } catch (err) {
      setShowToast(true);
      console.error("Login failed:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ... (Your existing JSX for header and form) ... */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-300">Sign in to your account to continue</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email and Password Fields (no changes needed here) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email" name="email" value={email} onChange={handleChange}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={handleChange}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-300">Remember me</span> 
          </label>
          
          {/* FIX: Make sure this path matches your AppRoutes.js */}
          <Link
            to="/forgot-password"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button and Social Logins (no changes needed here) */}
        <button
          type="submit" disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
        </button>
        {/* ... (Divider and Social Login Buttons) ... */}

      </form>
      <div className="text-center mt-8">
        <p className="text-gray-400">
          Don't have an account?{' '}
          {/* FIX: Make sure this path matches your AppRoutes.js */}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Your custom toast component */}
      {showToast && error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          <p>{typeof error === 'object' ? error.message : error}</p>
          <button onClick={() => setShowToast(false)} className="absolute top-0 right-1.5 text-white hover:text-gray-200 font-bold">&times;</button>
        </div>
      )}
    </div>
  );
};