import React from 'react';
import { Outlet } from 'react-router-dom';
import { MessageCircle, Users, Share, Zap } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding and features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="animate-fade-in">
            {/* Logo and brand */}
            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  CollabChat
                </h1>
                <p className="text-gray-300 text-sm">Real-time collaboration platform</p>
              </div>
            </div>

            {/* Features showcase */}
            <div className="space-y-6 mb-12">
              <h2 className="text-4xl font-bold leading-tight">
                Collaborate in <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  real-time
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Connect, share, and work together seamlessly with your team from anywhere in the world.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-300">Instant messaging & threaded conversations</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Share className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-300">Seamless file sharing & collaboration</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-gray-300">Team workspaces & channels</span>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-gray-300">Lightning-fast real-time sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-8 animate-slide-up">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Auth form container */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl animate-slide-up">
              <div className="lg:hidden text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">CollabChat</h1>
                <p className="text-gray-300 text-sm">Join your team's workspace</p>
              </div>

              <main>
                <Outlet />
              </main>
            </div>

            {/* Footer text */}
            <div className="text-center mt-8 text-gray-400 text-sm animate-fade-in">
              <p>
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;