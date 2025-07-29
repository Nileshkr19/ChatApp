import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, RefreshCw, KeyRound } from "lucide-react";

const PasswordResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  // Get email from location state
  const email = location.state?.email || "";

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);

    // Focus appropriate input
    const lastFilledIndex = newOtp.findLastIndex((digit) => digit !== "");
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex =
      nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(lastFilledIndex + 1, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to verify reset OTP
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Reset OTP Verified:", otpValue);

      // Navigate to new password creation
      navigate("/reset-password", {
        state: { email: email, resetToken: otpValue },
      });
    } catch (error) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
    console.log("Reset OTP Resent to:", email);
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
              onClick={() => navigate("/forgot-password")}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">Verify Reset Code</h1>
            <div className="w-8" />
          </div>

          <div className="bg-white/20 rounded-full p-3 inline-block mb-3">
            <KeyRound className="h-6 w-6 text-white" />
          </div>

          <p className="text-purple-100 text-sm">
            Enter the 6-digit code sent to
          </p>
          <p className="text-white font-medium text-sm mt-1">{email}</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              Enter the verification code to proceed with password reset
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-lg font-semibold border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 ${
                  error ? "border-red-300" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Didn't receive the code?
            </p>

            {canResend ? (
              <Button
                variant="link"
                onClick={handleResendOtp}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium p-0"
              >
                Resend Code
              </Button>
            ) : (
              <p className="text-sm text-gray-400">Resend in {timer}s</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetOtp;
