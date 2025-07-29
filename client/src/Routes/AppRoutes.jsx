import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {LoginPage} from '../pages/AuthPages/LoginPage';
import RegisterPage from '../pages/AuthPages/RegisterPage';
import OtpVerification from '../pages/AuthPages/OptVerification';
import ForgotPassword from '@/pages/AuthPages/ForgotPassword';
import PasswordResetOtp from '@/utils/PasswordResetOtp';
import ResetPasswordPage from '../pages/AuthPages/ResetPasswordPage';


const AppRoutes = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-otp" element={<PasswordResetOtp />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default AppRoutes