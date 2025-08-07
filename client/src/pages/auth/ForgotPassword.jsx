import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '@/features/auth/authSlice';
import { Toast } from '@/components/Toast';
import { useNavigate } from 'react-router-dom';


export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const [isEmailSent, setIsEmailSent] = useState(false);
    const [toastInfo, setToastInfo] = useState({
    show: false,
    message: "",
    type: "error",
  });
  

   const dispatch = useDispatch();
  const { loading: isLoading, error: apiError } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword({ email })).unwrap();
      if(result &&  result.token) {
        if (result && result.token) {
        setToastInfo({
          show: true,
          message: result.message || "Reset code sent! Check your email.",
          type: "success",
        });
        setIsEmailSent(true);
        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email,
              type: "forgot",
              token: result.token,
            },
          });
        }, 2000);

      }
    }
    else {
        console.error("ERROR: No token received from the backend.");
        setToastInfo({
          show: true,
          message:
            "Could not get verification token from server. Please try again.",
          type: "error",
        });
      }
   
  }
  catch (err) {
      setToastInfo({
        show: true,
        message:
          apiError?.message || err.message || "Failed to send reset code.",
        type: "error",
      });
      console.error("Forgot password API call failed:", err);
    }

}

  const handleResendEmail = () => {
    setIsEmailSent(false);
    setEmail('');
    setToastInfo({
      show: false,
      message: "",
      type: "error",
    });
  };

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-gray-300">
            We've sent a password reset link to
          </p>
          <p className="text-blue-400 font-medium">{email}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-300 mb-2">
              <strong>Didn't receive the email?</strong>
            </p>
            <ul className="text-xs text-gray-400 space-y-1 text-left">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• The email may take a few minutes to arrive</li>
            </ul>
          </div>

          <button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full bg-white/10 border border-white/20 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Resend Email</span>
              </>
            )}
          </button>

          <Link
            to="/auth/login"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Forgot your password?</h2>
        <p className="text-gray-300">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-2">
            <strong>Having trouble?</strong>
          </p>
          <p className="text-xs text-gray-400">
            If you don't receive an email within a few minutes, please check your spam folder or contact our support team for assistance.
          </p>
        </div>
      </form>

      {/* Back to Login */}
      <div className="text-center mt-8">
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
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
