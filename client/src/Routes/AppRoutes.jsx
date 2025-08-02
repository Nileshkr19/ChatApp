import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "../pages/AuthPages/LoginPage";
import RegisterPage from "../pages/AuthPages/RegisterPage";
import OtpVerification from "../pages/AuthPages/OptVerification";
import ForgotPassword from "@/pages/AuthPages/ForgotPassword";
import PasswordResetOtp from "@/utils/PasswordResetOtp";
import ResetPasswordPage from "../pages/AuthPages/ResetPasswordPage";
import Dashboard from "../pages/Dashboard";
import ProtectedRoutes from "@/utils/ProtectedRoutes";
import DashboardLayout from "@/layouts/DashboardLayout";
import Chatpage from "../pages/ChatPage";
import Whiteboard from "../pages/Whiteboard";
import VideoCall from "../pages/Video-call";
import Notes from "../pages/Notes";
import Task from "../pages/Task";
import File from "../pages/File";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

// Route configuration - just data, no repetition
const dashboardRoutes = [
  { path: "/dashboard", title: "Dashboard", component: Dashboard },
  { path: "/chat", title: "Chat", component: Chatpage },
  { path: "/whiteboard", title: "Whiteboard", component: Whiteboard },
  { path: "/video", title: "Video Call", component: VideoCall },
  { path: "/notes", title: "Notes", component: Notes },
  { path: "/tasks", title: "Tasks", component: Task },
  { path: "/files", title: "Files", component: File },
];

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

        {/* Protected Dashboard Routes - Generated dynamically */}
        {dashboardRoutes.map(({ path, title, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoutes>
                <DashboardLayout title={title}>
                  <Component />
                </DashboardLayout>
              </ProtectedRoutes>
            }
          />
        ))}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
