// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStatusQuery } from "../features/auth/authApiSlice";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [shouldCheckAuth, setShouldCheckAuth] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure cookie is properly set
    const timer = setTimeout(() => {
      setShouldCheckAuth(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, error } = useAuthStatusQuery(undefined, {
    skip: !shouldCheckAuth,
  });

  if (!shouldCheckAuth || isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data?.data?.user) {
    console.log("Auth check failed:", { error, data });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
