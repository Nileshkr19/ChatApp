import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Components & Pages
import {ProtectedRoute} from '@/components/auth/ProtectedRoutes';
import { LoginPage } from '@/pages/auth/Login';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { OtpVerificationPage } from '@/pages/auth/OtpVerification';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPassword';
import { ResetPasswordPage } from '@/pages/auth/ResetPassword';
import PublicRoutes from '@/utils/PublicRoutes';

// Layout Components
import MainLayout from '@/layouts/MainLayout'; 
import AuthLayout from '@/layouts/AuthLayout'; 

// Main App Pages
import { DashboardPage } from '@/pages/Dashboard';


function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="/verify-otp" element={<OtpVerificationPage />} />
      </Route>

      {/* 2. Protected app routes with the main layout (navbar, sidebar, etc.) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Redirect from root to dashboard for logged-in users */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add other main app routes here */}
        </Route>
      </Route>




    </Routes>
  );
}

export default AppRoutes;