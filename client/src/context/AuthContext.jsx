import React, { useReducer } from "react";
import { AuthContext } from "./AuthContextProvider";

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful login
      const user = {
        id: "1",
        name: "John Doe",
        email: credentials.email,
        bio: "Software Developer",
      };

      dispatch({ type: "SET_USER", payload: user });
      localStorage.setItem("token", "mock-jwt-token");
    } catch (error) {
      console.error("Login error:", error);
      dispatch({ type: "SET_ERROR", payload: "Invalid credentials" });
    }
  };

  const register = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful registration - redirect to OTP verification
      console.log("Registration data:", data);
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      console.error("Registration error:", error);
      dispatch({ type: "SET_ERROR", payload: "Registration failed" });
    }
  };

  const verifyOTP = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.type === "register") {
        const user = {
          id: "1",
          name: "New User",
          email: data.email,
        };
        dispatch({ type: "SET_USER", payload: user });
        localStorage.setItem("token", "mock-jwt-token");
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      dispatch({ type: "SET_ERROR", payload: "Invalid OTP" });
    }
  };

  const sendOTP = async (email, type) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      console.log("Sending OTP to:", email, "for:", type);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      console.error("Send OTP error:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to send OTP" });
    }
  };

  const resetPassword = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      console.log("Resetting password for:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      console.error("Reset password error:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to reset password" });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        verifyOTP,
        sendOTP,
        resetPassword,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
