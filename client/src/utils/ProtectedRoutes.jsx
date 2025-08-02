import  React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoutes = ({ children }) => {
    const {isAuthenticated, isLoading} = useAuth(); 


    if (isLoading) {
         return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    );
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;