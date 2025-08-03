import React from "react";
import { LogOut } from "lucide-react";
import { useLogoutMutation } from "@/features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/features/auth/authSlice";

export const LogoutButton = ({
  className = "",
  showIcon = true,
  showText = true,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      // Clear Redux state
      dispatch(logoutAction());

      console.log("Logout successful");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, clear local state and redirect
      dispatch(logoutAction());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      onClick={handleLogout}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showIcon && showText && <span className="ml-2" />}
      {showText && <span>Logout</span>}
    </div>
  );
};
