import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Dashboard from '../components/Dashboard/Dashboard';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { user, loading, logout } = useAuth();
  
  console.log("user in AppRoutes:", user);
  console.log("loading in AppRoutes:", loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Chat App</h2>
          <p className="text-gray-600">Please wait while we authenticate you...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard onLogout={logout} user={user} /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

export default AppRoutes;
