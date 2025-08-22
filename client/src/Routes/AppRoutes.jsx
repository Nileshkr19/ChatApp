import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth Components & Pages
import { ProtectedRoute } from "@/components/auth/ProtectedRoutes";
import { LoginPage } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { OtpVerificationPage } from "@/pages/auth/OtpVerification";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPassword";
import { ResetPasswordPage } from "@/pages/auth/ResetPassword";
import PublicRoutes from "@/utils/PublicRoutes";

// Layout Components
import AuthLayout from "@/layouts/AuthLayout";

// Main App Pages - Import the correct Dashboard component
import Dashboard from "@/pages/Dashboard"; // Changed from DashboardPage to Dashboard
import ChatView from "@/pages/ChatView";
import WhiteboardView from "@/pages/Whiteboard";
import TasksView from "@/pages/TaskView";
import FilesView from "@/pages/FileView";
import ProjectsView from "@/pages/ProjectView";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Redirect from root to dashboard/chat */}
        <Route path="/" element={<Navigate to="/dashboard/chat" replace />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Default route - redirect to chat */}
          <Route index element={<Navigate to="chat" replace />} />

          {/* Nested routes - these render in <Outlet /> */}
          <Route path="chat" element={<ChatView />} />
          <Route path="whiteboard" element={<WhiteboardView />} />
          <Route path="tasks" element={<TasksView />} />
          <Route path="files" element={<FilesView />} />
          <Route path="projects" element={<ProjectsView />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
