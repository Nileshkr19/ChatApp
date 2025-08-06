import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormWrapper } from "@/components/FormWrapper";
import { InputField } from "@/components/InputField";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Toast } from "@/components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/features/auth/authSlice";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  // Renaming to avoid confusion
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'error' });

  const dispatch = useDispatch();
  // Renaming Redux error to avoid conflict
  const { loading: isLoading, error: apiError } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // In ForgotPasswordPage.js

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword({ email })).unwrap();

      // --- CRUCIAL DEBUGGING LOG ---
      // We MUST see what this prints in your browser's console.
      console.log("Response from forgotPassword API:", result);

      // Defensive Check: Make sure a token exists before navigating.
      if (result && result.token) {
        setToastInfo({
            show: true,
            message: result.message || "Reset code sent! Check your email.",
            type: 'success'
        });
        
        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email,
              type: "forgot",
              token: result.token,
            },
          });
        }, 2000);

      } else {
        // This will happen if the backend fix didn't work.
        console.error("ERROR: No token received from the backend.");
        setToastInfo({
            show: true,
            message: "Could not get verification token from server. Please try again.",
            type: 'error'
        });
      }

    } catch (err) {
      setToastInfo({
          show: true,
          message: apiError?.message || err.message || "Failed to send reset code.",
          type: 'error'
      });
      console.error("Forgot password API call failed:", err);
    }
  };

  return (
    <>
      <FormWrapper
        title="Forgot Password"
        subtitle="Enter your email to receive a reset code"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                     hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
            {isLoading ? "Sending Code..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </FormWrapper>

      {toastInfo.show && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
        />
      )}
    </>
  );
};