import axiosInstance from "@/axios/axiosIntance";

export const authServices = {
    // Register function
  register: async (userData) => {
    try {
        const response = await axiosInstance.post("users/register", userData);
        if(response.status === 201) {
            const {user} = response.data.data;

            const userDetails = {
                id: user.id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio,
            };
            localStorage.setItem("user", JSON.stringify(userDetails));

            return {
                success: true,
                message: response.data.message,
                user: userDetails,
            }
        }
    }
    catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message ,
        errors: {
            general: error.response?.data?.message || "Registration failed. Please try again.",
        }
      };
    }
  },

  // login function

  login: async (email, password) => {
    try {
        const response = await axiosInstance.post("users/login",{
            email,
            password,
        })
        if(response.status === 200) {
            const {user} = response.data.data;

            const userDetails = {
                id: user.id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio,
            };
            localStorage.setItem("user", JSON.stringify(userDetails));

            return {
                success: true,
                message: response.data.message,
                user: userDetails,
            }
        }
    }
    catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },


  // Logout function
  logout: async () =>{
    try {
        const response = await axiosInstance.post("users/logout");
        if(response.status === 200) {
            localStorage.removeItem("user");
            return {
                success: true,
                message: response.data.message,
            }
        }
    }
    catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed",
      };
    }
  },

  // get current user function
  getCurrentUser: () =>{
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("user");
  },

  updateUserInfo: (updatedUser) =>{
    localStorage.setItem("user", JSON.stringify(updatedUser));
  },

  verifyAuth: async () => {
    try {
        const response = await axiosInstance.get("users/me");
        if(response.status === 200) {
            return {
                success: true,
                user: response.data.data.user,
            }
        }
    }
    catch (error) {
      console.error("Authentication verification error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Authentication verification failed",
      };
    }
  }


};
