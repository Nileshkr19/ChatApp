import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, MessageCircle, Users, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Chat App</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.fullName || user?.email}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 col-span-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to your Dashboard!
            </h2>
            <p className="text-gray-600">
              You have successfully logged in. Start chatting with your friends!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Start a new conversation or continue existing chats
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Open Messages
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Manage your contacts and find new friends
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Contacts
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Customize your profile and app preferences
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Open Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;