import axios from 'axios';
import { refreshAccessToken } from '@/features/auth/authSlice'; // Import the thunk

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, 
}); 

// This single function will set up both interceptors
export const setupAxiosInterceptors = (store) => {
    // Request interceptor to add the token
    axiosInstance.interceptors.request.use(
        (config) => {
            const accessToken = store.getState().auth.accessToken;
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const result = await store.dispatch(refreshAccessToken()).unwrap();
                    originalRequest.headers['Authorization'] = `Bearer ${result.accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Failed to refresh access token:", refreshError);
                    // Optionally dispatch a logout action here
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};

export default axiosInstance;