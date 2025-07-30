import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordStrengthChecker from "@/utils/PasswordStrengthChecker";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear all previous errors

    try {
      const result = await register(formData);
      
      if (!result.success) {
        // ✅ Safe error handling - ensure errors object exists
        const newErrors = {};
        
        if (result.errors) {
          Object.assign(newErrors, result.errors);
        }
        
        if (result.message && !newErrors.general) {
          newErrors.general = result.message;
        }
        
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Registration error:", error);
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
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-purple-100 text-sm">Join us and start chatting!</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* ✅ Error Display at Top of Form */}
          {(errors?.general || Object.keys(errors).length > 0) && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Registration Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {errors.general && (
                      <p className="mb-1">{errors.general}</p>
                    )}
                    {errors.name && (
                      <p className="mb-1">• {errors.name}</p>
                    )}
                    {errors.email && (
                      <p className="mb-1">• {errors.email}</p>
                    )}
                    {errors.password && (
                      <p className="mb-1">• {errors.password}</p>
                    )}
                    {errors.confirmPassword && (
                      <p className="mb-1">• {errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`pl-10 py-3 bg-gray-50 border-2 focus:bg-white transition-colors ${
                    errors.name
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
                  required
                />
              </div>
            </div>

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
                  className={`pl-10 py-3 bg-gray-50 border-2 focus:bg-white transition-colors ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
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
                  className={`pl-10 pr-12 py-3 bg-gray-50 border-2 focus:bg-white transition-colors ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
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

            {/* Password Strength Checker */}
            {formData.password && (
              <PasswordStrengthChecker password={formData.password} />
            )}

            {/* Confirm Password Field */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`pl-10 pr-12 py-3 bg-gray-50 border-2 focus:bg-white transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Already have an account?{" "}
            </span>
            <Button
              variant="link"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium p-0"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;