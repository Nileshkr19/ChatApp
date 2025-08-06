import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoutes';
import { LoginPage } from '@/pages/auth/Login';
import {Logout} from '@/pages/auth/Logout';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { OtpVerificationPage } from '@/pages/auth/OtpVerification';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPassword';
import { ResetPasswordPage } from '@/pages/auth/ResetPassword';
import { DashboardPage } from '@/pages/Dashboard';

function AppRoutes() {
  return (

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path ="/dashboard" element={<DashboardPage />} />
        </Routes>
  );
}

export default AppRoutes;