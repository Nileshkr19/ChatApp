import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/AuthPages/LoginPage';
import RegisterPage from '../pages/AuthPages/RegisterPage';
import OtpVerification from '../pages/AuthPages/OptVerification';
import ForgotPassword from '@/pages/AuthPages/ForgotPassword';
import PasswordResetOtp from '@/utils/PasswordResetOtp';
import ResetPasswordPage from '../pages/AuthPages/ResetPasswordPage';
import Dashboard from '../pages/Dashboard';
import ProtectedRoutes from '@/utils/ProtectedRoutes';
import DashboardLayout from '@/layouts/DashboardLayout';
import Chatpage from '../pages/ChatPage';
import Whiteboard from '../pages/Whiteboard';
import VideoCall from '../pages/Video-call';
import Notes from '../pages/Notes';
import Task from '../pages/Task';
import File from '../pages/File';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-otp" element={<PasswordResetOtp />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoutes>
            <DashboardLayout title="Dashboard" />
          </ProtectedRoutes>
        } />
        
        <Route path="/chat" element={
          <ProtectedRoutes>
            <DashboardLayout title="Chat">
              <Chatpage />
            </DashboardLayout>
          </ProtectedRoutes>
        } />
        
        <Route path="/whiteboard" element={
          <ProtectedRoutes>
            <DashboardLayout title="Whiteboard">
              <Whiteboard />
            </DashboardLayout>
          </ProtectedRoutes>
        } />
        
        <Route path="/video" element={
          <ProtectedRoutes>
            <DashboardLayout title="Video Call">
              <VideoCall />
            </DashboardLayout>
          </ProtectedRoutes>
        } />
        
        <Route path="/notes" element={
          <ProtectedRoutes>
            <DashboardLayout title="Notes">
              <Notes />
            </DashboardLayout>
          </ProtectedRoutes>
        } />
        
        <Route path="/tasks" element={
          <ProtectedRoutes>
            <DashboardLayout title="Tasks">
              <Task />
            </DashboardLayout>
          </ProtectedRoutes>
        } />

        <Route path="/files" element={
          <ProtectedRoutes>
            <DashboardLayout title="Files">
              <File />
            </DashboardLayout>
          </ProtectedRoutes>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};
export default AppRoutes;