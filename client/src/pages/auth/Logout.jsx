import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/features/auth/authSlice";
import { LogOut, Settings } from "lucide-react";

export const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log("User logged out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="flex items-center gap-4">
      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
        <Settings size={20} />
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
};
