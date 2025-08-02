import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ArrowLeft, RefreshCw } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  // Get email from location state (passed from RegisterPage)
  const email = location.state?.email || "example@email.com";

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
    if (value.length > 1) return; // Prevent multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error when user types

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

    // Focus last filled input or next empty one
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, accept any 6-digit OTP
      console.log("OTP Verified:", otpValue);

      // Navigate to success page or dashboard
      navigate("/login", {
        state: { message: "Account created successfully! Please login." },
      });
    } catch (error) {
      setError("Invalid OTP. Please try again.", error);
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
    console.log("OTP Resent to:", email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="w-10" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OTP Input */}
          <div className="flex justify-center space-x-2 mb-6">
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
                className={`w-12 h-12 text-center text-lg font-semibold ${
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
            className="w-full"
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
          <div className="text-center text-sm">
            <p className="text-muted-foreground mb-2">
              Didn't receive the code?
            </p>

            {canResend ? (
              <Button
                variant="link"
                onClick={handleResendOtp}
                className="text-primary hover:underline p-0"
              >
                Resend Code
              </Button>
            ) : (
              <p className="text-muted-foreground">Resend in {timer}s</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerification;
