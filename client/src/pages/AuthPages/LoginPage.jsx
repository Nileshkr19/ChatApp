import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name] || errors.general) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setErrors({ 
          general: result.message || "Login failed. Please try again." 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ 
        general: "Something went wrong. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-purple-100 text-sm">Sign in to continue chatting!</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* ✅ Error Display at Top of Form */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                  <p className="mt-1 text-sm text-red-700">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="pl-10 py-3 bg-gray-50 border-2 focus:bg-white focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pl-10 pr-12 py-3 bg-gray-50 border-2 focus:bg-white focus:border-purple-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 mt-6 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Don't have an account?{" "}
            </span>
            <Button
              variant="link"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium p-0"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;