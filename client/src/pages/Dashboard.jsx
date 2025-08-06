import React from 'react';
import { User, Mail, MessageSquare, LogOut, Settings } from 'lucide-react';
import { Logout } from './auth/Logout';

export const DashboardPage  = () => {
 
  const user = {
    name: "John Doe",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <Logout />   

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600 mb-4">
                {user?.bio || 'Great to see you again. Ready to get started?'}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile</h3>
            <p className="text-gray-600 text-sm">Your account is active</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Messages</h3>
            <p className="text-gray-600 text-sm">No new messages</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Settings</h3>
            <p className="text-gray-600 text-sm">All configured</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">Welcome to our platform! Your account has been successfully created.</p>
                <p className="text-xs text-gray-500 mt-1">Just now</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Email Verified</p>
                <p className="text-sm text-gray-600">Your email address has been verified successfully.</p>
                <p className="text-xs text-gray-500 mt-1">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};