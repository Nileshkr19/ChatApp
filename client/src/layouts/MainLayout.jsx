import React from 'react';
import { Outlet } from 'react-router-dom';
// You would create these components
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar /> {/* The sidebar is always visible */}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar /> {/* The navbar is always visible */}
        
        {/* The <Outlet/> renders the main page content (DashboardPage, ProfilePage, etc.) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;