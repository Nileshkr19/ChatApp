import { authServices } from "@/services/authServices";

export const checkAuthStatus = async () => {
    const user = authServices.getCurrentUser();
    if(!user) {
        return {
            isAuthenticated: false,
        }
    }

    const authCheck = await authServices.verifyAuth();
    if(!authCheck.success) {
        await authServices.logout();
        return {
            isAuthenticated: false,
        }
    }
    return {
        isAuthenticated: true,
        user: authCheck.user,
    }
}