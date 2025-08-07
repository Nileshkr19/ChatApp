import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { accessToken } = useSelector((state) => state.auth);

  if (accessToken) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};


