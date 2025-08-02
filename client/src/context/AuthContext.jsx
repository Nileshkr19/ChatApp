import React, { useEffect, useState } from 'react';
import { authServices } from '@/services/authServices';
import { checkAuthStatus } from '@/utils/checkAuthStatus';
import { AuthContext } from './AuthContext';





export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const initAuth = async () => {
        setIsLoading(true);
        const authStatus = await  checkAuthStatus()

        if(authStatus.isAuthenticated) {
            setUser(authStatus.user);
            setIsAuthenticated(true);
        }
        else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setIsLoading(false);
      }

      initAuth()
    }, []);

    const login = async (email, password) => {
      const result = await authServices.login(email, password)
      if(result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      return result;
    }


  const register = async(userData) => {
    const errors = {}

    if(!userData.name?.trim()){
        errors.name = "full name is required";
    }
    if(!userData.email?.trim()){
        errors.email = "email is required";
    }
    if (!userData.password?.trim()) {
            errors.password = "Password is required";
        }
        
        if (userData.password !== userData.confirmPassword) {
            errors.confirmPassword = "Passwords don't match";
        }

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                errors
            };
        }

         const backendData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            bio: userData.bio || ""
        };

         const result = await authServices.register(backendData);
        
        if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true); // ✅ This will trigger redirect
        }
        
        return {
            success: result.success,
            message: result.message,
            errors: result.errors || (result.success ? {} : { general: result.message }),
        };
  }

  const logout = async () => {
    const result = await authServices.logout();
   
        setUser(null);
        setIsAuthenticated(false);
        return result;
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    authServices.updateUserInfo(updatedUser);
  }

  const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser
  }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}