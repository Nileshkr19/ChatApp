import React from 'react';
import { MessageSquare, Users, Settings, LogOut, Plus, Search, Bell, User } from 'lucide-react';

const Dashboard = ({ onLogout, user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Chat App</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Search className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                  <Plus className="h-5 w-5" />
                  <span>New Chat</span>
                </button>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Chats</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((chat) => (
                      <div key={chat} className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              User {chat}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Last message...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="text-center py-16">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-3xl shadow-lg">
                    <MessageSquare className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Chat App, {user?.name || 'User'}!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Start a conversation or select an existing chat to begin messaging.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                    <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Find Friends</h3>
                    <p className="text-blue-700 text-sm">
                      Connect with friends and start chatting instantly.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                    <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Start Chatting</h3>
                    <p className="text-purple-700 text-sm">
                      Send messages, share files, and stay connected.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                    <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Customize</h3>
                    <p className="text-green-700 text-sm">
                      Personalize your chat experience with custom settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
