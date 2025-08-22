import React from "react";
import {
  MessageCircle,
  PenTool,
  CheckSquare,
  FolderOpen,
  BarChart3,
  Menu,
  Users,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
  // Static mock data for UI display
  const navigationItems = [
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/dashboard/chat" },
    { id: "whiteboard", label: "Whiteboard", icon: PenTool, path: "/dashboard/whiteboard" },
    { id: "tasks", label: "Tasks", icon: CheckSquare, path: "/dashboard/tasks" },
    { id: "files", label: "Files", icon: FolderOpen, path: "/dashboard/files" },
    { id: "projects", label: "Projects", icon: BarChart3, path: "/dashboard/projects" },
  ];

  const location = useLocation();
  const activeView = navigationItems.find(item => item.path === location.pathname)?.id || "chat";


  const mockCurrentRoom = {
    name: "General",
    description: "Main discussion room for the team",
    color: "#3B82F6",
    members: [1, 2, 3, 4, 5], // Mock member count
  };

  const sidebarOpen = false; // Static sidebar state

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {!sidebarOpen && (
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: mockCurrentRoom.color }}
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {mockCurrentRoom.name}
              </h1>
              <p className="text-sm text-gray-500">
                {mockCurrentRoom.description}
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
             <Link
              key ={item.id}
              to={item.path}
             >
              <button

                key={item.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === item.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
              </Link> 
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          <button className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">
              {mockCurrentRoom.members.length}
            </span>
          </button>

          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden mt-3 flex items-center space-x-1 overflow-x-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeView === item.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
