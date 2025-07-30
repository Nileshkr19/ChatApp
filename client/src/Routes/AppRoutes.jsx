import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/AuthPages/LoginPage';
import RegisterPage from '../pages/AuthPages/RegisterPage';
import OtpVerification from '../pages/AuthPages/OptVerification';
import ForgotPassword from '@/pages/AuthPages/ForgotPassword';
import PasswordResetOtp from '@/utils/PasswordResetOtp';
import ResetPasswordPage from '../pages/AuthPages/ResetPasswordPage';
import Dashboard from '../pages/Dashboard';
import ProtectedRoutes from '@/utils/ProtectedRoutes';


const AppRoutes = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
            path="/dashboard"
            element={ 
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
        />
      <Route path ="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-otp" element={<PasswordResetOtp />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes