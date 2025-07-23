import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

import { 
    login as loginService,
    register as registerService,
    logout as logoutService 
} from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await axiosInstance.get('/users/me', {
                    withCredentials: true
                });
                
                if (res.data?.data?.user) {
                    setUser(res.data.data.user);
                    console.log("User found:", res.data.data.user);
                } else if (res.data?.user) {
                    setUser(res.data.user);
                    console.log("User found:", res.data.user);
                } else {
                    console.log("No user found in response");
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking authentication status:", error);
                if (error.response?.status === 401) {
                    console.log("Access token expired, user will need to login again");
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        
        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await loginService(credentials);
            console.log("Login response:", res);
            
            const userData = res.data?.user || res.user;
            
            if (userData) {
                setUser(userData);
                console.log("User set after login:", userData);
            } else {
                throw new Error("User data not found in login response");
            }
            
            return res;
        } catch (error) {
            console.error("Login error in context:", error);
            throw error;
        }
    }

    const register = async (userData) => {
        try {
            const res = await registerService(userData);
            console.log("Register response:", res);
            
            const userInfo = res.data?.user || res.user;
            
            if (userInfo) {
                setUser(userInfo);
                console.log("User registered:", userInfo);
            } else {
                throw new Error("No user data found in register response");
            }
            return res;
        } catch (error) {
            console.error("Register error in context:", error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            await logoutService();
            setUser(null);
        } catch (error) {
            console.error("Logout error in context:", error);
            setUser(null);
        }
    }

    console.log("user in AuthContext:", user);
    
    return ( 
        <AuthContext.Provider  
            value={{
                user,
                login,
                register,
                logout,
                loading,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
