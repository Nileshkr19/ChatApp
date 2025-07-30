import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        } else {
            console.error("Logout failed");
        }
    }

  return (
   <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 cursor-pointer">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
   </button>
  )
}

