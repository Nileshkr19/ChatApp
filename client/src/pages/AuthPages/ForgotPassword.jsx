import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to send reset OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Reset OTP sent to:", email);

      // Navigate to password reset OTP verification
      navigate("/password-reset-otp", {
        state: { email: email },
      });
    } catch (error) {
      setError("Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
            <div className="w-8" /> {/* Spacer */}
          </div>

          <div className="bg-white/20 rounded-full p-3 inline-block mb-3">
            <KeyRound className="h-6 w-6 text-white" />
          </div>

          <p className="text-purple-100 text-sm">
            Enter your email to receive a reset code
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              We'll send you a 6-digit verification code to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your registered email"
                  className={`pl-10 py-3 bg-gray-50 border-2 focus:bg-white transition-colors ${
                    error
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 mt-6 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? "Sending Code..." : "Send Reset Code"}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">
              Remember your password?{" "}
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

export default ForgotPassword;
